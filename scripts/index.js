(()=>{var X=Object.defineProperty;var St=Object.getOwnPropertyDescriptor;var Pt=Object.getOwnPropertyNames;var Tt=Object.prototype.hasOwnProperty;var At=(t,e)=>()=>(t&&(e=t(t=0)),e);var R=(t,e)=>()=>(e||t((e={exports:{}}).exports,e),e.exports),Ht=(t,e)=>{for(var n in e)X(t,n,{get:e[n],enumerable:!0})},$t=(t,e,n,i)=>{if(e&&typeof e=="object"||typeof e=="function")for(let s of Pt(e))!Tt.call(t,s)&&s!==n&&X(t,s,{get:()=>e[s],enumerable:!(i=St(e,s))||i.enumerable});return t};var F=t=>$t(X({},"__esModule",{value:!0}),t);var C={};Ht(C,{APITransport:()=>at,ConsoleTransport:()=>z,FileTransport:()=>st,default:()=>P,interpolate:()=>ct});function P(t){if(t===void 0)throw new Error("Logger requires the file name of where it's being used.");if(!new.target)return new P(...arguments);Object.defineProperties(this,{log:{value:function(e,n,i){_.indexOf(e)<=_.indexOf(P.state.currentLevel)&&Object.values(P.state.transports).forEach(s=>{queueMicrotask(()=>s.log({level:e,msg:n,category:t,...i}))})}}}),_.forEach(e=>{let n;e==="noop"?n=()=>{}:n=this.log.bind(this,e),Object.defineProperty(this,e,{value:n})})}function z(t){if(!new.target)return new z(...arguments);Object.defineProperty(this,"log",{value:function(e){let n=Object.assign({},t,e);if(n.isTable)console.table(n.msg,n.args);else if(n.group)console[n.group](n.msg);else{let[i,s]=n.style?.length===2?n.style:["font-weight: bold; color: green;","font-style: italic;"];console[n.level](`%c${n.timestamp||new Date().toLocaleTimeString("en-US",n.dateFmt)}%c %c[${n.category}]%c ${n.msg}`,i,"",s,"",...n.args||[])}}})}function st(t){if(window.showSaveFilePicker===void 0){let e="FileTransport requires the File System Access API";throw console.warn(e),new Error(e)}if(!new.target)return new st(...arguments);Object.defineProperty(this,"initialize",{value:async function(){try{let e=await window.showSaveFilePicker({types:[{description:"Log Files",accept:{"text/plain":[".log"]}}]});Object.defineProperty(this,"log",{value:async function(n){let i=Object.assign({},t,n),s;try{s=await e.createWritable({keepExistingData:!0}),await s.write(`${i.timestamp||new Date().toLocaleTimeString("en-US",i.dateFmt)} [${i.category}] ${i.level}: ${i.msg}
`)}catch(r){console.error(r)}finally{await s.close()}}})}catch(e){console.error(e)}}})}function at(t){if(!new.target)return new at(...arguments);Object.defineProperty(this,"log",{value:async function(e){let n=ct(t,e);try{let i=await fetch(n.url,{method:n.method,headers:Object.entries(n.headers||{}).reduce((s,[r,o])=>(s[r]=o,s),{}),body:n.body});console.debug(i)}catch(i){console.error(i)}}})}var _,ct,I=At(()=>{_=["noop","error","warn","info","debug","silly"];Object.defineProperties(P,{addTransport:{value:(t,e)=>{P.state.transports[t]=e}},state:{value:{currentLevel:"noop",transports:{}}},level:{get:()=>P.state.currentLevel},removeTransport:{value:t=>{delete P.state.transports[t]}},setLogLevel:{value:t=>{if(_.some(e=>e===t))P.state.currentLevel=t;else throw new Error(`${t} is not a valid logger level`)}}});P.addTransport("default",z({}));_.reduce((t,e)=>(Object.defineProperty(t,e.toUpperCase(),{enumerable:!0,get:()=>e}),t),P);ct=function t(e,n){if(e instanceof Object){let i=Array.isArray(e)?[]:{};for(let s in e){let r=t(e[s],n);try{i[s]=JSON.parse(r)}catch{r!==void 0&&r!==""&&(i[s]=r)}}return i}return typeof e!="string"?e:e.replace(/\{\{(.+?)}}/g,(i,s)=>{let r=n[s]||"";return r instanceof Object?JSON.stringify(r):r})}});var ut=R((Bt,lt)=>{var Y;typeof window>"u"?Y=(I(),F(C)):Y=(I(),F(C)).default;var Rt=new Y("getopt.js"),ht=function(t){Rt.warn(t)};function l(t,e){typeof l.place>"u"&&(l.place="",l.iplace=0);let n;if(l.optreset>0||l.iplace===l.place.length){if(l.optreset=0,l.place=t[l.optind],l.iplace=0,l.optind>=t.length||l.place.charAt(l.iplace++)!=="-")return l.place="",l.iplace=0,"";if(l.optopt=l.place.charAt(l.iplace++),l.optopt==="-"&&l.iplace===l.place.length)return++l.optind,l.getopt.place="",l.getopt.iplace=0,"";if(l.optopt===0){if(l.place="",l.iplace=0,e.indexOf("-")===-1)return"";l.optopt="-"}}else l.optopt=l.place.charAt(l.iplace++);if(l.optopt===":"||(n=e.indexOf(l.optopt))===-1)return l.iplace===l.place.length&&++l.optind,l.opterr&&e.charAt(0)!==":"&&ht("illegal option -- "+l.optopt),"?";if(e.charAt(n+1)!==":")l.optarg=null,l.iplace===l.place.length&&++l.optind;else{if(l.iplace<l.place.length)l.optarg=l.place.substr(l.iplace);else if(t.length>++l.optind)l.optarg=t[l.optind];else return l.place="",l.iplace=0,e.charAt(0)===":"?":":l.opterr?(ht("option requires an argument -- "+l.optopt),":"):"?";l.place="",l.iplace=0,++l.optind}return l.optopt}l.opterr=1;l.optind=0;l.optopt="";l.optreset=0;l.optarg="";lt.exports=l});var V=R((Ut,dt)=>{var T=ut();function L(t,e,n){if(typeof e=="function")return function(){return e.apply(this,arguments)||L.OK};let i=this;i.echo===void 0&&(i.echo=t.info);let s=[],r=/"([^"]*)"|'([^']*)'|\S+/g,o=async function(c){t.info(`Executing: ${c}`);let u=c.match(r).map(d=>d.replace(/^['"]|['"]$/g,"")),a=u.shift(),p=e[a];if(p===void 0){if(s.includes(a))try{let d=JSON.stringify(await n(c));return t.debug(`RPC Response: ${d}`),i.echo(d),L.OK}catch(d){return i.echo(d),L.ECMDERR}return i.echo(`${a}: no such command`),L.ENOTFOUND}let{func:g,opts:y,usage:x}=p,f=y;if(x&&(f=f?`${f}h`:"h"),f!==void 0){t.debug(`Parsing options: ${f} with ${u}`);let d={},m;for(T.optreset=1,T.optind=0;(m=T(u,f))!=="";)switch(t.debug(`Opt: ${m}, optarg: ${T.optarg}, optind: ${T.optind}`),m){case"h":return i.echo(`Usage: ${x}`),L.OK;case":":return i.echo(`${T.optopt}: option needs a value`),L.EBADARGS;case"?":return i.echo(`${T.optopt}: no such option`),L.EBADARGS;default:t.debug(`Switch: ${m}, optarg: ${T.optarg}`),d[m]=T.optarg||!0}g.opts=d,t.debug(`Switches: ${JSON.stringify(d)}`)}else T.optind=0;return t.debug(`Terms: ${u}`),await g.apply(this,u.slice(T.optind))??L.OK};return n!==void 0&&queueMicrotask(async function(){let c=await n("system.describe");t.debug(`system.describe result: ${c}`),JSON.parse(c).procs.forEach(u=>s.push(u)),e.help.rpcList=s,t.debug(`RPC List: ${s}`),Object.defineProperties(o,{login:{value:async function(u,a){t.info(`Attempting to log in user ${u}`);try{let p=await n(`login ${u} ${a}`);if(p===!1)return i.echo("Login failed"),L.NOTOKEN;let g=n;return o.exit??Object.defineProperty(o,"exit",{value:async function(){t.info("Logging out"),n=g,i.authState=L.NOTOKEN,i.dispatchEvent(new CustomEvent("terminal-reset",{detail:{clear:!0}}))}}),n=new Proxy(n,{apply:function(y,x,f){return y(f[0],p)}}),L.OK}catch(p){return t.error(p),p}}}})}),o}var B=0;Object.defineProperties(L,{OK:{value:B++},ENOTFOUND:{value:B++},ECMDERR:{value:B++},EBADARGS:{value:B++},NOTOKEN:{value:B++}});function Nt(t,e){let n=0;return function(i,s){try{t.info(`Executing RPC: ${i}`);let r=i.trim().split(/\s+/),o=r.shift(),c=r;s&&(c={token:s,params:c}),t.debug(`Method: ${o}, params: ${c}`);try{return e.jsonrpc({id:n++,method:o,params:c}).then(u=>{let a=JSON.parse(u);if(t.debug(`Response: ${JSON.stringify(a)}`),a.error)throw new Error(a.error.message);return a.result})}catch(u){return t.error(u),u}}catch(r){return t.error(r),r}}}dt.exports={JSONRPCClient:Nt,Executor:L}});var ft=R(()=>{var{Executor:N}=V(),Q=(I(),F(C)).default,v=new Q("Terminal.js"),Ct=100,It=1e3,Z=class extends HTMLElement{constructor(){super(),this.attachShadow({mode:"open"}),this.parentTerminal=null,this.commandHistory=[],this.historyIndex=-1;let e=localStorage.getItem("commandHistory");e&&(this.commandHistory=JSON.parse(e),v.debug(`Loading command history (${this.commandHistory.length} items)`),this.historyIndex=this.commandHistory.length),this.inputHandler=this.inputHandler.bind(this),this.reset=this.reset.bind(this),this.addEventListener("terminal-reset",this.reset);let n=function(){v.debug("DOMContentLoaded event fired"),this.reset(new CustomEvent("terminal-reset",{detail:{clear:!0}})),document.removeEventListener("DOMContentLoaded",n)}.bind(this);document.addEventListener("DOMContentLoaded",n)}connectedCallback(){v.debug("Terminal connected")}disconnectedCallback(){v.debug("Terminal disconnected"),this.inputLine.removeEventListener("keydown",this.inputHandler),this.removeEventListener("click",this.focusHandler)}reset(e){if(v.debug(`Terminal reset (${this.parentTerminal?"sub-terminal":"main terminal"})`),v.debug(`Auth state: ${this.authState}, RPC enabled: ${this.rpcEnabled}`),this.rpcEnabled&&this.authState!==N.OK)v.debug("logging in"),this.loginModal();else{let n=e.detail?.clear??!1;v.debug(`reset ${n?"and clear ":""}terminal`),this.uiModal(n)}this.focusHandler=function(){this.inputLine.focus()}.bind(this),this.addEventListener("click",this.focusHandler),this.focusHandler()}applyStyles(){let e=this.querySelector("style").cloneNode(!0);this.shadowRoot.appendChild(e)}loginModal(){this.shadowRoot.innerHTML="",this.applyStyles();let e=this.querySelector("template#login").content.cloneNode(!0);this.shadowRoot.appendChild(e),this.inputLine=this.shadowRoot.querySelector(".input-line"),this.output=this.shadowRoot.querySelector(".output"),this.echo("Please log in");let n,i,s=async r=>{if(r.key==="Enter"){r.preventDefault();let o=(this.inputLine.value??this.inputLine.textContent).trim();if(n===void 0?n=o:i=o,n&&i)try{if(this.authState=await this.executor.login(n,i),v.debug(`Login state: ${this.authState}`),this.authState===N.NOTOKEN){this.loginModal(),this.focusHandler();return}this.inputLine.removeEventListener("keydown",s),this.removeEventListener("click",this.focusHandler),this.reset(new CustomEvent("terminal-reset",{detail:{clear:!0}}))}catch(c){this.echo(c),v.error(c)}else{v.debug(`awaiting password for ${n}`);let c=document.createElement("input");c.type="password",c.classList.add("input-line"),this.inputLine.textContent=this.inputLine.value="",this.inputLine.removeEventListener("keydown",s),this.removeEventListener("click",this.focusHandler),this.inputLine.replaceWith(c),this.inputLine=this.shadowRoot.querySelector(".input-line"),this.prompt="password:",this.inputLine.addEventListener("keydown",s),this.addEventListener("click",this.focusHandler),this.focusHandler()}}};this.inputLine.addEventListener("keydown",s)}uiModal(e){let n=this.shadowRoot.querySelector(".output")?.innerHTML;this.shadowRoot.innerHTML="",this.applyStyles();let i=this.querySelector("template#ui").content.cloneNode(!0);this.shadowRoot.appendChild(i),this.inputLine=this.shadowRoot.querySelector(".input-line"),this.output=this.shadowRoot.querySelector(".output"),e&&this.greeting?(v.debug("clearing terminal"),this.echo(this.greeting)):this.output.innerHTML=n??"",this.inputLine.addEventListener("keydown",this.inputHandler),this.inputLine.focus()}get executor(){return this._executor}set executor(e){v.info("Setting executor"),this._executor=e}get greeting(){return this.getAttribute("greeting")}set greeting(e){e===void 0?this.removeAttribute("greeting"):this.setAttribute("greeting",e)}get prompt(){return this.shadowRoot.querySelector(".prompt").textContent}set prompt(e){let n=this.shadowRoot.querySelector(".prompt");n.innerHTML=`${e}&nbsp;`}get rpcEnabled(){return this.getAttribute("rpc")==="true"}inputHandler(e){switch(e.key){case"Enter":{e.preventDefault();let n=this.inputLine.textContent.trim();this.inputLine.textContent="",this.echo(`${this.prompt}${n}`),this.processCommand(n),this.historyIndex=this.commandHistory.length;break}case"ArrowUp":v.debug(`History index (back): ${this.historyIndex}`),this.historyIndex>0&&(this.historyIndex-=1,this.inputLine.textContent=this.commandHistory[this.historyIndex]);break;case"ArrowDown":v.debug(`History index (forward): ${this.historyIndex}`),this.historyIndex<this.commandHistory.length-1?(this.historyIndex+=1,this.inputLine.textContent=this.commandHistory[this.historyIndex]):(this.historyIndex=this.commandHistory.length,this.inputLine.textContent="");break}}async processCommand(e){try{let n=await this.executor(e);switch(v.debug(`Status: ${n}`),n){case N.OK:v.debug(`${e} executed successfully`),e!==this.commandHistory[this.commandHistory.length-1]&&(this.commandHistory.push(e),this.commandHistory.length>Ct&&this.commandHistory.shift(),localStorage.setItem("commandHistory",JSON.stringify(this.commandHistory)));break;case N.ENOTFOUND:v.info(`${e} not found`);break;case N.ECMDERR:v.error(`Error executing ${e}`);break;case N.EBADARGS:v.warn(`${e} called with bad arguments`);break;default:v.error(`Unknown status: ${n} for ${e}`);break}}catch(n){v.error(n),this.echo(n)}}clear(){this.output.innerHTML=""}echo(e){for(e!=null&&e!==""&&(this.output.innerHTML+=`<div>${e}</div>`);this.output.children.length>It;)this.output.removeChild(this.output.firstChild);this.inputLine.getBoundingClientRect().bottom>window.innerHeight&&this.inputLine.scrollIntoView({behavior:"smooth"})}log(e){Q.level==="debug"&&(typeof e=="string"?console.info(e):console.dir(e))}startSubTerminal(e){v.info(`Starting sub-terminal: ${e.name}`),this.removeEventListener("terminal-reset",this.reset);let n=new Q(`Executor.js (${e.name})`),i=document.createElement("ng-terminal");return i.innerHTML=this.innerHTML,i.greeting=e.greeting,i.executor=N.bind(i)(n,e.registry),i.parentTerminal=this,this.replaceWith(i),i.dispatchEvent(new CustomEvent("terminal-reset",{detail:{clear:!0}})),e.prompt!==void 0&&(i.prompt=e.prompt),i}exitSubTerminal(){this.parentTerminal?(v.info("Exiting sub-terminal"),v.debug(`Parent terminal: ${JSON.stringify(this.parentTerminal)}`),this.parentTerminal.addEventListener("terminal-reset",this.parentTerminal.reset),this.replaceWith(this.parentTerminal),this.parentTerminal.dispatchEvent(new CustomEvent("terminal-reset",{detail:{clear:!1}}))):v.warn("No parent terminal found")}};customElements.define("ng-terminal",Z)});var J=R((Gt,pt)=>{var qt=(I(),F(C)).default,q=new qt("Renderer.js");function W(t,e){if(!new.target)return new W(...arguments);let n=t.pixels.toArray(),i=n.length,s=new Proxy(t,{get:function(r,o,c){if(typeof o=="string"&&!isNaN(o)){let u=+o;if(Number.isInteger(u)&&u>=0&&u<i)return n[u]}else return Reflect.get(r,o,c)},set:function(r,o,c,u){if(typeof o=="string"&&!isNaN(o)){let a=+o;Number.isInteger(a)&&a>=0&&a<i&&(n[a]=Array.isArray(c)?e.color.apply(this,c):c)}else return Reflect.set(r,o,c,u)}});return t.loaded=!0,Object.defineProperties(s,{blit:{value:function(r,o){t.pixels.set(n),e.image(t,r,o)}},length:{value:n.length},update:{value:function(){t.pixels.set(n)}}}),s}function tt(t){if(!new.target)return new tt(...arguments);let e=0,n=[];Object.defineProperties(n,{flip:{value:function(){e^=1}},read:{get:function(){return this[e^1]}},write:{get:function(){return this[e]}}});let i=t.createImage();n.push({buffer:i,get pixels(){return i.pixels.toArray()}});let s=t.createImage();n.push({buffer:s,get pixels(){return s.pixels.toArray()}}),Object.defineProperties(this,{flip:{value:function(){let o=n.write.buffer;o.update(),t.background(o),n.flip()}},readBuffer:{get:function(){return n.read.pixels}},writeBuffer:{get:function(){return n.write.buffer}}})}function U(t){if(U.instance!==void 0)return U.instance;if(!new.target)return new U(...arguments);let e={background:4278849802,frameRate:60,height:t.height,width:t.width},n;Object.defineProperties(this,{createImage:{value:function(s,r){let o=n.createImage(s??t.width,r??t.height);return new W(o,n)}},frame:{set:function(s){q.debug("pjs.draw set"),Object.defineProperty(n,"draw",{value:s,writable:!0})}},doubleBuffer:{value:function(){return new tt(this)}},init:{value:function(s){n!==void 0&&n.exit();let r=Object.assign({},e,s);n=new Processing(t,o=>{q.info("Processing.js created"),q.debug(`canvas width (${t.width}) height (${t.height})`),Object.defineProperties(o,{draw:{value:function(){},writable:!0},keyPressed:{value:function(){switch(o.keyCode){case o.UP:o.loop();break;case o.DOWN:o.noLoop();break;case o.LEFT:o.save("image.png");break;case o.RIGHT:o.redraw()}},writable:!0},setup:{value:function(){o.size(r.width,r.height),q.debug(`processingjs width (${o.width}) height (${o.height}) ${o.use3DContext}`),o.frameRate(r.frameRate),o.noLoop(),o.background(r.background),q.info("Processing.js setup")}}})})}},input:{set:function(s){q.debug("keyPressed set"),Object.defineProperty(n,"keyPressed",{value:s,writable:!0})}},pixelHeight:{get:function(){return 0}},pixelWidth:{get:function(){return 0}},showRuler:{set:function(){}}}),this.init();let i=new Proxy(this,{get:function(s,r){return s[r]??n[r]}});return Object.defineProperty(U,"instance",{value:i}),i}pt.exports={DoubleBuffer:tt,Image:W,Renderer:U}});var yt=R((Xt,gt)=>{function j(){if(j.instance instanceof j)return j.instance;if(!new.target)return new j(...arguments);Object.defineProperty(j,"instance",{value:this});let t=Math.PI/180;Object.defineProperties(this,{cos:{value:{},enumerable:!0},sin:{value:{},enumerable:!0}});for(let e=0;e<=360;++e)Object.defineProperty(this.cos,e,{value:Math.cos(e*t)}),Object.defineProperty(this.sin,e,{value:Math.sin(e*t)})}var et=Object.freeze({addColors:(...t)=>t.length===0?[]:t[0].map((e,n)=>t.reduce((i,s)=>i+s[n],0)),decodeColor:t=>[t>>16&255,t>>8&255,t&255,t>>>24],distance:(t,e,n,i)=>Math.hypot(Math.abs(n-t),Math.abs(i-e)),fastInvSqrt:()=>1,fastTrig:j(),randomColor:(t=!1)=>{let e=Array.from({length:3},()=>et.roll(255));return e.push(t?et.roll(255):255),e},range:(t,e)=>{let n=Math.random()*(e-t);return Number.isInteger(t)&&Number.isInteger(e)&&(n=Math.floor(n)),n+t},roll:t=>Math.floor(Math.random()*t)});gt.exports=et});var bt=R((zt,xt)=>{function mt(t,e){if(!new.target)return new mt(...arguments);let n=2,i=new s;i.next=new s,i.prev=i.next,i.prev.next=i,i.prev.prev=i,i.active=!1,i.prev.active=!1,this.acceleration=[0,.25],this.elasticity=.2,this.MAX_COUNT=3e3,Object.defineProperties(this,{count:{get:function(){return n}},createParticle:{value:function(r,o,c,u,a,p,g,y,x){if(i.prev.active){if(n>=this.MAX_COUNT)return;let f=new s(r,o,c,u,a,p,g,y,x);f.next=i,f.prev=i.prev,f.prev.next=f,i.prev=f,i=f,++n}else{let f=i.prev;f.activate(r,o,c,u,a,p,g,y,x),i=f}}},list:{get:function(){return i}},render:{value:function(){let r=i;for(;r.active;){e.call(r,this),t.stroke(r.r,r.g,r.b,r.a),t.point(r.x,r.y);let o=r;if(r.ttl>0&&++r.t>=r.ttl&&(r.active=!1),r=r.next,r===i)break;o.active||(o===i?i=o.next:(o.next.prev=o.prev,o.prev.next=o.next,o.next=i,o.prev=i.prev,i.prev.next=o,i.prev=o))}}}});function s(r,o,c,u,a,p,g,y,x){if(!new.target)return new s(...arguments);Object.defineProperties(this,{activate:{value:function(f,d,m,w,M,k,S,A,$){this.active=!0,this.ttl=f,this.t=0,this.x=d,this.y=m,this.dx=w,this.dy=M,this.ddx=0,this.ddy=0,this.dddx=0,this.dddy=0,this.r=k,this.g=S,this.b=A,this.a=$}}}),this.activate(r,o,c,u,a,p,g,y,x)}}xt.exports=mt});var Mt=R((Yt,vt)=>{var b=yt(),H=bt(),h=J().Renderer();function wt(t,e,n,i){let s=i%t,r=Math.floor(i/t),o=n,c=Math.floor(s/e)%2==0,u=Math.floor(r/e)%2==0;return c!=u&&(o=0),[o,o,o,255]}var jt={boids:function(){let t=h.width,e=h.height,n=t/2,i=e/2,s=200,r=3,o=5e-4,c=100,u=40,a=1,p=1.25,g=1,y=.75,x=new H(h,function(d){let m={x:0,y:0},w={x:0,y:0},M={x:0,y:0},k={x:0,y:0},S=0,A=0,$=d.list,E=$;for(;E.active;){if(E===this){if(E=E.next,E===$)break;continue}let O=Math.hypot(this.x-E.x,this.y-E.y);if(O<c&&(m.x+=E.dx,m.y+=E.dy,w.x+=E.x,w.y+=E.y,S++),O<u){let D=(u-O)/u;M.x+=(this.x-E.x)*D,M.y+=(this.y-E.y)*D,A++}if(E=E.next,E===$)break}if(S>0){m.x/=S,m.y/=S;let O=Math.hypot(m.x,m.y);O>0&&(m.x=m.x/O*o*a,m.y=m.y/O*o*a),w.x=(w.x/S-this.x)*o*p,w.y=(w.y/S-this.y)*o*p}if(A>0){M.x/=A,M.y/=A;let O=Math.hypot(M.x,M.y);O>0&&(M.x=M.x/O*o*g,M.y=M.y/O*o*g)}if(Math.random()>y){let O=Math.atan2(this.dy,this.dx)+b.range(-.1,.1),D=Math.hypot(this.dx,this.dy);k.x=D*Math.cos(O)-this.dx,k.y=D*Math.sin(O)-this.dy}this.ddx=m.x+w.x+M.x+k.x,this.ddy=m.y+w.y+M.y+k.y,this.dx+=this.ddx,this.dy+=this.ddy;let G=Math.hypot(this.dx,this.dy);G>r&&(this.dx=this.dx/G*r,this.dy=this.dy/G*r);let Lt=this.x-3*this.dx,kt=this.y-3*this.dy;this.x+=this.dx,this.y+=this.dy,h.line(this.x,this.y,Lt,kt),this.x>=t-1?(this.x=t-1,this.dx*=-1):this.x<0&&(this.x=0,this.dx*=-1),this.y>=e-1?(this.y=e-1,this.dy*=-1):this.y<0&&(this.y=0,this.dy*=-1)}),f=b.range(0,2*Math.PI);for(let d=0;d<s;++d){let m=b.range(.001,1)*r,w=b.range(-.1,.1);x.createParticle(0,b.range(n-10.01,n+10),b.range(i-10.01,i+10),m*Math.cos(w+f),m*Math.sin(w+f),...b.randomColor())}h.stroke(0,0,0,255),h.frame=function(){h.background(0),x.render()},h.loop()},bz:function(){let t=h.width,e=Array.from({length:8},()=>Math.random()*t),n=Array.from({length:8},()=>Math.random()*t),i=Array.from({length:8},()=>Math.random()*15);h.background(255),h.noFill(),h.frame=function(){h.stroke(0,0,0,20),e.map(function(s,r,o){let c=s+i[r];c<0?(c=0,i[r]*=-1):c>t&&(c=t,i[r]*=-1),o[r]=c}),h.bezier.apply(null,e),h.stroke(255,128,128,20),n.map(function(s,r,o){let c=s+i[r];c<0?(c=0,i[r]*=-1):c>t&&(c=t,i[r]*=-1),o[r]=c}),h.bezier.apply(null,n)},h.loop()},cell:function(t,e=200,n=200){console.log(t),h.init({background:0,frameRate:400,height:+n,width:+e});let i=h.width,s=h.height,r=0,o=1,c=1,u=0,a=Array.from(Array(i*s)).map(()=>[u,u]);a.forEach(y=>y[o]=Math.random()<.1?c:u),h.stroke(255);let p=a.length/i,g=0;h.frame=function(){h.point(b.roll(i),g),g!==p&&g++},h.loop()},chaos:function(t="3"){h.init({frameRate:400});let e=h.width,n=h.height,i=e/2,s=n/2,r=i-50,o=Math.PI/180,c={3:[{x:e/2,y:50},{x:50,y:n-50},{x:e-50,y:n-50}],5:[{x:e-50,y:50},{x:50,y:50},{x:50,y:n-50},{x:e-50,y:n-50},{x:i,y:s}],6:[{x:Math.cos(0)*r+i,y:Math.sin(0)*r+s},{x:Math.cos(60*o)*r+i,y:Math.sin(60*o)*r+s},{x:Math.cos(120*o)*r+i,y:Math.sin(120*o)*r+s},{x:Math.cos(180*o)*r+i,y:Math.sin(180*o)*r+s},{x:Math.cos(240*o)*r+i,y:Math.sin(240*o)*r+s},{x:Math.cos(300*o)*r+i,y:Math.sin(300*o)*r+s}]}[t],u={3:2,5:1.5,6:1.5}[t];h.background(0),h.stroke(255,255,255,255);for(let{x:g,y}of c)h.point(g,y);let a=Math.random()*e,p=Math.random()*n;h.frame=function(){let g=b.roll(c.length);a+=(c[g].x-a)/u,p+=(c[g].y-p)/u,h.point(a,p)},h.loop()},fire:function(){h.init({background:0,frameRate:60,height:300,width:300});let t=h.width,e=h.doubleBuffer(),n=e.writeBuffer;for(let r=0;r<n.length;++r)n[r]=[0,0,0,255];e.flip(),n=e.writeBuffer;for(let r=0;r<n.length;++r)n[r]=[0,0,0,255];e.flip();let i=e.readBuffer.length/t,s=h.color(255,128,96);h.frame=function(){let r=e.readBuffer,o=e.writeBuffer;for(let c=t;c<o.length-t;++c){if(c%t<1||c%t>=t-1)continue;let u=c/t;if(Math.random()<Math.pow(Math.E,Math.pow(u/i,4))-1&&Math.random()>.975){o[c]=s;continue}o[c]=b.addColors(b.decodeColor(r[c-1]),b.decodeColor(r[c]),b.decodeColor(r[c+1]),b.decodeColor(r[c+t])).map((a,p)=>{if(p===3)return 255;let g=a/4.25;return g<10?0:g})}e.flip()},h.loop()},fireworks:function(){let t=h.width,e=h.height,n=new H(h,function(){this.dx+=n.acceleration[0],this.dy+=n.acceleration[1],this.x+=this.dx,this.y+=this.dy;let a=1-this.t/this.ttl;this.r=255*Math.pow(a,.2),this.g=255*a*a,this.b=255*a*a*a*a,this.a=255*a}),i=new H(h,function(){this.dx+=i.acceleration[0],this.dy+=i.acceleration[1],this.x+=this.dx,this.y+=this.dy;let a=1-this.t/this.ttl;this.b=255*Math.pow(a,.2),this.g=255*a*a,this.r=255*a*a*a*a,this.a=255*a}),s=new H(h,function(){this.dx+=s.acceleration[0],this.dy+=s.acceleration[1],this.x+=this.dx,this.y+=this.dy;let a=1-this.t/this.ttl;this.g=255*Math.pow(a,.2),this.r=255*a*a,this.b=255*a*a*a*a,this.a=255*a}),r=new H(h,function(){this.dx+=r.acceleration[0],this.dy+=r.acceleration[1],this.x+=this.dx,this.y+=this.dy;let a=1-this.t/this.ttl;this.r=255*Math.pow(a,.2),this.g=255*Math.pow(a,.2),this.b=255*a*a*a*a,this.a=255*a}),o=new H(h,function(){this.dx+=o.acceleration[0],this.dy+=o.acceleration[1],this.x+=this.dx,this.y+=this.dy;let a=1-this.t/this.ttl;this.r=255*Math.pow(a,.2),this.b=255*a*a*a*a,this.g=255*a,this.a=255*a}),c=new H(h,function(){this.dx+=c.acceleration[0],this.dy+=c.acceleration[1],this.x+=this.dx,this.y+=this.dy;let a=1-this.t/this.ttl;this.r=255*Math.pow(a,.2),this.b=255*Math.pow(a,.2),this.g=255*a*a*a*a,this.a=255*a});n.acceleration=[0,.15],i.acceleration=[0,.15],s.acceleration=[0,.15],r.acceleration=[0,.15],o.acceleration=[0,.15],c.acceleration=[0,.15];function u(a,p){let g;switch(b.range(0,5)){case 0:g=n;break;case 1:g=i;break;case 2:g=s;break;case 3:g=r;break;case 4:g=c;break;case 5:g=o;break}for(let y=0;y<300;++y){let x=b.range(0,Math.PI*2),f=b.range(.001,10);g.createParticle(b.range(50.001,100),a,p,Math.cos(x)*f,Math.sin(x)*f,0,0,0,0)}}h.frame=function(){h.background(0),Math.random()>.95&&u(b.range(.001,t),b.range(.001,e/2)),n.render(),i.render(),s.render(),r.render(),c.render(),o.render()},h.loop()},fountain:function(){let t=h.width,e=h.height,n=new H(h,function(){this.dx+=n.acceleration[0],this.dy+=n.acceleration[1],this.x+=this.dx,this.y+=this.dy;let s=1-this.t/this.ttl;this.r=255*Math.pow(s,.2),this.g=255*s*s,this.b=255*s*s*s*s,this.a=255*Math.pow(s,.2),this.x>=t-1?(this.x=t-1,this.dx*=-1):this.x<0&&(this.x=0,this.dx*=-1),this.y>=e-2?(this.dy<.25?this.y=e-1:this.y=e-2,this.dy*=-1.2*Math.random()*n.elasticity,Math.random()<.5?this.dx-=this.dy:this.dx+=this.dy):this.y<0&&(this.y=0,this.dy*=-1*n.elasticity),this.y===e-1&&(this.active=!1)}),i=-20;h.frame=function(){h.background(0);for(let s=0;s<15;++s){let r=b.range(-.098,.098),o=b.range(i,.8*i);n.createParticle(b.range(10,30)*-o,t/2,e-20,Math.sin(r)*o,Math.cos(r)*o,0,0,0,0)}n.render()},h.loop()},lens:function(t=150,e=30){t=+t,e=+e;let n=h.width,i=h.createImage(),s=i.height;for(let d=0;d<i.length;++d)i[d]=wt(s,s/32,255,d);i.update();let r=h.createImage(t,t),o=new Array(t*t).fill(0),c=Math.round(t/2),u=c*c,a=c*(t+1),p;for(let d=0;d<u;++d){let m=d%c,w=Math.floor(d/c),M=m*m,k=w*w,S=0,A=0;if(M+k<u){let $=e/Math.sqrt(e*e-(M+k-u));S=Math.floor(m*$)-m,A=Math.floor(w*$)-w}p=A*n+S,o[a-w*t-m]=-p,o[a+w*t+m]=p,p=-A*n+S,o[a-w*t+m]=p,o[a+w*t-m]=-p}let g=n/2,y=n/2,x=1,f=2;h.frame=function(){g+=x,y+=f,g<0&&(g=0,x=-x),g>n-t&&(g=n-t,x=-x),y<0&&(y=0,f=-f),y>n-t&&(y=n-t,f=-f),h.background(i);let d=y*n+g;for(let m=0;m<t*t;++m)r[m]=i[Math.round(d)+Math.floor(m/t)*n+m%t+o[m]];r.blit(g,y)},h.loop()},life:function(t=300,e=300){h.init({background:0,frameRate:12,height:+e,width:+t});let n=h.width,i=h.height,s=.05,r=0,o=1,c=1,u=0,a=-1,p=Array.from(Array(n*i)).map(()=>Array.from(Array(2)));p.forEach(y=>{y[r]=u,y[o]=Math.random()<s?c:u});function g(y){let x=y%n,f=Math.floor(y/n),d=0;return f>0&&(x>0&&(d+=p[y-n-1][r]),x<n-1&&(d+=p[y-n+1][r]),d+=p[y-n][r]),f<i-1&&(x>0&&(d+=p[y+n-1][r]),x<n-1&&(d+=p[y+n+1][r]),d+=p[y+n][r]),x>0&&(d+=p[y-1][r]),x<n-1&&(d+=p[y+1][r]),d}h.stroke(255),h.frame=function(){h.background(0),p.forEach((y,x)=>{let f=p[x];if(y[o]===c||y[r]===c){f[r]=c;let M=x%n,k=x/n;h.point(M,k)}y[o]===a&&(f[r]=u),f[o]=u;let d=x-3*n;if(d<0)return;let m=p[d],w=g(d);w===3&&m[r]===u&&(m[o]=c),(w<2||w>3)&&m[r]===c&&(m[o]=a)})},h.loop()},pattern:function(){let t=h.createImage(),e=t.height;for(let n=0;n<t.length;++n)t[n]=wt(e,e/8,255,n);t.update(),h.background(t)},plasma:function(){h.init({background:0,height:300,width:300});let t=h.width,e=h.height,n=h.createImage(),i={},s={};function r(f){let d=1-f/255,m=255*d,w=255*d*d;return[255*d*d*d*d,w,m,255]}for(let f=0;f<256;++f)s[f]=r(f);for(let f=0;f<512;++f){let d=f*.703125*.0174532;i[f]=Math.sin(d)*1024}let o=0,c=0,u=0,a=0,p=0,g=0,y=0,x=0;h.frame=function(){x=a,y=u;for(let f=0;f<e;++f){p=o+5,g=c+3,y&=511,x&=511;for(let d=0;d<t;++d){p&=511,g&=511;let w=128+(i[p]+i[g]+i[y]+i[x]>>4);n[f*t+d]=s[w],p+=5,g+=3}x+=3,y+=1}o+=9,u+=8,n.update(),h.background(n)},h.loop()},snow:function(){let t=h.width,e=h.height,n=new H(h,function(){this.x+=this.dx,this.y+=this.dy,(this.x>=t-1||this.y>=e-1||this.y<0)&&(this.active=!1)});h.frame=function(){h.background(0),n.createParticle(0,b.range(-t/2,t-1),0,b.range(0,.25),b.range(.4,.6),255,255,255,b.range(96,255)),n.render()},h.loop()},stars:function(){let t=h.width,e=h.height,n=t/2,i=e/2,s=n*.75,r=new H(h,function(){let o=this.x-3*this.dx,c=this.y-3*this.dy;this.x+=this.dx,this.y+=this.dy,h.line(this.x,this.y,o,c),(this.x>=t-1||this.y>=e-1||this.x<0||this.y<0)&&(this.active=!1);let u=Math.hypot(this.dx,this.dy),a=Math.min(b.distance(this.x,this.y,n,i),n);this.a=128*Math.max(1-a/s,0)+64*(u/10)+64*Math.max(1-this.t++,0)});h.frame=function(){h.background(0);for(let o=0;o<20;++o){let c=(b.roll(t)+b.roll(t))/2,u=b.roll(e)+b.roll(e)/2,a=Math.min(b.distance(c,u,n,i),n),p=-Math.atan2(i-u,c-n),g=10*(a/n)+1;r.createParticle(0,c,u,Math.cos(p)*g,Math.sin(p)*g,255,255,255,0)}r.render()},h.loop()}};vt.exports=jt});var Ot=R((Vt,Et)=>{var K=Mt(),nt=J().Renderer(),it=Object.freeze({cat:{func:function(t){this.echo(K[t].toString())},man:"Print code listing for [demo]"},clear:{func:function(){this.clear()}},help:{func:function(t){t===void 0?(this.echo("Available commands:"),Object.keys(it).forEach(e=>this.echo(e))):this.echo(it[t].man)},man:"Print help text for [command].  If no command is passed, list available commands.",usage:"help [command]"},load:{func:function(t,...e){this.echo(`Loading ${t}\u2026`),t in K&&(nt.init(),K[t].apply(this,e))},man:"Load a demo.  Some demos accept additional arguments.\n<b>Example:</b>\n`load chaos 6`.",usage:"load [demo] [args]"},ls:{func:function(){this.echo("Available demos:"),Object.keys(K).forEach(t=>this.echo(t))},man:"List available demos"},properties:{func:function(t){t===void 0&&this.echo(JSON.stringify(nt,null,2)),this.echo(nt[t])}}});Et.exports=it});var ot=(I(),F(C)).default,{Executor:Dt}=V();ft();var{Renderer:Ft}=J();ot.setLogLevel("debug");var rt=new ot("index.js");window.addEventListener("load",()=>{rt.info("Creating renderer");let t=document.querySelector("canvas"),e=t.getBoundingClientRect();t.width=e.width,t.height=e.height,rt.debug(`initial canvas width (${t.width}) height (${t.height})`),Ft(t),rt.info("Creating executor");let n=document.querySelector("ng-terminal"),i=new ot("Executor.js");n.executor=Dt.bind(n)(i,Ot())});})();