import * as THREE from './vendor/three.module.js';

const C={wall:0xc6cfb6, edge:0x7e9476,wood:0x9a6846,lightwood:0xbc9068,cream:0xf4e9cd,green:0x54795d,dark:0x324c40,terra:0xb87552};
export class StoryWorld{
  constructor(container,onSelect){
    this.container=container;this.onSelect=onSelect;this.clock=new THREE.Clock();this.reduced=matchMedia('(prefers-reduced-motion: reduce)').matches;this.paused=false;this.chapter='typhoon';this.materials=new Map();this.interactables=[];this.labels=[];
    this.renderer=new THREE.WebGLRenderer({antialias:true,alpha:true,powerPreference:'low-power'});
    this.renderer.setPixelRatio(Math.min(devicePixelRatio,1.6));this.renderer.shadowMap.enabled=true;this.renderer.shadowMap.type=THREE.PCFSoftShadowMap;
    this.renderer.outputColorSpace=THREE.SRGBColorSpace;this.renderer.setClearColor(0x000000,0);this.renderer.domElement.setAttribute('aria-hidden','true');container.prepend(this.renderer.domElement);
    this.scene=new THREE.Scene();this.camera=new THREE.PerspectiveCamera(36,1,.1,100);this.target=new THREE.Vector3(0,.6,0);this.theta=.72;this.phi=.76;this.radius=16.7;
    this.ambient=new THREE.HemisphereLight(0xf7f6e3,0x647653,2.6);this.scene.add(this.ambient);
    this.sun=new THREE.DirectionalLight(0xffecc9,3.6);this.sun.position.set(-3,10,6);this.sun.castShadow=true;this.sun.shadow.mapSize.set(1024,1024);Object.assign(this.sun.shadow.camera,{left:-9,right:9,top:9,bottom:-9,near:.5,far:30});this.sun.shadow.bias=-.001;this.scene.add(this.sun);
    this.fill=new THREE.DirectionalLight(0xb1d9c7,1.1);this.fill.position.set(5,5,-5);this.scene.add(this.fill);
    this.root=new THREE.Group();this.scene.add(this.root);this.ray=new THREE.Raycaster();this.pointer=new THREE.Vector2();this.pointers=new Map();this.dragged=false;
    const canvas=this.renderer.domElement;
    canvas.addEventListener('pointerdown',e=>{this.pointers.set(e.pointerId,{x:e.clientX,y:e.clientY});this.start={x:e.clientX,y:e.clientY};this.dragged=false;canvas.setPointerCapture(e.pointerId);this.pinchDistance=this.pinch();});
    canvas.addEventListener('pointermove',e=>{const old=this.pointers.get(e.pointerId);if(!old)return;const dx=e.clientX-old.x,dy=e.clientY-old.y;this.pointers.set(e.pointerId,{x:e.clientX,y:e.clientY});if(Math.hypot(e.clientX-this.start.x,e.clientY-this.start.y)>5)this.dragged=true;if(this.pointers.size===2){const d=this.pinch();this.radius=THREE.MathUtils.clamp(this.radius+(this.pinchDistance-d)*.025,12,23);this.pinchDistance=d;}else{this.theta-=dx*.006;this.phi=THREE.MathUtils.clamp(this.phi-dy*.004,.47,1.15);}this.updateCamera();});
    canvas.addEventListener('pointerup',e=>{if(!this.dragged&&this.pointers.size===1)this.pick(e);this.pointers.delete(e.pointerId);});canvas.addEventListener('pointercancel',e=>this.pointers.delete(e.pointerId));
    canvas.addEventListener('wheel',e=>{e.preventDefault();this.radius=THREE.MathUtils.clamp(this.radius+e.deltaY*.008,12,23);this.updateCamera();},{passive:false});
    new ResizeObserver(()=>this.resize()).observe(container);this.resize();this.build('typhoon');this.animate();
    canvas.addEventListener('webglcontextlost',e=>{e.preventDefault();this.container.querySelector('#loading').style.display='flex';this.container.querySelector('#loading').textContent='3D 畫面已暫停，請重新整理。閱讀任務仍可從清單進入。';});
  }
  pinch(){const p=[...this.pointers.values()];return p.length<2?0:Math.hypot(p[0].x-p[1].x,p[0].y-p[1].y);}
  mat(color,extra={}){const key=color+JSON.stringify(extra);if(!this.materials.has(key))this.materials.set(key,new THREE.MeshStandardMaterial({color,roughness:.87,...extra}));return this.materials.get(key);}
  box(w,h,d,x,y,z,color,parent=this.root){const m=new THREE.Mesh(new THREE.BoxGeometry(w,h,d),this.mat(color));m.position.set(x,y,z);m.castShadow=true;m.receiveShadow=true;parent.add(m);return m;}
  cylinder(r1,r2,h,x,y,z,color,parent=this.root,segments=16){const m=new THREE.Mesh(new THREE.CylinderGeometry(r1,r2,h,segments),this.mat(color));m.position.set(x,y,z);m.castShadow=true;m.receiveShadow=true;parent.add(m);return m;}
  sphere(r,x,y,z,color,parent=this.root){const m=new THREE.Mesh(new THREE.IcosahedronGeometry(r,1),this.mat(color));m.position.set(x,y,z);m.castShadow=true;parent.add(m);return m;}
  group(id){const g=new THREE.Group();g.userData.mission=id;this.root.add(g);this.interactables.push(g);return g;}
  table(x,z,w=2.5,d=1.7,parent=this.root){this.box(w,.15,d,x,1.35,z,C.lightwood,parent);for(const dx of[-w/2+.15,w/2-.15])for(const dz of[-d/2+.15,d/2-.15])this.box(.12,1.25,.12,x+dx,.65,z+dz,C.wood,parent);}
  chair(x,z,rotation=0,color=C.green){const g=new THREE.Group();g.position.set(x,0,z);g.rotation.y=rotation;this.root.add(g);this.box(.75,.14,.7,0,.72,0,color,g);this.box(.75,.8,.1,0,1.16,-.32,color,g);for(const dx of[-.27,.27])for(const dz of[-.24,.24])this.box(.08,.7,.08,dx,.34,dz,C.wood,g);}
  plant(x,z,scale=1){const g=new THREE.Group();g.position.set(x,0,z);g.scale.setScalar(scale);this.root.add(g);this.cylinder(.32,.23,.55,0,.3,0,C.terra,g);for(let i=0;i<6;i++){const a=i*2.4;const m=this.sphere(.45,Math.sin(a)*.25,.9+i*.12,Math.cos(a)*.22,i%2?0x57784f:0x7b9563,g);m.scale.set(.7,1.5,.65);} }
  person(x,z,color,rotation=0){const g=new THREE.Group();g.position.set(x,0,z);g.rotation.y=rotation;this.root.add(g);this.cylinder(.23,.3,.62,0,1.05,0,color,g);this.sphere(.24,0,1.65,0,0xd5ad86,g);this.sphere(.245,0,1.75,-.04,0x493d30,g).scale.set(1,.6,1);this.box(.45,.17,.44,0,.72,.13,0x475a58,g);this.box(.13,.62,.15,-.15,.35,.28,0x475a58,g);this.box(.13,.62,.15,.15,.35,.28,0x475a58,g);for(const a of[-1,1]){const arm=this.box(.12,.5,.12,a*.32,1.1,.15,color,g);arm.rotation.x=-.6;}return g;}
  build(chapter){
    for(const child of [...this.root.children]){child.traverse(o=>{if(o.geometry)o.geometry.dispose();});this.root.remove(child);}this.interactables=[];this.clouds=[];this.animated=[];this.chapter=chapter;this.phase=0;this.ambient.intensity=2.6;this.sun.intensity=3.6;
    // A cutaway room floats above a tiny street, like a page from a pop-up book.
    this.box(8,.45,6.8,0,-.28,0,0x8c9d7c);this.box(8.12,.12,6.92,0,-.02,0,C.cream);
    for(let i=0;i<16;i++)this.box(.47,.025,6.65,-3.75+i*.5,.065,0,i%3===0?0xc6ae86:0xd3bb93);
    this.box(8,3.6,.16,0,1.82,-3.3,C.wall);this.box(.16,3.6,6.6,-3.9,1.82,0,0xb8c6ab);
    this.box(8.1,.11,.22,0,3.65,-3.3,C.edge);this.box(.23,.11,6.7,-3.9,3.65,0,C.edge);
    this.box(8,.12,.1,0,.16,-3.17,C.edge);this.box(.1,.12,6.5,-3.78,.16,0,C.edge);
    this.box(9.7,.2,1.4,.1,-.8,4.3,0xa4aa98);for(let i=0;i<7;i++)this.box(.7,.01,.06,-3.8+i*1.3,-.69,4.3,0xeee8cf);
    for(let i=0;i<4;i++){const g=new THREE.Group();g.position.set(-4+i*2.6,5.2+Math.sin(i)*.3,-4.5);this.root.add(g);for(let j=0;j<4;j++)this.sphere(.48+Math.sin(j)*.1,j*.45,Math.sin(j)*.17,0,chapter==='typhoon'?0x9baa9d:0xeceddf,g).scale.y=.6;this.clouds.push(g);}
    // Deep window reveals rain and a miniature skyline.
    const win=this.group(chapter==='typhoon'?'window':'floor');this.box(2.65,2.05,.12,-1.65,2.2,-3.17,0x779794,win);this.box(2.4,1.8,.08,-1.65,2.2,-3.08,chapter==='typhoon'?0x9eb9b1:0xbad1c5,win);
    for(let i=0;i<6;i++){this.box(.27,.45+(i%3)*.22,.04,-2.65+i*.4,1.53+(i%3)*.11,-3.01,0x819d94,win);}
    for(const xx of[-2.95,-1.65,-.35])this.box(.07,2.1,.15,xx,2.2,-2.98,C.cream,win);for(const yy of[1.2,2.2,3.2])this.box(2.7,.07,.15,-1.65,yy,-2.98,C.cream,win);
    this.box(3,.08,.35,-1.65,1.16,-2.95,C.lightwood,win);
    this.rain=[];if(chapter==='typhoon')for(let i=0;i<35;i++){const m=this.box(.015,.12,.015,-2.8+Math.random()*2.3,1.4+Math.random()*1.6,-2.91,0xd8e8d8,win);m.rotation.z=-.3;this.rain.push(m);}
    // Wall print.
    this.box(.95,1.15,.1,1,2.6,-3.12,C.wood);this.box(.81,1.01,.08,1,2.6,-3.05,0xebe6ce);this.sphere(.27,1,2.72,-2.98,0xd1a163).scale.set(1,1,.1);this.box(.65,.2,.06,1,2.34,-2.98,0x8b9f77);
    this.plant(-3,2.1,.85);this.plant(3.25,-2.65,1.1);
    // Light shade and a pendant lamp; kept clear of the reading targets.
    this.cylinder(.022,.022,1.2,.3,4.1,0,0x5f705a);this.cylinder(.18,.62,.35,.3,3.4,0,C.green);this.cylinder(.5,.5,.03,.3,3.21,0,0xf8e9ac);
    this.lamp=new THREE.PointLight(0xffdb8c,5,8,2);this.lamp.position.set(.3,3,0);this.root.add(this.lamp);
    if(chapter==='typhoon')this.apartment();else this.restaurant();
    this.water=this.box(9.4,.05,1.35,.1,-.65,4.3,0x7eaaa6);this.water.material=this.mat(0x7eaaa6,{transparent:true,opacity:.6});this.water.visible=false;
    // Soft contact shadow under the whole diorama.
    const shadow=new THREE.Mesh(new THREE.PlaneGeometry(30,30),new THREE.ShadowMaterial({opacity:.13}));shadow.rotation.x=-Math.PI/2;shadow.position.y=-1.05;shadow.receiveShadow=true;this.root.add(shadow);
    this.reset();
  }
  apartment(){
    const phone=this.group('message');this.box(1.25,.1,1.4,-2.35,.8,.6,C.lightwood,phone);for(const dx of[-.45,.45])for(const dz of[-.5,.5])this.box(.09,.75,.09,-2.35+dx,.4,.6+dz,C.wood,phone);
    this.box(.3,.05,.52,-2.35,.88,.65,0x354c43,phone);this.box(.25,.01,.43,-2.35,.912,.65,0xe4d5aa,phone);this.box(.18,.012,.025,-2.35,.92,.59,0x739679,phone);
    this.box(1.4,.45,2.2,-3,.5,-1,0x8a9c7a);this.box(.3,.7,2.3,-3.65,.85,-1,0x899a78);this.box(1.4,.6,.3,-3, .8,-2.1,0x899a78);this.box(1.4,.6,.3,-3,.8,.1,0x899a78);this.box(.65,.15,.75,-3,.8,-1.35,0xb3b899).rotation.z=.12;
    const rug=this.box(3.5,.025,2.9,-.6,.09,1,0x829a83);for(let i=0;i<9;i++)this.box(3.25,.004,.025,-.6,.107,-.2+i*.3,0xa6b297);
    this.table(.2,.5,2.1,1.4);this.cylinder(.22,.22,.055,-.1,1.46,.5,C.cream);this.cylinder(.13,.13,.23,.75,1.54,.4,0xdddcc0);this.box(.58,.04,.42,.3,1.46,.8,0x6a8073).rotation.y=.2;
    const bag=this.group('supplies');this.box(2.2,.9,.95,2.35,.51,-1.85,C.green,bag);this.box(2.3,.13,1.05,2.35,1,-1.85,C.lightwood,bag);this.box(.65,.65,.45,2.1,1.4,-1.85,0xc1a379,bag);this.box(.52,.09,.08,2.1,1.75,-1.85,C.wood,bag);this.box(.4,.05,.65,2.9,1.12,-1.7,C.cream,bag);
    for(let i=0;i<6;i++){const e=this.sphere(.09,2.77+(i%2)*.22,1.22,-1.92+Math.floor(i/2)*.2,0xe7d7b7,bag);e.scale.y=1.2;}
    this.cylinder(.12,.12,.32,1.55,1.23,-1.8,0x78533d,bag);
    const drawer=this.group('drawer');this.box(1.4,.9,.95,2.35,.52,1.55,C.wood,drawer);for(let i=0;i<2;i++){this.box(1.3,.35,.07,2.35,.3+i*.4,2.05,C.lightwood,drawer);this.box(.25,.045,.05,2.35,.3+i*.4,2.1,0x4f5f4a,drawer);}
    this.box(1.45,.1,1.03,2.35,1.04,1.55,C.lightwood,drawer);this.cylinder(.36,.36,.045,2.35,1.13,1.55,C.cream,drawer);for(let i=0;i<3;i++){this.cylinder(.12,.12,.045,2.15+i*.19,1.17,1.55+(i%2)*.15,0xb28551,drawer);for(let j=0;j<3;j++)this.sphere(.017,2.12+i*.19+j*.035,1.195,1.55+(i%2)*.15,0x785037,drawer);}
    this.chair(.5,1.9,0);this.box(.05,1.8,.05,3.35,.95,.3,C.dark);this.cylinder(.18,.4,.45,3.35,2,.3,0xd2b77e);
  }
  restaurant(){
    this.box(3.7,.02,3,0,.09,.3,0xbaad87);for(let i=0;i<7;i++)this.box(.025,.005,2.8,-1.6+i*.53,.105,.3,0xd6c8a3);
    const table=this.group('floor');this.table(0,.1,2.8,1.85,table);this.box(2.2,.025,1.9,0,1.45,.1,0xe6ddbc,table);for(const x of[-.8,.8]){this.cylinder(.28,.28,.045,x,1.49,.05,C.cream,table);this.cylinder(.11,.11,.2,x,1.58,-.45,0xb8c6b1,table);this.box(.025,.02,.45,x+.35,1.48,.1,0x8b978a,table);}this.cylinder(.17,.14,.3,0,1.63,.1,0x9aaf91,table);for(let i=0;i<3;i++)this.sphere(.12,Math.sin(i*2)*.12,1.97,Math.cos(i*2)*.12,0xcf9c69,table);
    this.chair(-1.9,0,-Math.PI/2);this.chair(1.9,0,Math.PI/2);this.chair(0,1.65,0);this.chair(0,-1.35,Math.PI);this.person(-1.95,0,0x839b8a,-Math.PI/2);this.person(1.95,0,0xb68a60,Math.PI/2);this.person(0,-1.4,0xa86752,Math.PI);
    const family=this.group('family');this.box(.7,1.0,.38,-2.8,.65,1.45,0xb97c53,family);for(const x of[-3.03,-2.57])this.cylinder(.07,.07,.08,x,.13,1.45,0x3a5046,family);this.box(.3,.05,.07,-2.8,1.23,1.45,C.wood,family);this.box(.6,.7,.03,-2.8,.65,1.66,0xc38e65,family);
    const shelf=this.group('dishes');this.box(1.45,2.65,.75,2.65,1.4,-2.65,C.wood,shelf);this.box(1.27,2.4,.65,2.65,1.4,-2.24,0x647e64,shelf);for(let i=0;i<3;i++){this.box(1.5,.09,.92,2.65,.6+i*.8,-2.35,C.lightwood,shelf);for(let j=0;j<3;j++)this.cylinder(.16,.16,.05,2.15+j*.45,.72+i*.8,-2.25,C.cream,shelf);}
    this.broken=[];for(let i=0;i<8;i++){const m=this.box(.16,.035,.12,2+Math.sin(i*1.7)*.7,.13,-1.5+Math.cos(i)*.5,C.cream,shelf);m.rotation.y=i*.7;m.visible=false;this.broken.push(m);}
    const shelter=this.group('shelter');const ring=new THREE.Mesh(new THREE.RingGeometry(.36,.4,32),this.mat(0xd3b37a,{side:THREE.DoubleSide}));ring.rotation.x=-Math.PI/2;ring.position.set(-.4,.14,1.1);shelter.add(ring);this.box(.15,.1,.15,-.4,.15,1.1,0xc8b889,shelter);
    this.box(.85,.06,.1,-3.75,2.4,-.4,C.lightwood);this.box(.06,.06,.5,-3.7,2.4,-.4,C.lightwood);
  }
  setLabels(missions,completed){const holder=this.container.querySelector('#hotspots');holder.innerHTML='';this.labels=missions.map((m,i)=>{const button=document.createElement('button');button.className='hotspot'+(completed.includes(m.id)?' done':'');button.innerHTML=`<i>${completed.includes(m.id)?'✓':i+1}</i>${m.label}`;button.setAttribute('aria-label',`探索${m.label}`);button.onclick=()=>this.onSelect(m.id);holder.append(button);return{button,point:new THREE.Vector3(...m.point)};});this.projectLabels();}
  setPhase(id){const ids=this.chapter==='typhoon'?['message','supplies','window','drawer']:['family','floor','shelter','dishes'];this.phase=Math.max(0,ids.indexOf(id));this.water.visible=this.chapter==='typhoon'&&this.phase===3;const dark=this.chapter==='typhoon'?this.phase>=2:this.phase>=2;this.ambient.intensity=dark?1.5:2.6;this.sun.intensity=dark?1.3:3.6;this.lamp.intensity=this.phase>=2?0:5;if(this.broken)for(const m of this.broken)m.visible=this.phase===3;}
  pick(e){const r=this.renderer.domElement.getBoundingClientRect();this.pointer.set((e.clientX-r.left)/r.width*2-1,-(e.clientY-r.top)/r.height*2+1);this.ray.setFromCamera(this.pointer,this.camera);const hit=this.ray.intersectObjects(this.interactables,true)[0];if(hit){let o=hit.object;while(o&&!o.userData.mission)o=o.parent;if(o)this.onSelect(o.userData.mission);}}
  reset(){this.theta=.72;this.phi=.76;this.radius=this.container.clientWidth<600?22.5:18;this.updateCamera();}
  resize(){const w=this.container.clientWidth,h=this.container.clientHeight;if(!w||!h)return;this.renderer.setSize(w,h);this.camera.aspect=w/h;this.camera.updateProjectionMatrix();this.updateCamera();}
  updateCamera(){this.camera.position.set(this.radius*Math.sin(this.phi)*Math.sin(this.theta),this.radius*Math.cos(this.phi)+.6,this.radius*Math.sin(this.phi)*Math.cos(this.theta));this.camera.lookAt(this.target);this.projectLabels();}
  projectLabels(){const w=this.container.clientWidth,h=this.container.clientHeight;for(const label of this.labels){const p=label.point.clone().project(this.camera);const x=(p.x*.5+.5)*w,y=(-p.y*.5+.5)*h-24;label.button.style.left=`${THREE.MathUtils.clamp(x,70,w-70)}px`;label.button.style.top=`${THREE.MathUtils.clamp(y,100,h-65)}px`;label.button.style.display=p.z>1?'none':'';}}
  animate(){this.renderer.setAnimationLoop(()=>{const dt=Math.min(this.clock.getDelta(),.05),t=this.clock.elapsedTime;if(!this.paused&&!this.reduced){for(let i=0;i<this.clouds.length;i++)this.clouds[i].position.y=5.2+Math.sin(i)*.3+Math.sin(t*.4+i)*.08;for(const r of this.rain){r.position.y-=dt*1.8;r.position.x-=dt*.3;if(r.position.y<1.35){r.position.y=3;r.position.x=-2.8+Math.random()*2.3;}}if(this.chapter==='earthquake'&&this.phase===1){this.root.rotation.z=Math.sin(t*13)*.003;}else this.root.rotation.z=0;}else this.root.rotation.z=0;this.renderer.render(this.scene,this.camera);});}
}
