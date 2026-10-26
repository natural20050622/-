import {chapters,vocabulary} from './content.js';
const $=s=>document.querySelector(s), $$=s=>[...document.querySelectorAll(s)];
const STORAGE='storm-diaries-v1';
let state={chapter:'typhoon',completed:[],answers:{},attempts:{},reduced:matchMedia('(prefers-reduced-motion: reduce)').matches};
try{const saved=JSON.parse(localStorage.getItem(STORAGE));if(saved&&Array.isArray(saved.completed)&&saved.answers&&saved.attempts){state={...state,...saved};state.completed=state.completed.filter(id=>Object.values(chapters).some(c=>c.missions.some(m=>m.id===id)));if(!chapters[state.chapter])state.chapter='typhoon';}}catch{}
let world=null,active=null,qIndex=0,toastTimer;
function save(){try{localStorage.setItem(STORAGE,JSON.stringify(state));}catch{toast('此瀏覽器無法儲存進度，關閉頁面前請下載日記。');}}
function toast(text){$('#toast').textContent=text;$('#toast').classList.add('visible');clearTimeout(toastTimer);toastTimer=setTimeout(()=>$('#toast').classList.remove('visible'),4000);}
function applyMotion(){$('body').classList.toggle('reduced-motion',state.reduced);$('#motion').setAttribute('aria-pressed',String(state.reduced));$('#motion').title=state.reduced?'開啟場景動態':'減少動態';if(world)world.reduced=state.reduced;}
function updateUI(){
  const c=chapters[state.chapter];
  $$('.chapter-card').forEach(b=>{b.classList.toggle('active',b.dataset.chapter===state.chapter);b.setAttribute('aria-pressed',String(b.dataset.chapter===state.chapter));});
  for(const [key,value]of Object.entries(chapters))$(`#${key}-count`).textContent=`${value.missions.filter(m=>state.completed.includes(m.id)).length} / 4`;
  $('#total-progress').textContent=`${state.completed.length} / 8`;$('#chapter-progress').textContent=`${c.missions.filter(m=>state.completed.includes(m.id)).length} / 4`;
  $('#scene-kicker').textContent=`CHAPTER ${c.number} / ${c.kicker}`;$('#scene-title').textContent=c.scene;$('#location').textContent=c.location;$('#weather').textContent=c.weather;$('#field-note').innerHTML=c.note;
  $('#mission-list').innerHTML=c.missions.map((m,i)=>`<button class="mission-row ${state.completed.includes(m.id)?'done':''}" data-mission="${m.id}"><span class="mission-dot">${state.completed.includes(m.id)?'✓':i+1}</span><span>${m.label}</span><span>↗</span></button>`).join('');
  $$('.mission-row').forEach(b=>b.onclick=()=>openMission(b.dataset.mission));
  world?.setLabels(c.missions,state.completed);
}
function switchChapter(chapter){if(chapter===state.chapter)return;state.chapter=chapter;save();world?.build(chapter);updateUI();}
function richText(text){return text.replace(/\b([A-Za-z]+)\b/g,word=>vocabulary[word.toLowerCase()]?`<button class="word" data-word="${word.toLowerCase()}" aria-label="查看 ${word} 的意思">${word}</button>`:word);}
function openMission(id){
  active=chapters[state.chapter].missions.find(m=>m.id===id);if(!active)return;
  qIndex=0;world?.setPhase(id);if(world)world.paused=true;
  $('#reader-kicker').textContent=`FIELD NOTE ${chapters[state.chapter].number} / ${active.time}`;$('#reader-title').textContent=active.title;$('#reader-meta').textContent=`探索物件：${active.object} · 閱讀＋理解任務`;
  $('#passage').innerHTML=active.text.map((p,i)=>`<p data-paragraph="${i}">${richText(p)}</p>`).join('');$('#translation').textContent=active.zh;$('#translation').hidden=true;$('#translate').textContent='文 顯示中文';$('#translate').setAttribute('aria-pressed','false');$('#source-note').textContent=`教材來源：${active.source}。場景為課文情境的藝術化重現。`;
  $$('.word').forEach(b=>b.onclick=()=>{const v=vocabulary[b.dataset.word];toast(`${b.textContent}：${v[0]} · ${v[1]}`);});
  renderQuestion();$('#reader').showModal();$('.reading-pane').scrollTop=0;
}
function renderQuestion(){
  const q=active.questions[qIndex],key=`${active.id}-${qIndex}`;
  $('#question-kicker').textContent=q.kind;$('#question-area').innerHTML=`<div class="question-count">READ & DISCOVER · ${qIndex+1} / ${active.questions.length}</div><h3>${q.prompt}</h3><div class="options">${q.options.map((v,i)=>`<button class="option" data-option="${i}"><span>${String.fromCharCode(65+i)}</span>${v}</button>`).join('')}</div><div id="feedback" aria-live="polite"></div><button class="secondary-button" id="evidence">↖ 回到課文找線索</button>`;
  $$('#passage p').forEach(p=>p.classList.remove('evidence'));
  $('#evidence').onclick=()=>highlightEvidence(q,true);
  $$('.option').forEach(button=>button.onclick=()=>{
    const n=Number(button.dataset.option);state.attempts[key]=(state.attempts[key]||0)+1;
    if(n!==q.answer){button.classList.add('wrong');button.disabled=true;$('#feedback').innerHTML='<div class="feedback wrong-feedback">再看看文中的角色、時間或句型。你可以回到課文找線索，再試一次。</div>';highlightEvidence(q);save();return;}
    state.answers[key]=true;save();button.classList.add('correct');$$('.option').forEach(b=>b.disabled=true);
    $('#feedback').innerHTML=`<div class="feedback"><b>✓ 找到了！</b><br>${q.explain}</div><button class="primary-button" id="next-question">${qIndex===active.questions.length-1?'完成這則日記':'下一個任務'} <span>→</span></button>`;
    highlightEvidence(q);$('#next-question').onclick=()=>{if(qIndex<active.questions.length-1){qIndex++;renderQuestion();}else finishMission();};
  });
}
function highlightEvidence(q,scroll=false){const i=q.evidence??(active.text.length-1);$$('#passage p').forEach(p=>p.classList.toggle('evidence',Number(p.dataset.paragraph)===i));if(scroll&&innerWidth<721)$('#passage p.evidence')?.scrollIntoView({behavior:state.reduced?'instant':'smooth',block:'center'});}
function finishMission(){
  const newDone=!state.completed.includes(active.id);if(newDone)state.completed.push(active.id);save();updateUI();
  const c=chapters[state.chapter],count=c.missions.filter(m=>state.completed.includes(m.id)).length,next=c.missions.find(m=>!state.completed.includes(m.id));
  $('#question-kicker').textContent='FIELD NOTE COLLECTED';$('#question-area').innerHTML=`<div class="completion-icon">✧</div><h3>${count===4?'本章故事，已經拼完整了。':'一段故事，已經被你讀懂。'}</h3><p class="learning-note">${count===4?(state.chapter==='typhoon'?'Adam 的經歷讓我們看見：輕忽提醒與準備不足，如何影響風雨之後的生活。':'你已用文字重建 Bella 的經歷，也練習了看見、聽見與感覺到的英文描述。'):`已收集「${active.label}」。<br>本章進度 ${count} / 4，繼續探索其他線索。`}</p><button class="primary-button" id="continue-story">${next?'探索下一個線索':state.completed.length===8?'查看我的完整日記':state.chapter==='typhoon'?'前往地震回憶':'前往颱風公寓'} <span>→</span></button><button class="secondary-button" id="back-scene">返回場景，自由探索</button>`;
  $('#continue-story').onclick=()=>{closeReader();if(next)openMission(next.id);else if(state.completed.length===8)showJournal();else switchChapter(state.chapter==='typhoon'?'earthquake':'typhoon');};$('#back-scene').onclick=closeReader;
}
function stopSpeaking(){if('speechSynthesis'in window)speechSynthesis.cancel();$('#speak').textContent='◖ 朗讀英文';}
function closeReader(){$('#reader').close();stopSpeaking();if(world)world.paused=false;}
$('#reader').addEventListener('close',()=>{stopSpeaking();if(world)world.paused=false;});
$$('[data-close]').forEach(b=>b.onclick=()=>{if(b.dataset.close==='reader')closeReader();else $('#'+b.dataset.close).close();});
$('#translate').onclick=()=>{const visible=$('#translation').hidden;$('#translation').hidden=!visible;$('#translate').textContent=visible?'文 隱藏中文':'文 顯示中文';$('#translate').setAttribute('aria-pressed',String(visible));};
$('#speak').onclick=()=>{if(!('speechSynthesis'in window)){toast('此瀏覽器不支援朗讀，請使用文字閱讀。');return;}if(speechSynthesis.speaking){stopSpeaking();return;}const u=new SpeechSynthesisUtterance(active.text.join(' '));u.lang='en-US';u.rate=.82;const voice=speechSynthesis.getVoices().find(v=>v.lang==='en-US');if(voice)u.voice=voice;u.onend=()=>$('#speak').textContent='◖ 朗讀英文';u.onerror=()=>{stopSpeaking();toast('目前無法朗讀，請確認裝置的英文語音設定。');};speechSynthesis.speak(u);$('#speak').textContent='■ 停止朗讀';};
function notebook(html){$('#notebook-body').innerHTML=html;$('#notebook').showModal();if(world)world.paused=true;}
$('#notebook').addEventListener('close',()=>{if(world)world.paused=false;});
function showJournal(){
  const total=Object.keys(state.answers).length,first=Object.keys(state.answers).filter(k=>state.attempts[k]===1).length;
  notebook(`<div class="eyebrow">MY EXPLORATION JOURNAL</div><h2 id="notebook-title">我的風暴日記</h2><p>${state.completed.length===8?'兩段故事，八個線索。你已完成這次閱讀旅程。':'每一個讀懂的線索，都會留在這裡。進度自動儲存在目前的裝置與瀏覽器。'}</p><div class="stats"><div class="stat"><strong>${state.completed.length}<small> / 8</small></strong><span>探索點完成</span></div><div class="stat"><strong>${total}<small> / 16</small></strong><span>已理解的題目</span></div><div class="stat"><strong>${first}</strong><span>首次作答即正確</span></div></div>${Object.values(chapters).map(c=>`<div class="journal-entry"><b>${c.number} · ${c.title}</b><p>${c.missions.map(m=>`${state.completed.includes(m.id)?'✓':'○'} ${m.label}`).join('　')}</p><small>${c.number==='01'?'時間順序 · 因果推論 · 反身代名詞 · not only… but also…':'感官動詞 · 敘事順序 · 反身代名詞 · 文字證據'}</small></div>`).join('')}<div class="notebook-actions"><button class="primary-button" id="export-journal">↓ 下載學習紀錄</button><button class="secondary-button" id="reset-progress">重新開始</button></div>`);
  $('#export-journal').onclick=exportJournal;$('#reset-progress').onclick=()=>{ $('#notebook-body').innerHTML='<div class="eyebrow">A FRESH PAGE</div><h2 id="notebook-title">重新開始這次旅程？</h2><p>這會清除本裝置的作答與探索進度。你可以先下載學習紀錄，再重新開始。</p><div class="notebook-actions"><button class="primary-button" id="confirm-reset">清除進度，重新開始</button><button class="secondary-button" id="cancel-reset">保留進度</button></div>';$('#confirm-reset').onclick=()=>{state.completed=[];state.answers={};state.attempts={};state.chapter='typhoon';save();world?.build('typhoon');updateUI();$('#notebook').close();toast('新的故事，從第一則訊息開始。');};$('#cancel-reset').onclick=()=>{$('#notebook').close();showJournal();};};
}
function exportJournal(){const lines=['風暴日記｜Lesson 5 學習紀錄',`匯出時間：${new Date().toLocaleString('zh-TW',{timeZone:'Asia/Taipei'})}`,`完成探索：${state.completed.length}/8`,''];for(const c of Object.values(chapters)){lines.push(c.title);for(const m of c.missions){lines.push(`${state.completed.includes(m.id)?'✓':'○'} ${m.label}`);m.questions.forEach((q,i)=>{const k=`${m.id}-${i}`;lines.push(`  ${q.kind}：${state.answers[k]?'已答對':'尚未完成'}；作答 ${state.attempts[k]||0} 次`);});}lines.push('');}const a=document.createElement('a'),url=URL.createObjectURL(new Blob(['\uFEFF'+lines.join('\n')],{type:'text/plain;charset=utf-8'}));a.href=url;a.download='風暴日記-學習紀錄.txt';a.click();setTimeout(()=>URL.revokeObjectURL(url),1000);}
function showGlossary(){notebook('<div class="eyebrow">POCKET VOCABULARY</div><h2 id="notebook-title">隨身單字本</h2><p>在故事中認識單字，再帶著它們回到故事。</p><input id="word-search" aria-label="搜尋英文或中文單字" placeholder="搜尋英文或中文…"><div class="word-grid" id="word-grid"></div>');const render=()=>{const filter=$('#word-search').value.trim().toLowerCase(),entries=Object.entries(vocabulary).filter(([k,v])=>(k+v.join(' ')).toLowerCase().includes(filter));$('#word-grid').innerHTML=entries.length?entries.map(([word,[zh,meaning]])=>`<div class="word-card"><b>${word}</b><span>${zh}</span><p>${meaning}</p></div>`).join(''):'<p>找不到這個單字，試試其他英文或中文字。</p>';};$('#word-search').oninput=render;render();}
$('#journal').onclick=showJournal;$('#glossary').onclick=showGlossary;$('#motion').onclick=()=>{state.reduced=!state.reduced;applyMotion();save();toast(state.reduced?'已減少動態效果。':'已開啟場景動態。');};$('#reset-camera').onclick=()=>world?.reset();$$('.chapter-card').forEach(b=>b.onclick=()=>switchChapter(b.dataset.chapter));
applyMotion();updateUI();
try{const {StoryWorld}=await import('./scene.js');world=new StoryWorld($('#scene'),openMission);if(state.chapter!=='typhoon')world.build(state.chapter);applyMotion();updateUI();$('#loading').style.display='none';}catch(e){console.error(e);$('#loading').style.display='none';const error=document.createElement('div');error.className='scene-error';error.innerHTML='<b>這台裝置目前無法顯示 3D 場景。</b><span>你仍可點選探索清單，閱讀故事與完成所有任務。</span><button class="secondary-button" id="retry-scene">重新載入場景</button>';$('#scene').append(error);$('#retry-scene').onclick=()=>location.reload();}
