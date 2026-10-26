import * as T from './vendor/three.module.js';
import {chapters} from './content.js';

export function createWorld(container,{onNear,onReady,onError}) {
 const scene=new T.Scene();scene.background=new T.Color('#d7e4df');scene.fog=new T.Fog('#d7e4df',65,150);
 const camera=new T.PerspectiveCamera(52,innerWidth/innerHeight,.1,220);camera.rotation.order='YXZ';
 let renderer;
 try{renderer=new T.WebGLRenderer({antialias:true,powerPreference:'high-performance'});}catch(e){onError(e);return null;}
 renderer.setPixelRatio(Math.min(devicePixelRatio,1.5));renderer.setSize(innerWidth,innerHeight);renderer.shadowMap.enabled=true;renderer.shadowMap.type=T.PCFSoftShadowMap;renderer.outputColorSpace=T.SRGBColorSpace;renderer.toneMapping=T.ACESFilmicToneMapping;renderer.toneMappingExposure=1.0;container.appendChild(renderer.domElement);
 const hemi=new T.HemisphereLight('#fff6dc','#7eada1',1.8);scene.add(hemi);
 const sun=new T.DirectionalLight('#ffe0b5',2.5);sun.position.set(-30,45,10);sun.castShadow=true;sun.shadow.mapSize.set(2048,2048);Object.assign(sun.shadow.camera,{left:-65,right:65,top:55,bottom:-50,near:1,far:120});sun.shadow.bias=-.0006;sun.shadow.normalBias=.035;scene.add(sun);
 const mats={};const mat=(color,extra={})=>{const key=color+JSON.stringify(extra);return mats[key]??=new T.MeshStandardMaterial({color,roughness:.85,...extra});};
 function mesh(geo,color,x=0,y=0,z=0,parent=scene,extra={}){const o=new T.Mesh(geo,mat(color,extra));o.position.set(x,y,z);o.castShadow=true;o.receiveShadow=true;parent.add(o);return o;}
 const box=(x,y,z,w,h,d,color,parent=scene)=>mesh(new T.BoxGeometry(w,h,d),color,x,y,z,parent);
 const sphere=(x,y,z,r,color,parent=scene)=>mesh(new T.IcosahedronGeometry(r,1),color,x,y,z,parent);
 const cylinder=(x,y,z,rt,rb,h,color,parent=scene,n=8)=>mesh(new T.CylinderGeometry(rt,rb,h,n),color,x,y,z,parent);
 const waterGeo=new T.PlaneGeometry(280,220,85,65);waterGeo.rotateX(-Math.PI/2);const base=waterGeo.attributes.position.array.slice();
 const water=mesh(waterGeo,'#4bafaa',0,-.27,-45,scene,{roughness:.35,metalness:.15});water.castShadow=false;
 const coast=[[-60,36],[48,36],[48,-34],[34,-33],[23,-28],[13,-19],[0,-13],[-15,-6],[-35,-5],[-60,4]];
 const shape=new T.Shape();coast.forEach(([x,z],i)=>i?shape.lineTo(x,-z):shape.moveTo(x,-z));shape.closePath();const ground=mesh(new T.ShapeGeometry(shape,10),'#e6d4ad',0,.02,0);ground.rotation.x=-Math.PI/2;ground.castShadow=false;
 // A second, inland patch preserves a broad sandy shore.
 const grass=new T.Shape();grass.moveTo(-60,-19);grass.bezierCurveTo(-20,-22,-5,-10,18,-15);grass.bezierCurveTo(30,-9,35,4,48,6);grass.lineTo(48,-36);grass.lineTo(-60,-36);grass.closePath();const lawn=mesh(new T.ShapeGeometry(grass),'#a6b88a',0,.04,0);lawn.rotation.x=-Math.PI/2;lawn.castShadow=false;
 // Curved line of quiet surf along the coast.
 const foam=[];for(let i=0;i<47;i++){let x=-43+i*1.6;let z=x<0?-13-x*.3:-13-x*.48;const s=box(x,-.13,z,1.1,.025,.10,'#e5f0de');s.rotation.y=.3;foam.push(s);}
 function path(a,b){const dx=b[0]-a[0],dz=b[1]-a[1],len=Math.hypot(dx,dz);const g=new T.Group();g.position.set((a[0]+b[0])/2,.12,(a[1]+b[1])/2);g.rotation.y=Math.atan2(dx,dz);scene.add(g);for(let i=0;i<len/.5;i++){box(0,0,-len/2+i*.5,2.7,.15,.43,i%4===0?'#b79773':'#c1a37e',g);}for(const side of [-1,1])box(side*1.15,-.14,0,.12,.2,len,'#8c806a',g);}
 path([-17,23],[-14,11]);path([-14,11],[1,-3]);path([1,-3],[14,6]);path([14,6],[23,-12]);
 function label(text,x,y,z,w=4.6,color='#224c46',bg='#faf3dc'){const c=document.createElement('canvas');c.width=1024;c.height=160;const ctx=c.getContext('2d');ctx.fillStyle=bg;ctx.fillRect(0,0,1024,160);ctx.strokeStyle='#9eaf98';ctx.lineWidth=6;ctx.strokeRect(8,8,1008,144);ctx.font='500 56px sans-serif';ctx.textAlign='center';ctx.textBaseline='middle';ctx.fillStyle=color;ctx.fillText(text,512,81);const tex=new T.CanvasTexture(c);tex.colorSpace=T.SRGBColorSpace;const s=new T.Sprite(new T.SpriteMaterial({map:tex,depthTest:true}));s.position.set(x,y,z);s.scale.set(w,w*160/1024,1);scene.add(s);return s;}
 const colliders=[];function obstacle(x,z,r){colliders.push({x,z,r});}
 // Picnic table and a reusable metal straw beside the drink.
 const picnic=new T.Group();picnic.position.set(-14,0,7);scene.add(picnic);
 box(0,1.05,0,4.8,.22,1.65,'#b88560',picnic);for(const x of [-1.7,1.7]){box(x,.5,0,.18,1.05,1.3,'#886f57',picnic);box(0,.6,x*.7,5,.15,.42,'#b28b65',picnic);}box(0,1.18,0,1.6,.018,1.6,'#e8d6b9',picnic);
 cylinder(.2,1.48,.2,.2,.15,.55,'#f4ecce',picnic);const straw=cylinder(.2,1.84,.2,.026,.026,.5,'#c5d9d3',picnic);straw.rotation.z=-.22;
 cylinder(-.6,1.21,-.1,.35,.35,.04,'#eff0dc',picnic,24);for(let i=0;i<3;i++)cylinder(-.6,1.25+i*.07,-.1,.25,.26,.07,i===2?'#d7a059':'#e5bc7b',picnic,24);obstacle(-14,7,2.5);
 cylinder(-16.7,1.9,7.1,.055,.055,3.8,'#867959');const umbrella=mesh(new T.ConeGeometry(2.8,1.2,8),'#e0a16b',-16.7,4.15,7.1);umbrella.rotation.y=.2;
 function person(x,z){const g=new T.Group();g.position.set(x,0,z);scene.add(g);box(0,.9,0,.55,.8,.35,'#56837d',g);sphere(0,1.65,0,.28,'#d4a67b',g);cylinder(0,1.93,0,.4,.39,.08,'#e6d6ab',g);cylinder(0,2.02,0,.23,.28,.18,'#d9c295',g);for(const s of [-1,1]){box(s*.16,.3,0,.18,.6,.2,'#565f58',g);const a=box(s*.39,1,0,.16,.65,.17,'#d4a67b',g);a.rotation.z=s*.18;}return g;}
 person(-11,6);label('UNCLE PAUL',-11,2.8,6,2.8);
 // Observation deck, field evidence cards, and rocks.
 box(1,.08,-7,5,.23,3.6,'#b6a07c');for(let i=-2;i<=2;i++)box(1+i,.23,-7,.04,.02,3.5,'#8b806c');
 for(const x of [-1.3,3.3]){cylinder(x,.8,-8.7,.07,.07,1.4,'#a08e6c');}box(1,1.4,-8.7,4.6,.12,.13,'#a08e6c');
 const board=box(1,1.1,-7.7,2.1,.8,.12,'#e9e4ca');board.rotation.x=-.35;label('OCEAN OBSERVATORY',1,1.55,-7.6,2.6);
 // Marine life remains in the water, observed rather than handled.
 const turtle=new T.Group();turtle.position.set(-1,-.05,-17);scene.add(turtle);const shell=sphere(0,0,0,.75,'#6b8970',turtle);shell.scale.set(1,.48,1.25);sphere(0,.03,-.95,.28,'#a8b98b',turtle);for(const [x,z]of[[-.65,-.5],[.65,-.5],[-.55,.5],[.55,.5]]){const f=sphere(x,-.1,z,.28,'#9bac7c',turtle);f.scale.set(1.8,.2,.8);}for(const x of [-.12,.12])sphere(x,.14,-1.16,.035,'#244e48',turtle);
 const jellies=[];for(let i=0;i<4;i++){const g=new T.Group();g.position.set(-3+i*1.2,-.05,-22-i*.7);scene.add(g);const b=mesh(new T.SphereGeometry(.33,12,8,0,Math.PI*2,0,Math.PI/2),'#d8d9ce',0,0,0,g,{transparent:true,opacity:.65});for(let j=0;j<4;j++){const t=cylinder((j-1.5)*.12,-.3,0,.015,.015,.5,'#b8d9d1',g);t.rotation.z=(j-1.5)*.15;}jellies.push(g);}
 const bag=new T.Group();bag.position.set(-4,-.13,-18);scene.add(bag);const bagbody=box(0,0,0,.65,.04,.85,'#e2e5da',bag);bagbody.rotation.y=.4;for(const x of [-.18,.18]){const h=mesh(new T.TorusGeometry(.15,.025,4,12),'#dce2d6',x,.02,.5,bag);h.rotation.x=-Math.PI/2;}
 // Coast action hut.
 box(14,1.4,1,4.8,2.8,2.6,'#7da698');box(14,1.6,2.34,3.7,1.7,.08,'#e9e4cd');label('TAKE ACTION',14,1.8,2.42,3.1);box(14,3.1,1,5.4,.22,3.3,'#c39c75');for(const x of [11.6,16.4])cylinder(x,1.4,2.4,.08,.08,2.8,'#967a5d');box(14,.9,3,4.5,.15,1.1,'#b28e6b');for(const x of [12.7,14,15.3]){cylinder(x,1.04,3,.28,.28,.04,'#ebedd8',scene,24);const fork=box(x,1.11,3,.055,.05,.65,'#b9cfca');}obstacle(14,1,2.8);
 for(let i=0;i<3;i++){box(10+i*1.05,.5,1,.8,1,.85,['#74938b','#bb9569','#809eab'][i]);label(['PAPER','REUSE','PLASTIC'][i],10+i*1.05,1.23,1,.9);}
 // Restaurant: warm coral roof, large glazed front and striped awning.
 box(24,2.35,-20,11,4.7,7,'#eee5c9');box(24,.2,-16.3,12,.4,2,'#c8b28e');
 const roofShape=new T.Shape();roofShape.moveTo(-6.1,0);roofShape.lineTo(0,1.9);roofShape.lineTo(6.1,0);roofShape.closePath();mesh(new T.ExtrudeGeometry(roofShape,{depth:7.8,bevelEnabled:false}),'#b87358',24,4.7,-23.9);
 for(const x of [20.2,27.8]){box(x,2,-16.46,2.8,2.6,.12,'#568e8a');box(x,2,-16.35,.1,2.65,.1,'#f0e9cf');box(x,2,-16.34,2.8,.1,.1,'#f0e9cf');}
 box(24,1.7,-16.45,1.8,3.4,.13,'#527975');box(24,1.9,-16.34,1.45,2.4,.05,'#b2d2c3');sphere(24.55,1.3,-16.2,.07,'#dab27a');
 box(24,4.1,-16.35,8,.7,.13,'#e9dabb');label('PANCAKE HOUSE',24,4.1,-16.15,6.5);
 for(let i=0;i<12;i++){const aw=box(18.5+i,3.15,-15.5,1,.12,2.1,i%2?'#eee4c7':'#ba7f61');aw.rotation.x=.12;box(18.5+i,2.94,-14.46,1,.35,.08,i%2?'#eee4c7':'#ba7f61');}
 for(const x of [18.5,29.5])cylinder(x,1.5,-14.5,.05,.05,3,'#a08161');
 // Mailbox on the entrance path.
 cylinder(23,.75,-17,.07,.07,1.5,'#a58b69');box(23,1.6,-17,.8,.65,.55,'#6c9686');box(23,1.64,-16.71,.5,.06,.02,'#274f48');label('LETTERS',23,2.2,-17,1.6);obstacle(24,-20,5.8);
 function table(x,z){cylinder(x,.78,z,.65,.65,.12,'#c2a17d',scene,16);cylinder(x,.4,z,.06,.06,.8,'#897c65');for(const dx of [-1,1]){box(x+dx,.46,z,.5,.1,.55,'#8f9c7c');box(x+dx,.75,z-.25,.5,.55,.08,'#8f9c7c');}obstacle(x,z,1.3);}
 table(30,-11);table(18,-12);
 // Seeded decoration keeps the coast deterministic across visits.
 let seed=622;const rand=()=>{seed=(seed*1664525+1013904223)>>>0;return seed/4294967296;};
 function tree(x,z,size=1){const g=new T.Group();g.position.set(x,0,z);g.scale.setScalar(size);scene.add(g);const trunk=cylinder(0,2,0,.13,.23,4,'#a18e69',g);trunk.rotation.z=.12;for(let j=0;j<6;j++){const a=j*Math.PI/3;const leaf=sphere(Math.sin(a)*1.1,4.1+Math.sin(j)*.2,Math.cos(a)*1.1,1,'#779b7b',g);leaf.scale.set(1.6,.3,.7);leaf.rotation.y=-a;leaf.rotation.z=.15;}obstacle(x,z,.65);}
 for(const [x,z,s]of[[-24,15,1.2],[-30,9,.9],[-5,18,1.1],[8,20,1.25],[20,17,1],[32,6,1.2],[37,-18,1.1],[14,-15,.9],[-21,0,.85],[34,20,1.1],[-41,4,1.2]])tree(x,z,s);
 for(let i=0;i<45;i++){const x=-42+rand()*82,z=16+rand()*15;const r=sphere(x,.14,z,.3+rand()*.5,['#92a780','#91aa8a','#a9b68b'][i%3]);r.scale.y=.5;}
 for(let i=0;i<28;i++){const x=-40+rand()*75,z=x<0?-11-x*.3:-13-x*.48;const r=sphere(x,-.04,z-1-rand()*3,.35+rand()*.65,['#91a79c','#b0b8a3','#b6b59c'][i%3]);r.scale.y=.5;}
 // Distant sailboat and hazy offshore islands.
 const boat=new T.Group();boat.position.set(-28,.1,-45);scene.add(boat);const hull=box(0,0,0,3,.4,1,'#dfd5b6',boat);cylinder(0,2,0,.04,.04,4,'#c6b997',boat);const sailshape=new T.Shape();sailshape.moveTo(0,0);sailshape.lineTo(0,3.3);sailshape.lineTo(2.1,0);sailshape.closePath();mesh(new T.ShapeGeometry(sailshape),'#f0e8ce',.1,.5,0,boat,{side:T.DoubleSide});
 for(let i=0;i<6;i++){const mountain=mesh(new T.ConeGeometry(8+i*1.4,4+i,5),'#9dbeb1',-60+i*22,-1,-92);mountain.scale.z=.5;}
 const clouds=[];for(let i=0;i<10;i++){const g=new T.Group();g.position.set(-65+rand()*150,17+rand()*10,-60+rand()*55);for(let j=0;j<4;j++){const c=sphere(j*1.8,Math.sin(j)*.5,0,1.8,'#e5ebe0',g);c.scale.set(1.8,.4,.8);c.castShadow=false;}scene.add(g);clouds.push(g);}
 const markers=chapters.map((ch,i)=>{const g=new T.Group();g.position.set(ch.position[0],0,ch.position[2]+1.7);scene.add(g);const ring=mesh(new T.TorusGeometry(.54,.035,5,36),'#efb779',0,.3,0,g,{emissive:'#e6a058',emissiveIntensity:.2});ring.rotation.x=-Math.PI/2;const orb=sphere(0,2.8,0,.17,'#f6c483',g);label(`0${i+1}  ${ch.place}`,ch.position[0],3.5,ch.position[2]+1.7,3.3);return{g,orb,ring};});
 let active=0,playing=false,dialogOpen=false,moving=false,motion=!matchMedia('(prefers-reduced-motion: reduce)').matches;
 let target=null,guideStart=null,guideTime=0,guideBegan=0,yaw=0,pitch=0,near=false,drag=null,last=performance.now(),elapsed=0;
 const keys=new Set(),mobileMoves=new Set();let targetYaw=0;
 function orientAt(p){const dx=p[0]-camera.position.x,dz=p[2]-camera.position.z;yaw=Math.atan2(-dx,-dz);pitch=chapters[active].pitch||0;camera.rotation.set(pitch,yaw,0,'YXZ');}
 function setChapter(index,teleport=false){active=index;target=null;if(teleport){camera.position.fromArray(chapters[index].stand);orientAt(chapters[index].look||chapters[index].position);}near=false;onNear(false);}
 function guide(){if(!playing||dialogOpen)return;const p=chapters[active].stand;if(!motion){target=null;camera.position.fromArray(p);orientAt(chapters[active].look||chapters[active].position);near=true;onNear(true);return;}guideStart=camera.position.clone();target=new T.Vector3(...p);guideTime=0;guideBegan=performance.now();const delta=target.clone().sub(camera.position);targetYaw=Math.atan2(-delta.x,-delta.z);}
 function lock(){if(!playing||dialogOpen)return;try{const p=renderer.domElement.requestPointerLock();if(p?.catch)p.catch(()=>{});}catch{}}
 function release(){keys.clear();mobileMoves.clear();if(document.pointerLockElement)document.exitPointerLock();}
 function blocked(x,z){if(x < -43 || x>39 || z>29)return true;const edge=x<0?-11-x*.3:-12-x*.48;if(z<edge+1)return true;return colliders.some(c=>Math.hypot(x-c.x,z-c.z)<c.r+.3);}
 const isInput=e=>/INPUT|TEXTAREA|SELECT/.test(e.target.tagName);
 addEventListener('keydown',e=>{if(isInput(e)||!playing||dialogOpen)return;if(['ArrowUp','ArrowDown','ArrowLeft','ArrowRight','KeyW','KeyA','KeyS','KeyD'].includes(e.code)){e.preventDefault();keys.add(e.code);target=null;}});
 addEventListener('keyup',e=>keys.delete(e.code));addEventListener('blur',release);
 document.addEventListener('visibilitychange',()=>{if(document.hidden)release();});
 renderer.domElement.addEventListener('pointerdown',e=>{if(playing&&!dialogOpen){drag={x:e.clientX,y:e.clientY};renderer.domElement.setPointerCapture(e.pointerId);}});
 renderer.domElement.addEventListener('pointerup',()=>drag=null);renderer.domElement.addEventListener('pointercancel',()=>drag=null);
 document.addEventListener('mousemove',e=>{if(document.pointerLockElement===renderer.domElement&&playing&&!dialogOpen){yaw-=e.movementX*.002;pitch=Math.max(-1.1,Math.min(1.1,pitch-e.movementY*.002));}});
 renderer.domElement.addEventListener('pointermove',e=>{if(document.pointerLockElement||!drag||dialogOpen)return;yaw-=(e.clientX-drag.x)*.005;pitch=Math.max(-1.1,Math.min(1.1,pitch-(e.clientY-drag.y)*.005));drag={x:e.clientX,y:e.clientY};});
 function resize(){camera.aspect=innerWidth/innerHeight;camera.updateProjectionMatrix();renderer.setSize(innerWidth,innerHeight);}addEventListener('resize',resize);
 function animate(now){requestAnimationFrame(animate);const dt=Math.min((now-last)/1000,.05);last=now;elapsed+=motion?dt:0;
  if(!playing){camera.position.set(-27,17,30);camera.lookAt(5,0,-8);}
  else if(!dialogOpen){
   if(target){guideTime=(now-guideBegan)/1000;const t=Math.min(guideTime/2.7,1);const ease=t*t*(3-2*t);camera.position.lerpVectors(guideStart,target,ease);let diff=targetYaw-yaw;diff=Math.atan2(Math.sin(diff),Math.cos(diff));yaw+=diff*Math.min(1,dt*5);pitch*=.9;if(t===1){target=null;orientAt(chapters[active].look||chapters[active].position);}}
   else{const forward=(keys.has('KeyW')||keys.has('ArrowUp')||mobileMoves.has('forward')?1:0)-(keys.has('KeyS')||keys.has('ArrowDown')||mobileMoves.has('backward')?1:0);const side=(keys.has('KeyD')||keys.has('ArrowRight')||mobileMoves.has('right')?1:0)-(keys.has('KeyA')||keys.has('ArrowLeft')||mobileMoves.has('left')?1:0);const speed=4*dt/(forward&&side?Math.SQRT2:1);const dx=(-Math.sin(yaw)*forward+Math.cos(yaw)*side)*speed,dz=(-Math.cos(yaw)*forward-Math.sin(yaw)*side)*speed;if(!blocked(camera.position.x+dx,camera.position.z))camera.position.x+=dx;if(!blocked(camera.position.x,camera.position.z+dz))camera.position.z+=dz;}
   camera.rotation.set(pitch,yaw,0,'YXZ');
  }
  const p=chapters[active].position;const n=playing&&Math.hypot(camera.position.x-p[0],camera.position.z-p[2])<5.3;if(n!==near){near=n;onNear(n);}
  markers.forEach((m,i)=>{m.orb.position.y=2.8+(motion?Math.sin(elapsed*1.7+i)*.15:0);m.ring.material.emissiveIntensity=i===active?.8:.05;m.orb.visible=i===active;m.ring.scale.setScalar(i===active?1.2:1);});
  if(motion){const a=waterGeo.attributes.position.array;for(let i=0;i<a.length;i+=3){a[i+1]=Math.sin(base[i]*.2+elapsed*.8)*.08+Math.cos(base[i+2]*.3+elapsed*.6)*.06;}waterGeo.attributes.position.needsUpdate=true;turtle.position.x=-1+Math.sin(elapsed*.13)*1.4;turtle.rotation.y=Math.sin(elapsed*.1)*.3;bag.rotation.y=Math.sin(elapsed*.4)*.2;jellies.forEach((g,i)=>g.position.y=-.05+Math.sin(elapsed+i)*.12);foam.forEach((f,i)=>f.position.y=-.13+Math.sin(elapsed+i*.15)*.035);boat.rotation.z=Math.sin(elapsed*.5)*.03;clouds.forEach((c,i)=>c.position.x+=Math.sin(i+1)*dt*.04);}
  renderer.render(scene,camera);
 }
 requestAnimationFrame(animate);onReady();
 renderer.domElement.addEventListener('webglcontextlost',e=>{e.preventDefault();onError(new Error('3D 顯示暫時中斷，請重新整理。'));});
 return{start(index){playing=true;camera.position.set(-17,1.7,19);setChapter(index,index>0);orientAt(chapters[index].look||chapters[index].position);},setChapter,guide,lock,release,setDialog(open){dialogOpen=open;if(open){target=null;release();drag=null;}},setMotion(v){motion=v;},move(direction,on){on?mobileMoves.add(direction):mobileMoves.delete(direction);},isNear:()=>near};
}

