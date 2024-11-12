(()=>{var rt=Object.defineProperty;var zt=Object.getOwnPropertyDescriptor;var Vt=Object.getOwnPropertyNames;var Wt=Object.prototype.hasOwnProperty;var Qt=(t,e)=>()=>(t&&(e=t(t=0)),e);var j=(t,e)=>()=>(e||t((e={exports:{}}).exports,e),e.exports),Zt=(t,e)=>{for(var i in e)rt(t,i,{get:e[i],enumerable:!0})},te=(t,e,i,s)=>{if(e&&typeof e=="object"||typeof e=="function")for(let a of Vt(e))!Wt.call(t,a)&&a!==i&&rt(t,a,{get:()=>e[a],enumerable:!(s=zt(e,a))||s.enumerable});return t};var z=t=>te(rt({},"__esModule",{value:!0}),t);var U={};Zt(U,{APITransport:()=>Mt,ConsoleTransport:()=>at,FileTransport:()=>Et,default:()=>$,interpolate:()=>At});function $(t){if(t===void 0)throw new Error("Logger requires the file name of where it's being used.");if(!new.target)return new $(...arguments);Object.defineProperties(this,{log:{value:function(e,i,s){V.indexOf(e)<=V.indexOf($.state.currentLevel)&&Object.values($.state.transports).forEach(a=>{queueMicrotask(()=>a.log({level:e,msg:i,category:t,...s}))})}}}),V.forEach(e=>{let i;e==="noop"?i=()=>{}:i=this.log.bind(this,e),Object.defineProperty(this,e,{value:i})})}function at(t){if(!new.target)return new at(...arguments);Object.defineProperty(this,"log",{value:function(e){let i=Object.assign({},t,e);if(i.isTable)console.table(i.msg,i.args);else if(i.group)console[i.group](i.msg);else{let[s,a]=i.style?.length===2?i.style:["font-weight: bold; color: green;","font-style: italic;"];console[i.level](`%c${i.timestamp||new Date().toLocaleTimeString("en-US",i.dateFmt)}%c %c[${i.category}]%c ${i.msg}`,s,"",a,"",...i.args||[])}}})}function Et(t){if(window.showSaveFilePicker===void 0){let e="FileTransport requires the File System Access API";throw console.warn(e),new Error(e)}if(!new.target)return new Et(...arguments);Object.defineProperty(this,"initialize",{value:async function(){try{let e=await window.showSaveFilePicker({types:[{description:"Log Files",accept:{"text/plain":[".log"]}}]});Object.defineProperty(this,"log",{value:async function(i){let s=Object.assign({},t,i),a;try{a=await e.createWritable({keepExistingData:!0}),await a.write(`${s.timestamp||new Date().toLocaleTimeString("en-US",s.dateFmt)} [${s.category}] ${s.level}: ${s.msg}
`)}catch(n){console.error(n)}finally{await a.close()}}})}catch(e){console.error(e)}}})}function Mt(t){if(!new.target)return new Mt(...arguments);Object.defineProperty(this,"log",{value:async function(e){let i=At(t,e);try{let s=await fetch(i.url,{method:i.method,headers:Object.entries(i.headers||{}).reduce((a,[n,o])=>(a[n]=o,a),{}),body:i.body});console.debug(s)}catch(s){console.error(s)}}})}var V,At,Y=Qt(()=>{V=["noop","error","warn","info","debug","silly"];Object.defineProperties($,{addTransport:{value:(t,e)=>{$.state.transports[t]=e}},state:{value:{currentLevel:"noop",transports:{}}},level:{get:()=>$.state.currentLevel},removeTransport:{value:t=>{delete $.state.transports[t]}},setLogLevel:{value:t=>{if(V.some(e=>e===t))$.state.currentLevel=t;else throw new Error(`${t} is not a valid logger level`)}}});$.addTransport("default",at({}));V.reduce((t,e)=>(Object.defineProperty(t,e.toUpperCase(),{enumerable:!0,get:()=>e}),t),$);At=function t(e,i){if(e instanceof Object){let s=Array.isArray(e)?[]:{};for(let a in e){let n=t(e[a],i);try{s[a]=JSON.parse(n)}catch{n!==void 0&&n!==""&&(s[a]=n)}}return s}return typeof e!="string"?e:e.replace(/\{\{(.+?)}}/g,(s,a)=>{let n=i[a]||"";return n instanceof Object?JSON.stringify(n):n})}});var Tt=j((le,Lt)=>{var ct;typeof window>"u"?ct=(Y(),z(U)):ct=(Y(),z(U)).default;var ee=new ct("getopt.js"),Ot=function(t){ee.warn(t)};function g(t,e){typeof g.place>"u"&&(g.place="",g.iplace=0);let i;if(g.optreset>0||g.iplace===g.place.length){if(g.optreset=0,g.place=t[g.optind],g.iplace=0,g.optind>=t.length||g.place.charAt(g.iplace++)!=="-")return g.place="",g.iplace=0,"";if(g.optopt=g.place.charAt(g.iplace++),g.optopt==="-"&&g.iplace===g.place.length)return++g.optind,g.getopt.place="",g.getopt.iplace=0,"";if(g.optopt===0){if(g.place="",g.iplace=0,e.indexOf("-")===-1)return"";g.optopt="-"}}else g.optopt=g.place.charAt(g.iplace++);if(g.optopt===":"||(i=e.indexOf(g.optopt))===-1)return g.iplace===g.place.length&&++g.optind,g.opterr&&e.charAt(0)!==":"&&Ot("illegal option -- "+g.optopt),"?";if(e.charAt(i+1)!==":")g.optarg=null,g.iplace===g.place.length&&++g.optind;else{if(g.iplace<g.place.length)g.optarg=g.place.substr(g.iplace);else if(t.length>++g.optind)g.optarg=t[g.optind];else return g.place="",g.iplace=0,e.charAt(0)===":"?":":g.opterr?(Ot("option requires an argument -- "+g.optopt),":"):"?";g.place="",g.iplace=0,++g.optind}return g.optopt}g.opterr=1;g.optind=0;g.optopt="";g.optreset=0;g.optarg="";Lt.exports=g});var ht=j((ue,Ct)=>{var q=Tt();function k(t,e,i){if(typeof e=="function")return function(){return e.apply(this,arguments)||k.OK};let s=this;s.echo===void 0&&(s.echo=t.info);let a=[],n=/"([^"]*)"|'([^']*)'|\S+/g,o=async function(c){t.info(`Executing: ${c}`);let d=c.match(n).map(u=>u.replace(/^['"]|['"]$/g,"")),h=d.shift(),l=e[h];if(l===void 0){if(a.includes(h))try{let u=JSON.stringify(await i(c));return t.debug(`RPC Response: ${u}`),s.echo(u),k.OK}catch(u){return s.echo(u),k.ECMDERR}return s.echo(`${h}: no such command`),k.ENOTFOUND}let{func:y,opts:f,usage:w}=l,p=f;if(w&&(p=p?`${p}h`:"h"),p!==void 0){t.debug(`Parsing options: ${p} with ${d}`);let u={},m;for(q.optreset=1,q.optind=0;(m=q(d,p))!=="";)switch(t.debug(`Opt: ${m}, optarg: ${q.optarg}, optind: ${q.optind}`),m){case"h":return s.echo(`Usage: ${w}`),k.OK;case":":return s.echo(`${q.optopt}: option needs a value`),k.EBADARGS;case"?":return s.echo(`${q.optopt}: no such option`),k.EBADARGS;default:t.debug(`Switch: ${m}, optarg: ${q.optarg}`),u[m]=q.optarg||!0}y.opts=u,t.debug(`Switches: ${JSON.stringify(u)}`)}else q.optind=0;return t.debug(`Terms: ${d}`),await y.apply(this,d.slice(q.optind))??k.OK};return i!==void 0&&queueMicrotask(async function(){let c=await i("system.describe");t.debug(`system.describe result: ${c}`),JSON.parse(c).procs.forEach(d=>a.push(d)),e.help.rpcList=a,t.debug(`RPC List: ${a}`),Object.defineProperties(o,{login:{value:async function(d,h){t.info(`Attempting to log in user ${d}`);try{let l=await i(`login ${d} ${h}`);if(l===!1)return s.echo("Login failed"),k.NOTOKEN;let y=i;return o.exit??Object.defineProperty(o,"exit",{value:async function(){t.info("Logging out"),i=y,s.authState=k.NOTOKEN,s.dispatchEvent(new CustomEvent("terminal-reset",{detail:{clear:!0}}))}}),i=new Proxy(i,{apply:function(f,w,p){return f(p[0],l)}}),k.OK}catch(l){return t.error(l),l}}}})}),o}var W=0;Object.defineProperties(k,{OK:{value:W++},ENOTFOUND:{value:W++},ECMDERR:{value:W++},EBADARGS:{value:W++},NOTOKEN:{value:W++}});function ie(t,e){let i=0;return function(s,a){try{t.info(`Executing RPC: ${s}`);let n=s.trim().split(/\s+/),o=n.shift(),c=n;a&&(c={token:a,params:c}),t.debug(`Method: ${o}, params: ${c}`);try{return e.jsonrpc({id:i++,method:o,params:c}).then(d=>{let h=JSON.parse(d);if(t.debug(`Response: ${JSON.stringify(h)}`),h.error)throw new Error(h.error.message);return h.result})}catch(d){return t.error(d),d}}catch(n){return t.error(n),n}}}Ct.exports={JSONRPCClient:ie,Executor:k}});var St=j(()=>{var{Executor:F}=ht(),dt=(Y(),z(U)).default,E=new dt("Terminal.js"),ne=100,se=1e3,lt=class extends HTMLElement{constructor(){super(),this.attachShadow({mode:"open"}),this.parentTerminal=null,this.commandHistory=[],this.historyIndex=-1;let e=localStorage.getItem("commandHistory");e&&(this.commandHistory=JSON.parse(e),E.debug(`Loading command history (${this.commandHistory.length} items)`),this.historyIndex=this.commandHistory.length),this.inputHandler=this.inputHandler.bind(this),this.reset=this.reset.bind(this),this.addEventListener("terminal-reset",this.reset);let i=function(){E.debug("DOMContentLoaded event fired"),this.reset(new CustomEvent("terminal-reset",{detail:{clear:!0}})),document.removeEventListener("DOMContentLoaded",i)}.bind(this);document.addEventListener("DOMContentLoaded",i)}connectedCallback(){E.debug("Terminal connected")}disconnectedCallback(){E.debug("Terminal disconnected"),this.inputLine.removeEventListener("keydown",this.inputHandler),this.removeEventListener("click",this.focusHandler)}reset(e){if(E.debug(`Terminal reset (${this.parentTerminal?"sub-terminal":"main terminal"})`),E.debug(`Auth state: ${this.authState}, RPC enabled: ${this.rpcEnabled}`),this.rpcEnabled&&this.authState!==F.OK)E.debug("logging in"),this.loginModal();else{let i=e.detail?.clear??!1;E.debug(`reset ${i?"and clear ":""}terminal`),this.uiModal(i)}this.focusHandler=function(){this.inputLine.focus()}.bind(this),this.addEventListener("click",this.focusHandler),this.focusHandler()}applyStyles(){let e=this.querySelector("style").cloneNode(!0);this.shadowRoot.appendChild(e)}loginModal(){this.shadowRoot.innerHTML="",this.applyStyles();let e=this.querySelector("template#login").content.cloneNode(!0);this.shadowRoot.appendChild(e),this.inputLine=this.shadowRoot.querySelector(".input-line"),this.output=this.shadowRoot.querySelector(".output"),this.echo("Please log in");let i,s,a=async n=>{if(n.key==="Enter"){n.preventDefault();let o=(this.inputLine.value??this.inputLine.textContent).trim();if(i===void 0?i=o:s=o,i&&s)try{if(this.authState=await this.executor.login(i,s),E.debug(`Login state: ${this.authState}`),this.authState===F.NOTOKEN){this.loginModal(),this.focusHandler();return}this.inputLine.removeEventListener("keydown",a),this.removeEventListener("click",this.focusHandler),this.reset(new CustomEvent("terminal-reset",{detail:{clear:!0}}))}catch(c){this.echo(c),E.error(c)}else{E.debug(`awaiting password for ${i}`);let c=document.createElement("input");c.type="password",c.classList.add("input-line"),this.inputLine.textContent=this.inputLine.value="",this.inputLine.removeEventListener("keydown",a),this.removeEventListener("click",this.focusHandler),this.inputLine.replaceWith(c),this.inputLine=this.shadowRoot.querySelector(".input-line"),this.prompt="password:",this.inputLine.addEventListener("keydown",a),this.addEventListener("click",this.focusHandler),this.focusHandler()}}};this.inputLine.addEventListener("keydown",a)}uiModal(e){let i=this.shadowRoot.querySelector(".output")?.innerHTML;this.shadowRoot.innerHTML="",this.applyStyles();let s=this.querySelector("template#ui").content.cloneNode(!0);this.shadowRoot.appendChild(s),this.inputLine=this.shadowRoot.querySelector(".input-line"),this.output=this.shadowRoot.querySelector(".output"),e&&this.greeting?(E.debug("clearing terminal"),this.echo(this.greeting)):this.output.innerHTML=i??"",this.inputLine.addEventListener("keydown",this.inputHandler),this.inputLine.focus()}get executor(){return this._executor}set executor(e){E.info("Setting executor"),this._executor=e}get greeting(){return this.getAttribute("greeting")}set greeting(e){e===void 0?this.removeAttribute("greeting"):this.setAttribute("greeting",e)}get prompt(){return this.shadowRoot.querySelector(".prompt").textContent}set prompt(e){let i=this.shadowRoot.querySelector(".prompt");i.innerHTML=`${e}&nbsp;`}get rpcEnabled(){return this.getAttribute("rpc")==="true"}inputHandler(e){switch(e.key){case"Enter":{e.preventDefault();let i=this.inputLine.textContent.trim();this.inputLine.textContent="",this.echo(`${this.prompt}${i}`),this.processCommand(i),this.historyIndex=this.commandHistory.length;break}case"ArrowUp":E.debug(`History index (back): ${this.historyIndex}`),this.historyIndex>0&&(this.historyIndex-=1,this.inputLine.textContent=this.commandHistory[this.historyIndex]);break;case"ArrowDown":E.debug(`History index (forward): ${this.historyIndex}`),this.historyIndex<this.commandHistory.length-1?(this.historyIndex+=1,this.inputLine.textContent=this.commandHistory[this.historyIndex]):(this.historyIndex=this.commandHistory.length,this.inputLine.textContent="");break}}async processCommand(e){try{let i=await this.executor(e);switch(E.debug(`Status: ${i}`),i){case F.OK:E.debug(`${e} executed successfully`),e!==this.commandHistory[this.commandHistory.length-1]&&(this.commandHistory.push(e),this.commandHistory.length>ne&&this.commandHistory.shift(),localStorage.setItem("commandHistory",JSON.stringify(this.commandHistory)));break;case F.ENOTFOUND:E.info(`${e} not found`);break;case F.ECMDERR:E.error(`Error executing ${e}`);break;case F.EBADARGS:E.warn(`${e} called with bad arguments`);break;default:E.error(`Unknown status: ${i} for ${e}`);break}}catch(i){E.error(i),this.echo(i)}}clear(){this.output.innerHTML=""}echo(e){for(e!=null&&e!==""&&(this.output.innerHTML+=`<div>${e}</div>`);this.output.children.length>se;)this.output.removeChild(this.output.firstChild);this.inputLine.getBoundingClientRect().bottom>window.innerHeight&&this.inputLine.scrollIntoView({behavior:"smooth"})}log(e){dt.level==="debug"&&(typeof e=="string"?console.info(e):console.dir(e))}startSubTerminal(e){E.info(`Starting sub-terminal: ${e.name}`),this.removeEventListener("terminal-reset",this.reset);let i=new dt(`Executor.js (${e.name})`),s=document.createElement("ng-terminal");return s.innerHTML=this.innerHTML,s.greeting=e.greeting,s.executor=F.bind(s)(i,e.registry),s.parentTerminal=this,this.replaceWith(s),s.dispatchEvent(new CustomEvent("terminal-reset",{detail:{clear:!0}})),e.prompt!==void 0&&(s.prompt=e.prompt),s}exitSubTerminal(){this.parentTerminal?(E.info("Exiting sub-terminal"),E.debug(`Parent terminal: ${JSON.stringify(this.parentTerminal)}`),this.parentTerminal.addEventListener("terminal-reset",this.parentTerminal.reset),this.replaceWith(this.parentTerminal),this.parentTerminal.dispatchEvent(new CustomEvent("terminal-reset",{detail:{clear:!1}}))):E.warn("No parent terminal found")}};customElements.define("ng-terminal",lt)});var it=j((ge,It)=>{var oe=(Y(),z(U)).default,B=new oe("Renderer.js");function ut(t,e){if(!new.target)return new ut(...arguments);let i=t.pixels.toArray(),s=i.length,a=new Proxy(t,{get:function(n,o,c){if(typeof o=="string"&&!isNaN(o)){let d=+o;if(Number.isInteger(d)&&d>=0&&d<s)return i[d]}else return Reflect.get(n,o,c)},set:function(n,o,c,d){if(typeof o=="string"&&!isNaN(o)){let h=+o;Number.isInteger(h)&&h>=0&&h<s&&(i[h]=Array.isArray(c)?e.color.apply(this,c):c)}else return Reflect.set(n,o,c,d)}});return t.loaded=!0,Object.defineProperties(a,{blit:{value:function(n,o){t.pixels.set(i),e.image(t,n,o)}},length:{value:i.length},update:{value:function(){t.pixels.set(i)}}}),a}function ft(t){if(!new.target)return new ft(...arguments);let e=0,i=[];Object.defineProperties(i,{flip:{value:function(){e^=1}},read:{get:function(){return this[e^1]}},write:{get:function(){return this[e]}}});let s=t.createImage();i.push({buffer:s,get pixels(){return s.pixels.toArray()}});let a=t.createImage();i.push({buffer:a,get pixels(){return a.pixels.toArray()}}),Object.defineProperties(this,{flip:{value:function(){let o=i.write.buffer;o.update(),t.background(o),i.flip()}},readBuffer:{get:function(){return i.read.pixels}},writeBuffer:{get:function(){return i.write.buffer}}})}function Q(t){if(Q.instance!==void 0)return Q.instance;if(!new.target)return new Q(...arguments);let e={background:4278849802,frameRate:60,height:t.height,width:t.width},i;Object.defineProperties(this,{createImage:{value:function(a,n){let o=i.createImage(a??t.width,n??t.height);return new ut(o,i)}},frame:{set:function(a){B.debug("pjs.draw set"),Object.defineProperty(i,"draw",{value:a,writable:!0})}},doubleBuffer:{value:function(){return new ft(this)}},init:{value:function(a){i!==void 0&&i.exit();let n=Object.assign({},e,a);i=new Processing(t,o=>{B.info("Processing.js created"),B.debug(`canvas width (${t.width}) height (${t.height})`),Object.defineProperties(o,{keyPressed:{value:function(){switch(o.keyCode){case o.UP:o.loop();break;case o.DOWN:o.noLoop();break;case o.LEFT:o.save("image.png");break;case o.RIGHT:o.redraw()}},writable:!0},setup:{value:function(){o.size(n.width,n.height),B.debug(`processingjs width (${o.width}) height (${o.height}) ${o.use3DContext}`),o.frameRate(n.frameRate),o.noLoop(),o.background(n.background),B.info("Processing.js setup")}}})})}},input:{set:function(a){B.debug("keyPressed set"),Object.defineProperty(i,"keyPressed",{value:a,writable:!0})}},pixelHeight:{get:function(){return 0}},pixelWidth:{get:function(){return 0}},showRuler:{set:function(){}}}),this.init();let s=new Proxy(this,{get:function(a,n){return a[n]??i[n]}});return Object.defineProperty(Q,"instance",{value:s}),s}It.exports={DoubleBuffer:ft,Image:ut,Renderer:Q}});var Pt=j((ye,Nt)=>{function G(){if(G.instance instanceof G)return G.instance;if(!new.target)return new G(...arguments);Object.defineProperty(G,"instance",{value:this});let t=Math.PI/180;Object.defineProperties(this,{cos:{value:{},enumerable:!0},sin:{value:{},enumerable:!0}});for(let e=0;e<=360;++e)Object.defineProperty(this.cos,e,{value:Math.cos(e*t)}),Object.defineProperty(this.sin,e,{value:Math.sin(e*t)})}var pt=Object.freeze({addColors:(...t)=>t.length===0?[]:t[0].map((e,i)=>t.reduce((s,a)=>s+a[i],0)),decodeColor:t=>[t>>16&255,t>>8&255,t&255,t>>>24],direction:(t,e,i,s)=>Math.atan2(s-e,i-t),distance:(t,e,i,s)=>Math.hypot(Math.abs(i-t),Math.abs(s-e)),fastInvSqrt:t=>{let i=new Float32Array([t]),s=new Float32Array([t]),a=new Int32Array(i.buffer);return a[0]=1597463007-(a[0]>>1),s[0]=i[0],s[0]=s[0]*(1.5-t*.5*s[0]*s[0]),s[0]},fastTrig:G(),invSqrt:t=>1/Math.sqrt(t),randomColor:(t=!1)=>{let e=Array.from({length:3},()=>pt.roll(255));return e.push(t?pt.roll(255):255),e},range:(t,e)=>{let i=Math.random()*(e-t);return Number.isInteger(t)&&Number.isInteger(e)&&(i=Math.floor(i)),i+t},roll:t=>Math.floor(Math.random()*t)});Nt.exports=pt});var Ht=j((xe,kt)=>{function Rt(t,e){if(!new.target)return new Rt(...arguments);let i=2,s=new a;s.next=new a,s.prev=s.next,s.prev.next=s,s.prev.prev=s,s.active=!1,s.prev.active=!1,this.ACCELERATION=[0,.25],this.ELASTICITY=.2,this.SHAPE="point",this.MAX_COUNT=3e3,Object.defineProperties(this,{count:{get:function(){return i}},createParticle:{value:function(n,o,c,d,h,l,y,f,w){if(s.prev.active){if(i>=this.MAX_COUNT)return;let p=new a(n,o,c,d,h,l,y,f,w);p.next=s,p.prev=s.prev,p.prev.next=p,s.prev=p,s=p,++i}else{let p=s.prev;p.activate(n,o,c,d,h,l,y,f,w),s=p}}},list:{get:function(){return s}},render:{value:function(){let n=s;for(;n.active;){e.call(n,this),t.stroke(n.r,n.g,n.b,n.a),t[this.SHAPE](n.x,n.y,2,2);let o=n;if(n.ttl>0&&++n.t>=n.ttl&&(n.active=!1),n=n.next,n===s)break;o.active||(o===s?s=o.next:(o.next.prev=o.prev,o.prev.next=o.next,o.next=s,o.prev=s.prev,s.prev.next=o,s.prev=o))}}}});function a(n,o,c,d,h,l,y,f,w){if(!new.target)return new a(...arguments);Object.defineProperties(this,{activate:{value:function(p,u,m,b,L,T,C,N,R){this.active=!0,this.ttl=p,this.t=0,this.x=u,this.y=m,this.dx=b,this.dy=L,this.ddx=0,this.ddy=0,this.dddx=0,this.dddy=0,this.r=T,this.g=C,this.b=N,this.a=R}}}),this.activate(n,o,c,d,h,l,y,f,w)}}kt.exports=Rt});var Dt=j((me,qt)=>{var x=Pt(),H=Ht(),r=it().Renderer();function $t(t,e,i,s){let a=s%t,n=Math.floor(s/t),o=i,c=Math.floor(a/e)%2==0,d=Math.floor(n/e)%2==0;return c!=d&&(o=0),[o,o,o,255]}var re={ants:function(){let t=r.width,e=r.height,i=200,s=1,a=new H(r,function(n){let o=n.list,c=o;for(;c.active;){if(c===this){if(c=c.next,c===o)break;continue}if(c=c.next,c===o)break}this.ddx=x.range(-1.01,1),this.ddy=x.range(-1.01,1),this.dx+=this.ddx,this.dy+=this.ddy;let d=Math.hypot(this.dx,this.dy);d>s&&(this.dx=this.dx/d*s,this.dy=this.dy/d*s);let h=this.x-3*this.dx,l=this.y-3*this.dy;this.x+=this.dx,this.y+=this.dy,r.line(this.x,this.y,h,l),this.x>=t-1?(this.x=t-1,this.dx*=-1):this.x<0&&(this.x=0,this.dx*=-1),this.y>=e-1?(this.y=e-1,this.dy*=-1):this.y<0&&(this.y=0,this.dy*=-1)});for(let n=0;n<i;++n)a.createParticle(0,x.range(1e-4,t),x.range(1e-4,e),0,0,207,16,32);r.stroke(0,0,0,255),r.frame=function(){r.background(0),a.render()},r.loop()},boids:function(){let t=r.width,e=r.height,i=t/2,s=e/2,a=200,n=3,o=5e-4,c=100,d=40,h=1,l=1.25,y=1,f=.75,w=new H(r,function(u){let m=0,b=0,L=0,T=0,C=0,N=0,R=0,J=0,S=0,A=0,I=u.list,v=I;for(;v.active;){if(v===this){if(v=v.next,v===I)break;continue}let O=Math.hypot(this.x-v.x,this.y-v.y);if(O<c&&(m+=v.dx,b+=v.dy,L+=v.x,T+=v.y,S++),O<d){let M=(d-O)/d;C+=(this.x-v.x)*M,N+=(this.y-v.y)*M,A++}if(v=v.next,v===I)break}if(S>0){m/=S,b/=S;let O=Math.hypot(m,b);O>0&&(m=m/O*o*h,b=b/O*o*h),L=(L/S-this.x)*o*l,T=(T/S-this.y)*o*l}if(A>0){C/=A,N/=A;let O=Math.hypot(C,N);O>0&&(C=C/O*o*y,N=N/O*o*y)}if(Math.random()>f){let O=Math.atan2(this.dy,this.dx)+x.range(-.1,.1),M=Math.hypot(this.dx,this.dy);R=M*Math.cos(O)-this.dx,J=M*Math.sin(O)-this.dy}this.ddx=m+L+C+R,this.ddy=b+T+N+J,this.dx+=this.ddx,this.dy+=this.ddy;let D=Math.hypot(this.dx,this.dy);D>n&&(this.dx=this.dx/D*n,this.dy=this.dy/D*n);let _=this.x-3*this.dx,X=this.y-3*this.dy;this.x+=this.dx,this.y+=this.dy,r.line(this.x,this.y,_,X),this.x>=t-1?(this.x=t-1,this.dx*=-1):this.x<0&&(this.x=0,this.dx*=-1),this.y>=e-1?(this.y=e-1,this.dy*=-1):this.y<0&&(this.y=0,this.dy*=-1)}),p=x.range(0,2*Math.PI);for(let u=0;u<a;++u){let m=x.range(.001,1)*n,b=x.range(-.1,.1);w.createParticle(0,x.range(i-10.01,i+10),x.range(s-10.01,s+10),m*Math.cos(b+p),m*Math.sin(b+p),...x.randomColor())}r.stroke(0,0,0,255),r.frame=function(){r.background(0),w.render()},r.loop()},bz:function(){let t=r.width,e=Array.from({length:8},()=>Math.random()*t),i=Array.from({length:8},()=>Math.random()*t),s=Array.from({length:8},()=>Math.random()*15);r.background(255),r.noFill(),r.frame=function(){r.stroke(0,0,0,20),e.map(function(a,n,o){let c=a+s[n];c<0?(c=0,s[n]*=-1):c>t&&(c=t,s[n]*=-1),o[n]=c}),r.bezier.apply(null,e),r.stroke(255,128,128,20),i.map(function(a,n,o){let c=a+s[n];c<0?(c=0,s[n]*=-1):c>t&&(c=t,s[n]*=-1),o[n]=c}),r.bezier.apply(null,i)},r.loop()},cell:function(t=30,e=!1,i=200,s=200){r.init({background:0,frameRate:400,height:+s,width:+i});let a=r.width,n=r.height,o=1,c=0,d=new Array(a*n).fill(c),h=(f=>{let w=f.toString(2).padStart(8,"0"),p=[];for(let u=0;u<8;++u)+w[7-u]&&p.push(u);return(u,m)=>{let b=(m-1)*a+u,L=parseInt([d[b-1],d[b],d[b+1]].join(""),2);return p.some(T=>L===T)?o:c}})(+t);if(r.stroke(255),e&&e!=="false")for(let f=0;f<a;++f)d[f]=Math.random()>.5?o:c,r.point(f,0);else d[a/2]=o,r.point(a/2,0);let l=0,y=d.length/a;r.frame=function(){for(let f=0;f<a;++f){let w=h(f,l);w&&(d[l*a+f]=w,r.point(f,l))}l!==y&&l++},r.loop()},chaos:function(t="3"){r.init({frameRate:400});let e=r.width,i=r.height,s=e/2,a=i/2,n=s-50,o=Math.PI/180,c={3:[{x:e/2,y:50},{x:50,y:i-50},{x:e-50,y:i-50}],5:[{x:e-50,y:50},{x:50,y:50},{x:50,y:i-50},{x:e-50,y:i-50},{x:s,y:a}],6:[{x:Math.cos(0)*n+s,y:Math.sin(0)*n+a},{x:Math.cos(60*o)*n+s,y:Math.sin(60*o)*n+a},{x:Math.cos(120*o)*n+s,y:Math.sin(120*o)*n+a},{x:Math.cos(180*o)*n+s,y:Math.sin(180*o)*n+a},{x:Math.cos(240*o)*n+s,y:Math.sin(240*o)*n+a},{x:Math.cos(300*o)*n+s,y:Math.sin(300*o)*n+a}]}[t],d={3:2,5:1.5,6:1.5}[t];r.background(0),r.stroke(255,255,255,255);for(let{x:y,y:f}of c)r.point(y,f);let h=Math.random()*e,l=Math.random()*i;r.frame=function(){let y=x.roll(c.length);h+=(c[y].x-h)/d,l+=(c[y].y-l)/d,r.point(h,l)},r.loop()},fire:function(){r.init({background:0,frameRate:60,height:300,width:300});let t=r.width,e=r.doubleBuffer(),i=e.writeBuffer;for(let n=0;n<i.length;++n)i[n]=[0,0,0,255];e.flip(),i=e.writeBuffer;for(let n=0;n<i.length;++n)i[n]=[0,0,0,255];e.flip();let s=e.readBuffer.length/t,a=r.color(255,128,96);r.frame=function(){let n=e.readBuffer,o=e.writeBuffer;for(let c=t;c<o.length-t;++c){if(c%t<1||c%t>=t-1)continue;let d=c/t;if(Math.random()<Math.pow(Math.E,Math.pow(d/s,4))-1&&Math.random()>.975){o[c]=a;continue}o[c]=x.addColors(x.decodeColor(n[c-1]),x.decodeColor(n[c]),x.decodeColor(n[c+1]),x.decodeColor(n[c+t])).map((h,l)=>{if(l===3)return 255;let y=h/4.25;return y<10?0:y})}e.flip()},r.loop()},fireworks:function(){let t=r.width,e=r.height,i=new H(r,function(){this.dx+=i.ACCELERATION[0],this.dy+=i.ACCELERATION[1],this.x+=this.dx,this.y+=this.dy;let h=1-this.t/this.ttl;this.r=255*Math.pow(h,.2),this.g=255*h*h,this.b=255*h*h*h*h,this.a=255*h}),s=new H(r,function(){this.dx+=s.ACCELERATION[0],this.dy+=s.ACCELERATION[1],this.x+=this.dx,this.y+=this.dy;let h=1-this.t/this.ttl;this.b=255*Math.pow(h,.2),this.g=255*h*h,this.r=255*h*h*h*h,this.a=255*h}),a=new H(r,function(){this.dx+=a.ACCELERATION[0],this.dy+=a.ACCELERATION[1],this.x+=this.dx,this.y+=this.dy;let h=1-this.t/this.ttl;this.g=255*Math.pow(h,.2),this.r=255*h*h,this.b=255*h*h*h*h,this.a=255*h}),n=new H(r,function(){this.dx+=n.ACCELERATION[0],this.dy+=n.ACCELERATION[1],this.x+=this.dx,this.y+=this.dy;let h=1-this.t/this.ttl;this.r=255*Math.pow(h,.2),this.g=255*Math.pow(h,.2),this.b=255*h*h*h*h,this.a=255*h}),o=new H(r,function(){this.dx+=o.ACCELERATION[0],this.dy+=o.ACCELERATION[1],this.x+=this.dx,this.y+=this.dy;let h=1-this.t/this.ttl;this.r=255*Math.pow(h,.2),this.b=255*h*h*h*h,this.g=255*h,this.a=255*h}),c=new H(r,function(){this.dx+=c.ACCELERATION[0],this.dy+=c.ACCELERATION[1],this.x+=this.dx,this.y+=this.dy;let h=1-this.t/this.ttl;this.r=255*Math.pow(h,.2),this.b=255*Math.pow(h,.2),this.g=255*h*h*h*h,this.a=255*h});i.ACCELERATION=[0,.15],s.ACCELERATION=[0,.15],a.ACCELERATION=[0,.15],n.ACCELERATION=[0,.15],o.ACCELERATION=[0,.15],c.ACCELERATION=[0,.15];function d(h,l){let y;switch(x.range(0,5)){case 0:y=i;break;case 1:y=s;break;case 2:y=a;break;case 3:y=n;break;case 4:y=c;break;case 5:y=o;break}for(let f=0;f<300;++f){let w=x.range(0,Math.PI*2),p=x.range(.001,10);y.createParticle(x.range(50.001,100),h,l,Math.cos(w)*p,Math.sin(w)*p,0,0,0,0)}}r.frame=function(){r.background(0),Math.random()>.95&&d(x.range(.001,t),x.range(.001,e/2)),i.render(),s.render(),a.render(),n.render(),c.render(),o.render()},r.loop()},fountain:function(){let t=r.width,e=r.height,i=new H(r,function(){this.dx+=i.ACCELERATION[0],this.dy+=i.ACCELERATION[1],this.x+=this.dx,this.y+=this.dy;let n=1-this.t/this.ttl;this.r=255*Math.pow(n,.2),this.g=255*n*n,this.b=255*n*n*n*n,this.a=255*Math.pow(n,.2),this.x>=t-1?(this.x=t-1,this.dx*=-1):this.x<0&&(this.x=0,this.dx*=-1),this.y>=e-2?(this.dy<.25?this.y=e-1:this.y=e-2,this.dy*=-1.2*Math.random()*i.ELASTICITY,Math.random()<.5?this.dx-=this.dy:this.dx+=this.dy):this.y<0&&(this.y=0,this.dy*=-1*i.ELASTICITY),this.y===e-1&&(this.active=!1)}),s=-20.01,a=[255,255,255,255];r.frame=function(){r.background(0);for(let n=0;n<15;++n){let o=x.range(-.098,.098),c=x.range(s,.8*s);i.createParticle(x.range(10,30.01)*-c,t/2,e-20,Math.sin(o)*c,Math.cos(o)*c,...a)}i.render()},r.loop()},graviton:function(){let t=r.width,e=r.height,i=t/2,s=e/2,a=100,n=10,o=new H(r,function(c){let d=0,h=0,l=c.list,y=l;for(;y.active;){if(y===this){if(y=y.next,y===l)break;continue}if(d+=y.x,h+=y.y,y=y.next,y===l)break}d=(d/o.count-this.x)*1e-4,h=(h/o.count-this.y)*1e-4,this.ddx=d,this.ddy=h,this.dx+=this.ddx,this.dy+=this.ddy;let f=Math.hypot(this.dx,this.dy);f>n&&(this.dx=this.dx/f*n,this.dy=this.dy/f*n),this.x+=this.dx,this.y+=this.dy,this.x>=t-1?(this.x=t-1,this.dx*=-1):this.x<0&&(this.x=0,this.dx*=-1),this.y>=e-1?(this.y=e-1,this.dy*=-1):this.y<0&&(this.y=0,this.dy*=-1)});for(let c=0;c<a;++c)o.createParticle(0,x.roll(t),x.roll(e),x.range(-5.01,5),x.range(-5.01,5),255,255,196);r.stroke(0,0,0,255),r.frame=function(){r.background(0),o.render()},r.loop()},lens:function(t=150,e=30){t=+t,e=+e;let i=r.width,s=r.createImage(),a=s.height;for(let u=0;u<s.length;++u)s[u]=$t(a,a/32,255,u);s.update();let n=r.createImage(t,t),o=new Array(t*t).fill(0),c=Math.round(t/2),d=c*c,h=c*(t+1),l;for(let u=0;u<d;++u){let m=u%c,b=Math.floor(u/c),L=m*m,T=b*b,C=0,N=0;if(L+T<d){let R=e/Math.sqrt(e*e-(L+T-d));C=Math.floor(m*R)-m,N=Math.floor(b*R)-b}l=N*i+C,o[h-b*t-m]=-l,o[h+b*t+m]=l,l=-N*i+C,o[h-b*t+m]=l,o[h+b*t-m]=-l}let y=i/2,f=i/2,w=1,p=2;r.frame=function(){y+=w,f+=p,y<0&&(y=0,w=-w),y>i-t&&(y=i-t,w=-w),f<0&&(f=0,p=-p),f>i-t&&(f=i-t,p=-p),r.background(s);let u=f*i+y;for(let m=0;m<t*t;++m)n[m]=s[Math.round(u)+Math.floor(m/t)*i+m%t+o[m]];n.blit(y,f)},r.loop()},life:function(t=300,e=300){r.init({background:0,frameRate:12,height:+e,width:+t});let i=r.width,s=r.height,a=.05,n=0,o=1,c=1,d=0,h=-1,l=Array.from(Array(i*s)).map(()=>Array.from(Array(2)));l.forEach(f=>{f[n]=d,f[o]=Math.random()<a?c:d});function y(f){let w=f%i,p=Math.floor(f/i),u=0;return p>0&&(w>0&&(u+=l[f-i-1][n]),w<i-1&&(u+=l[f-i+1][n]),u+=l[f-i][n]),p<s-1&&(w>0&&(u+=l[f+i-1][n]),w<i-1&&(u+=l[f+i+1][n]),u+=l[f+i][n]),w>0&&(u+=l[f-1][n]),w<i-1&&(u+=l[f+1][n]),u}r.stroke(255),r.frame=function(){r.background(0),l.forEach((f,w)=>{let p=l[w];if(f[o]===c||f[n]===c){p[n]=c;let L=w%i,T=w/i;r.point(L,T)}f[o]===h&&(p[n]=d),p[o]=d;let u=w-3*i;if(u<0)return;let m=l[u],b=y(u);b===3&&m[n]===d&&(m[o]=c),(b<2||b>3)&&m[n]===c&&(m[o]=h)})},r.loop()},pattern:function(){let t=r.createImage(),e=t.height;for(let i=0;i<t.length;++i)t[i]=$t(e,e/8,255,i);t.update(),r.background(t)},plasma:function(){r.init({background:0,height:300,width:300});let t=r.width,e=r.height,i=r.createImage(),s={},a={};function n(p){let u=1-p/255,m=255*u,b=255*u*u;return[255*u*u*u*u,b,m,255]}for(let p=0;p<256;++p)a[p]=n(p);for(let p=0;p<512;++p){let u=p*.703125*.0174532;s[p]=Math.sin(u)*1024}let o=0,c=0,d=0,h=0,l=0,y=0,f=0,w=0;r.frame=function(){f=d,w=h;for(let p=0;p<e;++p){l=o+5,y=c+3,f&=511,w&=511;for(let u=0;u<t;++u){l&=511,y&=511;let b=128+(s[l]+s[y]+s[f]+s[w]>>4);i[p*t+u]=a[b],l+=5,y+=3}f+=1,w+=3}o+=9,d+=8,i.update(),r.background(i)},r.loop()},rod:function(){let t=r.width,e=r.height,i=t/2,s=e/2,a=t/2+x.range(-100,100.01),n=t/2+x.range(-100,100.01),o=x.roll(-3.01,3),c=x.roll(-3.01,3),d,h,l=20,y=12,f=5,w=200,p=3,u=5e-4,m=100,b=40,L=.75,T=.5,C=3,N=.66,R=new H(r,function(S){let A={x:0,y:0},I={x:0,y:0},v={x:0,y:0},D={x:0,y:0},_=0,X=0,O=S.list,M=O;for(;M.active;){if(M===this){if(M=M.next,M===O)break;continue}let P=Math.hypot(this.x-M.x,this.y-M.y);if(P<m&&(A.x+=M.dx,A.y+=M.dy,I.x+=M.x,I.y+=M.y,_++),P<b){let K=(b-P)/b;v.x+=(this.x-M.x)*K,v.y+=(this.y-M.y)*K,X++}if(M=M.next,M===O)break}if(d+=this.x,h+=this.y,_>0){A.x/=_,A.y/=_;let P=Math.hypot(A.x,A.y);P>0&&(A.x=A.x/P*u*L,A.y=A.y/P*u*L),I.x=(I.x/_-this.x)*u*T,I.y=(I.y/_-this.y)*u*T}if(X>0){v.x/=X,v.y/=X;let P=Math.hypot(v.x,v.y);P>0&&(v.x=v.x/P*u*C,v.y=v.y/P*u*C)}if(Math.random()>N){let P=Math.atan2(this.dy,this.dx)+x.range(-.1,.1),K=Math.hypot(this.dx,this.dy);D.x=K*Math.cos(P)-this.dx,D.y=K*Math.sin(P)-this.dy}this.ddx=A.x+I.x+v.x+D.x+(a-this.x)*1e-4,this.ddy=A.y+I.y+v.y+D.y+(n-this.y)*1e-4,x.distance(this.x,this.y,a,n)<50&&(this.ddx+=(a-this.x)*.01,this.ddy+=(n-this.y)*.01),this.dx+=this.ddx,this.dy+=this.ddy;let st=Math.hypot(this.dx,this.dy);st>p&&(this.dx=this.dx/st*p,this.dy=this.dy/st*p),this.x+=this.dx,this.y+=this.dy;let wt=x.direction(this.x,this.y,this.x-this.dx,this.y-this.dy),bt=this.x+y*Math.cos(wt),vt=this.y+y*Math.sin(wt),Z=this.x-bt,tt=this.y-vt,ot=Math.hypot(Z,tt),et=ot+Math.PI/f*r.frameCount,Ft=-tt/ot,Xt=Z/ot,Ut=3*Math.cos(et+Math.PI/2)+this.x-.33*Z,Yt=3*Math.sin(et+Math.PI/2)+this.y-.33*tt,Bt=2*Math.cos(et)+this.x-.66*Z,Gt=2*Math.sin(et)+this.y-.66*tt,Jt=bt+Ft*Math.sin(Math.PI/f*r.frameCount)*3,Kt=vt+Xt*Math.sin(Math.PI/f*r.frameCount)*3;r.bezier(this.x,this.y,Ut,Yt,Bt,Gt,Jt,Kt),this.x>=t-1?(this.x=t-1,this.dx*=-1):this.x<0&&(this.x=0,this.dx*=-1),this.y>=e-1?(this.y=e-1,this.dy*=-1):this.y<0&&(this.y=0,this.dy*=-1)});R.SHAPE="ellipse";let J=x.range(0,2*Math.PI);for(let S=0;S<w;++S){let A=x.range(.001,1)*p,I=x.range(-.1,.1);R.createParticle(0,x.range(i-10.01,i+10),x.range(s-10.01,s+10),A*Math.cos(I+J),A*Math.sin(I+J),255,255,255,255)}r.frame=function(){d=0,h=0,r.background(0),r.fill(0,0,0,0),r.stroke(255,255,255,255),R.render(),d/=R.count,h/=R.count,o+=-(d-a)*1e-4+(i-a)*1e-4,c+=-(h-n)*1e-4+(s-n)*1e-4;let S=Math.hypot(o,c);S>p*1.4&&(o=o/S*p*1.4,c=c/S*p*1.4),a+=o,n+=c,a<0&&(a=0,o=-o),a>t-l&&(a=t-l,o=-o),n<0&&(n=0,c=-c),n>e-l&&(n=e-l,c=-c),r.stroke(196,128,196),r.fill(255,128,164,128),r.ellipse(a,n,l,l)},r.loop()},snow:function(){let t=r.width,e=r.height,i=new H(r,function(){this.x+=this.dx,this.y+=this.dy,(this.x>=t-1||this.y>=e-1||this.y<0)&&(this.active=!1)});r.frame=function(){r.background(0),i.createParticle(0,x.range(-t/2,t-1),0,x.range(0,.25),x.range(.4,.6),255,255,255,x.range(96,255)),i.render()},r.loop()},stars:function(){let t=r.width,e=r.height,i=t/2,s=e/2,a=i*.75,n=new H(r,function(){let o=this.x-3*this.dx,c=this.y-3*this.dy;this.x+=this.dx,this.y+=this.dy,r.line(this.x,this.y,o,c),(this.x>=t-1||this.y>=e-1||this.x<0||this.y<0)&&(this.active=!1);let d=Math.hypot(this.dx,this.dy),h=Math.min(x.distance(this.x,this.y,i,s),i);this.a=128*Math.max(1-h/a,0)+64*(d/10)+64*Math.max(1-this.t++,0)});r.frame=function(){r.background(0);for(let o=0;o<20;++o){let c=(x.roll(t)+x.roll(t))/2,d=x.roll(e)+x.roll(e)/2,h=Math.min(x.distance(c,d,i,s),i),l=-Math.atan2(s-d,c-i),y=10*(h/i)+1;n.createParticle(0,c,d,Math.cos(l)*y,Math.sin(l)*y,255,255,255,0)}n.render()},r.loop()}};qt.exports=re});var jt=j((we,_t)=>{var nt=Dt(),gt=it().Renderer(),yt=Object.freeze({cat:{func:function(t){this.echo(nt[t].toString())},man:"Print code listing for [demo]"},clear:{func:function(){this.clear()}},help:{func:function(t){t===void 0?(this.echo("Available commands:"),Object.keys(yt).forEach(e=>this.echo(e))):this.echo(yt[t].man)},man:"Print help text for [command].  If no command is passed, list available commands.",usage:"help [command]"},load:{func:function(t,...e){this.echo(`Loading ${t}\u2026`),t in nt&&(gt.init(),nt[t].apply(this,e))},man:"Load a demo.  Some demos accept additional arguments.\n<b>Example:</b>\n`load chaos 6`.",usage:"load [demo] [args]"},ls:{func:function(){this.echo("Available demos:"),Object.keys(nt).forEach(t=>this.echo(t))},man:"List available demos"},properties:{func:function(t){t===void 0&&this.echo(JSON.stringify(gt,null,2)),this.echo(gt[t])}}});_t.exports=yt});var mt=(Y(),z(U)).default,{Executor:ae}=ht();St();var{Renderer:ce}=it();mt.setLogLevel("debug");var xt=new mt("index.js");window.addEventListener("load",()=>{xt.info("Creating renderer");let t=document.querySelector("canvas"),e=t.getBoundingClientRect();t.width=e.width,t.height=e.height,xt.debug(`initial canvas width (${t.width}) height (${t.height})`),ce(t),xt.info("Creating executor");let i=document.querySelector("ng-terminal"),s=new mt("Executor.js");i.executor=ae.bind(i)(s,jt())});})();
