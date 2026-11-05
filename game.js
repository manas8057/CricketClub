import * as THREE from 'three';
import * as CANNON from 'cannon-es';

const $ = id => document.getElementById(id);
const canvas = $('world');
const renderer = new THREE.WebGLRenderer({canvas,antialias:true,alpha:true});
renderer.setPixelRatio(Math.min(devicePixelRatio,2)); renderer.shadowMap.enabled=true; renderer.shadowMap.type=THREE.PCFSoftShadowMap; renderer.outputColorSpace=THREE.SRGBColorSpace; renderer.toneMapping=THREE.ACESFilmicToneMapping; renderer.toneMappingExposure=1.12;
const scene = new THREE.Scene(); scene.fog = new THREE.Fog(0x102b1d,38,100);
const camera = new THREE.PerspectiveCamera(42,1,.1,180); camera.position.set(0,8.8,24); camera.lookAt(0,2.4,0);
scene.add(new THREE.HemisphereLight(0xc5e6ff,0x314323,2));
const sun = new THREE.DirectionalLight(0xffedcf,3); sun.position.set(-12,22,10); sun.castShadow=true; sun.shadow.mapSize.set(2048,2048); sun.shadow.camera.left=-32; sun.shadow.camera.right=32; sun.shadow.camera.top=32; sun.shadow.camera.bottom=-32; scene.add(sun);
const fill = new THREE.DirectionalLight(0x8cb9ff,1.3); fill.position.set(12,10,-16); scene.add(fill);
const material = (color,roughness=.8,metalness=0)=>new THREE.MeshStandardMaterial({color,roughness,metalness});
const M={grass:material(0x367d43),stripe:material(0x2d713c),pitch:material(0xb99b6d),line:material(0xf4edcf),white:material(0xf2eee1),skin:material(0x9a6548),skin2:material(0xb67b57),navy:material(0x183d68),blue:material(0x2869a2),gold:material(0xe5bd67),wood:material(0xc58c43),red:material(0xd74435),black:material(0x171d1a)};
function add(geo,mat,parent=scene,pos=[0,0,0]){const o=new THREE.Mesh(geo,mat);o.position.set(...pos);o.castShadow=true;o.receiveShadow=true;parent.add(o);return o}
function cube(parent,pos,size,mat){return add(new THREE.BoxGeometry(...size),mat,parent,pos)}
function ballMesh(parent,pos,r,mat){return add(new THREE.SphereGeometry(r,20,16),mat,parent,pos)}
function cylinder(parent,pos,r1,r2,h,mat,seg=16){return add(new THREE.CylinderGeometry(r1,r2,h,seg),mat,parent,pos)}
// Stadium bowl, outfield, mowing stripes, pitch and markings
add(new THREE.CylinderGeometry(36,36,1.1,96),material(0x203d2d),scene,[0,-.72,0]);
add(new THREE.CylinderGeometry(30,30,.22,96),M.grass,scene,[0,-.08,0]);
for(let i=0;i<16;i++){const a=i/16*Math.PI*2;const strip=add(new THREE.BoxGeometry(2.5,.012,16),i%2?M.stripe:M.grass,scene,[Math.cos(a)*18,.045,Math.sin(a)*18]);strip.rotation.y=-a}
cube(scene,[0,.1,0],[4,.18,20],M.pitch);
for(const z of [-8.5,8.5]){cube(scene,[0,.205,z],[3.6,.025,.13],M.line);for(const x of [-.7,0,.7])cube(scene,[x,.34,z],[.09,.25,.09],M.white)}
for(const x of [-1.5,1.5])cube(scene,[x,.205,0],[.035,.02,18],M.line);
for(let tier=0;tier<6;tier++){const ring=add(new THREE.CylinderGeometry(31+tier*1.1,30.5+tier*1.1,1.1,96,1,true),material(tier%2?0x344d42:0x263d34),scene,[0,1+tier*1.02,0]);ring.material.side=THREE.DoubleSide}
const crowdMats=[material(0xc8d1bd),material(0xd3b18b),material(0x9bb6d0),material(0xe2d5c2),material(0x879b8b),material(0x9e6b57)];
for(let row=0;row<6;row++)for(let i=0;i<120;i++){const a=i/120*Math.PI*2,r=30.5+row*1.08;const p=ballMesh(scene,[Math.cos(a)*r,1.65+row*1.02,Math.sin(a)*r],.17,crowdMats[(i*7+row*3)%crowdMats.length]);p.scale.set(.8,1.25,.8)}
const roof=add(new THREE.TorusGeometry(37,.35,8,128),material(0x172b22,.5,.4),scene,[0,7.1,0]);roof.rotation.x=Math.PI/2;
for(let i=0;i<8;i++){const a=i/8*Math.PI*2;const pole=cylinder(scene,[Math.cos(a)*32,5,Math.sin(a)*32],.1,.13,9,material(0x26382f,.4,.5));const lamp=add(new THREE.BoxGeometry(2,.3,.55),M.white,scene,[Math.cos(a)*32,9,Math.sin(a)*32]);lamp.lookAt(0,9,0);const light=new THREE.PointLight(0xffe9bd,30,20);light.position.set(Math.cos(a)*29,8,Math.sin(a)*29);scene.add(light)}
for(let i=0;i<32;i++){const a=i/32*Math.PI*2,r=28;const board=cube(scene,[Math.cos(a)*r,.48,Math.sin(a)*r],[2.8,.62,.12],i%3===0?material(0xc8f36b):i%3===1?M.white:material(0x244b38));board.lookAt(0,.48,0)}
// Rigid-body world: gravity, turf and cricket ball
const world=new CANNON.World({gravity:new CANNON.Vec3(0,-9.81,0)}); world.broadphase=new CANNON.SAPBroadphase(world); world.allowSleep=true;
const groundMat=new CANNON.Material('turf'), ballMat=new CANNON.Material('leather');
world.addContactMaterial(new CANNON.ContactMaterial(groundMat,ballMat,{friction:.42,restitution:.48}));
const ground=new CANNON.Body({mass:0,material:groundMat,shape:new CANNON.Plane()});ground.quaternion.setFromEuler(-Math.PI/2,0,0);ground.position.set(0,-.01,0);world.addBody(ground);
const ballBody=new CANNON.Body({mass:.163,material:ballMat,shape:new CANNON.Sphere(.115),linearDamping:.015,angularDamping:.035});world.addBody(ballBody);ballBody.sleep();
const ballVisual=ballMesh(scene,[0,1,-8],.115,material(0xc92d24,.3,.08));const seam=add(new THREE.TorusGeometry(.091,.008,6,28),M.white,ballVisual,[0,0,0]);seam.rotation.x=Math.PI/2;
// Character rig made from articulated groups. Swap these for licensed rigged player assets for photoreal visuals.
function player(x,z,kit,role='fielder'){const root=new THREE.Group();root.position.set(x,0,z);scene.add(root);const shirt=material(kit),trouser=material(0xe6e9e2),skin=material(0xa96f50),helmet=material(role==='batter'?0x204638:kit,.4,.2);ballMesh(root,[0,2.05,0],.43,shirt).scale.set(1,.65,.7);cylinder(root,[0,1.45,0],.3,.34,.8,trouser);ballMesh(root,[0,2.72,0],.29,skin).scale.set(1,1.1,.95);ballMesh(root,[0,2.88,0],.3,helmet).scale.set(1,.45,1);
const arms=[];for(const s of [-1,1]){const arm=new THREE.Group();arm.position.set(s*.4,2.2,0);root.add(arm);cylinder(arm,[s*.13,-.24,0],.11,.13,.48,skin);ballMesh(arm,[s*.15,-.48,.02],.13,M.white);arms.push(arm);const leg=new THREE.Group();leg.position.set(s*.17,1.1,0);root.add(leg);cylinder(leg,[0,-.38,0],.14,.17,.72,trouser);ballMesh(leg,[0,-.78,.12],.16,M.black).scale.set(1,.65,1.6);if(role==='batter')cube(root,[s*.2,1.1,.17],[.24,.72,.2],M.white)}
let bat=null;if(role==='batter'){bat=new THREE.Group();bat.position.set(-.43,1.7,.2);root.add(bat);cube(bat,[0,-.42,0],[.17,.94,.1],M.wood).rotation.z=-.12;cylinder(bat,[0,.1,0],.045,.045,.36,M.black)}
root.userData={arms,bat,role};return root}
const batter=player(0,7.5,0x174c39,'batter');batter.rotation.y=Math.PI;
const bowler=player(0,-8.8,0x9d332d,'bowler');
const fielders=[[-9,-4],[9,-4],[-13,3],[13,3],[-7,-14],[7,-14],[-18,-1],[18,-1],[0,-21]].map((p,i)=>{const f=player(p[0],p[1],i%2?0x244e86:0x9b3430);f.scale.setScalar(.78);return f});
function wickets(z){for(const x of [-.23,0,.23])cylinder(scene,[x,.65,z],.045,.045,.9,M.wood,10);cube(scene,[0,1.12,z],[.68,.07,.07],M.wood)}wickets(8.35);wickets(-8.35);
const state={active:false,phase:'menu',shot:'drive',format:20,difficulty:'normal',score:0,wickets:0,balls:0,fours:0,sixes:0,last:'—',best:'—',over:[],deliveryTime:0,deliveryDuration:0,contactWindow:false,contactUsed:false,shotPower:0,ballInPlay:false,ballTimer:0,runsPending:0,lastBowlerPace:0,fieldTarget:null,accumulator:0};
const settings={easy:{speed:23,window:.23,accuracy:.72},normal:{speed:27,window:.16,accuracy:.58},hard:{speed:31,window:.115,accuracy:.46}};
function hud(){ $('runs').textContent=state.score;$('wickets').textContent=state.wickets;$('overs').textContent=Math.floor(state.balls/6)+'.'+state.balls%6+' ov';$('runrate').textContent='RR '+(state.balls?state.score/(state.balls/6):0).toFixed(1);$('target').textContent=state.format+' OVER MATCH';$('thisOver').textContent=state.over.join(' ')||'—';$('lastBall').textContent=state.last;$('boundaries').textContent=state.fours+' / '+state.sixes;$('bestShot').textContent=state.best;$('pace').textContent=state.lastBowlerPace||'—';}
let toastTimer=0;function toast(s){$('toast').textContent=s;$('toast').classList.add('show');toastTimer=1.8}
function banner(title,sub){$('centre').innerHTML='<h1>'+title+'</h1><p>'+sub+'</p>';$('centre').classList.remove('hidden')}
function hideBanner(){$('centre').classList.add('hidden')}
function finish(){state.active=false;state.phase='finished';banner('INNINGS COMPLETE',state.score+' RUNS · '+state.wickets+' WICKETS');$('help').textContent='Match complete. Restart to play another innings.'}
function nextDelivery(){if(!state.active||state.phase==='delivery'||state.phase==='flight')return;if(state.balls>=state.format*6||state.wickets>=10){finish();return}state.phase='delivery';state.deliveryTime=0;state.contactUsed=false;state.ballInPlay=false;state.lastBowlerPace=Math.round(settings[state.difficulty].speed*3.6*(.94+Math.random()*.12));$('bowlerName').textContent=['ARJUN SINGH','KABIR KHAN','DEV PATEL'][Math.floor(Math.random()*3)];ballBody.position.set((Math.random()-.5)*.24,1.45,-8.6);ballBody.velocity.set(0,0,0);ballBody.angularVelocity.set(0,0,0);ballBody.wakeUp();ballVisual.visible=true;toast('BOWLER IN · '+state.lastBowlerPace+' KM/H');}
function addWicket(reason='WICKET'){state.wickets++;state.balls++;state.last='W';state.over.push('W');state.phase='result';state.ballInPlay=false;hud();toast(reason);setTimeout(()=>{if(state.active)nextDelivery();},1150);if(state.wickets>=10||state.balls>=state.format*6)setTimeout(finish,1200)}
function scoreRuns(r,shot){state.score+=r;state.balls++;state.last=String(r);state.over.push(String(r));if(r===4)state.fours++;if(r===6)state.sixes++;if(r>=4)state.best=shot.toUpperCase();if(state.balls%6===0)state.over=[];hud();toast(r===6?'SIX! · '+shot.toUpperCase():r===4?'FOUR! · '+shot.toUpperCase():r+' RUN'+(r===1?'':'S'));}
function swing(){if(!state.active){return}if(state.phase!=='delivery'||state.contactUsed)return;state.contactUsed=true;const cfg=settings[state.difficulty];const t=state.deliveryTime/state.deliveryDuration;const quality=Math.max(0,1-Math.abs(t-.82)/cfg.window);const q=Math.min(1,quality);const shot=state.shot;const batBonus=shot==='drive'?.05:shot==='loft'?-.04:.12;
if(q<.12){addWicket('BEATEN! WICKET');return}
const sweet=q+batBonus;let speed=0,angle=0,launchX=(Math.random()-.5)*.25;
if(shot==='defend'){speed=4+q*5;angle=.08+q*.12}
else if(shot==='loft'){speed=18+q*18;angle=.58+q*.38}
else{speed=12+q*21;angle=.22+q*.27}
if(q<.42){speed*=.48;angle*=.65}
const lateral=shot==='loft'?launchX*1.8:launchX;
ballBody.position.set(0,1.45,8.0);ballBody.velocity.set(lateral*speed,Math.sin(angle)*speed,-Math.cos(angle)*speed);ballBody.angularVelocity.set(8,2,14);ballBody.wakeUp();state.phase='flight';state.ballInPlay=true;state.ballTimer=0;state.shotPower=q;state.runsPending=0;
batter.userData.bat.rotation.x=-.7;batter.userData.bat.rotation.z=shot==='loft'?.75:-.5;
$('help').textContent=q>.72?'Sweet timing! Watch the fielders.':'Contact made — run hard!';
}
function chooseShot(s){state.shot=s;document.querySelectorAll('.shot').forEach(b=>b.classList.toggle('active',b.dataset.shot===s))}
function startMatch(){state.format=Number($('format').value);state.difficulty=$('difficulty').value;state.score=0;state.wickets=0;state.balls=0;state.fours=0;state.sixes=0;state.last='—';state.best='—';state.over=[];state.active=true;state.phase='ready';$('venue').textContent='THE NIGHT LEAGUE';$('menu').classList.add('hidden');hideBanner();hud();$('help').textContent='Watch the ball. Choose your shot. Swing close to the batter for best timing.';nextDelivery()}
$('start').addEventListener('click',startMatch);$('swing').addEventListener('click',swing);$('mobileSwing').addEventListener('click',swing);$('next').addEventListener('click',nextDelivery);$('mobileNext').addEventListener('click',nextDelivery);
document.querySelectorAll('.shot').forEach(b=>b.addEventListener('click',()=>chooseShot(b.dataset.shot)));
addEventListener('keydown',e=>{if(e.code==='Space'||e.key.toLowerCase()==='a'){e.preventDefault();swing()}if(['1','2','3'].includes(e.key))chooseShot(['drive','loft','defend'][Number(e.key)-1]);if(e.key==='Enter'&&state.phase==='menu')startMatch()});
const clock=new THREE.Clock();const fixed=1/60;let renderTime=0;
function resize(){const r=canvas.getBoundingClientRect();renderer.setSize(r.width,r.height,false);camera.aspect=r.width/r.height;camera.updateProjectionMatrix()}new ResizeObserver(resize).observe(canvas);resize();
function updateBallVisual(){ballVisual.position.set(ballBody.position.x,ballBody.position.y,ballBody.position.z);ballVisual.quaternion.set(ballBody.quaternion.x,ballBody.quaternion.y,ballBody.quaternion.z,ballBody.quaternion.w)}
function resolveFlight(dt){state.ballTimer+=dt;const x=ballBody.position.x,y=ballBody.position.y,z=ballBody.position.z;let nearest=100;let fielder=null;for(const f of fielders){const dx=f.position.x-x,dz=f.position.z-z,d=Math.hypot(dx,dz);if(d<nearest){nearest=d;fielder=f}}
if(fielder&&nearest<13){const dx=x-fielder.position.x,dz=z-fielder.position.z;const len=Math.max(.01,Math.hypot(dx,dz));fielder.position.x+=dx/len*dt*2.8;fielder.position.z+=dz/len*dt*2.8}
if(y<.16&&Math.abs(ballBody.velocity.y)<1.4){const dist=Math.hypot(x,z);let r;if(state.shotPower>.72&&dist>22)r=6;else if(dist>24)r=4;else if(dist>15)r=3;else if(dist>9)r=2;else r=1;if(nearest<2.4&&state.ballTimer>1.0)r=Math.min(r,1);if(state.shot==='defend')r=Math.min(r,1);state.ballInPlay=false;state.phase='result';scoreRuns(r,state.shot);setTimeout(()=>{if(state.active)nextDelivery()},1250)}
if(state.ballTimer>7){state.ballInPlay=false;state.phase='result';scoreRuns(1,state.shot);setTimeout(()=>{if(state.active)nextDelivery()},1000)}
}
function animate(){requestAnimationFrame(animate);const dt=Math.min(clock.getDelta(),.04);renderTime+=dt;camera.position.x=Math.sin(renderTime*.1)*.18;camera.lookAt(0,2.5,0);batter.position.y=Math.sin(renderTime*2)*.012;
if(state.phase==='delivery'){state.deliveryTime+=dt;const t=Math.min(1,state.deliveryTime/state.deliveryDuration||0);const cfg=settings[state.difficulty];state.deliveryDuration=8.6/cfg.speed;const z=-8.6+16.6*t;const y=1.45+Math.sin(t*Math.PI)*.3;ballBody.position.set(Math.sin(t*4)*.08,y,z);ballVisual.position.copy(ballBody.position);$('timingMeter').style.width=(Math.max(0,1-Math.abs(t-.82)/cfg.window)*100)+'%';if(t>=1&&!state.contactUsed){addWicket('BOWLED!');}}
if(state.phase==='flight'&&state.ballInPlay){world.step(fixed,dt,3);updateBallVisual();resolveFlight(dt)}
if(state.phase!=='flight'&&state.phase!=='delivery')$('timingMeter').style.width='0%';
if(toastTimer>0){toastTimer-=dt;if(toastTimer<=0)$('toast').classList.remove('show')}
renderer.render(scene,camera)}
state.deliveryDuration=8.6/settings.normal.speed;hud();animate();
