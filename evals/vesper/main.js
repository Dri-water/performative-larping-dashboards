import * as T from 'three';
import {createOptics} from './optics.mjs';
const $=s=>document.querySelector(s), params=new URLSearchParams(location.search);
let optics;
try{optics=createOptics({container:$('#world'),background:0x071017,cool:0x9dc7d6,warm:0xffbb79,bloomStrength:.42,pixelRatio:1});}catch(e){$('#fallback').hidden=false;throw e}
const {scene,camera,renderer}=optics; scene.fog=new T.FogExp2(0x071017,.024);
const root=new T.Group();scene.add(root);root.rotation.z=-.12;
const metal=new T.MeshStandardMaterial({color:0x44535a,metalness:.85,roughness:.32});
const dark=new T.MeshStandardMaterial({color:0x13232c,metalness:.7,roughness:.36});
const brass=new T.MeshStandardMaterial({color:0xa98461,metalness:.8,roughness:.3});
const glow=new T.MeshBasicMaterial({color:new T.Color(2.5,1.2,.42)});
const ice=new T.MeshBasicMaterial({color:new T.Color(.4,1.0,1.2)});
const lineMat=new T.LineBasicMaterial({color:0x608998,transparent:true,opacity:.28});
function mesh(g,m,parent=root){const o=new T.Mesh(g,m);parent.add(o);return o}
function line(points,mat= lineMat,parent=root){const g=new T.BufferGeometry().setFromPoints(points);const o=new T.Line(g,mat);parent.add(o);return o}
function curve(fn,n=180,mat=lineMat,parent=root){return line(Array.from({length:n+1},(_,i)=>fn(i/n)),mat,parent)}
function box(x,y,z,m,parent=root){return mesh(new T.BoxGeometry(x,y,z),m,parent)}
let randseed=902;function rnd(){randseed=(randseed*1664525+1013904223)>>>0;return randseed/4294967296}
const layers=[],fins=[],arms=[];
// Manufactured hurricane: open corrugated lamellae, interrupted perimeter ribs and inner spokes.
for(let j=0;j<44;j++){
 const y=-3.2+j*.147, r=.53+Math.pow(j/43,1.75)*3.15; const g=new T.BufferGeometry();const p=[],idx=[];
 for(let k=0;k<=160;k++)for(let q=0;q<2;q++){const a=k/160*Math.PI*2;const noise=.08*Math.sin(a*7+j*.4)+.045*Math.sin(a*19-j*.3);const rr=(r+noise)*(q?1:.87);p.push(Math.cos(a)*rr,y+Math.sin(a*3+j*.34)*(.11+j*.003)+q*.06,Math.sin(a)*rr);}
 for(let k=0;k<160;k++){if((k+j*7)%160>116)continue;let n=k*2;idx.push(n,n+1,n+2,n+1,n+3,n+2)}g.setAttribute('position',new T.Float32BufferAttribute(p,3));g.setIndex(idx);g.computeVertexNormals();
 const mat=new T.MeshStandardMaterial({color:new T.Color().setHSL(.065+j*.0007,.28,.27+j*.004),metalness:.38,roughness:.6,side:T.DoubleSide,transparent:true,opacity:.56,depthWrite:false});const o=mesh(g,mat);layers.push({o,y,r,mat});
 curve(t=>{let a=t*Math.PI*1.91;return new T.Vector3(Math.cos(a)*r,y+Math.sin(a*3+j*.34)*(.11+j*.003)+.06,Math.sin(a)*r)},160,new T.LineBasicMaterial({color:j%5===0?0xffbe82:0x9d7762,transparent:true,opacity:j%5===0?.8:.3}),o);
 if(j%4===0){for(let k=0;k<12;k++){let a=k*Math.PI/6+j*.17;const b=box(.09,.055,r*.38,brass,o);b.position.set(Math.sin(a)*r*.8,y,Math.cos(a)*r*.8);b.rotation.y=a;}}
}
// Articulated calipers with stacked shingles, actuator banks, and luminous inserts.
for(let k=0;k<9;k++){
 const a=k*Math.PI*2/9;const pivot=new T.Group();root.add(pivot);pivot.rotation.y=a;const structure=new T.Group();pivot.add(structure);structure.position.z=4.35;
 for(let j=0;j<13;j++){
 const s=box(.6,.42,.3,j%3?dark:metal,structure);s.position.set(0,-3.1+j*.49,Math.sin(j/12*Math.PI)*.4);s.rotation.x=-.16+j*.025;
 const rib=box(.71,.055,.42,brass,structure);rib.position.copy(s.position);rib.position.y+=.2;
 const tip=box(.035,.25,.03,j%4===0?glow:ice,structure);tip.position.copy(s.position);tip.position.z+=.22;
 }
 const spine=box(.16,6.6,.23,metal,structure);spine.position.y=0;
 for(let q=0;q<8;q++){let vane=box(.38,.16,.8,q%2?metal:brass,structure);vane.position.set(q%2?.42:-.42,-2.7+q*.74,.12);vane.rotation.z=(q%2?1:-1)*.3;}
 const foot=box(.8,.22,2.2,metal,structure);foot.position.set(0,-3.35,-.65);
 arms.push({pivot,structure,a});
}
// Internal lightning filament cage, revealed by the torn atmosphere.
const lightning=new T.Group();root.add(lightning);
for(let j=0;j<16;j++){curve(t=>{const a=t*17+j*.393;const r=.24+.16*Math.sin(t*14+j);return new T.Vector3(Math.cos(a)*r,-3.5+t*7,Math.sin(a)*r)},180,j%3===0?new T.LineBasicMaterial({color:0xffefd1}):new T.LineBasicMaterial({color:0xec9860,transparent:true,opacity:.5}),lightning)}
const core=mesh(new T.CylinderGeometry(.035,.12,7.4,12),glow,lightning);
// Wind rivers: nested trajectories in an eccentric system, with moving physical pulse packets.
const rivers=[],packets=[];
for(let j=0;j<22;j++){
 const fn=t=>{let a=t*Math.PI*2+.1*j;return new T.Vector3(Math.cos(a)*(5.5+j*.058),Math.sin(a*2+j*.11)*.7+(j-11)*.13,Math.sin(a)*(3.2+j*.045));};
 const c=curve(fn,240,new T.LineBasicMaterial({color:j%4===0?0xe8b088:0x537b89,transparent:true,opacity:j%4===0?.72:.32}));c.rotation.z=.34;c.rotation.x=.25;rivers.push(c);
 for(let q=0;q<3;q++){let o=mesh(new T.SphereGeometry(j%4===0?.035:.019,6,6),j%4===0?glow:ice,c);packets.push({o,fn,speed:.032+j*.001,phase:rnd()});}
}
// Large sounding curtain: depth strips, coordinate backbone, travelling spectrum.
const curtain=new T.Group();root.add(curtain);curtain.position.set(5.3,.2,-3.4);curtain.rotation.y=-.5;
const curtainRows=[];
for(let j=0;j<46;j++){
 const ps=[];for(let i=0;i<90;i++){let x=i/89*3.7;let z=Math.sin(x*3+j*.21)*.2+Math.sin(x*7-j*.4)*.12;ps.push(new T.Vector3(x,-3.8+j*.166,z));}
 const o=line(ps,new T.LineBasicMaterial({color:j%6===0?0xe8b685:0x658e9d,transparent:true,opacity:j%6===0?.75:.3}),curtain);curtainRows.push(o);
 for(let k=0;k<3;k++){let b=box(.04,.09,.06,j%8===0?glow:brass,curtain);b.position.set(-.1-k*.12,-3.8+j*.166,0)}
}
for(let k=0;k<13;k++)curve(t=>new T.Vector3(k*.31,-3.8+t*7.5,-.1),2,lineMat,curtain);
const scan=box(4,.025,.2,ice,curtain);scan.position.x=1.8;
// Foreground geodesic radar plate and relief field.
const radar=new T.Group();root.add(radar);radar.position.set(-4,-3.5,3.6);radar.rotation.set(-.06,0,-.13);
for(let j=0;j<14;j++){let r=.25+j*.19;curve(t=>{let a=t*Math.PI*2;return new T.Vector3(Math.cos(a)*r,0,Math.sin(a)*r)},160,new T.LineBasicMaterial({color:j%3===0?0x82a9b7:0x375663,transparent:true,opacity:.5}),radar)}
for(let j=0;j<72;j++){let a=j*Math.PI/36;curve(t=>new T.Vector3(Math.cos(a)*(2.4+t*.15),.01,Math.sin(a)*(2.4+t*.15)),2,j%6===0?new T.LineBasicMaterial({color:0xddac7e}):lineMat,radar)}
const needle=box(2.5,.025,.022,glow,radar);needle.geometry.translate(1.25,0,0);
for(let j=0;j<20;j++)curve(t=>{let a=t*Math.PI*2;let r=.25+j*.08+.06*Math.sin(a*5+j*.3);return new T.Vector3(Math.cos(a)*r,.18+Math.sin(j*.2)*.5,Math.sin(a)*r)},100,new T.LineBasicMaterial({color:0x72939c,transparent:true,opacity:.28}),radar);
// High-altitude jet-stream cross-section: a large folded atmospheric sail.
const jet=new T.Group();root.add(jet);jet.position.set(-2,3.3,-4.5);jet.rotation.y=.28;
for(let j=0;j<28;j++)curve(u=>{let x=(u-.5)*15;let z=(j-14)*.11;let y=.5*Math.sin(x*.8+j*.08)+.25*Math.cos(x*1.6-j*.1);return new T.Vector3(x,y,z)},140,new T.LineBasicMaterial({color:j%7===0?0xd59d70:0x4f7889,transparent:true,opacity:j%7===0?.45:.2}),jet);
const jetSweep=box(.035,.4,3.5,ice,jet);
// Massive clipped lower instrument deck and manufacturing detail.
const deck=mesh(new T.CylinderGeometry(4.9,5.3,.35,80,1,true),dark);deck.position.y=-3.85;
for(let j=0;j<140;j++){let a=j/140*Math.PI*2;let o=box(.035,j%5===0?.34:.14,.08,j%5===0?brass:metal);o.position.set(Math.cos(a)*4.95,-3.84,Math.sin(a)*4.95);o.rotation.y=-a;}
// Ambient star-like metrology dust.
const pp=[];for(let i=0;i<1800;i++)pp.push((rnd()-.5)*30,(rnd()-.5)*19,(rnd()-.5)*22);const pg=new T.BufferGeometry();pg.setAttribute('position',new T.Float32BufferAttribute(pp,3));const dust=new T.Points(pg,new T.PointsMaterial({color:0x648e9f,size:.013,transparent:true,opacity:.4}));scene.add(dust);
// Infinite graticule behind the machine.
for(let j=-12;j<=12;j++){curve(t=>new T.Vector3(-16+t*32,j,-9),2,new T.LineBasicMaterial({color:0x345564,transparent:true,opacity:.12}),scene);curve(t=>new T.Vector3(j,-12+t*24,-9),2,new T.LineBasicMaterial({color:0x345564,transparent:true,opacity:.12}),scene)}

// Millions of air parcels implied by a GPU advected point volume.
const count=48000, seeds=new Float32Array(count*3);
for(let i=0;i<count;i++){seeds[i*3]=rnd();seeds[i*3+1]=rnd();seeds[i*3+2]=rnd();}
const stormGeo=new T.BufferGeometry();stormGeo.setAttribute('position',new T.BufferAttribute(seeds,3));
const stormMat=new T.ShaderMaterial({uniforms:{uTime:{value:0},uOpen:{value:0},uThermal:{value:0}},transparent:true,depthWrite:false,blending:T.AdditiveBlending,
vertexShader:`uniform float uTime;uniform float uOpen;varying float vAlpha;varying float vHeight;void main(){float h=position.x;float a=position.y*6.28318+uTime*(.35+(1.-h)*1.1)+h*8.;float r=(.2+pow(h,1.8)*3.1)*(.52+.48*position.z);float y=-3.3+h*6.3+(h-.5)*uOpen*2.8;vec3 p=vec3(cos(a)*r,y+sin(a*4.+h*13.)*.14,sin(a)*r);p.x+=sin(h*8.)*uOpen*h*1.8;p.xz*=1.+uOpen*h*.25;vec4 mv=modelViewMatrix*vec4(p,1.);gl_Position=projectionMatrix*mv;gl_PointSize=(1.0+position.z*1.1)*min(1.8,18./-mv.z);vAlpha=.3+position.z*.6;vHeight=h;}`,
fragmentShader:`uniform float uThermal;varying float vAlpha;varying float vHeight;void main(){float d=length(gl_PointCoord-.5);if(d>.5)discard;vec3 c=mix(vec3(.65,1.25,1.5),vec3(2.2,1.2,.48),vHeight);c=mix(c,vec3(.3,1.,2.),uThermal);gl_FragColor=vec4(c,(1.-d*2.)*vAlpha*.74);}`});
const stormCloud=new T.Points(stormGeo,stormMat);root.add(stormCloud);
// Radial sensor caps and dense fastener banks give the articulated mass a manufactured scale.
const bolts=new T.InstancedMesh(new T.BoxGeometry(.035,.035,.09),brass,936);let bi=0;const bm=new T.Object3D();
for(let a=0;a<9;a++)for(let j=0;j<13;j++)for(let q=0;q<8;q++){let theta=a*Math.PI*2/9;let xx=(q%4-1.5)*.14,zz=4.62;bm.position.set(Math.cos(theta)*xx+Math.sin(theta)*zz,-3.1+j*.49+(q<4?-.12:.12),-Math.sin(theta)*xx+Math.cos(theta)*zz);bm.rotation.y=theta;bm.updateMatrix();bolts.setMatrixAt(bi++,bm.matrix);}root.add(bolts);

// Batch repeated manufactured boxes; preserve the designed individual transforms.
const exclusions=new Set([scan,needle,jetSweep]);
for(const parent of [root,...arms.map(a=>a.structure),...layers.map(l=>l.o),curtain]){
 const byMaterial=new Map();for(const child of [...parent.children]){if(child.isMesh&&!child.isInstancedMesh&&child.geometry.type==='BoxGeometry'&&!exclusions.has(child)){let arr=byMaterial.get(child.material)||[];arr.push(child);byMaterial.set(child.material,arr)}}
 for(const[material,children]of byMaterial){if(children.length<2)continue;let instance=new T.InstancedMesh(new T.BoxGeometry(1,1,1),material,children.length);const scaling=new T.Matrix4();children.forEach((child,i)=>{child.updateMatrix();let p=child.geometry.parameters;scaling.makeScale(p.width,p.height,p.depth);instance.setMatrixAt(i,child.matrix.clone().multiply(scaling));parent.remove(child);child.geometry.dispose()});parent.add(instance);}
}
let t=params.has('t')?Number(params.get('t')):2,paused=params.has('t')||matchMedia('(prefers-reduced-motion: reduce)').matches,thermal=false,last=performance.now(),frames=0,work=[];
if(matchMedia('(prefers-reduced-motion: reduce)').matches&&!params.has('t'))t=12;
const smooth=(a,b,x)=>{let s=T.MathUtils.clamp((x-a)/(b-a),0,1);return s*s*(3-2*s)};
function stateAt(time){const p=((time%24)+24)%24;return{p,open:smooth(6,11,p)*(1-smooth(16,22,p)),phase:p<6?'01 / FIELD ACQUISITION':p<10?'02 / PRESSURE COLLAPSE':p<17?'03 / EYEWALL DISSECTION':'04 / ATMOSPHERIC RECOVERY'}}
function draw(){let start=performance.now();const s=stateAt(t),portrait=innerWidth<600;
 camera.position.set(portrait?9.5:11,portrait?6.8:6.2,portrait?18.9:15.7);camera.fov=portrait?49:43;camera.lookAt(portrait?0:0,portrait?.0:-.15,0);camera.updateProjectionMatrix();root.scale.setScalar(portrait?.78:1);root.position.set(portrait?-.1:0,portrait?.8:0,0);
 stormMat.uniforms.uTime.value=t;stormMat.uniforms.uOpen.value=s.open;stormMat.uniforms.uThermal.value=thermal?1:0;bolts.visible=s.open<.2;
 layers.forEach(({o,y,r,mat},j)=>{o.position.y=(j-20)*.084*s.open;o.position.x=Math.sin(j*.18)*s.open*(j/43)*2.4;o.rotation.y=t*(.035+j*.0008)+j*.13;o.rotation.z=s.open*Math.sin(j*.15)*.24;const k=1+s.open*(j/43)*.28;o.scale.set(k,1,k);mat.color.setHSL(thermal?.57:.067+j*.0007,thermal?.35:.28,.085+j*.0017);});
 arms.forEach(({structure,a},j)=>{structure.rotation.x=-s.open*.48;structure.position.z=4.35+s.open*.35;});
 rivers.forEach((r,j)=>{r.rotation.y=t*.024*(j%2?1:-1);r.rotation.z=.34+s.open*.24;});packets.forEach(p=>p.o.position.copy(p.fn((t*p.speed+p.phase)%1)));
 curtain.rotation.y=-.5+.08*Math.sin(t*.21);curtain.scale.y=1+s.open*.15;scan.position.y=-3.7+(t*.8%7.4);curtainRows.forEach((o,j)=>o.position.z=Math.sin(t*1.1+j*.25)*.08);
 jetSweep.position.x=-7.5+(t*.6%15);jet.position.y=3.3+s.open*.8;jet.rotation.z=Math.sin(t*.13)*.04;
 needle.rotation.y=-t*.5;radar.rotation.y=t*.025;lightning.rotation.y=-t*.22;lightning.scale.set(1+s.open*.7,1+s.open*.25,1+s.open*.7);dust.rotation.y=t*.003;
 $('#phase').textContent=s.phase;$('#pressure').textContent=Math.round(892-s.open*74+Math.sin(t*.5)*3);$('#wind').textContent=Math.round(347+s.open*92+Math.sin(t)*4);$('#height').textContent=(18.6+s.open*7.3).toFixed(1)+' km';$('#clock').textContent='00:'+s.p.toFixed(1).padStart(4,'0');$('#detail').textContent='VORTEX COHERENCE / '+(98.2-s.open*13).toFixed(1)+'%';
 $('#wave').setAttribute('d',Array.from({length:120},(_,i)=>{let y=31+Math.sin(i*.22-t*2)*7+Math.sin(i*.71+t)*3+Math.sin(i*.1)*s.open*10;return(i?'L':'M')+(i*2)+','+y}).join(''));
 $('#spectrum').innerHTML=Array.from({length:38},(_,i)=>{let h=12+Math.abs(Math.sin(i*.28-t*.7)*Math.cos(i*.1+t*.2))*80;return `<rect x="${i*4.7}" y="${110-h}" width="2" height="${h}" fill="${i%5===0?'#e5b28a':'#526f7b'}"/>`}).join('');
 optics.render();frames++;work.push(performance.now()-start);if(work.length>240)work.shift();window.__state={time:t,paused,thermal,frames,phase:s.phase,open:s.open,renderer:renderer.info.render,meanFrameWork:work.reduce((a,b)=>a+b,0)/work.length};}
function tick(now){let dt=(now-last)/1000;last=now;if(!document.hidden&&!paused){t+=dt;draw()}requestAnimationFrame(tick)}
$('#pause').onclick=()=>{paused=!paused;$('#pause').textContent=paused?'Resume':'Pause';last=performance.now();draw()};$('#event').onclick=()=>{t=8;paused=false;$('#pause').textContent='Pause';draw()};$('#mode').onclick=()=>{thermal=!thermal;$('#mode').textContent=thermal?'Copper view':'Thermal view';draw()};$('#copy').onclick=()=>{document.body.classList.toggle('clean');$('#copy').textContent=document.body.classList.contains('clean')?'Show labels':'Hide labels'};
window.__seek=(time)=>{t=time;paused=true;$('#pause').textContent='Resume';draw()};window.__setPaused=p=>{paused=p;last=performance.now();draw()};addEventListener('resize',draw);renderer.domElement.addEventListener('webglcontextlost',e=>{e.preventDefault();$('#fallback').hidden=false});
if(params.has('hero'))document.body.classList.add('clean');$('#pause').textContent=paused?'Resume':'Pause';draw();requestAnimationFrame(tick);
