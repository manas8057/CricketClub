// CricketClub 2D anime cricket — canvas renderer
const $=id=>document.getElementById(id),canvas=$('world'),ctx=canvas.getContext('2d');
const S={active:false,phase:'menu',score:0,wickets:0,balls:0,fours:0,sixes:0,shot:'drive',t:0,duration:1.25,ball:null,swing:0,swingAt:0,queued:false,pace:135,format:20,toast:'',toastEnd:0,over:[],last:'—',best:'—'};
let W=0,H=0,D=1,now=0,elapsed=0;
function resize(){const r=canvas.getBoundingClientRect();D=Math.min(devicePixelRatio||1,2);W=r.width;H=r.height;canvas.width=W*D;canvas.height=H*D;ctx.setTransform(D,0,0,D,0,0)}new ResizeObserver(resize).observe(canvas);resize();
function oval(x,y,a,b,c){ctx.beginPath();ctx.ellipse(x,y,a,b,0,0,Math.PI*2);ctx.fillStyle=c;ctx.fill()}
function stroke(x,y,X,Y,c,w=3){ctx.beginPath();ctx.moveTo(x,y);ctx.lineTo(X,Y);ctx.strokeStyle=c;ctx.lineWidth=w;ctx.lineCap='round';ctx.stroke()}
function rr(x,y,w,h,r,c){ctx.beginPath();ctx.roundRect(x,y,w,h,r);ctx.fillStyle=c;ctx.fill()}
function anime(x,y,s,name,kit,role,phase=0){ctx.save();ctx.translate(x,y);ctx.scale(s,s);const run=Math.sin(elapsed*8+phase),swing=role==='batter'&&S.swing>0?Math.sin((.42-S.swing)/.42*Math.PI):0,step=role==='fielder'?run*.55:role==='bowler'&&S.phase==='delivery'?Math.sin(S.t*9)*.7:0;oval(0,3,23,7,'#06150d77');
stroke(-7,53,-9+step*10,81,'#202b34',9);stroke(-9+step*10,81,-14+step*13,101,'#e8edf0',8);stroke(7,53,9-step*10,81,'#202b34',9);stroke(9-step*10,81,15-step*13,101,'#e8edf0',8);stroke(-14+step*13,101,-2+step*13,102,'#111820',9);stroke(15-step*13,101,27-step*13,102,'#111820',9);
ctx.beginPath();ctx.moveTo(-19,10);ctx.quadraticCurveTo(-27,20,-23,49);ctx.lineTo(-14,57);ctx.lineTo(14,57);ctx.lineTo(23,49);ctx.quadraticCurveTo(27,20,19,10);ctx.closePath();ctx.fillStyle=kit;ctx.fill();
stroke(-17,17,-28,39+step*7,'#d59a79',8);oval(-28,42+step*7,5,6,'#d59a79');stroke(17,17,28,39-step*7,'#d59a79',8);oval(28,42-step*7,5,6,'#d59a79');
rr(-5,2,10,13,3,'#c88968');oval(0,-10,17,21,'#d99c7a');oval(-17,-10,4,7,'#c88968');oval(17,-10,4,7,'#c88968');
ctx.beginPath();ctx.moveTo(-17,-12);ctx.quadraticCurveTo(-20,-34,1,-33);ctx.quadraticCurveTo(20,-32,17,-8);ctx.lineTo(8,-18);ctx.lineTo(2,-9);ctx.lineTo(-5,-17);ctx.lineTo(-12,-7);ctx.closePath();ctx.fillStyle='#20232e';ctx.fill();
for(const q of [-1,1]){oval(q*7,-8,4.5,5.5,'#fff');oval(q*7,-7,2.3,3.7,'#263d60');oval(q*7.5,-8.5,1,1.4,'#fff');stroke(q*3,-16,q*10,-17,'#392a29',2)}
stroke(-2,1,2,1,'#985e50',1.5);stroke(-4,7,4,7,'#984f56',1.6);
if(role==='batter'){ctx.strokeStyle='#b8c9c1';ctx.lineWidth=1.5;ctx.beginPath();ctx.arc(0,-9,22,-.2,Math.PI+.2);ctx.stroke();ctx.save();ctx.translate(22,28);ctx.rotate(-.5-swing*1.6);stroke(0,0,2,-55,'#87562c',7);stroke(2,-55,1,-77,'#d6a25e',9);stroke(0,0,0,-13,'#ddd8cc',6);ctx.restore()}
rr(-25,110,50,13,4,'#07130ddd');ctx.fillStyle='#fff';ctx.font='bold 7px system-ui';ctx.textAlign='center';ctx.fillText(name,0,119);ctx.restore()}
function ground(){const cx=W/2,pw=Math.min(W*.34,170),sky=ctx.createLinearGradient(0,0,0,H);sky.addColorStop(0,'#142b42');sky.addColorStop(.48,'#28523d');sky.addColorStop(1,'#173b27');ctx.fillStyle=sky;ctx.fillRect(0,0,W,H);
for(let i=0;i<7;i++){ctx.fillStyle=i%2?'#354e50':'#263e43';ctx.fillRect(0,H*(.09+i*.018),W,H*.016)}
for(let i=0;i<260;i++)oval((i*73%997)/997*W,H*.105+(i*37%85)/1000*H,1.5,2,['#e9c69c','#d8e5db','#9eb9d0','#d16c5b'][i%4]);
ctx.beginPath();ctx.ellipse(cx,H*.64,W*.58,H*.43,0,0,Math.PI*2);ctx.fillStyle='#347b43';ctx.fill();ctx.save();ctx.beginPath();ctx.ellipse(cx,H*.64,W*.58,H*.43,0,0,Math.PI*2);ctx.clip();
for(let i=0;i<13;i++){ctx.strokeStyle=i%2?'#4b914e':'#286d3a';ctx.lineWidth=H*.026;ctx.beginPath();ctx.ellipse(cx,H*.64,W*(.12+i*.04),H*(.09+i*.032),0,0,Math.PI*2);ctx.stroke()}
for(let i=0;i<650;i++){let x=(i*127%997)/997*W,y=H*.28+(i*71%700)/700*H*.58;stroke(x,y,x+2,y-4,'#a3c97855',.7)}ctx.restore();
ctx.beginPath();ctx.ellipse(cx,H*.64,W*.55,H*.405,0,0,Math.PI*2);ctx.strokeStyle='#eee2c2';ctx.lineWidth=3;ctx.stroke();
ctx.beginPath();ctx.moveTo(cx-pw*.5,H*.18);ctx.lineTo(cx+pw*.5,H*.18);ctx.lineTo(cx+pw*.62,H*.88);ctx.lineTo(cx-pw*.62,H*.88);ctx.closePath();ctx.fillStyle='#b99a70';ctx.fill();
for(let i=0;i<100;i++)oval(cx-pw*.48+(i*37%100)/100*pw*.96,H*.2+(i*83%100)/100*H*.65,1.2,1,'#80684966');
for(const y of [H*.25,H*.81]){stroke(cx-pw*.55,y,cx+pw*.55,y,'#fff0ce',2);for(const dx of [-10,0,10])rr(cx+dx-1.5,y-15,3,17,1,'#f1dfb6')}
rr(W*.08,H*.14,W*.17,H*.06,7,'#d7d9cf');rr(W*.75,H*.14,W*.17,H*.06,7,'#d7d9cf');
anime(W*.78,H*.56,.72,'UMPIRE','#f0f0e9','umpire',1);
[[.18,.47],[.82,.43],[.13,.68],[.87,.7],[.31,.36],[.68,.34]].forEach((p,i)=>anime(W*p[0],H*p[1],.65,['DHONI','KOLHI','SHARMA','SRIMAN','RAJNEESH'][i%5],i%2?'#234e87':'#a63e37','fielder',i));
anime(W*.57,H*.28,.7,'DHONI','#245e9c','fielder',3);
anime(cx,H*.2,.84,'PRATEEK','#a53d35','bowler',2);
anime(cx,H*.77,1.02,'MANAS','#174d3a','batter',0);
if(S.ball){const b=S.ball;oval(b.x+2,b.y+4,7,3,'#10201666');const gr=ctx.createRadialGradient(b.x-3,b.y-4,1,b.x,b.y,Math.max(5,b.r));gr.addColorStop(0,'#ffaaa0');gr.addColorStop(.5,'#ec3027');gr.addColorStop(1,'#8e1718');oval(b.x,b.y,b.r,b.r,gr);ctx.beginPath();ctx.arc(b.x,b.y,b.r*.72,-.9,1.5);ctx.strokeStyle='#fff4e6';ctx.lineWidth=1.4;ctx.stroke()}
if(S.active){rr(12,H*.11,W-24,6,4,'#07130e99');rr(12,H*.11,(W-24)*Math.min(1,S.t/S.duration),6,4,'#d3f36f')}
if(S.toast&&elapsed<S.toastEnd){rr(W*.2,H*.39,W*.6,38,18,'#d4f36d');ctx.fillStyle='#122016';ctx.font='900 14px system-ui';ctx.textAlign='center';ctx.fillText(S.toast,W*.5,H*.39+24)}}
function draw(){ctx.clearRect(0,0,W,H);ground()}
function hud(){$('runs').textContent=S.score;$('wickets').textContent=S.wickets;$('overs').textContent=Math.floor(S.balls/6)+'.'+S.balls%6+' ov';$('runrate').textContent='RR '+(S.balls?S.score/(S.balls/6):0).toFixed(1);$('target').textContent=S.format+' OVER MATCH';$('thisOver').textContent=S.over.join(' ')||'—';$('lastBall').textContent=S.last;$('boundaries').textContent=S.fours+' / '+S.sixes;$('bestShot').textContent=S.best;$('pace').textContent=S.pace}
function say(t){S.toast=t;S.toastEnd=elapsed+1.5}
function next(){if(!S.active)return;if(S.balls>=S.format*6||S.wickets>=10){S.active=false;S.phase='finished';$('restart').classList.remove('hidden');$('centre').innerHTML='<h1>INNINGS COMPLETE</h1><p>'+S.score+' RUNS</p>';$('centre').classList.remove('hidden');return}S.phase='delivery';S.t=0;S.duration=1.3*135/S.pace;S.ball={x:W/2,y:H*.27,r:5};S.queued=false;S.swing=0;$('bowlerName').textContent='PRATEEK';say('PRATEEK · '+S.pace+' KM/H')}
function result(r){S.phase='result';S.ball=null;S.balls++;S.score+=r;S.last=''+r;S.over.push(''+r);if(r===4)S.fours++;if(r===6)S.sixes++;if(r>=4)S.best=S.shot.toUpperCase();if(S.balls%6===0)S.over=[];hud();say(r===6?'SIX!':r===4?'FOUR!':r+' RUNS');setTimeout(()=>{if(S.active)next()},850)}
function wicket(){if(S.phase!=='delivery')return;S.phase='result';S.ball=null;S.balls++;S.wickets++;S.last='W';S.over.push('W');hud();say('WICKET');setTimeout(()=>{if(S.active)next()},900)}
function hit(t){if(S.phase!=='delivery')return;const q=Math.max(0,1-Math.abs(t-.86)/.3);if(q<.1){wicket();return}S.phase='flight';S.queued=false;S.ball={x:W/2,y:H*.77,r:7,vy:-H*(.75+q*.16)*(S.shot==='loft'?1.25:S.shot==='defend'?.65:1),vx:(Math.random()-.5)*W*.13,air:S.shot==='loft'}}
function swing(){if(!S.active||S.phase!=='delivery')return;S.swing=.42;S.swingAt=elapsed;S.queued=true;const t=S.t/S.duration;if(t>.68&&t<1.04)hit(t)}
function choose(s){S.shot=s;document.querySelectorAll('.shot').forEach(b=>b.classList.toggle('active',b.dataset.shot===s))}
function start(){S.format=Number($('format').value);S.pace=Number($('ballSpeed').value);S.score=S.wickets=S.balls=S.fours=S.sixes=0;S.last='—';S.best='—';S.over=[];S.active=true;$('menu').classList.add('hidden');$('restart').classList.add('hidden');$('centre').classList.add('hidden');$('speedValue').textContent=S.pace+' km/h';hud();next()}
$('ballSpeed').addEventListener('input',e=>$('speedValue').textContent=e.target.value+' km/h');$('start').addEventListener('click',start);$('restart').addEventListener('click',start);$('swing').addEventListener('click',swing);$('mobileSwing').addEventListener('click',swing);$('next').addEventListener('click',next);$('mobileNext').addEventListener('click',next);document.querySelectorAll('.shot').forEach(b=>b.addEventListener('click',()=>choose(b.dataset.shot)));addEventListener('keydown',e=>{if(e.code==='Space'||e.key.toLowerCase()==='a'){e.preventDefault();if(!e.repeat)swing()}if(['1','2','3'].includes(e.key))choose(['drive','loft','defend'][+e.key-1]);if(e.key==='Enter'&&!S.active)start()});
function loop(ts){requestAnimationFrame(loop);const dt=Math.min(.04,(ts-now)/1000||0);now=ts;elapsed+=dt;if(S.swing>0)S.swing=Math.max(0,.42-(elapsed-S.swingAt));if(S.phase==='delivery'){S.t+=dt;const t=Math.min(1,S.t/S.duration);S.ball.y=H*(.27+.5*t);S.ball.x=W/2;if(S.queued&&t>.78&&t<.99)hit(t);else if(t>=1)wicket()}else if(S.phase==='flight'&&S.ball){S.ball.y+=S.ball.vy*dt;S.ball.x+=S.ball.vx*dt;S.ball.vy+=H*.85*dt;if(S.ball.y<H*.24||S.ball.x<W*.02||S.ball.x>W*.98)result(S.ball.air||S.shot==='loft'?6:4);else if(S.ball.y>H*.94)result(4)}draw()}requestAnimationFrame(loop);hud();
