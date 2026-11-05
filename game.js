// CricketClub — fully 3D cricket stadium and reactive fielding
import * as THREE from 'https://cdn.jsdelivr.net/npm/three@0.164.1/build/three.module.js';
const $=id=>document.getElementById(id), canvas=$('world');
const scene=new THREE.Scene(); scene.background=new THREE.Color(0x182b43); scene.fog=new THREE.Fog(0x182b43,48,105);
const camera=new THREE.PerspectiveCamera(48,1,.1,150); camera.position.set(0,12,22); camera.lookAt(0,1,-1);
const renderer=new THREE.WebGLRenderer({canvas,antialias:true,alpha:false}); renderer.setPixelRatio(Math.min(devicePixelRatio,2)); renderer.shadowMap.enabled=true; renderer.shadowMap.type=THREE.PCFSoftShadowMap; renderer.outputColorSpace=THREE.SRGBColorSpace; renderer.toneMapping=THREE.ACESFilmicToneMapping; renderer.toneMappingExposure=1.15;
scene.add(new THREE.HemisphereLight(0xc9ddf4,0x293a2d,1.8));
const sun=new THREE.DirectionalLight(0xffe6c2,2.6); sun.position.set(-12,24,12); sun.castShadow=true; sun.shadow.mapSize.set(2048,2048); sun.shadow.camera.left=-24;sun.shadow.camera.right=24;sun.shadow.camera.top=24;sun.shadow.camera.bottom=-24;scene.add(sun);
const mat=(color,roughness=.8,metalness=0)=>new THREE.MeshStandardMaterial({color,roughness,metalness});
const grass=mat(0x398447), lightGrass=mat(0x4b9851), darkGrass=mat(0x2d713c), soil=mat(0xb99b72), white=mat(0xf5f1df), red=mat(0xd92d2d), skin=mat(0xc98968), hair=mat(0x202638), navy=mat(0x173f75), black=mat(0x171d28), gold=mat(0xe8b85c);
function mesh(g,m,x,y,z,parent=scene){const o=new THREE.Mesh(g,m);o.position.set(x,y,z);o.castShadow=true;o.receiveShadow=true;parent.add(o);return o}
function box(x,y,z,sx,sy,sz,m,parent=scene){return mesh(new THREE.BoxGeometry(sx,sy,sz),m,x,y,z,parent)}
function cylinder(x,y,z,r1,r2,h,m,parent=scene,n=16){return mesh(new THREE.CylinderGeometry(r1,r2,h,n),m,x,y,z,parent)}
// Outfield, mowing bands and boundary
mesh(new THREE.CircleGeometry(28,96),grass,0,-.18,0).rotation.x=-Math.PI/2;
for(let i=0;i<9;i++){const ring=mesh(new THREE.RingGeometry(7+i*2.05,8.05+i*2.05,96),i%2?lightGrass:darkGrass,0,-.165,0);ring.rotation.x=-Math.PI/2}
const boundary=mesh(new THREE.TorusGeometry(19,.09,8,128),white,0,.02,0);boundary.rotation.x=Math.PI/2;
box(0,-.02,0,4.8,.12,18,soil);
for(const z of [-7.5,7.5]){box(0,.05,z,5,.04,.14,white);for(let x of [-.9,0,.9]){cylinder(x,.65,z,.055,.055,1.2,white);cylinder(x,.18,z,.07,.07,.1,gold)}}
for(let z of [-8,8])box(0,.2,z,3.4,.1,.12,white);
// Full enclosed international stadium: raised grandstands, packed seating tiers, roof trusses, LED ribbon and floodlight pylons
const standBase=mesh(new THREE.CylinderGeometry(25.8,23.2,6.2,128,1,true),mat(0x24384d),0,3.1,0);standBase.scale.z=.84;
for(let row=0;row<9;row++){
 const radius=22.3+row*.62, y=1.15+row*.58;
 const tier=mesh(new THREE.TorusGeometry(radius,.19,8,180),mat(row%2?0x52677c:0x344d64),0,y,0);tier.scale.z=.84;
 const rail=mesh(new THREE.TorusGeometry(radius+.22,.035,6,180),mat(0x9ba9b4),0,y+.22,0);rail.scale.z=.84;
}
for(let row=0;row<7;row++)for(let i=0;i<210;i++){
 const a=i/210*Math.PI*2,r=22.5+row*.57,x=Math.cos(a)*r,z=Math.sin(a)*r*.84;
 const person=mesh(new THREE.CapsuleGeometry(.075,.13,2,5),mat([0xe7d5b4,0xe8eeee,0xe1a28a,0x4d78a0,0xd6c36b,0x263344][(i*3+row)%6]),x,1.55+row*.58,z);
 person.rotation.z=(i%3-1)*.12;
}
for(let i=0;i<48;i++){
 const a=i/48*Math.PI*2,r=21.95,x=Math.cos(a)*r,z=Math.sin(a)*r*.84;
 const panel=box(x,1.05,z,.82,.5,.16,mat(i%2?0x173e54:0x0c2839));panel.rotation.y=-a;
}
for(const x of [-19,19])for(const z of [-17,17]){
 cylinder(x,8,z,.17,.25,16,mat(0x778795));
 box(x,16,z,3.5,.24,.8,white);
 const glow=new THREE.SpotLight(0xfff0d0,850,65,Math.PI/5,.45,1.2);glow.position.set(x,16,z);glow.target.position.set(0,0,0);scene.add(glow,glow.target);
}
const roof=mesh(new THREE.TorusGeometry(25.8,.32,8,160),mat(0x1b2b3e,.48,.55),0,8.2,0);roof.scale.z=.84;
for(let i=0;i<24;i++){const a=i/24*Math.PI*2,x=Math.cos(a)*25.7,z=Math.sin(a)*25.7*.84;const beam=box(x,7.9,z,.16,.5,.16,mat(0x8192a1,.4,.6));beam.rotation.y=-a}
const screen=box(0,6.4,-22.5,9,2.2,.28,mat(0x071a28,.3,.4));screen.rotation.y=0;
const screenText=box(0,6.4,-22.31,8.5,1.55,.04,mat(0x0b3541,.4,.1));
// Character rigs with separate articulated limbs and expressive anime faces
function limb(parent,a,b,r,m){const d=new THREE.Vector3().subVectors(b,a);const o=mesh(new THREE.CapsuleGeometry(r,Math.max(.01,d.length()-2*r),4,8),m,0,0,0,parent);o.position.copy(a).add(b).multiplyScalar(.5);o.quaternion.setFromUnitVectors(new THREE.Vector3(0,1,0),d.normalize());return o}
function makePlayer(name,kit,x,z,role,scale=1){
const root=new THREE.Group();scene.add(root);root.position.set(x,0,z);root.scale.setScalar(scale);
const torso=mesh(new THREE.CapsuleGeometry(.42,.78,5,12),mat(kit),0,1.55,0,root);torso.scale.set(.9,1, .58);
mesh(new THREE.CylinderGeometry(.16,.19,.24,12),skin,0,2.27,0,root);
const face=mesh(new THREE.SphereGeometry(.39,28,22),skin,0,2.62,0,root);face.scale.set(.88,1.08,.9);
mesh(new THREE.SphereGeometry(.405,24,14,0,Math.PI*2,0,Math.PI*.48),hair,0,2.78,-.015,root);
mesh(new THREE.SphereGeometry(.12,12,10),skin,0,2.53,.35,root);
mesh(new THREE.SphereGeometry(.13,12,8),hair,-.32,2.48,.02,root);mesh(new THREE.SphereGeometry(.13,12,8),hair,.32,2.48,.02,root);
for(let ex of [-.14,.14]){mesh(new THREE.SphereGeometry(.067,12,10),white,ex,2.62,.326,root);mesh(new THREE.SphereGeometry(.034,10,8),mat(0x24334e),ex,2.62,.378,root);mesh(new THREE.SphereGeometry(.015,8,8),white,ex-.012,2.64,.402,root);const brow=mesh(new THREE.CapsuleGeometry(.025,.12,3,6),hair,ex,2.74,.33,root);brow.rotation.z=ex<0?-.12:.12;}
const smile=mesh(new THREE.TorusGeometry(.075,.012,5,12,Math.PI),mat(0x743e39),0,2.39,.35,root);smile.rotation.z=Math.PI;
const arms=[],legs=[];
// tailored jersey collar, chest stripe, waist belt and detailed cricket pads
mesh(new THREE.TorusGeometry(.19,.045,8,24),white,0,2.02,.02,root).rotation.x=Math.PI/2;
box(0,1.55,.245,.09,.8,.025,mat(0xe8e5d8),root);
box(0,1.08,.02,.78,.09,.62,black,root);
for(let side of [-1,1]){
const shoulder=new THREE.Group();shoulder.position.set(side*.42,1.95,0);root.add(shoulder);
limb(shoulder,new THREE.Vector3(0,0,0),new THREE.Vector3(side*.12,-.48,.04),.12,skin);
const elbow=new THREE.Group();elbow.position.set(side*.12,-.48,.04);shoulder.add(elbow);
limb(elbow,new THREE.Vector3(0,0,0),new THREE.Vector3(side*.08,-.48,.12),.105,skin);
mesh(new THREE.SphereGeometry(.12,10,8),skin,side*.08,-.48,.12,elbow);arms.push({shoulder,elbow,side});
const hip=new THREE.Group();hip.position.set(side*.2,1.05,0);root.add(hip);
limb(hip,new THREE.Vector3(0,0,0),new THREE.Vector3(0,-.53,0),.15,mat(0x202b39));
const knee=new THREE.Group();knee.position.set(0,-.53,0);hip.add(knee);
limb(knee,new THREE.Vector3(0,0,0),new THREE.Vector3(0,-.48,.08),.12,white);
mesh(new THREE.BoxGeometry(.25,.13,.4),black,0,-.48,.2,knee);legs.push({hip,knee,side});
}
if(role==='batter'){const bat=mesh(new THREE.BoxGeometry(.13,1.3,.16),gold,.52,1.3,.32,root);bat.rotation.z=-.32;const grip=mesh(new THREE.CylinderGeometry(.055,.055,.35,8),black,.52,1.95,.32,root);grip.rotation.z=-.32;root.userData.bat=bat;root.userData.grip=grip}
const label=document.createElement('div');label.className='player-label';label.textContent=name;label.style.display='none';
root.userData={...root.userData,name,role,arms,legs,baseX:x,baseZ:z,phase:Math.random()*6,react:false,target:null,speed:0};
return root;
}
const batter=makePlayer('MANAS',0x176747,0,8,'batter',1.05), bowler=makePlayer('PRATEEK',0xa83c37,0,-8.2,'bowler',.94), umpire=makePlayer('UMPIRE',0xf4f0e6,4.2,5.1,'umpire',.85);
const stumps=[];for(const z of [-7.5,7.5])for(let x of [-.22,0,.22])stumps.push(cylinder(x,.55,z,.045,.045,1.1,gold));
const ball=mesh(new THREE.SphereGeometry(.14,20,16),red,0,1,-8);ball.visible=false;const seam=mesh(new THREE.TorusGeometry(.105,.009,5,24),white,0,0,0,ball);seam.rotation.x=.8;
const S={active:false,phase:'menu',score:0,wickets:0,balls:0,fours:0,sixes:0,shot:'drive',t:0,duration:1.2,queued:false,pace:135,format:20,toast:'',over:[],last:'—',best:'—',flight:null};let clock=0,lastTime=0;
function hud(){$('runs').textContent=S.score;$('wickets').textContent=S.wickets;$('overs').textContent=Math.floor(S.balls/6)+'.'+S.balls%6+' ov';$('runrate').textContent='RR '+(S.balls?S.score/(S.balls/6):0).toFixed(1);$('target').textContent=S.format+' OVER MATCH';$('thisOver').textContent=S.over.join(' ')||'—';$('lastBall').textContent=S.last;$('boundaries').textContent=S.fours+' / '+S.sixes;$('bestShot').textContent=S.best;$('pace').textContent=S.pace}
function say(t){const el=$('toast');el.textContent=t;el.classList.add('show');clearTimeout(say.timer);say.timer=setTimeout(()=>el.classList.remove('show'),1300)}
function posePlayer(p,t,dt){const u=p.userData;const moving=u.role==='bowler'&&S.phase==='delivery';const run=moving?Math.sin(t*12+u.phase):0;u.legs.forEach(l=>{l.hip.rotation.x=run*.65;l.knee.rotation.x=Math.max(0,-run)*.7});u.arms.forEach(a=>{a.shoulder.rotation.x=-run*.55;a.shoulder.rotation.z=a.side*(u.react?-.22:0);a.elbow.rotation.x=u.react?-1.1:0});if(u.role==='bowler'&&S.phase==='delivery'){u.arms[1].shoulder.rotation.x=-1.9+Math.sin(t*13)*.25;u.arms[1].elbow.rotation.x=-.6}if(u.role==='batter'&&S.swinging){p.userData.bat.rotation.z=-.32+Math.sin(S.swingT*9)*1.15}if(u.role==='umpire'){const gesture=S.phase==='result';u.arms.forEach(a=>{a.shoulder.rotation.z=gesture?a.side*-.9:0;a.shoulder.rotation.x=gesture?-.45:0})}}
function updateFielders(dt){}
function next(){if(!S.active)return;if(S.balls>=S.format*6||S.wickets>=10){finish();return}S.phase='delivery';S.t=0;S.duration=1.24*135/S.pace;S.queued=false;S.flight=null;ball.visible=true;ball.position.set(0,1.65,-8);bowler.userData.arms[1].shoulder.rotation.x=-1.4;say('PRATEEK · '+S.pace+' KM/H')}
function finish(){S.active=false;S.phase='finished';$('restart').classList.remove('hidden');$('centre').innerHTML='<h1>INNINGS COMPLETE</h1><p>'+S.score+' RUNS · '+S.wickets+' WICKETS</p>';$('centre').classList.remove('hidden')}
function result(r){if(S.phase!=='flight')return;S.phase='result';ball.visible=false;S.balls++;S.score+=r;S.last=''+r;S.over.push(''+r);if(r===4)S.fours++;if(r===6)S.sixes++;if(r>=4)S.best=S.shot.toUpperCase();if(S.balls%6===0)S.over=[];S.flight=null;hud();say(r===6?'SIX!':r===4?'FOUR!':r+' RUNS');setTimeout(()=>{if(S.active)next()},850)}
function wicket(message='WICKET'){if(!S.active||S.phase!=='delivery'&&S.phase!=='flight'&&S.phase!=='caught')return;S.phase='result';S.flight=null;ball.visible=false;S.balls++;S.wickets++;S.last='W';S.over.push('W');if(S.balls%6===0)S.over=[];hud();say(message);setTimeout(()=>{if(S.active)next()},1000)}
function hit(){if(S.phase!=='delivery')return;const timing=S.t/S.duration,q=Math.max(0,1-Math.abs(timing-.86)/.3);if(q<.12){wicket('BEATEN!');return}S.phase='flight';S.queued=false;const angle=(Math.random()-.5)*(S.shot==='defend'?.5:1.25),power=S.shot==='loft'?1.28:S.shot==='defend'?.58:1;S.flight={x:0,y:1.1,z:7.4,vx:Math.sin(angle)*7*power,vy:(S.shot==='loft'?9.2:5.4)*q,vz:-9.5*power,age:0};ball.position.set(0,1.1,7.4);batter.userData.swinging=true;batter.userData.swingT=0;
function swing(){if(!S.active||S.phase!=='delivery')return;const t=S.t/S.duration;if(t>.67&&t<1.05)hit();else {S.queued=true;say('SHOT READY')}}
function choose(s){S.shot=s;document.querySelectorAll('.shot').forEach(b=>b.classList.toggle('active',b.dataset.shot===s))}
function start(){S.format=Number($('format').value);S.pace=Number($('ballSpeed').value);S.score=S.wickets=S.balls=S.fours=S.sixes=0;S.last='—';S.best='—';S.over=[];S.active=true;S.phase='ready';$('menu').classList.add('hidden');$('restart').classList.add('hidden');$('centre').classList.add('hidden');$('speedValue').textContent=S.pace+' km/h';batter.userData.swinging=false;hud();next()}
$('ballSpeed').addEventListener('input',e=>$('speedValue').textContent=e.target.value+' km/h');$('start').addEventListener('click',start);$('restart').addEventListener('click',start);$('swing').addEventListener('click',swing);$('mobileSwing').addEventListener('click',swing);$('next').addEventListener('click',next);$('mobileNext').addEventListener('click',next);document.querySelectorAll('.shot').forEach(b=>b.addEventListener('click',()=>choose(b.dataset.shot)));addEventListener('keydown',e=>{if(e.code==='Space'||e.key.toLowerCase()==='a'){e.preventDefault();if(!e.repeat)swing()}if(['1','2','3'].includes(e.key))choose(['drive','loft','defend'][+e.key-1]);if(e.key==='Enter'&&!S.active)start()});
function animate(ts){requestAnimationFrame(animate);const dt=Math.min(.04,(ts-lastTime)/1000||0);lastTime=ts;clock+=dt;
if(S.phase==='delivery'){S.t+=dt;const t=Math.min(1,S.t/S.duration);ball.position.set(0,1.65+Math.sin(t*Math.PI)*.15,-8+15*t);ball.rotation.x+=dt*14;if(S.queued&&t>.78&&t<.99)hit();else if(t>=1)wicket('MISSED!')}
if(S.phase==='flight'&&S.flight){const f=S.flight;f.age+=dt;f.x+=f.vx*dt;f.z+=f.vz*dt;f.y+=f.vy*dt;f.vy-=15*dt;f.vx*=.997;ball.position.set(f.x,Math.max(.18,f.y),f.z);ball.rotation.x+=dt*18;if(f.y<=.2){f.y=.2;if(Math.abs(f.vy)>2.1){f.vy*=-.35;f.vx*=.8}else f.vy=0}if(S.phase==='flight'&&(Math.abs(f.x)>18||f.z< -18||f.z>18)){const six=f.y>2.8||S.shot==='loft';result(six?6:4)}else if(S.phase==='flight'&&f.age>3.2)result(S.shot==='defend'?1:2)}
for(const p of [batter,bowler,umpire])posePlayer(p,clock,dt);
if(batter.userData.swinging){batter.userData.swingT+=dt;if(batter.userData.swingT>.38)batter.userData.swinging=false}
renderer.render(scene,camera)}
function resize(){const w=canvas.clientWidth,h=canvas.clientHeight;if(!w||!h)return;renderer.setSize(w,h,false);camera.aspect=w/h;camera.updateProjectionMatrix();if(h>w){camera.position.set(0,13,25);camera.lookAt(0,1,-1)}else{camera.position.set(0,11,21);camera.lookAt(0,1,-1)}}
new ResizeObserver(resize).observe(canvas);resize();hud();requestAnimationFrame(animate);
