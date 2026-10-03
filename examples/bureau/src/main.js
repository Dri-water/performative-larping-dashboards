import './style.css';
import {agents,stateAt,wave} from './state.js';
import {createScene} from './scene.js';
const $=s=>document.querySelector(s);
const params=new URLSearchParams(location.search);
const reduced=matchMedia('(prefers-reduced-motion: reduce)');
let time=params.has('t')?Math.max(0,Number(params.get('t'))||0):reduced.matches?8:0;
let paused=params.has('t')||reduced.matches, selected=0, scenario='routine';
$('#agents').innerHTML=agents.map((a,i)=>`<button class="agent" style="--accent:${a.color}" data-index="${i}" aria-pressed="${i===0}"><span class="agent-top"><b>${a.name}</b><small>0${i+1}</small></span><span class="agent-role">${a.role}</span><span class="agent-bottom"><i>${a.glyph}</i><span class="agent-load"></span></span></button>`).join('');
$('#loads').innerHTML=agents.map(a=>`<div class="load-row"><label>${a.name}<b></b></label><div><span style="background:${a.color}"></span></div></div>`).join('');
$('#heatmap').innerHTML=Array.from({length:96},()=>'<i></i>').join('');
$('#spectrum').innerHTML=Array.from({length:48},()=>'<i></i>').join('');
const optics=createScene($('#scene'),params.get('fallback')==='1');
function draw(){
 const s=stateAt(time,scenario), a=agents[selected];
 document.documentElement.dataset.time=time.toFixed(3);
 $('#pause').textContent=paused?'Resume':'Pause';$('#pause').setAttribute('aria-pressed',String(paused));
 $('#clock').textContent=new Date(time*1000).toISOString().slice(11,19);
 $('#processed').textContent=s.processed.toLocaleString('en-US');$('#rate').textContent=12*s.multiplier;
 $('#pressure').textContent=s.pressure.toFixed(1);$('#phase').textContent=s.phaseLabel;$('#packet-count').textContent='24 DOSSIERS IN TRANSIT';
 $('#agent-glyph').textContent=a.glyph;$('#agent-glyph').style.color=a.color;$('#agent-role').textContent=a.role;$('#agent-name').textContent=a.name;$('#agent-quote').textContent=`“${a.quote}”`;
 $('#agent-meter').style.width=s.loads[selected]+'%';$('#agent-meter').style.background=a.color;$('#agent-value').textContent=Math.round(s.loads[selected])+'%';
 document.querySelectorAll('.agent').forEach((el,i)=>{el.setAttribute('aria-pressed',String(i===selected));el.querySelector('.agent-load').textContent=Math.round(s.loads[i])+'% DELIBERATING';});
 document.querySelectorAll('.load-row').forEach((el,i)=>{el.querySelector('b').textContent=Math.round(s.loads[i])+'%';el.querySelector('div span').style.width=s.loads[i]+'%';});
 $('#spark').innerHTML=`<path d="${Array.from({length:50},(_,i)=>`${i?'L':'M'}${i*240/49},${65-wave(time*.5-i*.18)*55}`).join(' ')}" fill="none" stroke="#bde5a5" stroke-width="2"/>`;
 document.querySelectorAll('#heatmap i').forEach((el,i)=>{el.style.background=agents[i%6].color;el.style.opacity=.12+wave(time*.2+i*3)*.75;});
 document.querySelectorAll('#spectrum i').forEach((el,i)=>{el.style.height=(10+wave(time*.8+i*.3)*85)+'%';el.style.background=agents[Math.floor(i/8)].color;});
 $('#log').innerHTML=s.events.map(e=>`<div class="log-row"><small>${String(e.id).padStart(4,'0')}</small><b style="color:${agents[e.agent].color}">${agents[e.agent].name}</b><span>${e.label}</span></div>`).join('');
 optics.render(time,s,selected);
}
$('#agents').addEventListener('click',e=>{const button=e.target.closest('button');if(button){selected=Number(button.dataset.index);draw();}});
$('#pause').onclick=()=>{paused=!paused;draw();};$('#reset').onclick=()=>{time=0;draw();};$('#capture').onclick=()=>{paused=true;const url=new URL(location.href);url.searchParams.set('t',time.toFixed(3));history.replaceState(null,'',url);draw();};
$('#scenario').onchange=e=>{scenario=e.target.value;draw();};
reduced.addEventListener('change',e=>{if(e.matches)paused=true;draw();});
let previous=performance.now();
let lastUI=0;
function frame(now){const delta=Math.min((now-previous)/1000,.1);previous=now;if(!paused&&!document.hidden){time+=delta;if(now-lastUI>100){draw();lastUI=now;}else optics.render(time,stateAt(time,scenario),selected);}requestAnimationFrame(frame);}
draw();requestAnimationFrame(frame);
