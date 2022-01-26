(()=>{"use strict";var e,t={6892:(e,t,n)=>{var i=n(8138),r=n.n(i),o=n(829),s=n(5803),a=n(708),l=n(4170),c=function(e,t,n,i){var r,o=arguments.length,s=o<3?t:null===i?i=Object.getOwnPropertyDescriptor(t,n):i;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)s=Reflect.decorate(e,t,n,i);else for(var a=e.length-1;a>=0;a--)(r=e[a])&&(s=(o<3?r(s):o>3?r(t,n,s):r(t,n))||s);return o>3&&s&&Object.defineProperty(t,n,s),s};const u=new o.SpeedcontrolUtilBrowser(nodecg),d={bids:nodecg.Replicant("bids"),bigbuttonPlayerMap:nodecg.Replicant("bigbuttonPlayerMap"),commentators:nodecg.Replicant("commentators"),countdown:nodecg.Replicant("countdown"),currentRunDelay:nodecg.Replicant("currentRunDelay"),donationReader:nodecg.Replicant("donationReader"),donationsToRead:nodecg.Replicant("donationsToRead"),donationTotal:nodecg.Replicant("donationTotal"),donationTotalMilestones:nodecg.Replicant("donationTotalMilestones"),gameLayouts:nodecg.Replicant("gameLayouts"),obsData:nodecg.Replicant("obsData"),omnibar:nodecg.Replicant("omnibar"),otherStreamData:nodecg.Replicant("otherStreamData"),prizes:nodecg.Replicant("prizes"),runDataActiveRun:u.runDataActiveRun,runDataActiveRunSurrounding:u.runDataActiveRunSurrounding,runDataArray:u.runDataArray,serverTimestamp:nodecg.Replicant("serverTimestamp"),streamDeckData:nodecg.Replicant("streamDeckData"),timer:u.timer,ttsVoices:nodecg.Replicant("ttsVoices"),upcomingRunID:nodecg.Replicant("upcomingRunID"),videoPlayer:nodecg.Replicant("videoPlayer")};let h,p=class extends l.g4{constructor(){super(...arguments),this.reps={}}get repsTyped(){return this.reps}setState({name:e,val:t}){s.Z.set(this.reps,e,r()(t))}setReplicant({name:e,val:t}){s.Z.set(this.reps,e,r()(t)),d[e].value=r()(t)}};c([l.mm],p.prototype,"setState",null),c([l.mm],p.prototype,"setReplicant",null),p=c([(0,l.Yl)({name:"ReplicantModule",namespaced:!0})],p);const f=(0,a.uD)("ReplicantModule");var v=n(9459),g=n(5925);n(4807),n(7023),n(5654),n(779),n(8793);var b=function(e,t,n,i){var r,o=arguments.length,s=o<3?t:null===i?i=Object.getOwnPropertyDescriptor(t,n):i;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)s=Reflect.decorate(e,t,n,i);else for(var a=e.length-1;a>=0;a--)(r=e[a])&&(s=(o<3?r(s):o>3?r(t,n,s):r(t,n))||s);return o>3&&s&&Object.defineProperty(t,n,s),s};let y=class extends s.Z{constructor(){super(...arguments),this.entry="",this.disable=!1}onDonationReaderChanged(e){this.entry=e||""}modify(e=!1){return t=this,n=void 0,r=function*(){this.disable=!0;try{yield nodecg.sendMessage("readerModify",e?null:this.entry)}catch(e){}this.entry=this.donationReader||"",this.disable=!1},new((i=void 0)||(i=Promise))((function(e,o){function s(e){try{l(r.next(e))}catch(e){o(e)}}function a(e){try{l(r.throw(e))}catch(e){o(e)}}function l(t){var n;t.done?e(t.value):(n=t.value,n instanceof i?n:new i((function(e){e(n)}))).then(s,a)}l((r=r.apply(t,n||[])).next())}));var t,n,i,r}};b([f.State((e=>e.reps.donationReader))],y.prototype,"donationReader",void 0),b([function(e,t){void 0===t&&(t={});var n=t.deep,i=void 0!==n&&n,r=t.immediate,o=void 0!==r&&r;return(0,g.createDecorator)((function(t,n){"object"!=typeof t.watch&&(t.watch=Object.create(null));var r=t.watch;"object"!=typeof r[e]||Array.isArray(r[e])?void 0===r[e]&&(r[e]=[]):r[e]=[r[e]],r[e].push({handler:n,deep:i,immediate:o})}))}("donationReader",{immediate:!0})],y.prototype,"onDonationReaderChanged",null),y=b([g.default],y);const m=y;var w=n(5440),x=n(7618),R=n.n(x),$=n(1883),k=n(690),O=n(3777),S=n(1954),j=n(2377);const B=S.Z.extend({name:"v-progress-circular",directives:{intersect:O.Z},props:{button:Boolean,indeterminate:Boolean,rotate:{type:[Number,String],default:0},size:{type:[Number,String],default:32},width:{type:[Number,String],default:4},value:{type:[Number,String],default:0}},data:()=>({radius:20,isVisible:!0}),computed:{calculatedSize(){return Number(this.size)+(this.button?8:0)},circumference(){return 2*Math.PI*this.radius},classes(){return{"v-progress-circular--visible":this.isVisible,"v-progress-circular--indeterminate":this.indeterminate,"v-progress-circular--button":this.button}},normalizedValue(){return this.value<0?0:this.value>100?100:parseFloat(this.value)},strokeDashArray(){return Math.round(1e3*this.circumference)/1e3},strokeDashOffset(){return(100-this.normalizedValue)/100*this.circumference+"px"},strokeWidth(){return Number(this.width)/+this.size*this.viewBoxSize*2},styles(){return{height:(0,j.kb)(this.calculatedSize),width:(0,j.kb)(this.calculatedSize)}},svgStyles(){return{transform:`rotate(${Number(this.rotate)}deg)`}},viewBoxSize(){return this.radius/(1-Number(this.width)/+this.size)}},methods:{genCircle(e,t){return this.$createElement("circle",{class:`v-progress-circular__${e}`,attrs:{fill:"transparent",cx:2*this.viewBoxSize,cy:2*this.viewBoxSize,r:this.radius,"stroke-width":this.strokeWidth,"stroke-dasharray":this.strokeDashArray,"stroke-dashoffset":t}})},genSvg(){const e=[this.indeterminate||this.genCircle("underlay",0),this.genCircle("overlay",this.strokeDashOffset)];return this.$createElement("svg",{style:this.svgStyles,attrs:{xmlns:"http://www.w3.org/2000/svg",viewBox:`${this.viewBoxSize} ${this.viewBoxSize} ${2*this.viewBoxSize} ${2*this.viewBoxSize}`}},e)},genInfo(){return this.$createElement("div",{staticClass:"v-progress-circular__info"},this.$slots.default)},onObserve(e,t,n){this.isVisible=n}},render(e){return e("div",this.setTextColor(this.color,{staticClass:"v-progress-circular",attrs:{role:"progressbar","aria-valuemin":0,"aria-valuemax":100,"aria-valuenow":this.indeterminate?void 0:this.normalizedValue},class:this.classes,directives:[{name:"intersect",value:this.onObserve}],style:this.styles,on:this.$listeners}),[this.genSvg(),this.genInfo()])}});var C=n(3844);function D(e="value",t="input"){return s.Z.extend({name:"toggleable",model:{prop:e,event:t},props:{[e]:{required:!1}},data(){return{isActive:!!this[e]}},watch:{[e](e){this.isActive=!!e},isActive(n){!!n!==this[e]&&this.$emit(t,n)}}})}D();var _=n(8316),Z=n(2027),T=n(9657),z=n(5010),A=n(6248),P=n(8298);const q=(0,A.Z)(k.Z,T.Z,Z.Z,z.Z,(0,C.d)("btnToggle"),D("inputValue")).extend().extend({name:"v-btn",props:{activeClass:{type:String,default(){return this.btnToggle?this.btnToggle.activeClass:""}},block:Boolean,depressed:Boolean,fab:Boolean,icon:Boolean,loading:Boolean,outlined:Boolean,plain:Boolean,retainFocusOnClick:Boolean,rounded:Boolean,tag:{type:String,default:"button"},text:Boolean,tile:Boolean,type:{type:String,default:"button"},value:null},data:()=>({proxyClass:"v-btn--active"}),computed:{classes(){return{"v-btn":!0,...T.Z.options.computed.classes.call(this),"v-btn--absolute":this.absolute,"v-btn--block":this.block,"v-btn--bottom":this.bottom,"v-btn--disabled":this.disabled,"v-btn--is-elevated":this.isElevated,"v-btn--fab":this.fab,"v-btn--fixed":this.fixed,"v-btn--has-bg":this.hasBg,"v-btn--icon":this.icon,"v-btn--left":this.left,"v-btn--loading":this.loading,"v-btn--outlined":this.outlined,"v-btn--plain":this.plain,"v-btn--right":this.right,"v-btn--round":this.isRound,"v-btn--rounded":this.rounded,"v-btn--router":this.to,"v-btn--text":this.text,"v-btn--tile":this.tile,"v-btn--top":this.top,...this.themeClasses,...this.groupClasses,...this.elevationClasses,...this.sizeableClasses}},computedElevation(){if(!this.disabled)return _.Z.options.computed.computedElevation.call(this)},computedRipple(){var e;const t=!this.icon&&!this.fab||{circle:!0};return!this.disabled&&(null!=(e=this.ripple)?e:t)},hasBg(){return!(this.text||this.plain||this.outlined||this.icon)},isElevated(){return Boolean(!(this.icon||this.text||this.outlined||this.depressed||this.disabled||this.plain||!(null==this.elevation||Number(this.elevation)>0)))},isRound(){return Boolean(this.icon||this.fab)},styles(){return{...this.measurableStyles}}},created(){[["flat","text"],["outline","outlined"],["round","rounded"]].forEach((([e,t])=>{this.$attrs.hasOwnProperty(e)&&(0,P.fK)(e,t,this)}))},methods:{click(e){!this.retainFocusOnClick&&!this.fab&&e.detail&&this.$el.blur(),this.$emit("click",e),this.btnToggle&&this.toggle()},genContent(){return this.$createElement("span",{staticClass:"v-btn__content"},this.$slots.default)},genLoader(){return this.$createElement("span",{class:"v-btn__loader"},this.$slots.loader||[this.$createElement(B,{props:{indeterminate:!0,size:23,width:2}})])}},render(e){const t=[this.genContent(),this.loading&&this.genLoader()],{tag:n,data:i}=this.generateRouteLink(),r=this.hasBg?this.setBackgroundColor:this.setTextColor;return"button"===n&&(i.attrs.type=this.type,i.attrs.disabled=this.disabled),i.attrs.value=["string","number"].includes(typeof this.value)?this.value:JSON.stringify(this.value),e(n,this.disabled?i:r(this.color,i),t)}});var M=n(7019),E=n(5861),V=(0,w.Z)(m,(function(){var e=this,t=e.$createElement,n=e._self._c||t;return n("v-app",[n("div",{staticClass:"d-flex"},[n("v-text-field",{attrs:{label:"Donation Reader","hide-details":"",filled:"",spellcheck:!1,disabled:e.disable},on:{keyup:function(t){if(!t.type.indexOf("key")&&e._k(t.keyCode,"enter",13,t.key,"Enter"))return null;e.modify(),t.target.blur()}},model:{value:e.entry,callback:function(t){e.entry=t},expression:"entry"}}),e._v(" "),n("v-btn",{style:{"min-width":"0","margin-left":"5px"},attrs:{height:"56px",disabled:e.disable},on:{click:function(t){return e.modify()}}},[n("v-icon",[e._v("mdi-check")])],1)],1),e._v(" "),n("v-btn",{style:{"margin-top":"10px"},attrs:{disabled:e.disable},on:{click:function(t){return e.modify(!0)}}},[e._v("\n    Clear\n  ")])],1)}),[],!1,null,null,null);const N=V.exports;R()(V,{VApp:$.Z,VBtn:q,VIcon:M.Z,VTextField:E.Z});var L=n(8586);s.Z.use(L.ZP);let I=class extends l.g4{get reps(){return this.context.rootState.ReplicantModule.reps}};I=function(e,t,n,i){var r,o=arguments.length,s=o<3?t:null===i?i=Object.getOwnPropertyDescriptor(t,n):i;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)s=Reflect.decorate(e,t,n,i);else for(var a=e.length-1;a>=0;a--)(r=e[a])&&(s=(o<3?r(s):o>3?r(t,n,s):r(t,n))||s);return o>3&&s&&Object.defineProperty(t,n,s),s}([(0,l.Yl)({name:"OurModule"})],I);const F=new L.yh({strict:!1,state:{},modules:{ReplicantModule:p,OurModule:I}}),W=F;(0,l.rT)(I,F),function(e){return t=this,n=void 0,r=function*(){Object.keys(d).forEach((t=>{d[t].on("change",(n=>{e.commit("ReplicantModule/setState",{name:t,val:n})}))})),yield NodeCG.waitForReplicants(...Object.keys(d).map((e=>d[e]))),h=(0,l.rT)(p,e)},new((i=void 0)||(i=Promise))((function(e,o){function s(e){try{l(r.next(e))}catch(e){o(e)}}function a(e){try{l(r.throw(e))}catch(e){o(e)}}function l(t){var n;t.done?e(t.value):(n=t.value,n instanceof i?n:new i((function(e){e(n)}))).then(s,a)}l((r=r.apply(t,n||[])).next())}));var t,n,i,r}(W).then((()=>{new s.Z({vuetify:v.Z,store:W,el:"#App",render:e=>e(N)})}))},779:(e,t,n)=>{"undefined"!=typeof Reflect&&Reflect.getMetadata},1058:(e,t,n)=>{n.d(t,{Z5:()=>o,Qn:()=>s});var i=n(2727),r=n(4240);(0,i.q)("carousel-transition"),(0,i.q)("carousel-reverse-transition"),(0,i.q)("tab-transition"),(0,i.q)("tab-reverse-transition"),(0,i.q)("menu-transition"),(0,i.q)("fab-transition","center center","out-in"),(0,i.q)("dialog-transition"),(0,i.q)("dialog-bottom-transition"),(0,i.q)("dialog-top-transition");const o=(0,i.q)("fade-transition"),s=((0,i.q)("scale-transition"),(0,i.q)("scroll-x-transition"),(0,i.q)("scroll-x-reverse-transition"),(0,i.q)("scroll-y-transition"),(0,i.q)("scroll-y-reverse-transition"),(0,i.q)("slide-x-transition"));(0,i.q)("slide-x-reverse-transition"),(0,i.q)("slide-y-transition"),(0,i.q)("slide-y-reverse-transition"),(0,i.x)("expand-transition",(0,r.Z)()),(0,i.x)("expand-x-transition",(0,r.Z)("",!0))},2027:(e,t,n)=>{n.d(t,{d:()=>s,Z:()=>a});var i=n(5803),r=n(2377);const o={absolute:Boolean,bottom:Boolean,fixed:Boolean,left:Boolean,right:Boolean,top:Boolean};function s(e=[]){return i.Z.extend({name:"positionable",props:e.length?(0,r.ji)(o,e):o})}const a=s()},4185:(e,t,n)=>{n.d(t,{f:()=>s});var i=n(5803),r=n(8298);function o(e,t){return()=>(0,r.Kd)(`The ${e} component must be used inside a ${t}`)}function s(e,t,n){const r=t&&n?{register:o(t,n),unregister:o(t,n)}:null;return i.Z.extend({name:"registrable-inject",inject:{[e]:{default:r}}})}},8298:(e,t,n)=>{n.d(t,{Kd:()=>o,N6:()=>s,fK:()=>a});var i=n(9721);function r(e,t,n){if(!i.Z.config.silent){if(n&&(t={_isVue:!0,$parent:n,$options:t}),t){if(t.$_alreadyWarned=t.$_alreadyWarned||[],t.$_alreadyWarned.includes(e))return;t.$_alreadyWarned.push(e)}return`[Vuetify] ${e}`+(t?function(e){if(e._isVue&&e.$parent){const t=[];let n=0;for(;e;){if(t.length>0){const i=t[t.length-1];if(i.constructor===e.constructor){n++,e=e.$parent;continue}n>0&&(t[t.length-1]=[i,n],n=0)}t.push(e),e=e.$parent}return"\n\nfound in\n\n"+t.map(((e,t)=>`${0===t?"---\x3e ":" ".repeat(5+2*t)}${Array.isArray(e)?`${c(e[0])}... (${e[1]} recursive calls)`:c(e)}`)).join("\n")}return`\n\n(found in ${c(e)})`}(t):"")}}function o(e,t,n){const i=r(e,t,n);null!=i&&console.warn(i)}function s(e,t,n){const i=r(e,t,n);null!=i&&console.error(i)}function a(e,t,n,i){s(`[BREAKING] '${e}' has been removed, use '${t}' instead. For more information, see the upgrade guide https://github.com/vuetifyjs/vuetify/releases/tag/v2.0.0#user-content-upgrade-guide`,n,i)}const l=/(?:^|[-_])(\w)/g;function c(e,t){if(e.$root===e)return"<Root>";const n="function"==typeof e&&null!=e.cid?e.options:e._isVue?e.$options||e.constructor.options:e||{};let i=n.name||n._componentTag;const r=n.__file;if(!i&&r){const e=r.match(/([^/\\]+)\.vue$/);i=e&&e[1]}return(i?`<${o=i,o.replace(l,(e=>e.toUpperCase())).replace(/[-_]/g,"")}>`:"<Anonymous>")+(r&&!1!==t?` at ${r}`:"");var o}},2377:(e,t,n)=>{n.d(t,{qw:()=>r,vZ:()=>o,vO:()=>s,ji:()=>a,kb:()=>l,GL:()=>c,Do:()=>d,RB:()=>h,XP:()=>p,_A:()=>v,jC:()=>g,TI:()=>b,z9:()=>y,uZ:()=>m,Ee:()=>w});let i=!1;try{if("undefined"!=typeof window){const e=Object.defineProperty({},"passive",{get:()=>{i=!0}});window.addEventListener("testListener",e,e),window.removeEventListener("testListener",e,e)}}catch(e){console.warn(e)}function r(e,t,n){const i=t.length-1;if(i<0)return void 0===e?n:e;for(let r=0;r<i;r++){if(null==e)return n;e=e[t[r]]}return null==e||void 0===e[t[i]]?n:e[t[i]]}function o(e,t){if(e===t)return!0;if(e instanceof Date&&t instanceof Date&&e.getTime()!==t.getTime())return!1;if(e!==Object(e)||t!==Object(t))return!1;const n=Object.keys(e);return n.length===Object.keys(t).length&&n.every((n=>o(e[n],t[n])))}function s(e,t,n){return null!=e&&t&&"string"==typeof t?void 0!==e[t]?e[t]:r(e,(t=(t=t.replace(/\[(\w+)\]/g,".$1")).replace(/^\./,"")).split("."),n):n}function a(e,t){const n={};for(let i=0;i<t.length;i++){const r=t[i];void 0!==e[r]&&(n[r]=e[r])}return n}function l(e,t="px"){return null==e||""===e?void 0:isNaN(+e)?String(e):`${Number(e)}${t}`}function c(e){return(e||"").replace(/([a-z])([A-Z])/g,"$1-$2").toLowerCase()}function u(e){return null!==e&&"object"==typeof e}const d=Object.freeze({enter:13,tab:9,delete:46,esc:27,space:32,up:38,down:40,left:37,right:39,end:35,home:36,del:46,backspace:8,insert:45,pageup:33,pagedown:34,shift:16});function h(e,t){const n=e.$vuetify.icons.component;if(t.startsWith("$")){const n=s(e,`$vuetify.icons.values.${t.split("$").pop().split(".").pop()}`,t);if("string"!=typeof n)return n;t=n}return null==n?t:{component:n,props:{icon:t}}}function p(e){return Object.keys(e)}const f=/-(\w)/g,v=e=>e.replace(f,((e,t)=>t?t.toUpperCase():""));function g(e){return e.charAt(0).toUpperCase()+e.slice(1)}function b(e){return null!=e?Array.isArray(e)?e:[e]:[]}function y(e,t="default",n,i=!1){return e.$scopedSlots.hasOwnProperty(t)?e.$scopedSlots[t](n instanceof Function?n():n):!e.$slots.hasOwnProperty(t)||n&&!i?void 0:e.$slots[t]}function m(e,t=0,n=1){return Math.max(t,Math.min(n,e))}function w(e={},t={}){for(const n in t){const i=e[n],r=t[n];u(i)&&u(r)?e[n]=w(i,r):e[n]=r}return e}},2138:(e,t,n)=>{n.d(t,{ZP:()=>a});var i=n(2377);const r=/;(?![^(]*\))/g,o=/:(.*)/;function s(e){const t={};for(const n of e.split(r)){let[e,r]=n.split(o);e=e.trim(),e&&("string"==typeof r&&(r=r.trim()),t[(0,i._A)(e)]=r)}return t}function a(){const e={};let t,n=arguments.length;for(;n--;)for(t of Object.keys(arguments[n]))switch(t){case"class":case"directives":arguments[n][t]&&(e[t]=c(e[t],arguments[n][t]));break;case"style":arguments[n][t]&&(e[t]=l(e[t],arguments[n][t]));break;case"staticClass":if(!arguments[n][t])break;void 0===e[t]&&(e[t]=""),e[t]&&(e[t]+=" "),e[t]+=arguments[n][t].trim();break;case"on":case"nativeOn":arguments[n][t]&&(e[t]=u(e[t],arguments[n][t]));break;case"attrs":case"props":case"domProps":case"scopedSlots":case"staticStyle":case"hook":case"transition":if(!arguments[n][t])break;e[t]||(e[t]={}),e[t]={...arguments[n][t],...e[t]};break;default:e[t]||(e[t]=arguments[n][t])}return e}function l(e,t){return e?t?(e=(0,i.TI)("string"==typeof e?s(e):e)).concat("string"==typeof t?s(t):t):e:t}function c(e,t){return t?e&&e?(0,i.TI)(e).concat(t):t:e}function u(...e){if(!e[0])return e[1];if(!e[1])return e[0];const t={};for(let n=2;n--;){const i=e[n];for(const e in i)i[e]&&(t[e]?t[e]=[].concat(i[e],t[e]):t[e]=i[e])}return t}}},n={};function i(e){var r=n[e];if(void 0!==r)return r.exports;var o=n[e]={exports:{}};return t[e].call(o.exports,o,o.exports,i),o.exports}i.m=t,e=[],i.O=(t,n,r,o)=>{if(!n){var s=1/0;for(u=0;u<e.length;u++){for(var[n,r,o]=e[u],a=!0,l=0;l<n.length;l++)(!1&o||s>=o)&&Object.keys(i.O).every((e=>i.O[e](n[l])))?n.splice(l--,1):(a=!1,o<s&&(s=o));if(a){e.splice(u--,1);var c=r();void 0!==c&&(t=c)}}return t}o=o||0;for(var u=e.length;u>0&&e[u-1][2]>o;u--)e[u]=e[u-1];e[u]=[n,r,o]},i.n=e=>{var t=e&&e.__esModule?()=>e.default:()=>e;return i.d(t,{a:t}),t},i.d=(e,t)=>{for(var n in t)i.o(t,n)&&!i.o(e,n)&&Object.defineProperty(e,n,{enumerable:!0,get:t[n]})},i.g=function(){if("object"==typeof globalThis)return globalThis;try{return this||new Function("return this")()}catch(e){if("object"==typeof window)return window}}(),i.o=(e,t)=>Object.prototype.hasOwnProperty.call(e,t),i.r=e=>{"undefined"!=typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(e,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(e,"__esModule",{value:!0})},(()=>{var e={564:0};i.O.j=t=>0===e[t];var t=(t,n)=>{var r,o,[s,a,l]=n,c=0;if(s.some((t=>0!==e[t]))){for(r in a)i.o(a,r)&&(i.m[r]=a[r]);if(l)var u=l(i)}for(t&&t(n);c<s.length;c++)o=s[c],i.o(e,o)&&e[o]&&e[o][0](),e[o]=0;return i.O(u)},n=self.webpackChunk=self.webpackChunk||[];n.forEach(t.bind(null,0)),n.push=t.bind(null,n.push.bind(n))})();var r=i.O(void 0,[515,821,873,314],(()=>i(6892)));r=i.O(r)})();