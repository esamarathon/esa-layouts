(()=>{"use strict";var t,e={8172:(t,e,n)=>{var i=n(5803),r=n(9459),s=n(5925);n(4807),n(7023),n(5654),n(779),n(8793);var o=n(8586),a=l("computed",o.rn);function l(t,e){function n(n,i){return(0,s.createDecorator)((function(r,s){r[t]||(r[t]={});var o,a=((o={})[s]=n,o);r[t][s]=void 0!==i?e(i,a)[s]:e(a)[s]}))}return function(t,e){if("string"==typeof e){var i=e,r=t;return n(i,void 0)(r,i)}return n(t,function(t){var e=t&&t.namespace;if("string"==typeof e)return"/"!==e[e.length-1]?e+"/":e}(e))}}l("computed",o.Se),l("methods",o.nv),l("methods",o.OI);var u=function(t,e,n,i){var r,s=arguments.length,o=s<3?e:null===i?i=Object.getOwnPropertyDescriptor(e,n):i;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)o=Reflect.decorate(t,e,n,i);else for(var a=t.length-1;a>=0;a--)(r=t[a])&&(o=(s<3?r(o):s>3?r(e,n,o):r(e,n))||o);return s>3&&o&&Object.defineProperty(e,n,o),o};let c=class extends i.Z{constructor(){super(...arguments),this.entry="",this.disable=!1}onDonationReaderChanged(t){this.entry=t||""}modify(t=!1){return e=this,n=void 0,r=function*(){this.disable=!0;try{yield nodecg.sendMessage("readerModify",t?null:this.entry)}catch(t){}this.entry=this.donationReader||"",this.disable=!1},new((i=void 0)||(i=Promise))((function(t,s){function o(t){try{l(r.next(t))}catch(t){s(t)}}function a(t){try{l(r.throw(t))}catch(t){s(t)}}function l(e){var n;e.done?t(e.value):(n=e.value,n instanceof i?n:new i((function(t){t(n)}))).then(o,a)}l((r=r.apply(e,n||[])).next())}));var e,n,i,r}};u([a],c.prototype,"donationReader",void 0),u([function(t,e){void 0===e&&(e={});var n=e.deep,i=void 0!==n&&n,r=e.immediate,o=void 0!==r&&r;return(0,s.createDecorator)((function(e,n){"object"!=typeof e.watch&&(e.watch=Object.create(null));var r=e.watch;"object"!=typeof r[t]||Array.isArray(r[t])?void 0===r[t]&&(r[t]=[]):r[t]=[r[t]],r[t].push({handler:n,deep:i,immediate:o})}))}("donationReader",{immediate:!0})],c.prototype,"onDonationReaderChanged",null),c=u([s.default],c);const d=c;var h=n(5440),v=n(7618),f=n.n(v),p=n(1883),b=n(690),g=n(3777),m=n(1954),y=n(2377);const x=m.Z.extend({name:"v-progress-circular",directives:{intersect:g.Z},props:{button:Boolean,indeterminate:Boolean,rotate:{type:[Number,String],default:0},size:{type:[Number,String],default:32},width:{type:[Number,String],default:4},value:{type:[Number,String],default:0}},data:()=>({radius:20,isVisible:!0}),computed:{calculatedSize(){return Number(this.size)+(this.button?8:0)},circumference(){return 2*Math.PI*this.radius},classes(){return{"v-progress-circular--visible":this.isVisible,"v-progress-circular--indeterminate":this.indeterminate,"v-progress-circular--button":this.button}},normalizedValue(){return this.value<0?0:this.value>100?100:parseFloat(this.value)},strokeDashArray(){return Math.round(1e3*this.circumference)/1e3},strokeDashOffset(){return(100-this.normalizedValue)/100*this.circumference+"px"},strokeWidth(){return Number(this.width)/+this.size*this.viewBoxSize*2},styles(){return{height:(0,y.kb)(this.calculatedSize),width:(0,y.kb)(this.calculatedSize)}},svgStyles(){return{transform:`rotate(${Number(this.rotate)}deg)`}},viewBoxSize(){return this.radius/(1-Number(this.width)/+this.size)}},methods:{genCircle(t,e){return this.$createElement("circle",{class:`v-progress-circular__${t}`,attrs:{fill:"transparent",cx:2*this.viewBoxSize,cy:2*this.viewBoxSize,r:this.radius,"stroke-width":this.strokeWidth,"stroke-dasharray":this.strokeDashArray,"stroke-dashoffset":e}})},genSvg(){const t=[this.indeterminate||this.genCircle("underlay",0),this.genCircle("overlay",this.strokeDashOffset)];return this.$createElement("svg",{style:this.svgStyles,attrs:{xmlns:"http://www.w3.org/2000/svg",viewBox:`${this.viewBoxSize} ${this.viewBoxSize} ${2*this.viewBoxSize} ${2*this.viewBoxSize}`}},t)},genInfo(){return this.$createElement("div",{staticClass:"v-progress-circular__info"},this.$slots.default)},onObserve(t,e,n){this.isVisible=n}},render(t){return t("div",this.setTextColor(this.color,{staticClass:"v-progress-circular",attrs:{role:"progressbar","aria-valuemin":0,"aria-valuemax":100,"aria-valuenow":this.indeterminate?void 0:this.normalizedValue},class:this.classes,directives:[{name:"intersect",value:this.onObserve}],style:this.styles,on:this.$listeners}),[this.genSvg(),this.genInfo()])}});var w=n(3844);function $(t="value",e="input"){return i.Z.extend({name:"toggleable",model:{prop:t,event:e},props:{[t]:{required:!1}},data(){return{isActive:!!this[t]}},watch:{[t](t){this.isActive=!!t},isActive(n){!!n!==this[t]&&this.$emit(e,n)}}})}$();var k=n(8316),B=n(2027),S=n(9657),_=n(5010),C=n(6248),O=n(8298);const Z=(0,C.Z)(b.Z,S.Z,B.Z,_.Z,(0,w.d)("btnToggle"),$("inputValue")).extend().extend({name:"v-btn",props:{activeClass:{type:String,default(){return this.btnToggle?this.btnToggle.activeClass:""}},block:Boolean,depressed:Boolean,fab:Boolean,icon:Boolean,loading:Boolean,outlined:Boolean,plain:Boolean,retainFocusOnClick:Boolean,rounded:Boolean,tag:{type:String,default:"button"},text:Boolean,tile:Boolean,type:{type:String,default:"button"},value:null},data:()=>({proxyClass:"v-btn--active"}),computed:{classes(){return{"v-btn":!0,...S.Z.options.computed.classes.call(this),"v-btn--absolute":this.absolute,"v-btn--block":this.block,"v-btn--bottom":this.bottom,"v-btn--disabled":this.disabled,"v-btn--is-elevated":this.isElevated,"v-btn--fab":this.fab,"v-btn--fixed":this.fixed,"v-btn--has-bg":this.hasBg,"v-btn--icon":this.icon,"v-btn--left":this.left,"v-btn--loading":this.loading,"v-btn--outlined":this.outlined,"v-btn--plain":this.plain,"v-btn--right":this.right,"v-btn--round":this.isRound,"v-btn--rounded":this.rounded,"v-btn--router":this.to,"v-btn--text":this.text,"v-btn--tile":this.tile,"v-btn--top":this.top,...this.themeClasses,...this.groupClasses,...this.elevationClasses,...this.sizeableClasses}},computedElevation(){if(!this.disabled)return k.Z.options.computed.computedElevation.call(this)},computedRipple(){var t;const e=!this.icon&&!this.fab||{circle:!0};return!this.disabled&&(null!=(t=this.ripple)?t:e)},hasBg(){return!(this.text||this.plain||this.outlined||this.icon)},isElevated(){return Boolean(!(this.icon||this.text||this.outlined||this.depressed||this.disabled||this.plain||!(null==this.elevation||Number(this.elevation)>0)))},isRound(){return Boolean(this.icon||this.fab)},styles(){return{...this.measurableStyles}}},created(){[["flat","text"],["outline","outlined"],["round","rounded"]].forEach((([t,e])=>{this.$attrs.hasOwnProperty(t)&&(0,O.fK)(t,e,this)}))},methods:{click(t){!this.retainFocusOnClick&&!this.fab&&t.detail&&this.$el.blur(),this.$emit("click",t),this.btnToggle&&this.toggle()},genContent(){return this.$createElement("span",{staticClass:"v-btn__content"},this.$slots.default)},genLoader(){return this.$createElement("span",{class:"v-btn__loader"},this.$slots.loader||[this.$createElement(x,{props:{indeterminate:!0,size:23,width:2}})])}},render(t){const e=[this.genContent(),this.loading&&this.genLoader()],{tag:n,data:i}=this.generateRouteLink(),r=this.hasBg?this.setBackgroundColor:this.setTextColor;return"button"===n&&(i.attrs.type=this.type,i.attrs.disabled=this.disabled),i.attrs.value=["string","number"].includes(typeof this.value)?this.value:JSON.stringify(this.value),t(n,this.disabled?i:r(this.color,i),e)}});var R=n(7337),q=n(5861),z=(0,h.Z)(d,(function(){var t=this,e=t.$createElement,n=t._self._c||e;return n("v-app",[n("div",{staticClass:"d-flex"},[n("v-text-field",{attrs:{label:"Donation Reader","hide-details":"",filled:"",spellcheck:!1,disabled:t.disable},on:{keyup:function(e){if(!e.type.indexOf("key")&&t._k(e.keyCode,"enter",13,e.key,"Enter"))return null;t.modify(),e.target.blur()}},model:{value:t.entry,callback:function(e){t.entry=e},expression:"entry"}}),t._v(" "),n("v-btn",{style:{"min-width":"0","margin-left":"5px"},attrs:{height:"56px",disabled:t.disable},on:{click:function(e){return t.modify()}}},[n("v-icon",[t._v("mdi-check")])],1)],1),t._v(" "),n("v-btn",{style:{"margin-top":"10px"},attrs:{disabled:t.disable},on:{click:function(e){return t.modify(!0)}}},[t._v("\n    Clear\n  ")])],1)}),[],!1,null,null,null);const j=z.exports;f()(z,{VApp:p.Z,VBtn:Z,VIcon:R.Z,VTextField:q.Z});var E=n(8138),V=n.n(E);i.Z.use(o.ZP);const A={donationReader:nodecg.Replicant("donationReader")},N=new o.ZP.Store({state:{},mutations:{setState(t,{name:e,val:n}){i.Z.set(t,e,n)}}});var P,T,D,M;Object.keys(A).forEach((t=>{A[t].on("change",(e=>{N.commit("setState",{name:t,val:V()(e)})}))})),(P=void 0,T=void 0,D=void 0,M=function*(){return yield NodeCG.waitForReplicants(...Object.keys(A).map((t=>A[t]))),N},new(D||(D=Promise))((function(t,e){function n(t){try{r(M.next(t))}catch(t){e(t)}}function i(t){try{r(M.throw(t))}catch(t){e(t)}}function r(e){var r;e.done?t(e.value):(r=e.value,r instanceof D?r:new D((function(t){t(r)}))).then(n,i)}r((M=M.apply(P,T||[])).next())}))).then((t=>{new i.Z({vuetify:r.Z,store:t,el:"#App",render:t=>t(j)})}))},779:(t,e,n)=>{"undefined"!=typeof Reflect&&Reflect.getMetadata},1058:(t,e,n)=>{n.d(e,{Z5:()=>s,Qn:()=>o});var i=n(2727),r=n(4240);(0,i.q)("carousel-transition"),(0,i.q)("carousel-reverse-transition"),(0,i.q)("tab-transition"),(0,i.q)("tab-reverse-transition"),(0,i.q)("menu-transition"),(0,i.q)("fab-transition","center center","out-in"),(0,i.q)("dialog-transition"),(0,i.q)("dialog-bottom-transition"),(0,i.q)("dialog-top-transition");const s=(0,i.q)("fade-transition"),o=((0,i.q)("scale-transition"),(0,i.q)("scroll-x-transition"),(0,i.q)("scroll-x-reverse-transition"),(0,i.q)("scroll-y-transition"),(0,i.q)("scroll-y-reverse-transition"),(0,i.q)("slide-x-transition"));(0,i.q)("slide-x-reverse-transition"),(0,i.q)("slide-y-transition"),(0,i.q)("slide-y-reverse-transition"),(0,i.x)("expand-transition",(0,r.Z)()),(0,i.x)("expand-x-transition",(0,r.Z)("",!0))},2027:(t,e,n)=>{n.d(e,{d:()=>o,Z:()=>a});var i=n(5803),r=n(2377);const s={absolute:Boolean,bottom:Boolean,fixed:Boolean,left:Boolean,right:Boolean,top:Boolean};function o(t=[]){return i.Z.extend({name:"positionable",props:t.length?(0,r.ji)(s,t):s})}const a=o()},8298:(t,e,n)=>{n.d(e,{Kd:()=>s,N6:()=>o,fK:()=>a});var i=n(9721);function r(t,e,n){if(!i.Z.config.silent){if(n&&(e={_isVue:!0,$parent:n,$options:e}),e){if(e.$_alreadyWarned=e.$_alreadyWarned||[],e.$_alreadyWarned.includes(t))return;e.$_alreadyWarned.push(t)}return`[Vuetify] ${t}`+(e?function(t){if(t._isVue&&t.$parent){const e=[];let n=0;for(;t;){if(e.length>0){const i=e[e.length-1];if(i.constructor===t.constructor){n++,t=t.$parent;continue}n>0&&(e[e.length-1]=[i,n],n=0)}e.push(t),t=t.$parent}return"\n\nfound in\n\n"+e.map(((t,e)=>`${0===e?"---\x3e ":" ".repeat(5+2*e)}${Array.isArray(t)?`${u(t[0])}... (${t[1]} recursive calls)`:u(t)}`)).join("\n")}return`\n\n(found in ${u(t)})`}(e):"")}}function s(t,e,n){const i=r(t,e,n);null!=i&&console.warn(i)}function o(t,e,n){const i=r(t,e,n);null!=i&&console.error(i)}function a(t,e,n,i){o(`[BREAKING] '${t}' has been removed, use '${e}' instead. For more information, see the upgrade guide https://github.com/vuetifyjs/vuetify/releases/tag/v2.0.0#user-content-upgrade-guide`,n,i)}const l=/(?:^|[-_])(\w)/g;function u(t,e){if(t.$root===t)return"<Root>";const n="function"==typeof t&&null!=t.cid?t.options:t._isVue?t.$options||t.constructor.options:t||{};let i=n.name||n._componentTag;const r=n.__file;if(!i&&r){const t=r.match(/([^/\\]+)\.vue$/);i=t&&t[1]}return(i?`<${s=i,s.replace(l,(t=>t.toUpperCase())).replace(/[-_]/g,"")}>`:"<Anonymous>")+(r&&!1!==e?` at ${r}`:"");var s}}},n={};function i(t){var r=n[t];if(void 0!==r)return r.exports;var s=n[t]={exports:{}};return e[t](s,s.exports,i),s.exports}i.m=e,t=[],i.O=(e,n,r,s)=>{if(!n){var o=1/0;for(c=0;c<t.length;c++){for(var[n,r,s]=t[c],a=!0,l=0;l<n.length;l++)(!1&s||o>=s)&&Object.keys(i.O).every((t=>i.O[t](n[l])))?n.splice(l--,1):(a=!1,s<o&&(o=s));if(a){t.splice(c--,1);var u=r();void 0!==u&&(e=u)}}return e}s=s||0;for(var c=t.length;c>0&&t[c-1][2]>s;c--)t[c]=t[c-1];t[c]=[n,r,s]},i.n=t=>{var e=t&&t.__esModule?()=>t.default:()=>t;return i.d(e,{a:e}),e},i.d=(t,e)=>{for(var n in e)i.o(e,n)&&!i.o(t,n)&&Object.defineProperty(t,n,{enumerable:!0,get:e[n]})},i.g=function(){if("object"==typeof globalThis)return globalThis;try{return this||new Function("return this")()}catch(t){if("object"==typeof window)return window}}(),i.o=(t,e)=>Object.prototype.hasOwnProperty.call(t,e),i.r=t=>{"undefined"!=typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(t,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(t,"__esModule",{value:!0})},(()=>{var t={564:0};i.O.j=e=>0===t[e];var e=(e,n)=>{var r,s,[o,a,l]=n,u=0;if(o.some((e=>0!==t[e]))){for(r in a)i.o(a,r)&&(i.m[r]=a[r]);if(l)var c=l(i)}for(e&&e(n);u<o.length;u++)s=o[u],i.o(t,s)&&t[s]&&t[s][0](),t[o[u]]=0;return i.O(c)},n=self.webpackChunk=self.webpackChunk||[];n.forEach(e.bind(null,0)),n.push=e.bind(null,n.push.bind(n))})();var r=i.O(void 0,[515,873,13,314,193],(()=>i(8172)));r=i.O(r)})();