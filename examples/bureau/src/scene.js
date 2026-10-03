import * as THREE from 'three';
import { agents } from './state.js';

export function createScene(host, forceFallback=false) {
  let renderer;
  const fallback = () => {
    host.innerHTML = `<svg class="fallback" viewBox="0 0 700 500"><defs><radialGradient id="halo"><stop stop-color="#d8a856" stop-opacity=".3"/><stop offset="1" stop-color="#10251f" stop-opacity="0"/></radialGradient></defs><circle cx="350" cy="235" r="210" fill="url(#halo)"/><g fill="none" stroke="#b99354">${[85,110,160,195].map((r,i)=>`<ellipse cx="350" cy="235" rx="${r}" ry="${r*.55}" transform="rotate(${i*43} 350 235)"/>`).join('')}</g><circle cx="350" cy="235" r="52" fill="#203d32" stroke="#e5c58d"/><text x="350" y="245" text-anchor="middle" fill="#f3dfb4" font-size="30">B∴</text>${agents.map((a,i)=>{let x=350+240*Math.cos(i*Math.PI/3),y=235+150*Math.sin(i*Math.PI/3);return `<circle cx="${x}" cy="${y}" r="20" fill="${a.color}"/><text x="${x}" y="${y+40}" text-anchor="middle" fill="${a.color}" font-size="12">${a.name}</text>`;}).join('')}</svg>`;
    document.querySelector('#renderer-status').textContent='SVG / STATIC OPTICS';
    document.documentElement.dataset.renderer='svg';
  };
  try { if(forceFallback) throw Error('Requested fallback'); renderer=new THREE.WebGLRenderer({antialias:true,alpha:true}); }
  catch { fallback(); return {render(){}}; }
  host.appendChild(renderer.domElement);
  renderer.setPixelRatio(Math.min(devicePixelRatio,2));
  renderer.setClearColor(0x091713,0);
  renderer.outputColorSpace=THREE.SRGBColorSpace;
  renderer.toneMapping=THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure=1.5;
  document.querySelector('#renderer-status').textContent='WEBGL / LIVE OPTICS';
  document.documentElement.dataset.renderer='webgl';
  const scene=new THREE.Scene();
  const camera=new THREE.PerspectiveCamera(39,1,.1,100);
  camera.position.set(0,5.8,11.8); camera.lookAt(0,0,0);
  scene.add(new THREE.HemisphereLight(0xe5f8e7,0x16291e,3));
  for(const [color,intensity,x,y,z] of [[0xffcc88,65,3,5,4],[0x64ffbd,40,-4,2,-2],[0xab8dff,35,0,-2,4]]) {const l=new THREE.PointLight(color,intensity);l.position.set(x,y,z);scene.add(l);}
  const brass=new THREE.MeshStandardMaterial({color:0xc79b55,metalness:.72,roughness:.24});
  const dark=new THREE.MeshStandardMaterial({color:0x173c2d,metalness:.5,roughness:.27});
  const glow=new THREE.MeshStandardMaterial({color:0xffe5a5,emissive:0xe2a64c,emissiveIntensity:1.1});
  const root=new THREE.Group(); scene.add(root);
  const add=(geo,mat,parent=root)=>{const m=new THREE.Mesh(geo,mat);parent.add(m);return m;};
  const core=add(new THREE.IcosahedronGeometry(.76,2),dark);
  add(new THREE.IcosahedronGeometry(.8,1),new THREE.MeshBasicMaterial({color:0xd4b76c,wireframe:true}));
  add(new THREE.SphereGeometry(.24,24,16),glow).position.z=.73;
  const rings=[];
  for(let i=0;i<5;i++){
    const group=new THREE.Group();root.add(group);rings.push(group);
    add(new THREE.TorusGeometry(1.02+i*.19,.018+(i%2)*.015,8,160),i%2?glow:brass,group);
    for(let j=0;j<40;j++){let a=j/40*Math.PI*2;const tick=add(new THREE.BoxGeometry(.018,j%5===0?.15:.055,.024),brass,group);tick.position.set(Math.cos(a)*(1.02+i*.19),Math.sin(a)*(1.02+i*.19),0);tick.rotation.z=a-Math.PI/2;}
  }
  const trackMat=new THREE.LineBasicMaterial({color:0x537567,transparent:true,opacity:.4});
  for(let r=2.2;r<4.5;r+=.42){const points=Array.from({length:181},(_,i)=>new THREE.Vector3(Math.cos(i/180*Math.PI*2)*r,-.75,Math.sin(i/180*Math.PI*2)*r));root.add(new THREE.Line(new THREE.BufferGeometry().setFromPoints(points),trackMat));}
  const bodies=agents.map((a,i)=>{
    const g=new THREE.Group();root.add(g);
    const mat=new THREE.MeshStandardMaterial({color:a.color,metalness:.25,roughness:.3});
    const geometry=[new THREE.SphereGeometry(.28,24,16),new THREE.OctahedronGeometry(.34),new THREE.ConeGeometry(.27,.65,5),new THREE.BoxGeometry(.48,.48,.48),new THREE.IcosahedronGeometry(.33,0),new THREE.CapsuleGeometry(.23,.25,6,16)][i];
    add(geometry,mat,g);
    for(const x of [-.1,.1]){const eye=add(new THREE.SphereGeometry(.043,12,8),dark,g);eye.position.set(x,.07,.27);}
    const crown=add(new THREE.TorusGeometry(.38,.014,8,48),brass,g);crown.rotation.x=Math.PI/2;crown.position.y=.36;
    if(i===1)for(const s of [-1,1]){const wing=add(new THREE.SphereGeometry(.25,16,12),mat,g);wing.scale.set(1.4,.12,.7);wing.position.x=s*.38;wing.rotation.z=s*.4;}
    const disc=add(new THREE.TorusGeometry(.48,.012,8,64),new THREE.MeshBasicMaterial({color:a.color}),g);disc.rotation.x=Math.PI/2;disc.position.y=-.4;
    return g;
  });
  const paths=agents.map((a,i)=>{
    const angle=i*Math.PI/3;
    const end=new THREE.Vector3(Math.cos(angle)*3.15,0,Math.sin(angle)*2.7);
    const curve=new THREE.QuadraticBezierCurve3(new THREE.Vector3(),new THREE.Vector3(end.x*.55,1.1,end.z*.55),end);
    root.add(new THREE.Line(new THREE.BufferGeometry().setFromPoints(curve.getPoints(60)),new THREE.LineBasicMaterial({color:a.color,transparent:true,opacity:.3})));
    return {curve,end,packets:Array.from({length:4},()=>add(new THREE.OctahedronGeometry(.052),new THREE.MeshBasicMaterial({color:a.color})))};
  });
  const positions=[];for(let i=0;i<500;i++){positions.push(Math.sin(i*127.1)*6,Math.sin(i*311.7)*3-1,Math.cos(i*73.3)*5);}
  scene.add(new THREE.Points(new THREE.BufferGeometry().setAttribute('position',new THREE.Float32BufferAttribute(positions,3)),new THREE.PointsMaterial({color:0xabc4a6,size:.018,transparent:true,opacity:.5})));
  const resize=()=>{const {width,height}=host.getBoundingClientRect();renderer.setSize(width,height);camera.aspect=width/height;camera.position.z=width<500?17:11.8;camera.updateProjectionMatrix();};
  new ResizeObserver(resize).observe(host);resize();
  let lost=false;renderer.domElement.addEventListener('webglcontextlost',e=>{e.preventDefault();lost=true;fallback();});
  return {render(t,state,selected){
    if(lost)return;
    core.rotation.y=t*.12;
    rings.forEach((r,i)=>{r.rotation.set(i*.57+t*.08*(i%2?1:-1),i*.64+t*.1,i*.3);});
    bodies.forEach((b,i)=>{b.position.copy(paths[i].end);b.position.y=Math.sin(t*.8+i)*.16;b.rotation.y=Math.sin(t*.3+i)*.3;b.scale.setScalar(i===selected?1.2:1);});
    paths.forEach(p=>p.packets.forEach((m,j)=>m.position.copy(p.curve.getPoint((t*.14*state.multiplier+j/4)%1))));
    renderer.render(scene,camera);
  }};
}
