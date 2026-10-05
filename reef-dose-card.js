var Ue=Object.defineProperty;var Ie=Object.getOwnPropertyDescriptor;var u=(i,t,e,s)=>{for(var r=s>1?void 0:s?Ie(t,e):t,o=i.length-1,n;o>=0;o--)(n=i[o])&&(r=(s?n(t,e,r):n(r))||r);return s&&r&&Ue(t,e,r),r};var U=globalThis,I=U.ShadowRoot&&(U.ShadyCSS===void 0||U.ShadyCSS.nativeShadow)&&"adoptedStyleSheets"in Document.prototype&&"replace"in CSSStyleSheet.prototype,F=Symbol(),oe=new WeakMap,R=class{constructor(t,e,s){if(this._$cssResult$=!0,s!==F)throw Error("CSSResult is not constructable. Use `unsafeCSS` or `css` instead.");this.cssText=t,this.t=e}get styleSheet(){let t=this.o,e=this.t;if(I&&t===void 0){let s=e!==void 0&&e.length===1;s&&(t=oe.get(e)),t===void 0&&((this.o=t=new CSSStyleSheet).replaceSync(this.cssText),s&&oe.set(e,t))}return t}toString(){return this.cssText}},ne=i=>new R(typeof i=="string"?i:i+"",void 0,F),B=(i,...t)=>{let e=i.length===1?i[0]:t.reduce((s,r,o)=>s+(n=>{if(n._$cssResult$===!0)return n.cssText;if(typeof n=="number")return n;throw Error("Value passed to 'css' function must be a 'css' function result: "+n+". Use 'unsafeCSS' to pass non-literal values, but take care to ensure page security.")})(r)+i[o+1],i[0]);return new R(e,i,F)},ae=(i,t)=>{if(I)i.adoptedStyleSheets=t.map(e=>e instanceof CSSStyleSheet?e:e.styleSheet);else for(let e of t){let s=document.createElement("style"),r=U.litNonce;r!==void 0&&s.setAttribute("nonce",r),s.textContent=e.cssText,i.appendChild(s)}},W=I?i=>i:i=>i instanceof CSSStyleSheet?(t=>{let e="";for(let s of t.cssRules)e+=s.cssText;return ne(e)})(i):i;var{is:je,defineProperty:ze,getOwnPropertyDescriptor:De,getOwnPropertyNames:qe,getOwnPropertySymbols:Ve,getPrototypeOf:Fe}=Object,j=globalThis,de=j.trustedTypes,Be=de?de.emptyScript:"",We=j.reactiveElementPolyfillSupport,k=(i,t)=>i,M={toAttribute(i,t){switch(t){case Boolean:i=i?Be:null;break;case Object:case Array:i=i==null?i:JSON.stringify(i)}return i},fromAttribute(i,t){let e=i;switch(t){case Boolean:e=i!==null;break;case Number:e=i===null?null:Number(i);break;case Object:case Array:try{e=JSON.parse(i)}catch{e=null}}return e}},z=(i,t)=>!je(i,t),le={attribute:!0,type:String,converter:M,reflect:!1,useDefault:!1,hasChanged:z};Symbol.metadata??=Symbol("metadata"),j.litPropertyMetadata??=new WeakMap;var f=class extends HTMLElement{static addInitializer(t){this._$Ei(),(this.l??=[]).push(t)}static get observedAttributes(){return this.finalize(),this._$Eh&&[...this._$Eh.keys()]}static createProperty(t,e=le){if(e.state&&(e.attribute=!1),this._$Ei(),this.prototype.hasOwnProperty(t)&&((e=Object.create(e)).wrapped=!0),this.elementProperties.set(t,e),!e.noAccessor){let s=Symbol(),r=this.getPropertyDescriptor(t,s,e);r!==void 0&&ze(this.prototype,t,r)}}static getPropertyDescriptor(t,e,s){let{get:r,set:o}=De(this.prototype,t)??{get(){return this[e]},set(n){this[e]=n}};return{get:r,set(n){let d=r?.call(this);o?.call(this,n),this.requestUpdate(t,d,s)},configurable:!0,enumerable:!0}}static getPropertyOptions(t){return this.elementProperties.get(t)??le}static _$Ei(){if(this.hasOwnProperty(k("elementProperties")))return;let t=Fe(this);t.finalize(),t.l!==void 0&&(this.l=[...t.l]),this.elementProperties=new Map(t.elementProperties)}static finalize(){if(this.hasOwnProperty(k("finalized")))return;if(this.finalized=!0,this._$Ei(),this.hasOwnProperty(k("properties"))){let e=this.properties,s=[...qe(e),...Ve(e)];for(let r of s)this.createProperty(r,e[r])}let t=this[Symbol.metadata];if(t!==null){let e=litPropertyMetadata.get(t);if(e!==void 0)for(let[s,r]of e)this.elementProperties.set(s,r)}this._$Eh=new Map;for(let[e,s]of this.elementProperties){let r=this._$Eu(e,s);r!==void 0&&this._$Eh.set(r,e)}this.elementStyles=this.finalizeStyles(this.styles)}static finalizeStyles(t){let e=[];if(Array.isArray(t)){let s=new Set(t.flat(1/0).reverse());for(let r of s)e.unshift(W(r))}else t!==void 0&&e.push(W(t));return e}static _$Eu(t,e){let s=e.attribute;return s===!1?void 0:typeof s=="string"?s:typeof t=="string"?t.toLowerCase():void 0}constructor(){super(),this._$Ep=void 0,this.isUpdatePending=!1,this.hasUpdated=!1,this._$Em=null,this._$Ev()}_$Ev(){this._$ES=new Promise(t=>this.enableUpdating=t),this._$AL=new Map,this._$E_(),this.requestUpdate(),this.constructor.l?.forEach(t=>t(this))}addController(t){(this._$EO??=new Set).add(t),this.renderRoot!==void 0&&this.isConnected&&t.hostConnected?.()}removeController(t){this._$EO?.delete(t)}_$E_(){let t=new Map,e=this.constructor.elementProperties;for(let s of e.keys())this.hasOwnProperty(s)&&(t.set(s,this[s]),delete this[s]);t.size>0&&(this._$Ep=t)}createRenderRoot(){let t=this.shadowRoot??this.attachShadow(this.constructor.shadowRootOptions);return ae(t,this.constructor.elementStyles),t}connectedCallback(){this.renderRoot??=this.createRenderRoot(),this.enableUpdating(!0),this._$EO?.forEach(t=>t.hostConnected?.())}enableUpdating(t){}disconnectedCallback(){this._$EO?.forEach(t=>t.hostDisconnected?.())}attributeChangedCallback(t,e,s){this._$AK(t,s)}_$ET(t,e){let s=this.constructor.elementProperties.get(t),r=this.constructor._$Eu(t,s);if(r!==void 0&&s.reflect===!0){let o=(s.converter?.toAttribute!==void 0?s.converter:M).toAttribute(e,s.type);this._$Em=t,o==null?this.removeAttribute(r):this.setAttribute(r,o),this._$Em=null}}_$AK(t,e){let s=this.constructor,r=s._$Eh.get(t);if(r!==void 0&&this._$Em!==r){let o=s.getPropertyOptions(r),n=typeof o.converter=="function"?{fromAttribute:o.converter}:o.converter?.fromAttribute!==void 0?o.converter:M;this._$Em=r;let d=n.fromAttribute(e,o.type);this[r]=d??this._$Ej?.get(r)??d,this._$Em=null}}requestUpdate(t,e,s,r=!1,o){if(t!==void 0){let n=this.constructor;if(r===!1&&(o=this[t]),s??=n.getPropertyOptions(t),!((s.hasChanged??z)(o,e)||s.useDefault&&s.reflect&&o===this._$Ej?.get(t)&&!this.hasAttribute(n._$Eu(t,s))))return;this.C(t,e,s)}this.isUpdatePending===!1&&(this._$ES=this._$EP())}C(t,e,{useDefault:s,reflect:r,wrapped:o},n){s&&!(this._$Ej??=new Map).has(t)&&(this._$Ej.set(t,n??e??this[t]),o!==!0||n!==void 0)||(this._$AL.has(t)||(this.hasUpdated||s||(e=void 0),this._$AL.set(t,e)),r===!0&&this._$Em!==t&&(this._$Eq??=new Set).add(t))}async _$EP(){this.isUpdatePending=!0;try{await this._$ES}catch(e){Promise.reject(e)}let t=this.scheduleUpdate();return t!=null&&await t,!this.isUpdatePending}scheduleUpdate(){return this.performUpdate()}performUpdate(){if(!this.isUpdatePending)return;if(!this.hasUpdated){if(this.renderRoot??=this.createRenderRoot(),this._$Ep){for(let[r,o]of this._$Ep)this[r]=o;this._$Ep=void 0}let s=this.constructor.elementProperties;if(s.size>0)for(let[r,o]of s){let{wrapped:n}=o,d=this[r];n!==!0||this._$AL.has(r)||d===void 0||this.C(r,void 0,o,d)}}let t=!1,e=this._$AL;try{t=this.shouldUpdate(e),t?(this.willUpdate(e),this._$EO?.forEach(s=>s.hostUpdate?.()),this.update(e)):this._$EM()}catch(s){throw t=!1,this._$EM(),s}t&&this._$AE(e)}willUpdate(t){}_$AE(t){this._$EO?.forEach(e=>e.hostUpdated?.()),this.hasUpdated||(this.hasUpdated=!0,this.firstUpdated(t)),this.updated(t)}_$EM(){this._$AL=new Map,this.isUpdatePending=!1}get updateComplete(){return this.getUpdateComplete()}getUpdateComplete(){return this._$ES}shouldUpdate(t){return!0}update(t){this._$Eq&&=this._$Eq.forEach(e=>this._$ET(e,this[e])),this._$EM()}updated(t){}firstUpdated(t){}};f.elementStyles=[],f.shadowRootOptions={mode:"open"},f[k("elementProperties")]=new Map,f[k("finalized")]=new Map,We?.({ReactiveElement:f}),(j.reactiveElementVersions??=[]).push("2.1.2");var ee=globalThis,ce=i=>i,D=ee.trustedTypes,pe=D?D.createPolicy("lit-html",{createHTML:i=>i}):void 0,ve="$lit$",y=`lit$${Math.random().toFixed(9).slice(2)}$`,fe="?"+y,Ke=`<${fe}>`,A=document,C=()=>A.createComment(""),H=i=>i===null||typeof i!="object"&&typeof i!="function",te=Array.isArray,Je=i=>te(i)||typeof i?.[Symbol.iterator]=="function",K=`[ 	
\f\r]`,G=/<(?:(!--|\/[^a-zA-Z])|(\/?[a-zA-Z][^>\s]*)|(\/?$))/g,ue=/-->/g,he=/>/g,w=RegExp(`>|${K}(?:([^\\s"'>=/]+)(${K}*=${K}*(?:[^ 	
\f\r"'\`<>=]|("|')|))|$)`,"g"),me=/'/g,_e=/"/g,be=/^(?:script|style|textarea|title)$/i,se=i=>(t,...e)=>({_$litType$:i,strings:t,values:e}),l=se(1),nt=se(2),at=se(3),P=Symbol.for("lit-noChange"),_=Symbol.for("lit-nothing"),ge=new WeakMap,S=A.createTreeWalker(A,129);function ye(i,t){if(!te(i)||!i.hasOwnProperty("raw"))throw Error("invalid template strings array");return pe!==void 0?pe.createHTML(t):t}var Ze=(i,t)=>{let e=i.length-1,s=[],r,o=t===2?"<svg>":t===3?"<math>":"",n=G;for(let d=0;d<e;d++){let a=i[d],m,g,c=-1,v=0;for(;v<a.length&&(n.lastIndex=v,g=n.exec(a),g!==null);)v=n.lastIndex,n===G?g[1]==="!--"?n=ue:g[1]!==void 0?n=he:g[2]!==void 0?(be.test(g[2])&&(r=RegExp("</"+g[2],"g")),n=w):g[3]!==void 0&&(n=w):n===w?g[0]===">"?(n=r??G,c=-1):g[1]===void 0?c=-2:(c=n.lastIndex-g[2].length,m=g[1],n=g[3]===void 0?w:g[3]==='"'?_e:me):n===_e||n===me?n=w:n===ue||n===he?n=G:(n=w,r=void 0);let b=n===w&&i[d+1].startsWith("/>")?" ":"";o+=n===G?a+Ke:c>=0?(s.push(m),a.slice(0,c)+ve+a.slice(c)+y+b):a+y+(c===-2?d:b)}return[ye(i,o+(i[e]||"<?>")+(t===2?"</svg>":t===3?"</math>":"")),s]},N=class i{constructor({strings:t,_$litType$:e},s){let r;this.parts=[];let o=0,n=0,d=t.length-1,a=this.parts,[m,g]=Ze(t,e);if(this.el=i.createElement(m,s),S.currentNode=this.el.content,e===2||e===3){let c=this.el.content.firstChild;c.replaceWith(...c.childNodes)}for(;(r=S.nextNode())!==null&&a.length<d;){if(r.nodeType===1){if(r.hasAttributes())for(let c of r.getAttributeNames())if(c.endsWith(ve)){let v=g[n++],b=r.getAttribute(c).split(y),L=/([.?@])?(.*)/.exec(v);a.push({type:1,index:o,name:L[2],strings:b,ctor:L[1]==="."?Z:L[1]==="?"?Q:L[1]==="@"?X:T}),r.removeAttribute(c)}else c.startsWith(y)&&(a.push({type:6,index:o}),r.removeAttribute(c));if(be.test(r.tagName)){let c=r.textContent.split(y),v=c.length-1;if(v>0){r.textContent=D?D.emptyScript:"";for(let b=0;b<v;b++)r.append(c[b],C()),S.nextNode(),a.push({type:2,index:++o});r.append(c[v],C())}}}else if(r.nodeType===8)if(r.data===fe)a.push({type:2,index:o});else{let c=-1;for(;(c=r.data.indexOf(y,c+1))!==-1;)a.push({type:7,index:o}),c+=y.length-1}o++}}static createElement(t,e){let s=A.createElement("template");return s.innerHTML=t,s}};function E(i,t,e=i,s){if(t===P)return t;let r=s!==void 0?e._$Co?.[s]:e._$Cl,o=H(t)?void 0:t._$litDirective$;return r?.constructor!==o&&(r?._$AO?.(!1),o===void 0?r=void 0:(r=new o(i),r._$AT(i,e,s)),s!==void 0?(e._$Co??=[])[s]=r:e._$Cl=r),r!==void 0&&(t=E(i,r._$AS(i,t.values),r,s)),t}var J=class{constructor(t,e){this._$AV=[],this._$AN=void 0,this._$AD=t,this._$AM=e}get parentNode(){return this._$AM.parentNode}get _$AU(){return this._$AM._$AU}u(t){let{el:{content:e},parts:s}=this._$AD,r=(t?.creationScope??A).importNode(e,!0);S.currentNode=r;let o=S.nextNode(),n=0,d=0,a=s[0];for(;a!==void 0;){if(n===a.index){let m;a.type===2?m=new O(o,o.nextSibling,this,t):a.type===1?m=new a.ctor(o,a.name,a.strings,this,t):a.type===6&&(m=new Y(o,this,t)),this._$AV.push(m),a=s[++d]}n!==a?.index&&(o=S.nextNode(),n++)}return S.currentNode=A,r}p(t){let e=0;for(let s of this._$AV)s!==void 0&&(s.strings!==void 0?(s._$AI(t,s,e),e+=s.strings.length-2):s._$AI(t[e])),e++}},O=class i{get _$AU(){return this._$AM?._$AU??this._$Cv}constructor(t,e,s,r){this.type=2,this._$AH=_,this._$AN=void 0,this._$AA=t,this._$AB=e,this._$AM=s,this.options=r,this._$Cv=r?.isConnected??!0}get parentNode(){let t=this._$AA.parentNode,e=this._$AM;return e!==void 0&&t?.nodeType===11&&(t=e.parentNode),t}get startNode(){return this._$AA}get endNode(){return this._$AB}_$AI(t,e=this){t=E(this,t,e),H(t)?t===_||t==null||t===""?(this._$AH!==_&&this._$AR(),this._$AH=_):t!==this._$AH&&t!==P&&this._(t):t._$litType$!==void 0?this.$(t):t.nodeType!==void 0?this.T(t):Je(t)?this.k(t):this._(t)}O(t){return this._$AA.parentNode.insertBefore(t,this._$AB)}T(t){this._$AH!==t&&(this._$AR(),this._$AH=this.O(t))}_(t){this._$AH!==_&&H(this._$AH)?this._$AA.nextSibling.data=t:this.T(A.createTextNode(t)),this._$AH=t}$(t){let{values:e,_$litType$:s}=t,r=typeof s=="number"?this._$AC(t):(s.el===void 0&&(s.el=N.createElement(ye(s.h,s.h[0]),this.options)),s);if(this._$AH?._$AD===r)this._$AH.p(e);else{let o=new J(r,this),n=o.u(this.options);o.p(e),this.T(n),this._$AH=o}}_$AC(t){let e=ge.get(t.strings);return e===void 0&&ge.set(t.strings,e=new N(t)),e}k(t){te(this._$AH)||(this._$AH=[],this._$AR());let e=this._$AH,s,r=0;for(let o of t)r===e.length?e.push(s=new i(this.O(C()),this.O(C()),this,this.options)):s=e[r],s._$AI(o),r++;r<e.length&&(this._$AR(s&&s._$AB.nextSibling,r),e.length=r)}_$AR(t=this._$AA.nextSibling,e){for(this._$AP?.(!1,!0,e);t!==this._$AB;){let s=ce(t).nextSibling;ce(t).remove(),t=s}}setConnected(t){this._$AM===void 0&&(this._$Cv=t,this._$AP?.(t))}},T=class{get tagName(){return this.element.tagName}get _$AU(){return this._$AM._$AU}constructor(t,e,s,r,o){this.type=1,this._$AH=_,this._$AN=void 0,this.element=t,this.name=e,this._$AM=r,this.options=o,s.length>2||s[0]!==""||s[1]!==""?(this._$AH=Array(s.length-1).fill(new String),this.strings=s):this._$AH=_}_$AI(t,e=this,s,r){let o=this.strings,n=!1;if(o===void 0)t=E(this,t,e,0),n=!H(t)||t!==this._$AH&&t!==P,n&&(this._$AH=t);else{let d=t,a,m;for(t=o[0],a=0;a<o.length-1;a++)m=E(this,d[s+a],e,a),m===P&&(m=this._$AH[a]),n||=!H(m)||m!==this._$AH[a],m===_?t=_:t!==_&&(t+=(m??"")+o[a+1]),this._$AH[a]=m}n&&!r&&this.j(t)}j(t){t===_?this.element.removeAttribute(this.name):this.element.setAttribute(this.name,t??"")}},Z=class extends T{constructor(){super(...arguments),this.type=3}j(t){this.element[this.name]=t===_?void 0:t}},Q=class extends T{constructor(){super(...arguments),this.type=4}j(t){this.element.toggleAttribute(this.name,!!t&&t!==_)}},X=class extends T{constructor(t,e,s,r,o){super(t,e,s,r,o),this.type=5}_$AI(t,e=this){if((t=E(this,t,e,0)??_)===P)return;let s=this._$AH,r=t===_&&s!==_||t.capture!==s.capture||t.once!==s.once||t.passive!==s.passive,o=t!==_&&(s===_||r);r&&this.element.removeEventListener(this.name,this,s),o&&this.element.addEventListener(this.name,this,t),this._$AH=t}handleEvent(t){typeof this._$AH=="function"?this._$AH.call(this.options?.host??this.element,t):this._$AH.handleEvent(t)}},Y=class{constructor(t,e,s){this.element=t,this.type=6,this._$AN=void 0,this._$AM=e,this.options=s}get _$AU(){return this._$AM._$AU}_$AI(t){E(this,t)}};var Qe=ee.litHtmlPolyfillSupport;Qe?.(N,O),(ee.litHtmlVersions??=[]).push("3.3.3");var $e=(i,t,e)=>{let s=e?.renderBefore??t,r=s._$litPart$;if(r===void 0){let o=e?.renderBefore??null;s._$litPart$=r=new O(t.insertBefore(C(),o),o,void 0,e??{})}return r._$AI(i),r};var re=globalThis,$=class extends f{constructor(){super(...arguments),this.renderOptions={host:this},this._$Do=void 0}createRenderRoot(){let t=super.createRenderRoot();return this.renderOptions.renderBefore??=t.firstChild,t}update(t){let e=this.render();this.hasUpdated||(this.renderOptions.isConnected=this.isConnected),super.update(t),this._$Do=$e(e,this.renderRoot,this.renderOptions)}connectedCallback(){super.connectedCallback(),this._$Do?.setConnected(!0)}disconnectedCallback(){super.disconnectedCallback(),this._$Do?.setConnected(!1)}render(){return P}};$._$litElement$=!0,$.finalized=!0,re.litElementHydrateSupport?.({LitElement:$});var Xe=re.litElementPolyfillSupport;Xe?.({LitElement:$});(re.litElementVersions??=[]).push("4.2.2");var xe=i=>(t,e)=>{e!==void 0?e.addInitializer(()=>{customElements.define(i,t)}):customElements.define(i,t)};var Ye={attribute:!0,type:String,converter:M,reflect:!1,hasChanged:z},et=(i=Ye,t,e)=>{let{kind:s,metadata:r}=e,o=globalThis.litPropertyMetadata.get(r);if(o===void 0&&globalThis.litPropertyMetadata.set(r,o=new Map),s==="setter"&&((i=Object.create(i)).wrapped=!0),o.set(e.name,i),s==="accessor"){let{name:n}=e;return{set(d){let a=t.get.call(this);t.set.call(this,d),this.requestUpdate(n,a,i,!0,d)},init(d){return d!==void 0&&this.C(n,void 0,i,d),d}}}if(s==="setter"){let{name:n}=e;return function(d){let a=this[n];t.call(this,d),this.requestUpdate(n,a,i,!0,d)}}throw Error("Unsupported decorator location: "+s)};function we(i){return(t,e)=>typeof e=="object"?et(i,t,e):((s,r,o)=>{let n=r.hasOwnProperty(o);return r.constructor.createProperty(o,s),n?Object.getOwnPropertyDescriptor(r,o):void 0})(i,t,e)}function h(i){return we({...i,state:!0,attribute:!1})}var Se="reef_dose";async function V(i,t,e){let s=new Promise((o,n)=>{setTimeout(()=>n(new Error(`reef_dose.${t} did not respond within 10s - is reef-dose-ha updated and reloaded?`)),1e4)});return(await Promise.race([i.connection.sendMessagePromise({type:"call_service",domain:Se,service:t,service_data:e,return_response:!0}),s])).response}async function x(i,t,e){await i.callService(Se,t,e)}function Ae(i,t){return V(i,"get_schedule",{pump_id:t})}function Pe(i,t){return V(i,"get_reservoir",{pump_id:t})}function Ee(i,t,e){return x(i,"refill_reservoir",{pump_id:t,full_ml:e})}function Te(i,t,e){return x(i,"update_schedule",{pump_id:t,slots:e})}function Re(i,t,e){return x(i,"auto_divide_schedule",{pump_id:t,daily_total_ml:e})}async function ke(i){return(await V(i,"get_groups",{})).groups}function Me(i,t,e,s){return x(i,"create_group",{group_id:t,name:e,pump_ids:s})}function ie(i,t,e){let s={group_id:t};return e.name!==void 0&&(s.name=e.name),e.pumpIds!==void 0&&(s.pump_ids=e.pumpIds),e.scalePercent!==void 0&&(s.scale_percent=e.scalePercent),x(i,"update_group",s)}function Ge(i,t){return x(i,"delete_group",{group_id:t})}function Ce(i,t){return V(i,"get_group_schedule",{group_id:t})}function He(i,t,e){return x(i,"update_group_schedule",{group_id:t,slots:e})}function Ne(i,t,e){return x(i,"auto_divide_group_schedule",{group_id:t,daily_total_ml:e})}var Oe=Array.from({length:24},(i,t)=>String(t).padStart(2,"0"));var Le=["1","2","3","4","5","6"],p=class extends ${constructor(){super(...arguments);this._tab="dashboard";this._reservoirs={};this._reservoirErrors={};this._reservoirsLoading=!1;this._activeTarget=null;this._scheduleSlots=null;this._scheduleLoading=!1;this._editingHour=null;this._editValue="";this._groups=[];this._groupsLoading=!1;this._showNewGroupForm=!1;this._newGroupId="";this._newGroupName="";this._newGroupPumpIds=new Set;this._editingGroupId=null;this._editGroupPumpIds=new Set;this._prompt=null;this._error=null}setConfig(e){if(!e.pump_ids||!Array.isArray(e.pump_ids)||e.pump_ids.length===0)throw new Error("reef-dose-card: config.pump_ids must be a non-empty array of pump ids, e.g. ['1', '4']");this._config=e,this._activeTarget||(this._activeTarget={kind:"pump",id:e.pump_ids[0]})}set hass(e){let s=!this._hass;this._hass=e,s&&(this._loadDashboard(),this._loadActiveSchedule(),this._loadGroups())}getCardSize(){return 8}render(){return this._config?l`
      <ha-card header=${this._config.title??"Reef Dose"}>
        <div style="padding: 0 16px 16px">
          ${this._error?l`<div class="error">${this._error}</div>`:""}
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
    `:l``}_openPrompt(e){let{initialValue:s,...r}=e;this._prompt={...r,value:String(s)}}_renderPrompt(){if(!this._prompt)return l``;let e=this._prompt;return l`
      <div class="modal-overlay" @click=${s=>s.target===s.currentTarget&&this._cancelPrompt()}>
        <div class="modal">
          <h3>${e.title}</h3>
          <div class="field">
            <input
              type="number"
              min=${e.min}
              max=${e.max}
              step=${e.step}
              .value=${e.value}
              @input=${s=>this._prompt={...e,value:s.target.value}}
            />
            <span>${e.unit}</span>
          </div>
          <div class="actions">
            <button @click=${()=>this._savePrompt()}>Save</button>
            <button class="secondary" @click=${()=>this._cancelPrompt()}>Cancel</button>
          </div>
        </div>
      </div>
    `}async _savePrompt(){if(!this._prompt)return;let{value:e,min:s,max:r,onSave:o}=this._prompt,n=Number(e);if(!Number.isFinite(n)||n<s||n>r){this._error=`Value must be between ${s} and ${r}.`;return}this._error=null,this._prompt=null,await o(n)}_cancelPrompt(){this._prompt=null}_renderSchedule(){let e=this._config.pump_ids.map(o=>({kind:"pump",id:o})),s=(this._config.group_ids??[]).map(o=>({kind:"group",id:o})),r=[...e,...s];return l`
      ${r.length>1?l`
            <div class="pump-select">
              ${r.map(o=>l`
                  <div
                    class="pump-chip ${this._isActiveTarget(o)?"active":""}"
                    @click=${()=>this._selectTarget(o)}
                  >
                    ${o.kind==="pump"?`Pump ${o.id}`:this._groupLabel(o.id)}
                  </div>
                `)}
            </div>
          `:""}
      ${this._scheduleLoading?l`<div>Loading…</div>`:this._scheduleSlots?this._renderScheduleRows(this._scheduleSlots):l`<div>No schedule loaded.</div>`}
    `}_isActiveTarget(e){return this._activeTarget?.kind===e.kind&&this._activeTarget.id===e.id}_groupLabel(e){return this._groups.find(s=>s.id===e)?.name??e}_renderScheduleRows(e){let s=Object.values(e).reduce((r,o)=>r+o,0);return l`
      <div class="auto-divide">
        <button @click=${()=>this._openAutoDividePrompt(s)}>Auto-Divide Schedule</button>
        <span class="group-meta">Current total: ${s.toFixed(2)}mL/day</span>
      </div>
      ${Oe.map(r=>{let o=e[r]??0,n=this._editingHour===r;return l`
          <div class="row">
            <span class="hour">${r}:00</span>
            ${n?l`
                  <input
                    type="number"
                    min="0"
                    max="50"
                    step="0.01"
                    .value=${this._editValue}
                    @input=${d=>this._editValue=d.target.value}
                  />
                  <div class="actions">
                    <button @click=${()=>this._saveSlot(r)}>Save</button>
                    <button class="secondary" @click=${()=>this._editingHour=null}>Cancel</button>
                  </div>
                `:l`
                  <span class="ml">${o.toFixed(2)}mL</span>
                  <button class="secondary" @click=${()=>this._startEditSlot(r,o)}>Edit</button>
                `}
          </div>
        `})}
    `}_selectTarget(e){this._activeTarget=e,this._editingHour=null,this._loadActiveSchedule()}_switchTab(e){this._tab=e,e==="dashboard"?this._loadDashboard():e==="schedule"?this._loadActiveSchedule():this._loadGroups()}async _loadDashboard(){if(!this._hass||!this._config)return;this._reservoirsLoading=!0,this._error=null;let e={};try{let s=await Promise.all(this._config.pump_ids.map(async r=>{try{return[r,await Pe(this._hass,r)]}catch(o){return e[r]=this._errorMessage(o),[r,null]}}));this._reservoirs=Object.fromEntries(s),this._reservoirErrors=e}catch(s){this._error=this._errorMessage(s)}finally{this._reservoirsLoading=!1}}_renderDashboard(){return this._reservoirsLoading&&Object.keys(this._reservoirs).length===0?l`<div>Loading…</div>`:l`${this._config.pump_ids.map(e=>this._renderDashboardRow(e))}`}_renderDashboardRow(e){let s=this._reservoirs[e];if(!s){let d=this._reservoirErrors[e]??"No reservoir data - no product assigned yet, or device offline.";return l`
        <div class="dash-row">
          <div class="dash-name">Pump ${e}</div>
          <div class="dash-meta dash-empty">${d}</div>
        </div>
      `}let r=s.dosedTodayMl??0,o=s.dailyScheduledMl>0?Math.min(100,Math.max(0,r/s.dailyScheduledMl*100)):0,n=s.fullMl>0?Math.min(100,Math.max(0,s.remainingMl/s.fullMl*100)):0;return l`
      <div class="dash-row">
        <div class="dash-name">Pump ${e}</div>
        <div class="dash-meta">
          <div class="dash-bar-wrap">
            <div class="dash-bar"><div class="dash-bar-fill" style="width: ${o}%"></div></div>
            <div class="dash-bar-label">
              ${r.toFixed(2)} / ${s.dailyScheduledMl.toFixed(2)} mL today
            </div>
            <div class="dash-reservoir-label">
              ${s.remainingMl.toFixed(1)} / ${s.fullMl.toFixed(1)} mL remaining
            </div>
          </div>
          <div class="dash-days">
            <div class="dash-days-ring" style="--dash-pct: ${n}">
              <div class="dash-days-circle">${s.daysRemaining??"\u2013"}</div>
            </div>
            <div class="dash-days-label">Days Left</div>
          </div>
          <button class="secondary" @click=${()=>this._openRefillPrompt(e,s.fullMl)}>Refill</button>
        </div>
      </div>
    `}_openRefillPrompt(e,s){this._openPrompt({title:`Refill Pump ${e} (new full volume, mL)`,initialValue:s,min:0,max:2e4,step:1,unit:"mL",onSave:async r=>{try{await Ee(this._hass,e,r),await this._loadDashboard()}catch(o){this._error=this._errorMessage(o)}}})}async _loadActiveSchedule(){if(!(!this._hass||!this._activeTarget)){this._scheduleLoading=!0,this._error=null;try{this._scheduleSlots=this._activeTarget.kind==="pump"?(await Ae(this._hass,this._activeTarget.id)).slots:(await Ce(this._hass,this._activeTarget.id)).slots}catch(e){this._error=this._errorMessage(e)}finally{this._scheduleLoading=!1}}}_startEditSlot(e,s){this._editingHour=e,this._editValue=s.toFixed(2)}async _saveSlot(e){let s=Number(this._editValue);if(!Number.isFinite(s)||s<0||s>50){this._error="Slot value must be between 0 and 50ml.";return}this._error=null;try{let r=this._activeTarget;r.kind==="pump"?await Te(this._hass,r.id,{[e]:s}):await He(this._hass,r.id,{[e]:s}),this._editingHour=null,await this._loadActiveSchedule()}catch(r){this._error=this._errorMessage(r)}}_openAutoDividePrompt(e){let s=this._activeTarget,r=s.kind==="pump"?`Pump ${s.id}`:this._groupLabel(s.id);this._openPrompt({title:`Auto-Divide ${r} (mL/day)`,initialValue:e,min:0,max:1200,step:.01,unit:"mL/day",onSave:async o=>{try{s.kind==="pump"?await Re(this._hass,s.id,o):await Ne(this._hass,s.id,o),await this._loadActiveSchedule()}catch(n){this._error=this._errorMessage(n)}}})}_renderGroups(){return l`
      ${this._groupsLoading?l`<div>Loading…</div>`:this._groups.map(e=>this._renderGroup(e))}
      ${this._showNewGroupForm?this._renderNewGroupForm():l`<button @click=${()=>this._showNewGroupForm=!0}>+ New Group</button>`}
    `}_renderGroup(e){let s=this._editingGroupId===e.id;return l`
      <div class="group-card">
        <div class="group-header">
          <strong>${e.name}</strong>
        </div>
        <div class="group-meta">id: ${e.id} · members: ${e.pumpIds.map(r=>`Pump ${r}`).join(", ")||"none"}</div>
        ${s?l`
              <div class="checkbox-list">
                ${Le.map(r=>l`
                    <label>
                      <input
                        type="checkbox"
                        .checked=${this._editGroupPumpIds.has(r)}
                        @change=${o=>this._toggleEditPump(r,o.target.checked)}
                      />
                      Pump ${r}
                    </label>
                  `)}
              </div>
              <div class="actions">
                <button @click=${()=>this._saveGroupMembership(e.id)}>Save</button>
                <button class="secondary" @click=${()=>this._editingGroupId=null}>Cancel</button>
              </div>
            `:l`
              <div class="actions">
                <button class="secondary" @click=${()=>this._startEditGroup(e)}>Edit Membership</button>
                <button @click=${()=>this._openAdjustmentPrompt(e)}>Manual Overall Adjustment</button>
                <button class="danger" @click=${()=>this._confirmRemoveGroup(e)}>Delete</button>
              </div>
            `}
      </div>
    `}_renderNewGroupForm(){return l`
      <div class="group-card">
        <input
          type="text"
          placeholder="group-id"
          .value=${this._newGroupId}
          @input=${e=>this._newGroupId=e.target.value}
        />
        <input
          type="text"
          placeholder="Display name"
          .value=${this._newGroupName}
          @input=${e=>this._newGroupName=e.target.value}
        />
        <div class="checkbox-list">
          ${Le.map(e=>l`
              <label>
                <input
                  type="checkbox"
                  .checked=${this._newGroupPumpIds.has(e)}
                  @change=${s=>this._toggleNewPump(e,s.target.checked)}
                />
                Pump ${e}
              </label>
            `)}
        </div>
        <div class="actions">
          <button @click=${()=>this._createGroup()}>Create</button>
          <button class="secondary" @click=${()=>this._showNewGroupForm=!1}>Cancel</button>
        </div>
      </div>
    `}_toggleNewPump(e,s){let r=new Set(this._newGroupPumpIds);s?r.add(e):r.delete(e),this._newGroupPumpIds=r}_toggleEditPump(e,s){let r=new Set(this._editGroupPumpIds);s?r.add(e):r.delete(e),this._editGroupPumpIds=r}_startEditGroup(e){this._editingGroupId=e.id,this._editGroupPumpIds=new Set(e.pumpIds)}_openAdjustmentPrompt(e){this._openPrompt({title:`Manual Overall Adjustment \u2014 ${e.name} (%)`,initialValue:0,min:-100,max:1e3,step:1,unit:"%",onSave:async s=>{let r=Math.round(e.scalePercent*(1+s/100)*100)/100;try{await ie(this._hass,e.id,{scalePercent:r}),await this._loadGroups()}catch(o){this._error=this._errorMessage(o)}}})}async _loadGroups(){if(this._hass){this._groupsLoading=!0,this._error=null;try{this._groups=await ke(this._hass)}catch(e){this._error=this._errorMessage(e)}finally{this._groupsLoading=!1}}}async _createGroup(){if(!this._newGroupId||!this._newGroupName){this._error="Group id and name are both required.";return}this._error=null;try{await Me(this._hass,this._newGroupId,this._newGroupName,[...this._newGroupPumpIds]),this._showNewGroupForm=!1,this._newGroupId="",this._newGroupName="",this._newGroupPumpIds=new Set,await this._loadGroups()}catch(e){this._error=this._errorMessage(e)}}async _saveGroupMembership(e){this._error=null;try{await ie(this._hass,e,{pumpIds:[...this._editGroupPumpIds]}),this._editingGroupId=null,await this._loadGroups()}catch(s){this._error=this._errorMessage(s)}}_confirmRemoveGroup(e){let s=e.pumpIds.map(r=>`Pump ${r}`).join(", ")||"no members";window.confirm(`Delete group "${e.name}"? Members (${s}) keep dosing whatever they're currently set to, but will no longer be kept in sync with each other.`)&&this._removeGroup(e.id)}async _removeGroup(e){this._error=null;try{await Ge(this._hass,e),await this._loadGroups()}catch(s){this._error=this._errorMessage(s)}}_errorMessage(e){return e instanceof Error||e&&typeof e=="object"&&"message"in e&&typeof e.message=="string"?e.message:String(e)}};p.styles=B`
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
  `,u([h()],p.prototype,"_tab",2),u([h()],p.prototype,"_reservoirs",2),u([h()],p.prototype,"_reservoirErrors",2),u([h()],p.prototype,"_reservoirsLoading",2),u([h()],p.prototype,"_activeTarget",2),u([h()],p.prototype,"_scheduleSlots",2),u([h()],p.prototype,"_scheduleLoading",2),u([h()],p.prototype,"_editingHour",2),u([h()],p.prototype,"_editValue",2),u([h()],p.prototype,"_groups",2),u([h()],p.prototype,"_groupsLoading",2),u([h()],p.prototype,"_showNewGroupForm",2),u([h()],p.prototype,"_newGroupId",2),u([h()],p.prototype,"_newGroupName",2),u([h()],p.prototype,"_newGroupPumpIds",2),u([h()],p.prototype,"_editingGroupId",2),u([h()],p.prototype,"_editGroupPumpIds",2),u([h()],p.prototype,"_prompt",2),u([h()],p.prototype,"_error",2),p=u([xe("reef-dose-card")],p);window.customCards=[...window.customCards??[],{type:"reef-dose-card",name:"Reef Dose Card",description:"Per-slot schedule editor and scaling-group management for reef-dose."}];export{p as ReefDoseCard};
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
