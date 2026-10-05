var zt=Object.defineProperty;var Dt=Object.getOwnPropertyDescriptor;var u=(i,e,t,r)=>{for(var s=r>1?void 0:r?Dt(e,t):e,o=i.length-1,n;o>=0;o--)(n=i[o])&&(s=(r?n(e,t,s):n(s))||s);return r&&s&&zt(e,t,s),s};var I=globalThis,j=I.ShadowRoot&&(I.ShadyCSS===void 0||I.ShadyCSS.nativeShadow)&&"adoptedStyleSheets"in Document.prototype&&"replace"in CSSStyleSheet.prototype,F=Symbol(),it=new WeakMap,k=class{constructor(e,t,r){if(this._$cssResult$=!0,r!==F)throw Error("CSSResult is not constructable. Use `unsafeCSS` or `css` instead.");this.cssText=e,this.t=t}get styleSheet(){let e=this.o,t=this.t;if(j&&e===void 0){let r=t!==void 0&&t.length===1;r&&(e=it.get(t)),e===void 0&&((this.o=e=new CSSStyleSheet).replaceSync(this.cssText),r&&it.set(t,e))}return e}toString(){return this.cssText}},ot=i=>new k(typeof i=="string"?i:i+"",void 0,F),B=(i,...e)=>{let t=i.length===1?i[0]:e.reduce((r,s,o)=>r+(n=>{if(n._$cssResult$===!0)return n.cssText;if(typeof n=="number")return n;throw Error("Value passed to 'css' function must be a 'css' function result: "+n+". Use 'unsafeCSS' to pass non-literal values, but take care to ensure page security.")})(s)+i[o+1],i[0]);return new k(t,i,F)},nt=(i,e)=>{if(j)i.adoptedStyleSheets=e.map(t=>t instanceof CSSStyleSheet?t:t.styleSheet);else for(let t of e){let r=document.createElement("style"),s=I.litNonce;s!==void 0&&r.setAttribute("nonce",s),r.textContent=t.cssText,i.appendChild(r)}},W=j?i=>i:i=>i instanceof CSSStyleSheet?(e=>{let t="";for(let r of e.cssRules)t+=r.cssText;return ot(t)})(i):i;var{is:qt,defineProperty:Vt,getOwnPropertyDescriptor:Ft,getOwnPropertyNames:Bt,getOwnPropertySymbols:Wt,getPrototypeOf:Kt}=Object,z=globalThis,at=z.trustedTypes,Jt=at?at.emptyScript:"",Zt=z.reactiveElementPolyfillSupport,M=(i,e)=>i,R={toAttribute(i,e){switch(e){case Boolean:i=i?Jt:null;break;case Object:case Array:i=i==null?i:JSON.stringify(i)}return i},fromAttribute(i,e){let t=i;switch(e){case Boolean:t=i!==null;break;case Number:t=i===null?null:Number(i);break;case Object:case Array:try{t=JSON.parse(i)}catch{t=null}}return t}},D=(i,e)=>!qt(i,e),lt={attribute:!0,type:String,converter:R,reflect:!1,useDefault:!1,hasChanged:D};Symbol.metadata??=Symbol("metadata"),z.litPropertyMetadata??=new WeakMap;var b=class extends HTMLElement{static addInitializer(e){this._$Ei(),(this.l??=[]).push(e)}static get observedAttributes(){return this.finalize(),this._$Eh&&[...this._$Eh.keys()]}static createProperty(e,t=lt){if(t.state&&(t.attribute=!1),this._$Ei(),this.prototype.hasOwnProperty(e)&&((t=Object.create(t)).wrapped=!0),this.elementProperties.set(e,t),!t.noAccessor){let r=Symbol(),s=this.getPropertyDescriptor(e,r,t);s!==void 0&&Vt(this.prototype,e,s)}}static getPropertyDescriptor(e,t,r){let{get:s,set:o}=Ft(this.prototype,e)??{get(){return this[t]},set(n){this[t]=n}};return{get:s,set(n){let l=s?.call(this);o?.call(this,n),this.requestUpdate(e,l,r)},configurable:!0,enumerable:!0}}static getPropertyOptions(e){return this.elementProperties.get(e)??lt}static _$Ei(){if(this.hasOwnProperty(M("elementProperties")))return;let e=Kt(this);e.finalize(),e.l!==void 0&&(this.l=[...e.l]),this.elementProperties=new Map(e.elementProperties)}static finalize(){if(this.hasOwnProperty(M("finalized")))return;if(this.finalized=!0,this._$Ei(),this.hasOwnProperty(M("properties"))){let t=this.properties,r=[...Bt(t),...Wt(t)];for(let s of r)this.createProperty(s,t[s])}let e=this[Symbol.metadata];if(e!==null){let t=litPropertyMetadata.get(e);if(t!==void 0)for(let[r,s]of t)this.elementProperties.set(r,s)}this._$Eh=new Map;for(let[t,r]of this.elementProperties){let s=this._$Eu(t,r);s!==void 0&&this._$Eh.set(s,t)}this.elementStyles=this.finalizeStyles(this.styles)}static finalizeStyles(e){let t=[];if(Array.isArray(e)){let r=new Set(e.flat(1/0).reverse());for(let s of r)t.unshift(W(s))}else e!==void 0&&t.push(W(e));return t}static _$Eu(e,t){let r=t.attribute;return r===!1?void 0:typeof r=="string"?r:typeof e=="string"?e.toLowerCase():void 0}constructor(){super(),this._$Ep=void 0,this.isUpdatePending=!1,this.hasUpdated=!1,this._$Em=null,this._$Ev()}_$Ev(){this._$ES=new Promise(e=>this.enableUpdating=e),this._$AL=new Map,this._$E_(),this.requestUpdate(),this.constructor.l?.forEach(e=>e(this))}addController(e){(this._$EO??=new Set).add(e),this.renderRoot!==void 0&&this.isConnected&&e.hostConnected?.()}removeController(e){this._$EO?.delete(e)}_$E_(){let e=new Map,t=this.constructor.elementProperties;for(let r of t.keys())this.hasOwnProperty(r)&&(e.set(r,this[r]),delete this[r]);e.size>0&&(this._$Ep=e)}createRenderRoot(){let e=this.shadowRoot??this.attachShadow(this.constructor.shadowRootOptions);return nt(e,this.constructor.elementStyles),e}connectedCallback(){this.renderRoot??=this.createRenderRoot(),this.enableUpdating(!0),this._$EO?.forEach(e=>e.hostConnected?.())}enableUpdating(e){}disconnectedCallback(){this._$EO?.forEach(e=>e.hostDisconnected?.())}attributeChangedCallback(e,t,r){this._$AK(e,r)}_$ET(e,t){let r=this.constructor.elementProperties.get(e),s=this.constructor._$Eu(e,r);if(s!==void 0&&r.reflect===!0){let o=(r.converter?.toAttribute!==void 0?r.converter:R).toAttribute(t,r.type);this._$Em=e,o==null?this.removeAttribute(s):this.setAttribute(s,o),this._$Em=null}}_$AK(e,t){let r=this.constructor,s=r._$Eh.get(e);if(s!==void 0&&this._$Em!==s){let o=r.getPropertyOptions(s),n=typeof o.converter=="function"?{fromAttribute:o.converter}:o.converter?.fromAttribute!==void 0?o.converter:R;this._$Em=s;let l=n.fromAttribute(t,o.type);this[s]=l??this._$Ej?.get(s)??l,this._$Em=null}}requestUpdate(e,t,r,s=!1,o){if(e!==void 0){let n=this.constructor;if(s===!1&&(o=this[e]),r??=n.getPropertyOptions(e),!((r.hasChanged??D)(o,t)||r.useDefault&&r.reflect&&o===this._$Ej?.get(e)&&!this.hasAttribute(n._$Eu(e,r))))return;this.C(e,t,r)}this.isUpdatePending===!1&&(this._$ES=this._$EP())}C(e,t,{useDefault:r,reflect:s,wrapped:o},n){r&&!(this._$Ej??=new Map).has(e)&&(this._$Ej.set(e,n??t??this[e]),o!==!0||n!==void 0)||(this._$AL.has(e)||(this.hasUpdated||r||(t=void 0),this._$AL.set(e,t)),s===!0&&this._$Em!==e&&(this._$Eq??=new Set).add(e))}async _$EP(){this.isUpdatePending=!0;try{await this._$ES}catch(t){Promise.reject(t)}let e=this.scheduleUpdate();return e!=null&&await e,!this.isUpdatePending}scheduleUpdate(){return this.performUpdate()}performUpdate(){if(!this.isUpdatePending)return;if(!this.hasUpdated){if(this.renderRoot??=this.createRenderRoot(),this._$Ep){for(let[s,o]of this._$Ep)this[s]=o;this._$Ep=void 0}let r=this.constructor.elementProperties;if(r.size>0)for(let[s,o]of r){let{wrapped:n}=o,l=this[s];n!==!0||this._$AL.has(s)||l===void 0||this.C(s,void 0,o,l)}}let e=!1,t=this._$AL;try{e=this.shouldUpdate(t),e?(this.willUpdate(t),this._$EO?.forEach(r=>r.hostUpdate?.()),this.update(t)):this._$EM()}catch(r){throw e=!1,this._$EM(),r}e&&this._$AE(t)}willUpdate(e){}_$AE(e){this._$EO?.forEach(t=>t.hostUpdated?.()),this.hasUpdated||(this.hasUpdated=!0,this.firstUpdated(e)),this.updated(e)}_$EM(){this._$AL=new Map,this.isUpdatePending=!1}get updateComplete(){return this.getUpdateComplete()}getUpdateComplete(){return this._$ES}shouldUpdate(e){return!0}update(e){this._$Eq&&=this._$Eq.forEach(t=>this._$ET(t,this[t])),this._$EM()}updated(e){}firstUpdated(e){}};b.elementStyles=[],b.shadowRootOptions={mode:"open"},b[M("elementProperties")]=new Map,b[M("finalized")]=new Map,Zt?.({ReactiveElement:b}),(z.reactiveElementVersions??=[]).push("2.1.2");var tt=globalThis,dt=i=>i,q=tt.trustedTypes,ct=q?q.createPolicy("lit-html",{createHTML:i=>i}):void 0,gt="$lit$",$=`lit$${Math.random().toFixed(9).slice(2)}$`,vt="?"+$,Qt=`<${vt}>`,A=document,G=()=>A.createComment(""),H=i=>i===null||typeof i!="object"&&typeof i!="function",et=Array.isArray,Xt=i=>et(i)||typeof i?.[Symbol.iterator]=="function",K=`[ 	
\f\r]`,C=/<(?:(!--|\/[^a-zA-Z])|(\/?[a-zA-Z][^>\s]*)|(\/?$))/g,pt=/-->/g,ut=/>/g,w=RegExp(`>|${K}(?:([^\\s"'>=/]+)(${K}*=${K}*(?:[^ 	
\f\r"'\`<>=]|("|')|))|$)`,"g"),ht=/'/g,mt=/"/g,ft=/^(?:script|style|textarea|title)$/i,rt=i=>(e,...t)=>({_$litType$:i,strings:e,values:t}),d=rt(1),de=rt(2),ce=rt(3),P=Symbol.for("lit-noChange"),_=Symbol.for("lit-nothing"),_t=new WeakMap,S=A.createTreeWalker(A,129);function bt(i,e){if(!et(i)||!i.hasOwnProperty("raw"))throw Error("invalid template strings array");return ct!==void 0?ct.createHTML(e):e}var Yt=(i,e)=>{let t=i.length-1,r=[],s,o=e===2?"<svg>":e===3?"<math>":"",n=C;for(let l=0;l<t;l++){let a=i[l],m,g,p=-1,f=0;for(;f<a.length&&(n.lastIndex=f,g=n.exec(a),g!==null);)f=n.lastIndex,n===C?g[1]==="!--"?n=pt:g[1]!==void 0?n=ut:g[2]!==void 0?(ft.test(g[2])&&(s=RegExp("</"+g[2],"g")),n=w):g[3]!==void 0&&(n=w):n===w?g[0]===">"?(n=s??C,p=-1):g[1]===void 0?p=-2:(p=n.lastIndex-g[2].length,m=g[1],n=g[3]===void 0?w:g[3]==='"'?mt:ht):n===mt||n===ht?n=w:n===pt||n===ut?n=C:(n=w,s=void 0);let y=n===w&&i[l+1].startsWith("/>")?" ":"";o+=n===C?a+Qt:p>=0?(r.push(m),a.slice(0,p)+gt+a.slice(p)+$+y):a+$+(p===-2?l:y)}return[bt(i,o+(i[t]||"<?>")+(e===2?"</svg>":e===3?"</math>":"")),r]},L=class i{constructor({strings:e,_$litType$:t},r){let s;this.parts=[];let o=0,n=0,l=e.length-1,a=this.parts,[m,g]=Yt(e,t);if(this.el=i.createElement(m,r),S.currentNode=this.el.content,t===2||t===3){let p=this.el.content.firstChild;p.replaceWith(...p.childNodes)}for(;(s=S.nextNode())!==null&&a.length<l;){if(s.nodeType===1){if(s.hasAttributes())for(let p of s.getAttributeNames())if(p.endsWith(gt)){let f=g[n++],y=s.getAttribute(p).split($),U=/([.?@])?(.*)/.exec(f);a.push({type:1,index:o,name:U[2],strings:y,ctor:U[1]==="."?Z:U[1]==="?"?Q:U[1]==="@"?X:T}),s.removeAttribute(p)}else p.startsWith($)&&(a.push({type:6,index:o}),s.removeAttribute(p));if(ft.test(s.tagName)){let p=s.textContent.split($),f=p.length-1;if(f>0){s.textContent=q?q.emptyScript:"";for(let y=0;y<f;y++)s.append(p[y],G()),S.nextNode(),a.push({type:2,index:++o});s.append(p[f],G())}}}else if(s.nodeType===8)if(s.data===vt)a.push({type:2,index:o});else{let p=-1;for(;(p=s.data.indexOf($,p+1))!==-1;)a.push({type:7,index:o}),p+=$.length-1}o++}}static createElement(e,t){let r=A.createElement("template");return r.innerHTML=e,r}};function E(i,e,t=i,r){if(e===P)return e;let s=r!==void 0?t._$Co?.[r]:t._$Cl,o=H(e)?void 0:e._$litDirective$;return s?.constructor!==o&&(s?._$AO?.(!1),o===void 0?s=void 0:(s=new o(i),s._$AT(i,t,r)),r!==void 0?(t._$Co??=[])[r]=s:t._$Cl=s),s!==void 0&&(e=E(i,s._$AS(i,e.values),s,r)),e}var J=class{constructor(e,t){this._$AV=[],this._$AN=void 0,this._$AD=e,this._$AM=t}get parentNode(){return this._$AM.parentNode}get _$AU(){return this._$AM._$AU}u(e){let{el:{content:t},parts:r}=this._$AD,s=(e?.creationScope??A).importNode(t,!0);S.currentNode=s;let o=S.nextNode(),n=0,l=0,a=r[0];for(;a!==void 0;){if(n===a.index){let m;a.type===2?m=new N(o,o.nextSibling,this,e):a.type===1?m=new a.ctor(o,a.name,a.strings,this,e):a.type===6&&(m=new Y(o,this,e)),this._$AV.push(m),a=r[++l]}n!==a?.index&&(o=S.nextNode(),n++)}return S.currentNode=A,s}p(e){let t=0;for(let r of this._$AV)r!==void 0&&(r.strings!==void 0?(r._$AI(e,r,t),t+=r.strings.length-2):r._$AI(e[t])),t++}},N=class i{get _$AU(){return this._$AM?._$AU??this._$Cv}constructor(e,t,r,s){this.type=2,this._$AH=_,this._$AN=void 0,this._$AA=e,this._$AB=t,this._$AM=r,this.options=s,this._$Cv=s?.isConnected??!0}get parentNode(){let e=this._$AA.parentNode,t=this._$AM;return t!==void 0&&e?.nodeType===11&&(e=t.parentNode),e}get startNode(){return this._$AA}get endNode(){return this._$AB}_$AI(e,t=this){e=E(this,e,t),H(e)?e===_||e==null||e===""?(this._$AH!==_&&this._$AR(),this._$AH=_):e!==this._$AH&&e!==P&&this._(e):e._$litType$!==void 0?this.$(e):e.nodeType!==void 0?this.T(e):Xt(e)?this.k(e):this._(e)}O(e){return this._$AA.parentNode.insertBefore(e,this._$AB)}T(e){this._$AH!==e&&(this._$AR(),this._$AH=this.O(e))}_(e){this._$AH!==_&&H(this._$AH)?this._$AA.nextSibling.data=e:this.T(A.createTextNode(e)),this._$AH=e}$(e){let{values:t,_$litType$:r}=e,s=typeof r=="number"?this._$AC(e):(r.el===void 0&&(r.el=L.createElement(bt(r.h,r.h[0]),this.options)),r);if(this._$AH?._$AD===s)this._$AH.p(t);else{let o=new J(s,this),n=o.u(this.options);o.p(t),this.T(n),this._$AH=o}}_$AC(e){let t=_t.get(e.strings);return t===void 0&&_t.set(e.strings,t=new L(e)),t}k(e){et(this._$AH)||(this._$AH=[],this._$AR());let t=this._$AH,r,s=0;for(let o of e)s===t.length?t.push(r=new i(this.O(G()),this.O(G()),this,this.options)):r=t[s],r._$AI(o),s++;s<t.length&&(this._$AR(r&&r._$AB.nextSibling,s),t.length=s)}_$AR(e=this._$AA.nextSibling,t){for(this._$AP?.(!1,!0,t);e!==this._$AB;){let r=dt(e).nextSibling;dt(e).remove(),e=r}}setConnected(e){this._$AM===void 0&&(this._$Cv=e,this._$AP?.(e))}},T=class{get tagName(){return this.element.tagName}get _$AU(){return this._$AM._$AU}constructor(e,t,r,s,o){this.type=1,this._$AH=_,this._$AN=void 0,this.element=e,this.name=t,this._$AM=s,this.options=o,r.length>2||r[0]!==""||r[1]!==""?(this._$AH=Array(r.length-1).fill(new String),this.strings=r):this._$AH=_}_$AI(e,t=this,r,s){let o=this.strings,n=!1;if(o===void 0)e=E(this,e,t,0),n=!H(e)||e!==this._$AH&&e!==P,n&&(this._$AH=e);else{let l=e,a,m;for(e=o[0],a=0;a<o.length-1;a++)m=E(this,l[r+a],t,a),m===P&&(m=this._$AH[a]),n||=!H(m)||m!==this._$AH[a],m===_?e=_:e!==_&&(e+=(m??"")+o[a+1]),this._$AH[a]=m}n&&!s&&this.j(e)}j(e){e===_?this.element.removeAttribute(this.name):this.element.setAttribute(this.name,e??"")}},Z=class extends T{constructor(){super(...arguments),this.type=3}j(e){this.element[this.name]=e===_?void 0:e}},Q=class extends T{constructor(){super(...arguments),this.type=4}j(e){this.element.toggleAttribute(this.name,!!e&&e!==_)}},X=class extends T{constructor(e,t,r,s,o){super(e,t,r,s,o),this.type=5}_$AI(e,t=this){if((e=E(this,e,t,0)??_)===P)return;let r=this._$AH,s=e===_&&r!==_||e.capture!==r.capture||e.once!==r.once||e.passive!==r.passive,o=e!==_&&(r===_||s);s&&this.element.removeEventListener(this.name,this,r),o&&this.element.addEventListener(this.name,this,e),this._$AH=e}handleEvent(e){typeof this._$AH=="function"?this._$AH.call(this.options?.host??this.element,e):this._$AH.handleEvent(e)}},Y=class{constructor(e,t,r){this.element=e,this.type=6,this._$AN=void 0,this._$AM=t,this.options=r}get _$AU(){return this._$AM._$AU}_$AI(e){E(this,e)}};var te=tt.litHtmlPolyfillSupport;te?.(L,N),(tt.litHtmlVersions??=[]).push("3.3.3");var yt=(i,e,t)=>{let r=t?.renderBefore??e,s=r._$litPart$;if(s===void 0){let o=t?.renderBefore??null;r._$litPart$=s=new N(e.insertBefore(G(),o),o,void 0,t??{})}return s._$AI(i),s};var st=globalThis,x=class extends b{constructor(){super(...arguments),this.renderOptions={host:this},this._$Do=void 0}createRenderRoot(){let e=super.createRenderRoot();return this.renderOptions.renderBefore??=e.firstChild,e}update(e){let t=this.render();this.hasUpdated||(this.renderOptions.isConnected=this.isConnected),super.update(e),this._$Do=yt(t,this.renderRoot,this.renderOptions)}connectedCallback(){super.connectedCallback(),this._$Do?.setConnected(!0)}disconnectedCallback(){super.disconnectedCallback(),this._$Do?.setConnected(!1)}render(){return P}};x._$litElement$=!0,x.finalized=!0,st.litElementHydrateSupport?.({LitElement:x});var ee=st.litElementPolyfillSupport;ee?.({LitElement:x});(st.litElementVersions??=[]).push("4.2.2");var $t=i=>(e,t)=>{t!==void 0?t.addInitializer(()=>{customElements.define(i,e)}):customElements.define(i,e)};var re={attribute:!0,type:String,converter:R,reflect:!1,hasChanged:D},se=(i=re,e,t)=>{let{kind:r,metadata:s}=t,o=globalThis.litPropertyMetadata.get(s);if(o===void 0&&globalThis.litPropertyMetadata.set(s,o=new Map),r==="setter"&&((i=Object.create(i)).wrapped=!0),o.set(t.name,i),r==="accessor"){let{name:n}=t;return{set(l){let a=e.get.call(this);e.set.call(this,l),this.requestUpdate(n,a,i,!0,l)},init(l){return l!==void 0&&this.C(n,void 0,i,l),l}}}if(r==="setter"){let{name:n}=t;return function(l){let a=this[n];e.call(this,l),this.requestUpdate(n,a,i,!0,l)}}throw Error("Unsupported decorator location: "+r)};function xt(i){return(e,t)=>typeof t=="object"?se(i,e,t):((r,s,o)=>{let n=s.hasOwnProperty(o);return s.constructor.createProperty(o,r),n?Object.getOwnPropertyDescriptor(s,o):void 0})(i,e,t)}function h(i){return xt({...i,state:!0,attribute:!1})}var wt="reef_dose";async function O(i,e,t){let r=new Promise((o,n)=>{setTimeout(()=>n(new Error(`reef_dose.${e} did not respond within 10s - is reef-dose-ha updated and reloaded?`)),1e4)});return(await Promise.race([i.connection.sendMessagePromise({type:"call_service",domain:wt,service:e,service_data:t,return_response:!0}),r])).response}async function v(i,e,t){await i.callService(wt,e,t)}function St(i,e){return O(i,"get_schedule",{pump_id:e})}function At(i,e){return O(i,"get_reservoir",{pump_id:e})}function Pt(i,e,t){return v(i,"refill_reservoir",{pump_id:e,full_ml:t})}async function Et(i,e){return(await O(i,"start_calibration",{pump_id:e})).sessionId}function Tt(i,e,t,r){return v(i,"apply_calibration",{pump_id:e,session_id:t,measured_ml:r})}function kt(i,e,t){return v(i,"update_schedule",{pump_id:e,slots:t})}function Mt(i,e,t){return v(i,"auto_divide_schedule",{pump_id:e,daily_total_ml:t})}async function Rt(i){return(await O(i,"get_groups",{})).groups}function Ct(i,e,t,r){return v(i,"create_group",{group_id:e,name:t,pump_ids:r})}function Gt(i,e,t){let r={group_id:e};return t.name!==void 0&&(r.name=t.name),t.pumpIds!==void 0&&(r.pump_ids=t.pumpIds),t.scalePercent!==void 0&&(r.scale_percent=t.scalePercent),v(i,"update_group",r)}function Ht(i,e){return v(i,"delete_group",{group_id:e})}function Lt(i,e){return O(i,"get_group_schedule",{group_id:e})}function Nt(i,e,t){return v(i,"update_group_schedule",{group_id:e,slots:t})}function Ot(i,e,t){return v(i,"auto_divide_group_schedule",{group_id:e,daily_total_ml:t})}function Ut(i,e,t){return v(i,"apply_group_adjustment",{group_id:e,delta_percent:t})}var It=Array.from({length:24},(i,e)=>String(e).padStart(2,"0"));var jt=["1","2","3","4","5","6"],c=class extends x{constructor(){super(...arguments);this._tab="dashboard";this._reservoirs={};this._reservoirErrors={};this._reservoirsLoading=!1;this._activeTarget=null;this._scheduleSlots=null;this._scheduleLoading=!1;this._editingHour=null;this._editValue="";this._groups=[];this._groupsLoading=!1;this._showNewGroupForm=!1;this._newGroupId="";this._newGroupName="";this._newGroupPumpIds=new Set;this._editingGroupId=null;this._editGroupPumpIds=new Set;this._prompt=null;this._confirm=null;this._error=null}setConfig(t){if(!t.pump_ids||!Array.isArray(t.pump_ids)||t.pump_ids.length===0)throw new Error("reef-dose-card: config.pump_ids must be a non-empty array of pump ids, e.g. ['1', '4']");this._config=t,this._activeTarget||(this._activeTarget={kind:"pump",id:t.pump_ids[0]})}set hass(t){let r=!this._hass;this._hass=t,r&&(this._loadDashboard(),this._loadActiveSchedule(),this._loadGroups())}getCardSize(){return 8}render(){return this._config?d`
      <ha-card header=${this._config.title??"Reef Dose"}>
        <div style="padding: 0 16px 16px">
          ${this._error?d`<div class="error">${this._error}</div>`:""}
          <div class="tabs">
            <div class="tab ${this._tab==="dashboard"?"active":""}" @click=${()=>this._switchTab("dashboard")}>
              Dashboard
            </div>
            <div class="tab ${this._tab==="schedule"?"active":""}" @click=${()=>this._switchTab("schedule")}>
              Schedule
            </div>
            <div class="tab ${this._tab==="groups"?"active":""}" @click=${()=>this._switchTab("groups")}>
              Groups
            </div>
          </div>
          ${this._tab==="dashboard"?this._renderDashboard():this._tab==="schedule"?this._renderSchedule():this._renderGroups()}
        </div>
      </ha-card>
      ${this._renderPrompt()}
      ${this._renderConfirm()}
    `:d``}_openPrompt(t){let{initialValue:r,...s}=t;this._prompt={...s,value:String(r)}}_renderPrompt(){if(!this._prompt)return d``;let t=this._prompt;return d`
      <div class="modal-overlay" @click=${r=>r.target===r.currentTarget&&this._cancelPrompt()}>
        <div class="modal">
          <h3>${t.title}</h3>
          <div class="field">
            <input
              type="number"
              min=${t.min}
              max=${t.max}
              step=${t.step}
              .value=${t.value}
              @input=${r=>this._prompt={...t,value:r.target.value}}
            />
            <span>${t.unit}</span>
          </div>
          <div class="actions">
            <button @click=${()=>this._savePrompt()}>${t.saveLabel??"Save"}</button>
            <button class="secondary" @click=${()=>this._cancelPrompt()}>Cancel</button>
          </div>
        </div>
      </div>
    `}async _savePrompt(){if(!this._prompt)return;let{value:t,min:r,max:s,onSave:o}=this._prompt,n=Number(t);if(!Number.isFinite(n)||n<r||n>s){this._error=`Value must be between ${r} and ${s}.`;return}this._error=null,this._prompt=null,await o(n)}_cancelPrompt(){this._prompt=null}_renderConfirm(){if(!this._confirm)return d``;let t=this._confirm;return d`
      <div class="modal-overlay" @click=${r=>r.target===r.currentTarget&&this._cancelConfirm()}>
        <div class="modal">
          <h3>${t.title}</h3>
          <p>${t.message}</p>
          <div class="actions">
            <button ?disabled=${t.busy} @click=${()=>this._confirmConfirm()}>
              ${t.busy?"Starting\u2026":t.confirmLabel}
            </button>
            <button class="secondary" ?disabled=${t.busy} @click=${()=>this._cancelConfirm()}>Cancel</button>
          </div>
        </div>
      </div>
    `}async _confirmConfirm(){!this._confirm||this._confirm.busy||(this._confirm={...this._confirm,busy:!0},await this._confirm.onConfirm())}_cancelConfirm(){this._confirm=null}_openCalibratePrompt(t){this._confirm={title:`Calibrate Pump ${t}`,message:"This briefly runs the pump so you can measure how much it actually dispenses.",confirmLabel:"Start Calibration",busy:!1,onConfirm:async()=>{try{let r=await Et(this._hass,t);this._confirm=null,this._openMeasurePrompt(t,r)}catch(r){this._confirm=null,this._error=this._errorMessage(r)}}}}_openMeasurePrompt(t,r){this._openPrompt({title:`Calibrate Pump ${t} - measured volume (mL)`,initialValue:0,min:.01,max:2e3,step:.01,unit:"mL",saveLabel:"Apply",onSave:async s=>{try{await Tt(this._hass,t,r,s),await this._loadDashboard()}catch(o){this._error=this._errorMessage(o)}}})}_renderSchedule(){let t=this._config.pump_ids.map(o=>({kind:"pump",id:o})),r=(this._config.group_ids??[]).map(o=>({kind:"group",id:o})),s=[...t,...r];return d`
      ${s.length>1?d`
            <div class="pump-select">
              ${s.map(o=>d`
                  <div
                    class="pump-chip ${this._isActiveTarget(o)?"active":""}"
                    @click=${()=>this._selectTarget(o)}
                  >
                    ${o.kind==="pump"?`Pump ${o.id}`:this._groupLabel(o.id)}
                  </div>
                `)}
            </div>
          `:""}
      ${this._scheduleLoading?d`<div>Loading…</div>`:this._scheduleSlots?this._renderScheduleRows(this._scheduleSlots):d`<div>No schedule loaded.</div>`}
    `}_isActiveTarget(t){return this._activeTarget?.kind===t.kind&&this._activeTarget.id===t.id}_groupLabel(t){return this._groups.find(r=>r.id===t)?.name??t}_renderScheduleRows(t){let r=Object.values(t).reduce((s,o)=>s+o,0);return d`
      <div class="auto-divide">
        <button @click=${()=>this._openAutoDividePrompt(r)}>Auto-Divide Schedule</button>
        <span class="group-meta">Current total: ${r.toFixed(2)}mL/day</span>
      </div>
      ${It.map(s=>{let o=t[s]??0,n=this._editingHour===s;return d`
          <div class="row">
            <span class="hour">${s}:00</span>
            ${n?d`
                  <input
                    type="number"
                    min="0"
                    max="50"
                    step="0.01"
                    .value=${this._editValue}
                    @input=${l=>this._editValue=l.target.value}
                  />
                  <div class="actions">
                    <button @click=${()=>this._saveSlot(s)}>Save</button>
                    <button class="secondary" @click=${()=>this._editingHour=null}>Cancel</button>
                  </div>
                `:d`
                  <span class="ml">${o.toFixed(2)}mL</span>
                  <button class="secondary" @click=${()=>this._startEditSlot(s,o)}>Edit</button>
                `}
          </div>
        `})}
    `}_selectTarget(t){this._activeTarget=t,this._editingHour=null,this._loadActiveSchedule()}_switchTab(t){this._tab=t,t==="dashboard"?this._loadDashboard():t==="schedule"?this._loadActiveSchedule():this._loadGroups()}async _loadDashboard(){if(!this._hass||!this._config)return;this._reservoirsLoading=!0,this._error=null;let t={};try{let r=await Promise.all(this._config.pump_ids.map(async s=>{try{return[s,await At(this._hass,s)]}catch(o){return t[s]=this._errorMessage(o),[s,null]}}));this._reservoirs=Object.fromEntries(r),this._reservoirErrors=t}catch(r){this._error=this._errorMessage(r)}finally{this._reservoirsLoading=!1}}_renderDashboard(){return this._reservoirsLoading&&Object.keys(this._reservoirs).length===0?d`<div>Loading…</div>`:d`${this._config.pump_ids.map(t=>this._renderDashboardRow(t))}`}_renderDashboardRow(t){let r=this._reservoirs[t];if(!r){let l=this._reservoirErrors[t]??"No reservoir data - no product assigned yet, or device offline.";return d`
        <div class="dash-row">
          <div class="dash-name">Pump ${t}</div>
          <div class="dash-meta dash-empty">${l}</div>
        </div>
      `}let s=r.dosedTodayMl??0,o=r.dailyScheduledMl>0?Math.min(100,Math.max(0,s/r.dailyScheduledMl*100)):0,n=r.fullMl>0?Math.min(100,Math.max(0,r.remainingMl/r.fullMl*100)):0;return d`
      <div class="dash-row">
        <div class="dash-name">Pump ${t}</div>
        <div class="dash-meta">
          <div class="dash-bar-wrap">
            <div class="dash-bar"><div class="dash-bar-fill" style="width: ${o}%"></div></div>
            <div class="dash-bar-label">
              ${s.toFixed(2)} / ${r.dailyScheduledMl.toFixed(2)} mL today
            </div>
            <div class="dash-reservoir-label">
              ${r.remainingMl.toFixed(1)} / ${r.fullMl.toFixed(1)} mL remaining
            </div>
          </div>
          <div class="dash-days">
            <div class="dash-days-ring" style="--dash-pct: ${n}">
              <div class="dash-days-circle">${r.daysRemaining??"\u2013"}</div>
            </div>
            <div class="dash-days-label">Days Left</div>
          </div>
          <button class="secondary" @click=${()=>this._openRefillPrompt(t,r.fullMl)}>Refill</button>
          <button class="secondary" @click=${()=>this._openCalibratePrompt(t)}>Calibrate</button>
        </div>
      </div>
    `}_openRefillPrompt(t,r){this._openPrompt({title:`Refill Pump ${t} (new full volume, mL)`,initialValue:r,min:0,max:2e4,step:1,unit:"mL",onSave:async s=>{try{await Pt(this._hass,t,s),await this._loadDashboard()}catch(o){this._error=this._errorMessage(o)}}})}async _loadActiveSchedule(){if(!(!this._hass||!this._activeTarget)){this._scheduleLoading=!0,this._error=null;try{this._scheduleSlots=this._activeTarget.kind==="pump"?(await St(this._hass,this._activeTarget.id)).slots:(await Lt(this._hass,this._activeTarget.id)).slots}catch(t){this._error=this._errorMessage(t)}finally{this._scheduleLoading=!1}}}_startEditSlot(t,r){this._editingHour=t,this._editValue=r.toFixed(2)}async _saveSlot(t){let r=Number(this._editValue);if(!Number.isFinite(r)||r<0||r>50){this._error="Slot value must be between 0 and 50ml.";return}this._error=null;try{let s=this._activeTarget;s.kind==="pump"?await kt(this._hass,s.id,{[t]:r}):await Nt(this._hass,s.id,{[t]:r}),this._editingHour=null,await this._loadActiveSchedule()}catch(s){this._error=this._errorMessage(s)}}_openAutoDividePrompt(t){let r=this._activeTarget,s=r.kind==="pump"?`Pump ${r.id}`:this._groupLabel(r.id);this._openPrompt({title:`Auto-Divide ${s} (mL/day)`,initialValue:t,min:0,max:1200,step:.01,unit:"mL/day",onSave:async o=>{try{r.kind==="pump"?await Mt(this._hass,r.id,o):await Ot(this._hass,r.id,o),await this._loadActiveSchedule()}catch(n){this._error=this._errorMessage(n)}}})}_renderGroups(){return d`
      ${this._groupsLoading?d`<div>Loading…</div>`:this._groups.map(t=>this._renderGroup(t))}
      ${this._showNewGroupForm?this._renderNewGroupForm():d`<button @click=${()=>this._showNewGroupForm=!0}>+ New Group</button>`}
    `}_renderGroup(t){let r=this._editingGroupId===t.id;return d`
      <div class="group-card">
        <div class="group-header">
          <strong>${t.name}</strong>
        </div>
        <div class="group-meta">id: ${t.id} · members: ${t.pumpIds.map(s=>`Pump ${s}`).join(", ")||"none"}</div>
        ${r?d`
              <div class="checkbox-list">
                ${jt.map(s=>d`
                    <label>
                      <input
                        type="checkbox"
                        .checked=${this._editGroupPumpIds.has(s)}
                        @change=${o=>this._toggleEditPump(s,o.target.checked)}
                      />
                      Pump ${s}
                    </label>
                  `)}
              </div>
              <div class="actions">
                <button @click=${()=>this._saveGroupMembership(t.id)}>Save</button>
                <button class="secondary" @click=${()=>this._editingGroupId=null}>Cancel</button>
              </div>
            `:d`
              <div class="actions">
                <button class="secondary" @click=${()=>this._startEditGroup(t)}>Edit Membership</button>
                <button @click=${()=>this._openAdjustmentPrompt(t)}>Manual Overall Adjustment</button>
                <button class="danger" @click=${()=>this._confirmRemoveGroup(t)}>Delete</button>
              </div>
            `}
      </div>
    `}_renderNewGroupForm(){return d`
      <div class="group-card">
        <input
          type="text"
          placeholder="group-id"
          .value=${this._newGroupId}
          @input=${t=>this._newGroupId=t.target.value}
        />
        <input
          type="text"
          placeholder="Display name"
          .value=${this._newGroupName}
          @input=${t=>this._newGroupName=t.target.value}
        />
        <div class="checkbox-list">
          ${jt.map(t=>d`
              <label>
                <input
                  type="checkbox"
                  .checked=${this._newGroupPumpIds.has(t)}
                  @change=${r=>this._toggleNewPump(t,r.target.checked)}
                />
                Pump ${t}
              </label>
            `)}
        </div>
        <div class="actions">
          <button @click=${()=>this._createGroup()}>Create</button>
          <button class="secondary" @click=${()=>this._showNewGroupForm=!1}>Cancel</button>
        </div>
      </div>
    `}_toggleNewPump(t,r){let s=new Set(this._newGroupPumpIds);r?s.add(t):s.delete(t),this._newGroupPumpIds=s}_toggleEditPump(t,r){let s=new Set(this._editGroupPumpIds);r?s.add(t):s.delete(t),this._editGroupPumpIds=s}_startEditGroup(t){this._editingGroupId=t.id,this._editGroupPumpIds=new Set(t.pumpIds)}_openAdjustmentPrompt(t){this._openPrompt({title:`Manual Overall Adjustment \u2014 ${t.name} (%)`,initialValue:0,min:-100,max:1e3,step:1,unit:"%",onSave:async r=>{try{await Ut(this._hass,t.id,r),await this._loadGroups()}catch(s){this._error=this._errorMessage(s)}}})}async _loadGroups(){if(this._hass){this._groupsLoading=!0,this._error=null;try{this._groups=await Rt(this._hass)}catch(t){this._error=this._errorMessage(t)}finally{this._groupsLoading=!1}}}async _createGroup(){if(!this._newGroupId||!this._newGroupName){this._error="Group id and name are both required.";return}this._error=null;try{await Ct(this._hass,this._newGroupId,this._newGroupName,[...this._newGroupPumpIds]),this._showNewGroupForm=!1,this._newGroupId="",this._newGroupName="",this._newGroupPumpIds=new Set,await this._loadGroups()}catch(t){this._error=this._errorMessage(t)}}async _saveGroupMembership(t){this._error=null;try{await Gt(this._hass,t,{pumpIds:[...this._editGroupPumpIds]}),this._editingGroupId=null,await this._loadGroups()}catch(r){this._error=this._errorMessage(r)}}_confirmRemoveGroup(t){let r=t.pumpIds.map(s=>`Pump ${s}`).join(", ")||"no members";window.confirm(`Delete group "${t.name}"? Members (${r}) keep dosing whatever they're currently set to, but will no longer be kept in sync with each other.`)&&this._removeGroup(t.id)}async _removeGroup(t){this._error=null;try{await Ht(this._hass,t),await this._loadGroups()}catch(r){this._error=this._errorMessage(r)}}_errorMessage(t){return t instanceof Error||t&&typeof t=="object"&&"message"in t&&typeof t.message=="string"?t.message:String(t)}};c.styles=B`
    :host {
      display: block;
    }
    ha-card {
      padding: 16px;
    }
    .tabs {
      display: flex;
      gap: 8px;
      margin-bottom: 12px;
      border-bottom: 1px solid var(--divider-color, #333);
    }
    .tab {
      padding: 8px 12px;
      cursor: pointer;
      border-bottom: 2px solid transparent;
      font-weight: 500;
      color: var(--secondary-text-color);
    }
    .tab.active {
      color: var(--primary-color);
      border-bottom-color: var(--primary-color);
    }
    .pump-select {
      display: flex;
      gap: 6px;
      flex-wrap: wrap;
      margin-bottom: 12px;
    }
    .pump-chip {
      padding: 4px 10px;
      border-radius: 12px;
      border: 1px solid var(--divider-color, #555);
      cursor: pointer;
      font-size: 0.85em;
    }
    .pump-chip.active {
      background: var(--primary-color);
      color: var(--text-primary-color, #fff);
      border-color: var(--primary-color);
    }
    .error {
      background: var(--error-color, #b00020);
      color: white;
      padding: 8px 12px;
      border-radius: 4px;
      margin-bottom: 12px;
      font-size: 0.9em;
    }
    .dash-row {
      padding: 12px 0;
      border-bottom: 1px solid var(--divider-color, #2a2a2a);
    }
    .dash-row:last-child {
      border-bottom: none;
    }
    .dash-name {
      font-weight: 500;
      margin-bottom: 8px;
    }
    .dash-meta {
      display: flex;
      align-items: center;
      gap: 16px;
    }
    .dash-empty {
      color: var(--secondary-text-color);
      font-size: 0.85em;
    }
    .dash-bar-wrap {
      flex: 1;
      min-width: 0;
    }
    .dash-bar {
      height: 6px;
      border-radius: 3px;
      background: var(--divider-color, #333);
      overflow: hidden;
    }
    .dash-bar-fill {
      height: 100%;
      background: var(--primary-color);
      border-radius: 3px;
    }
    .dash-bar-label {
      margin-top: 4px;
      font-size: 0.8em;
      color: var(--secondary-text-color);
      font-variant-numeric: tabular-nums;
    }
    .dash-reservoir-label {
      margin-top: 2px;
      font-size: 0.75em;
      color: var(--secondary-text-color);
      font-variant-numeric: tabular-nums;
    }
    .dash-days {
      flex-shrink: 0;
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 2px;
    }
    .dash-days-ring {
      width: 44px;
      height: 44px;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      /* --dash-pct is the reservoir's remaining/full percentage (same
         ratio as the bar above) - filled portion of the ring, not a
         days-remaining percentage, since there's no fixed "100%
         days" to measure against. */
      background: conic-gradient(
        var(--primary-color) calc(var(--dash-pct, 0) * 1%),
        var(--divider-color, #333) 0
      );
    }
    .dash-days-circle {
      width: 36px;
      height: 36px;
      border-radius: 50%;
      background: var(--card-background-color, #1c1c1c);
      display: flex;
      align-items: center;
      justify-content: center;
      font-weight: 600;
      font-variant-numeric: tabular-nums;
      font-size: 0.85em;
    }
    .dash-days-label {
      font-size: 0.7em;
      color: var(--secondary-text-color);
      text-align: center;
    }
    .row {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 4px 0;
      border-bottom: 1px solid var(--divider-color, #2a2a2a);
    }
    .row .hour {
      width: 48px;
      font-variant-numeric: tabular-nums;
    }
    .row .ml {
      flex: 1;
      text-align: right;
      margin-right: 8px;
    }
    input[type="number"],
    input[type="text"] {
      background: var(--card-background-color, #1c1c1c);
      color: var(--primary-text-color);
      border: 1px solid var(--divider-color, #555);
      border-radius: 4px;
      padding: 4px 6px;
      width: 80px;
    }
    .auto-divide {
      display: flex;
      align-items: center;
      gap: 8px;
      margin-bottom: 12px;
      padding-bottom: 12px;
      border-bottom: 1px solid var(--divider-color, #2a2a2a);
    }
    button {
      background: var(--primary-color);
      color: var(--text-primary-color, #fff);
      border: none;
      border-radius: 4px;
      padding: 6px 12px;
      cursor: pointer;
      font-size: 0.85em;
    }
    button.secondary {
      background: transparent;
      color: var(--primary-text-color);
      border: 1px solid var(--divider-color, #555);
    }
    button.danger {
      background: var(--error-color, #b00020);
    }
    .group-card {
      border: 1px solid var(--divider-color, #2a2a2a);
      border-radius: 8px;
      padding: 12px;
      margin-bottom: 12px;
    }
    .group-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
    }
    .group-meta {
      color: var(--secondary-text-color);
      font-size: 0.85em;
    }
    .checkbox-list {
      display: flex;
      flex-wrap: wrap;
      gap: 10px;
      margin: 8px 0;
    }
    .checkbox-list label {
      display: flex;
      align-items: center;
      gap: 4px;
      font-size: 0.9em;
    }
    .actions {
      display: flex;
      gap: 8px;
      margin-top: 8px;
    }
    .modal-overlay {
      position: fixed;
      inset: 0;
      background: rgba(0, 0, 0, 0.5);
      display: flex;
      align-items: center;
      justify-content: center;
      z-index: 1000;
    }
    .modal {
      background: var(--card-background-color, #1c1c1c);
      color: var(--primary-text-color);
      border-radius: 8px;
      padding: 20px;
      min-width: 260px;
      box-shadow: 0 4px 20px rgba(0, 0, 0, 0.4);
    }
    .modal h3 {
      margin: 0 0 12px;
    }
    .modal .field {
      display: flex;
      align-items: center;
      gap: 8px;
      margin-bottom: 16px;
    }
    .modal input[type="number"] {
      width: 120px;
    }
  `,u([h()],c.prototype,"_tab",2),u([h()],c.prototype,"_reservoirs",2),u([h()],c.prototype,"_reservoirErrors",2),u([h()],c.prototype,"_reservoirsLoading",2),u([h()],c.prototype,"_activeTarget",2),u([h()],c.prototype,"_scheduleSlots",2),u([h()],c.prototype,"_scheduleLoading",2),u([h()],c.prototype,"_editingHour",2),u([h()],c.prototype,"_editValue",2),u([h()],c.prototype,"_groups",2),u([h()],c.prototype,"_groupsLoading",2),u([h()],c.prototype,"_showNewGroupForm",2),u([h()],c.prototype,"_newGroupId",2),u([h()],c.prototype,"_newGroupName",2),u([h()],c.prototype,"_newGroupPumpIds",2),u([h()],c.prototype,"_editingGroupId",2),u([h()],c.prototype,"_editGroupPumpIds",2),u([h()],c.prototype,"_prompt",2),u([h()],c.prototype,"_confirm",2),u([h()],c.prototype,"_error",2),c=u([$t("reef-dose-card")],c);window.customCards=[...window.customCards??[],{type:"reef-dose-card",name:"Reef Dose Card",description:"Per-slot schedule editor and scaling-group management for reef-dose."}];export{c as ReefDoseCard};
/*! Bundled license information:

@lit/reactive-element/css-tag.js:
  (**
   * @license
   * Copyright 2019 Google LLC
   * SPDX-License-Identifier: BSD-3-Clause
   *)

@lit/reactive-element/reactive-element.js:
  (**
   * @license
   * Copyright 2017 Google LLC
   * SPDX-License-Identifier: BSD-3-Clause
   *)

lit-html/lit-html.js:
  (**
   * @license
   * Copyright 2017 Google LLC
   * SPDX-License-Identifier: BSD-3-Clause
   *)

lit-element/lit-element.js:
  (**
   * @license
   * Copyright 2017 Google LLC
   * SPDX-License-Identifier: BSD-3-Clause
   *)

lit-html/is-server.js:
  (**
   * @license
   * Copyright 2022 Google LLC
   * SPDX-License-Identifier: BSD-3-Clause
   *)

@lit/reactive-element/decorators/custom-element.js:
  (**
   * @license
   * Copyright 2017 Google LLC
   * SPDX-License-Identifier: BSD-3-Clause
   *)

@lit/reactive-element/decorators/property.js:
  (**
   * @license
   * Copyright 2017 Google LLC
   * SPDX-License-Identifier: BSD-3-Clause
   *)

@lit/reactive-element/decorators/state.js:
  (**
   * @license
   * Copyright 2017 Google LLC
   * SPDX-License-Identifier: BSD-3-Clause
   *)

@lit/reactive-element/decorators/event-options.js:
  (**
   * @license
   * Copyright 2017 Google LLC
   * SPDX-License-Identifier: BSD-3-Clause
   *)

@lit/reactive-element/decorators/base.js:
  (**
   * @license
   * Copyright 2017 Google LLC
   * SPDX-License-Identifier: BSD-3-Clause
   *)

@lit/reactive-element/decorators/query.js:
  (**
   * @license
   * Copyright 2017 Google LLC
   * SPDX-License-Identifier: BSD-3-Clause
   *)

@lit/reactive-element/decorators/query-all.js:
  (**
   * @license
   * Copyright 2017 Google LLC
   * SPDX-License-Identifier: BSD-3-Clause
   *)

@lit/reactive-element/decorators/query-async.js:
  (**
   * @license
   * Copyright 2017 Google LLC
   * SPDX-License-Identifier: BSD-3-Clause
   *)

@lit/reactive-element/decorators/query-assigned-elements.js:
  (**
   * @license
   * Copyright 2021 Google LLC
   * SPDX-License-Identifier: BSD-3-Clause
   *)

@lit/reactive-element/decorators/query-assigned-nodes.js:
  (**
   * @license
   * Copyright 2017 Google LLC
   * SPDX-License-Identifier: BSD-3-Clause
   *)
*/
