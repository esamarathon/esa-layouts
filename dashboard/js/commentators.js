(()=>{"use strict";var t,e={1488:(t,e,i)=>{var s=i(8138),n=i.n(s),r=i(829),a=i(5803),o=i(708),l=i(4170),c=function(t,e,i,s){var n,r=arguments.length,a=r<3?e:null===s?s=Object.getOwnPropertyDescriptor(e,i):s;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)a=Reflect.decorate(t,e,i,s);else for(var o=t.length-1;o>=0;o--)(n=t[o])&&(a=(r<3?n(a):r>3?n(e,i,a):n(e,i))||a);return r>3&&a&&Object.defineProperty(e,i,a),a};const u=new r.SpeedcontrolUtilBrowser(nodecg),d={bids:nodecg.Replicant("bids"),bigbuttonPlayerMap:nodecg.Replicant("bigbuttonPlayerMap"),commentators:nodecg.Replicant("commentators"),countdown:nodecg.Replicant("countdown"),currentRunDelay:nodecg.Replicant("currentRunDelay"),donationReader:nodecg.Replicant("donationReader"),donationsToRead:nodecg.Replicant("donationsToRead"),donationTotal:nodecg.Replicant("donationTotal"),donationTotalMilestones:nodecg.Replicant("donationTotalMilestones"),gameLayouts:nodecg.Replicant("gameLayouts"),obsData:nodecg.Replicant("obsData"),omnibar:nodecg.Replicant("omnibar"),otherStreamData:nodecg.Replicant("otherStreamData"),prizes:nodecg.Replicant("prizes"),runDataActiveRun:u.runDataActiveRun,runDataActiveRunSurrounding:u.runDataActiveRunSurrounding,runDataArray:u.runDataArray,serverTimestamp:nodecg.Replicant("serverTimestamp"),streamDeckData:nodecg.Replicant("streamDeckData"),timer:u.timer,ttsVoices:nodecg.Replicant("ttsVoices"),upcomingRunID:nodecg.Replicant("upcomingRunID"),videoPlayer:nodecg.Replicant("videoPlayer")};let h,p=class extends l.g4{constructor(){super(...arguments),this.reps={}}get repsTyped(){return this.reps}setState({name:t,val:e}){a.Z.set(this.reps,t,n()(e))}setReplicant({name:t,val:e}){a.Z.set(this.reps,t,n()(e)),d[t].value=n()(e)}};c([l.mm],p.prototype,"setState",null),c([l.mm],p.prototype,"setReplicant",null),p=c([(0,l.Yl)({name:"ReplicantModule",namespaced:!0})],p);const v=(0,o.uD)("ReplicantModule");var m=i(9459),f=i(5925);i(4807),i(7023),i(5654),i(779),i(8793);var g=i(8586),b=function(t,e,i,s){var n,r=arguments.length,a=r<3?e:null===s?s=Object.getOwnPropertyDescriptor(e,i):s;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)a=Reflect.decorate(t,e,i,s);else for(var o=t.length-1;o>=0;o--)(n=t[o])&&(a=(r<3?n(a):r>3?n(e,i,a):n(e,i))||a);return r>3&&a&&Object.defineProperty(e,i,a),a};a.Z.use(g.ZP);let y=class extends l.g4{get reps(){return this.context.rootState.ReplicantModule.reps}clearCommentators(){h.setReplicant({name:"commentators",val:[]})}};b([l.mm],y.prototype,"clearCommentators",null),y=b([(0,l.Yl)({name:"OurModule"})],y);const x=new g.yh({strict:!1,state:{},modules:{ReplicantModule:p,OurModule:y}}),k=x,$=(0,l.rT)(y,x);var w=function(t,e,i,s){var n,r=arguments.length,a=r<3?e:null===s?s=Object.getOwnPropertyDescriptor(e,i):s;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)a=Reflect.decorate(t,e,i,s);else for(var o=t.length-1;o>=0;o--)(n=t[o])&&(a=(r<3?n(a):r>3?n(e,i,a):n(e,i))||a);return r>3&&a&&Object.defineProperty(e,i,a),a};let B=class extends a.Z{constructor(){super(...arguments),this.nameEntry="",this.disable=!1,this.clear=$.clearCommentators}add(){return t=this,e=void 0,s=function*(){this.disable=!0;try{yield nodecg.sendMessage("commentatorAdd",this.nameEntry)}catch(t){}this.disable=!1,this.nameEntry=""},new((i=void 0)||(i=Promise))((function(n,r){function a(t){try{l(s.next(t))}catch(t){r(t)}}function o(t){try{l(s.throw(t))}catch(t){r(t)}}function l(t){var e;t.done?n(t.value):(e=t.value,e instanceof i?e:new i((function(t){t(e)}))).then(a,o)}l((s=s.apply(t,e||[])).next())}));var t,e,i,s}};w([v.State((t=>t.reps.commentators))],B.prototype,"commentators",void 0),B=w([f.default],B);const C=B;var R=i(5440),O=i(7618),S=i.n(O),Z=i(1883),V=i(690),I=i(3777),_=i(1954),A=i(2377);const j=_.Z.extend({name:"v-progress-circular",directives:{intersect:I.Z},props:{button:Boolean,indeterminate:Boolean,rotate:{type:[Number,String],default:0},size:{type:[Number,String],default:32},width:{type:[Number,String],default:4},value:{type:[Number,String],default:0}},data:()=>({radius:20,isVisible:!0}),computed:{calculatedSize(){return Number(this.size)+(this.button?8:0)},circumference(){return 2*Math.PI*this.radius},classes(){return{"v-progress-circular--visible":this.isVisible,"v-progress-circular--indeterminate":this.indeterminate,"v-progress-circular--button":this.button}},normalizedValue(){return this.value<0?0:this.value>100?100:parseFloat(this.value)},strokeDashArray(){return Math.round(1e3*this.circumference)/1e3},strokeDashOffset(){return(100-this.normalizedValue)/100*this.circumference+"px"},strokeWidth(){return Number(this.width)/+this.size*this.viewBoxSize*2},styles(){return{height:(0,A.kb)(this.calculatedSize),width:(0,A.kb)(this.calculatedSize)}},svgStyles(){return{transform:`rotate(${Number(this.rotate)}deg)`}},viewBoxSize(){return this.radius/(1-Number(this.width)/+this.size)}},methods:{genCircle(t,e){return this.$createElement("circle",{class:`v-progress-circular__${t}`,attrs:{fill:"transparent",cx:2*this.viewBoxSize,cy:2*this.viewBoxSize,r:this.radius,"stroke-width":this.strokeWidth,"stroke-dasharray":this.strokeDashArray,"stroke-dashoffset":e}})},genSvg(){const t=[this.indeterminate||this.genCircle("underlay",0),this.genCircle("overlay",this.strokeDashOffset)];return this.$createElement("svg",{style:this.svgStyles,attrs:{xmlns:"http://www.w3.org/2000/svg",viewBox:`${this.viewBoxSize} ${this.viewBoxSize} ${2*this.viewBoxSize} ${2*this.viewBoxSize}`}},t)},genInfo(){return this.$createElement("div",{staticClass:"v-progress-circular__info"},this.$slots.default)},onObserve(t,e,i){this.isVisible=i}},render(t){return t("div",this.setTextColor(this.color,{staticClass:"v-progress-circular",attrs:{role:"progressbar","aria-valuemin":0,"aria-valuemax":100,"aria-valuenow":this.indeterminate?void 0:this.normalizedValue},class:this.classes,directives:[{name:"intersect",value:this.onObserve}],style:this.styles,on:this.$listeners}),[this.genSvg(),this.genInfo()])}});var D=i(3844);function M(t="value",e="input"){return a.Z.extend({name:"toggleable",model:{prop:t,event:e},props:{[t]:{required:!1}},data(){return{isActive:!!this[t]}},watch:{[t](t){this.isActive=!!t},isActive(i){!!i!==this[t]&&this.$emit(e,i)}}})}M();var T=i(8316),E=i(2027),P=i(9657),L=i(5010),z=i(6248),N=i(8298);const q=(0,z.Z)(V.Z,P.Z,E.Z,L.Z,(0,D.d)("btnToggle"),M("inputValue")).extend().extend({name:"v-btn",props:{activeClass:{type:String,default(){return this.btnToggle?this.btnToggle.activeClass:""}},block:Boolean,depressed:Boolean,fab:Boolean,icon:Boolean,loading:Boolean,outlined:Boolean,plain:Boolean,retainFocusOnClick:Boolean,rounded:Boolean,tag:{type:String,default:"button"},text:Boolean,tile:Boolean,type:{type:String,default:"button"},value:null},data:()=>({proxyClass:"v-btn--active"}),computed:{classes(){return{"v-btn":!0,...P.Z.options.computed.classes.call(this),"v-btn--absolute":this.absolute,"v-btn--block":this.block,"v-btn--bottom":this.bottom,"v-btn--disabled":this.disabled,"v-btn--is-elevated":this.isElevated,"v-btn--fab":this.fab,"v-btn--fixed":this.fixed,"v-btn--has-bg":this.hasBg,"v-btn--icon":this.icon,"v-btn--left":this.left,"v-btn--loading":this.loading,"v-btn--outlined":this.outlined,"v-btn--plain":this.plain,"v-btn--right":this.right,"v-btn--round":this.isRound,"v-btn--rounded":this.rounded,"v-btn--router":this.to,"v-btn--text":this.text,"v-btn--tile":this.tile,"v-btn--top":this.top,...this.themeClasses,...this.groupClasses,...this.elevationClasses,...this.sizeableClasses}},computedElevation(){if(!this.disabled)return T.Z.options.computed.computedElevation.call(this)},computedRipple(){var t;const e=!this.icon&&!this.fab||{circle:!0};return!this.disabled&&(null!=(t=this.ripple)?t:e)},hasBg(){return!(this.text||this.plain||this.outlined||this.icon)},isElevated(){return Boolean(!(this.icon||this.text||this.outlined||this.depressed||this.disabled||this.plain||!(null==this.elevation||Number(this.elevation)>0)))},isRound(){return Boolean(this.icon||this.fab)},styles(){return{...this.measurableStyles}}},created(){[["flat","text"],["outline","outlined"],["round","rounded"]].forEach((([t,e])=>{this.$attrs.hasOwnProperty(t)&&(0,N.fK)(t,e,this)}))},methods:{click(t){!this.retainFocusOnClick&&!this.fab&&t.detail&&this.$el.blur(),this.$emit("click",t),this.btnToggle&&this.toggle()},genContent(){return this.$createElement("span",{staticClass:"v-btn__content"},this.$slots.default)},genLoader(){return this.$createElement("span",{class:"v-btn__loader"},this.$slots.loader||[this.$createElement(j,{props:{indeterminate:!0,size:23,width:2}})])}},render(t){const e=[this.genContent(),this.loading&&this.genLoader()],{tag:i,data:s}=this.generateRouteLink(),n=this.hasBg?this.setBackgroundColor:this.setTextColor;return"button"===i&&(s.attrs.type=this.type,s.attrs.disabled=this.disabled),s.attrs.value=["string","number"].includes(typeof this.value)?this.value:JSON.stringify(this.value),t(i,this.disabled?s:n(this.color,s),e)}});var G=i(2750);const F=(0,z.Z)(G.Z,P.Z,V.Z).extend({name:"v-card",props:{flat:Boolean,hover:Boolean,img:String,link:Boolean,loaderHeight:{type:[Number,String],default:4},raised:Boolean},computed:{classes(){return{"v-card":!0,...P.Z.options.computed.classes.call(this),"v-card--flat":this.flat,"v-card--hover":this.hover,"v-card--link":this.isClickable,"v-card--loading":this.loading,"v-card--disabled":this.disabled,"v-card--raised":this.raised,...V.Z.options.computed.classes.call(this)}},styles(){const t={...V.Z.options.computed.styles.call(this)};return this.img&&(t.background=`url("${this.img}") center center / cover no-repeat`),t}},methods:{genProgress(){const t=G.Z.options.methods.genProgress.call(this);return t?this.$createElement("div",{staticClass:"v-card__progress",key:"progress"},[t]):null}},render(t){const{tag:e,data:i}=this.generateRouteLink();return i.style=this.styles,this.isClickable&&(i.attrs=i.attrs||{},i.attrs.tabindex=0),t(e,this.setBackgroundColor(this.color,i),[this.genProgress(),this.$slots.default])}});var W=i(7019),K=i(9146);const U=K.Z.extend().extend({name:"v-list",provide(){return{isInList:!0,list:this}},inject:{isInMenu:{default:!1},isInNav:{default:!1}},props:{dense:Boolean,disabled:Boolean,expand:Boolean,flat:Boolean,nav:Boolean,rounded:Boolean,subheader:Boolean,threeLine:Boolean,twoLine:Boolean},data:()=>({groups:[]}),computed:{classes(){return{...K.Z.options.computed.classes.call(this),"v-list--dense":this.dense,"v-list--disabled":this.disabled,"v-list--flat":this.flat,"v-list--nav":this.nav,"v-list--rounded":this.rounded,"v-list--subheader":this.subheader,"v-list--two-line":this.twoLine,"v-list--three-line":this.threeLine}}},methods:{register(t){this.groups.push(t)},unregister(t){const e=this.groups.findIndex((e=>e._uid===t._uid));e>-1&&this.groups.splice(e,1)},listClick(t){if(!this.expand)for(const e of this.groups)e.toggle(t)}},render(t){const e={staticClass:"v-list",class:this.classes,style:this.styles,attrs:{role:this.isInNav||this.isInMenu?void 0:"list",...this.attrs$}};return t(this.tag,this.setBackgroundColor(this.color,e),[this.$slots.default])}});var J=i(9405),Y=i(2385);const H=(0,z.Z)(_.Z,P.Z,J.Z,(0,D.d)("listItemGroup"),M("inputValue")).extend().extend({name:"v-list-item",directives:{Ripple:Y.Z},inject:{isInGroup:{default:!1},isInList:{default:!1},isInMenu:{default:!1},isInNav:{default:!1}},inheritAttrs:!1,props:{activeClass:{type:String,default(){return this.listItemGroup?this.listItemGroup.activeClass:""}},dense:Boolean,inactive:Boolean,link:Boolean,selectable:{type:Boolean},tag:{type:String,default:"div"},threeLine:Boolean,twoLine:Boolean,value:null},data:()=>({proxyClass:"v-list-item--active"}),computed:{classes(){return{"v-list-item":!0,...P.Z.options.computed.classes.call(this),"v-list-item--dense":this.dense,"v-list-item--disabled":this.disabled,"v-list-item--link":this.isClickable&&!this.inactive,"v-list-item--selectable":this.selectable,"v-list-item--three-line":this.threeLine,"v-list-item--two-line":this.twoLine,...this.themeClasses}},isClickable(){return Boolean(P.Z.options.computed.isClickable.call(this)||this.listItemGroup)}},created(){this.$attrs.hasOwnProperty("avatar")&&(0,N.Jk)("avatar",this)},methods:{click(t){t.detail&&this.$el.blur(),this.$emit("click",t),this.to||this.toggle()},genAttrs(){const t={"aria-disabled":!!this.disabled||void 0,tabindex:this.isClickable&&!this.disabled?0:-1,...this.$attrs};return this.$attrs.hasOwnProperty("role")||this.isInNav||(this.isInGroup?(t.role="option",t["aria-selected"]=String(this.isActive)):this.isInMenu?(t.role=this.isClickable?"menuitem":void 0,t.id=t.id||`list-item-${this._uid}`):this.isInList&&(t.role="listitem")),t},toggle(){this.to&&void 0===this.inputValue&&(this.isActive=!this.isActive),this.$emit("change")}},render(t){let{tag:e,data:i}=this.generateRouteLink();i.attrs={...i.attrs,...this.genAttrs()},i[this.to?"nativeOn":"on"]={...i[this.to?"nativeOn":"on"],keydown:t=>{t.keyCode===A.Do.enter&&this.click(t),this.$emit("keydown",t)}},this.inactive&&(e="div"),this.inactive&&this.to&&(i.on=i.nativeOn,delete i.nativeOn);const s=this.$scopedSlots.default?this.$scopedSlots.default({active:this.isActive,toggle:this.toggle}):this.$slots.default;return t(e,this.isActive?this.setTextColor(this.color,i):i,s)}}),Q=a.Z.extend({name:"comparable",props:{valueComparator:{type:Function,default:A.vZ}}});var X=i(312);const tt=(0,z.Z)(Q,X.Z,J.Z).extend({name:"base-item-group",props:{activeClass:{type:String,default:"v-item--active"},mandatory:Boolean,max:{type:[Number,String],default:null},multiple:Boolean,tag:{type:String,default:"div"}},data(){return{internalLazyValue:void 0!==this.value?this.value:this.multiple?[]:void 0,items:[]}},computed:{classes(){return{"v-item-group":!0,...this.themeClasses}},selectedIndex(){return this.selectedItem&&this.items.indexOf(this.selectedItem)||-1},selectedItem(){if(!this.multiple)return this.selectedItems[0]},selectedItems(){return this.items.filter(((t,e)=>this.toggleMethod(this.getValue(t,e))))},selectedValues(){return null==this.internalValue?[]:Array.isArray(this.internalValue)?this.internalValue:[this.internalValue]},toggleMethod(){if(!this.multiple)return t=>this.valueComparator(this.internalValue,t);const t=this.internalValue;return Array.isArray(t)?e=>t.some((t=>this.valueComparator(t,e))):()=>!1}},watch:{internalValue:"updateItemsState",items:"updateItemsState"},created(){this.multiple&&!Array.isArray(this.internalValue)&&(0,N.Kd)("Model must be bound to an array if the multiple property is true.",this)},methods:{genData(){return{class:this.classes}},getValue:(t,e)=>void 0===t.value?e:t.value,onClick(t){this.updateInternalValue(this.getValue(t,this.items.indexOf(t)))},register(t){const e=this.items.push(t)-1;t.$on("change",(()=>this.onClick(t))),this.mandatory&&!this.selectedValues.length&&this.updateMandatory(),this.updateItem(t,e)},unregister(t){if(this._isDestroyed)return;const e=this.items.indexOf(t),i=this.getValue(t,e);if(this.items.splice(e,1),!(this.selectedValues.indexOf(i)<0)){if(!this.mandatory)return this.updateInternalValue(i);this.multiple&&Array.isArray(this.internalValue)?this.internalValue=this.internalValue.filter((t=>t!==i)):this.internalValue=void 0,this.selectedItems.length||this.updateMandatory(!0)}},updateItem(t,e){const i=this.getValue(t,e);t.isActive=this.toggleMethod(i)},updateItemsState(){this.$nextTick((()=>{if(this.mandatory&&!this.selectedItems.length)return this.updateMandatory();this.items.forEach(this.updateItem)}))},updateInternalValue(t){this.multiple?this.updateMultiple(t):this.updateSingle(t)},updateMandatory(t){if(!this.items.length)return;const e=this.items.slice();t&&e.reverse();const i=e.find((t=>!t.disabled));if(!i)return;const s=this.items.indexOf(i);this.updateInternalValue(this.getValue(i,s))},updateMultiple(t){const e=(Array.isArray(this.internalValue)?this.internalValue:[]).slice(),i=e.findIndex((e=>e===t));this.mandatory&&i>-1&&e.length-1<1||null!=this.max&&i<0&&e.length+1>this.max||(i>-1?e.splice(i,1):e.push(t),this.internalValue=e)},updateSingle(t){const e=t===this.internalValue;this.mandatory&&e||(this.internalValue=e?void 0:t)}},render(t){return t(this.tag,this.genData(),this.$slots.default)}}),et=(tt.extend({name:"v-item-group",provide(){return{itemGroup:this}}}),(0,z.Z)(tt,_.Z).extend({name:"v-list-item-group",provide(){return{isInGroup:!0,listItemGroup:this}},computed:{classes(){return{...tt.options.computed.classes.call(this),"v-list-item-group":!0}}},methods:{genData(){return this.setTextColor(this.color,{...tt.options.methods.genData.call(this),attrs:{role:"listbox"}})}}}));var it=i(5861),st=(0,R.Z)(C,(function(){var t=this,e=t.$createElement,i=t._self._c||e;return i("v-app",[i("v-card",{style:{"margin-bottom":"10px"},attrs:{tile:""}},[i("v-list",{attrs:{dense:"",disabled:""}},[i("v-list-item-group",[t.commentators.length?t._l(t.commentators,(function(e,s){return i("v-list-item",{key:s},[t._v("\n            "+t._s(e)+"\n          ")])})):i("v-list-item",{style:{"font-style":"italic"}},[t._v("\n          No commentators specified\n        ")])],2)],1)],1),t._v(" "),i("div",{staticClass:"d-flex"},[i("v-text-field",{attrs:{label:"Enter Name Here","hide-details":"",filled:"",spellcheck:!1,disabled:t.disable},on:{keyup:function(e){return!e.type.indexOf("key")&&t._k(e.keyCode,"enter",13,e.key,"Enter")?null:t.add.apply(null,arguments)}},model:{value:t.nameEntry,callback:function(e){t.nameEntry=e},expression:"nameEntry"}}),t._v(" "),i("v-btn",{style:{"min-width":"0","margin-left":"5px"},attrs:{height:"56px",disabled:t.disable},on:{click:t.add}},[i("v-icon",[t._v("mdi-check")])],1)],1),t._v(" "),i("v-btn",{style:{"margin-top":"10px"},attrs:{disabled:t.disable},on:{click:t.clear}},[t._v("\n    Manual Clear\n  ")])],1)}),[],!1,null,null,null);const nt=st.exports;S()(st,{VApp:Z.Z,VBtn:q,VCard:F,VIcon:W.Z,VList:U,VListItem:H,VListItemGroup:et,VTextField:it.Z}),function(t){return e=this,i=void 0,n=function*(){Object.keys(d).forEach((e=>{d[e].on("change",(i=>{t.commit("ReplicantModule/setState",{name:e,val:i})}))})),yield NodeCG.waitForReplicants(...Object.keys(d).map((t=>d[t]))),h=(0,l.rT)(p,t)},new((s=void 0)||(s=Promise))((function(t,r){function a(t){try{l(n.next(t))}catch(t){r(t)}}function o(t){try{l(n.throw(t))}catch(t){r(t)}}function l(e){var i;e.done?t(e.value):(i=e.value,i instanceof s?i:new s((function(t){t(i)}))).then(a,o)}l((n=n.apply(e,i||[])).next())}));var e,i,s,n}(k).then((()=>{new a.Z({vuetify:m.Z,store:k,el:"#App",render:t=>t(nt)})}))},779:(t,e,i)=>{"undefined"!=typeof Reflect&&Reflect.getMetadata},1058:(t,e,i)=>{i.d(e,{Z5:()=>r,Qn:()=>a});var s=i(2727),n=i(4240);(0,s.q)("carousel-transition"),(0,s.q)("carousel-reverse-transition"),(0,s.q)("tab-transition"),(0,s.q)("tab-reverse-transition"),(0,s.q)("menu-transition"),(0,s.q)("fab-transition","center center","out-in"),(0,s.q)("dialog-transition"),(0,s.q)("dialog-bottom-transition"),(0,s.q)("dialog-top-transition");const r=(0,s.q)("fade-transition"),a=((0,s.q)("scale-transition"),(0,s.q)("scroll-x-transition"),(0,s.q)("scroll-x-reverse-transition"),(0,s.q)("scroll-y-transition"),(0,s.q)("scroll-y-reverse-transition"),(0,s.q)("slide-x-transition"));(0,s.q)("slide-x-reverse-transition"),(0,s.q)("slide-y-transition"),(0,s.q)("slide-y-reverse-transition"),(0,s.x)("expand-transition",(0,n.Z)()),(0,s.x)("expand-x-transition",(0,n.Z)("",!0))},2027:(t,e,i)=>{i.d(e,{d:()=>a,Z:()=>o});var s=i(5803),n=i(2377);const r={absolute:Boolean,bottom:Boolean,fixed:Boolean,left:Boolean,right:Boolean,top:Boolean};function a(t=[]){return s.Z.extend({name:"positionable",props:t.length?(0,n.ji)(r,t):r})}const o=a()},4185:(t,e,i)=>{i.d(e,{f:()=>a});var s=i(5803),n=i(8298);function r(t,e){return()=>(0,n.Kd)(`The ${t} component must be used inside a ${e}`)}function a(t,e,i){const n=e&&i?{register:r(e,i),unregister:r(e,i)}:null;return s.Z.extend({name:"registrable-inject",inject:{[t]:{default:n}}})}},8298:(t,e,i)=>{i.d(e,{Kd:()=>r,N6:()=>a,fK:()=>o,Jk:()=>l});var s=i(9721);function n(t,e,i){if(!s.Z.config.silent){if(i&&(e={_isVue:!0,$parent:i,$options:e}),e){if(e.$_alreadyWarned=e.$_alreadyWarned||[],e.$_alreadyWarned.includes(t))return;e.$_alreadyWarned.push(t)}return`[Vuetify] ${t}`+(e?function(t){if(t._isVue&&t.$parent){const e=[];let i=0;for(;t;){if(e.length>0){const s=e[e.length-1];if(s.constructor===t.constructor){i++,t=t.$parent;continue}i>0&&(e[e.length-1]=[s,i],i=0)}e.push(t),t=t.$parent}return"\n\nfound in\n\n"+e.map(((t,e)=>`${0===e?"---\x3e ":" ".repeat(5+2*e)}${Array.isArray(t)?`${u(t[0])}... (${t[1]} recursive calls)`:u(t)}`)).join("\n")}return`\n\n(found in ${u(t)})`}(e):"")}}function r(t,e,i){const s=n(t,e,i);null!=s&&console.warn(s)}function a(t,e,i){const s=n(t,e,i);null!=s&&console.error(s)}function o(t,e,i,s){a(`[BREAKING] '${t}' has been removed, use '${e}' instead. For more information, see the upgrade guide https://github.com/vuetifyjs/vuetify/releases/tag/v2.0.0#user-content-upgrade-guide`,i,s)}function l(t,e,i){r(`[REMOVED] '${t}' has been removed. You can safely omit it.`,e,i)}const c=/(?:^|[-_])(\w)/g;function u(t,e){if(t.$root===t)return"<Root>";const i="function"==typeof t&&null!=t.cid?t.options:t._isVue?t.$options||t.constructor.options:t||{};let s=i.name||i._componentTag;const n=i.__file;if(!s&&n){const t=n.match(/([^/\\]+)\.vue$/);s=t&&t[1]}return(s?`<${r=s,r.replace(c,(t=>t.toUpperCase())).replace(/[-_]/g,"")}>`:"<Anonymous>")+(n&&!1!==e?` at ${n}`:"");var r}},2377:(t,e,i)=>{i.d(e,{qw:()=>n,vZ:()=>r,vO:()=>a,ji:()=>o,kb:()=>l,GL:()=>c,Do:()=>d,RB:()=>h,XP:()=>p,_A:()=>m,jC:()=>f,TI:()=>g,z9:()=>b,uZ:()=>y,Ee:()=>x});let s=!1;try{if("undefined"!=typeof window){const t=Object.defineProperty({},"passive",{get:()=>{s=!0}});window.addEventListener("testListener",t,t),window.removeEventListener("testListener",t,t)}}catch(t){console.warn(t)}function n(t,e,i){const s=e.length-1;if(s<0)return void 0===t?i:t;for(let n=0;n<s;n++){if(null==t)return i;t=t[e[n]]}return null==t||void 0===t[e[s]]?i:t[e[s]]}function r(t,e){if(t===e)return!0;if(t instanceof Date&&e instanceof Date&&t.getTime()!==e.getTime())return!1;if(t!==Object(t)||e!==Object(e))return!1;const i=Object.keys(t);return i.length===Object.keys(e).length&&i.every((i=>r(t[i],e[i])))}function a(t,e,i){return null!=t&&e&&"string"==typeof e?void 0!==t[e]?t[e]:n(t,(e=(e=e.replace(/\[(\w+)\]/g,".$1")).replace(/^\./,"")).split("."),i):i}function o(t,e){const i={};for(let s=0;s<e.length;s++){const n=e[s];void 0!==t[n]&&(i[n]=t[n])}return i}function l(t,e="px"){return null==t||""===t?void 0:isNaN(+t)?String(t):`${Number(t)}${e}`}function c(t){return(t||"").replace(/([a-z])([A-Z])/g,"$1-$2").toLowerCase()}function u(t){return null!==t&&"object"==typeof t}const d=Object.freeze({enter:13,tab:9,delete:46,esc:27,space:32,up:38,down:40,left:37,right:39,end:35,home:36,del:46,backspace:8,insert:45,pageup:33,pagedown:34,shift:16});function h(t,e){const i=t.$vuetify.icons.component;if(e.startsWith("$")){const i=a(t,`$vuetify.icons.values.${e.split("$").pop().split(".").pop()}`,e);if("string"!=typeof i)return i;e=i}return null==i?e:{component:i,props:{icon:e}}}function p(t){return Object.keys(t)}const v=/-(\w)/g,m=t=>t.replace(v,((t,e)=>e?e.toUpperCase():""));function f(t){return t.charAt(0).toUpperCase()+t.slice(1)}function g(t){return null!=t?Array.isArray(t)?t:[t]:[]}function b(t,e="default",i,s=!1){return t.$scopedSlots.hasOwnProperty(e)?t.$scopedSlots[e](i instanceof Function?i():i):!t.$slots.hasOwnProperty(e)||i&&!s?void 0:t.$slots[e]}function y(t,e=0,i=1){return Math.max(e,Math.min(i,t))}function x(t={},e={}){for(const i in e){const s=t[i],n=e[i];u(s)&&u(n)?t[i]=x(s,n):t[i]=n}return t}},2138:(t,e,i)=>{i.d(e,{ZP:()=>o});var s=i(2377);const n=/;(?![^(]*\))/g,r=/:(.*)/;function a(t){const e={};for(const i of t.split(n)){let[t,n]=i.split(r);t=t.trim(),t&&("string"==typeof n&&(n=n.trim()),e[(0,s._A)(t)]=n)}return e}function o(){const t={};let e,i=arguments.length;for(;i--;)for(e of Object.keys(arguments[i]))switch(e){case"class":case"directives":arguments[i][e]&&(t[e]=c(t[e],arguments[i][e]));break;case"style":arguments[i][e]&&(t[e]=l(t[e],arguments[i][e]));break;case"staticClass":if(!arguments[i][e])break;void 0===t[e]&&(t[e]=""),t[e]&&(t[e]+=" "),t[e]+=arguments[i][e].trim();break;case"on":case"nativeOn":arguments[i][e]&&(t[e]=u(t[e],arguments[i][e]));break;case"attrs":case"props":case"domProps":case"scopedSlots":case"staticStyle":case"hook":case"transition":if(!arguments[i][e])break;t[e]||(t[e]={}),t[e]={...arguments[i][e],...t[e]};break;default:t[e]||(t[e]=arguments[i][e])}return t}function l(t,e){return t?e?(t=(0,s.TI)("string"==typeof t?a(t):t)).concat("string"==typeof e?a(e):e):t:e}function c(t,e){return e?t&&t?(0,s.TI)(t).concat(e):e:t}function u(...t){if(!t[0])return t[1];if(!t[1])return t[0];const e={};for(let i=2;i--;){const s=t[i];for(const t in s)s[t]&&(e[t]?e[t]=[].concat(s[t],e[t]):e[t]=s[t])}return e}}},i={};function s(t){var n=i[t];if(void 0!==n)return n.exports;var r=i[t]={exports:{}};return e[t].call(r.exports,r,r.exports,s),r.exports}s.m=e,t=[],s.O=(e,i,n,r)=>{if(!i){var a=1/0;for(u=0;u<t.length;u++){for(var[i,n,r]=t[u],o=!0,l=0;l<i.length;l++)(!1&r||a>=r)&&Object.keys(s.O).every((t=>s.O[t](i[l])))?i.splice(l--,1):(o=!1,r<a&&(a=r));if(o){t.splice(u--,1);var c=n();void 0!==c&&(e=c)}}return e}r=r||0;for(var u=t.length;u>0&&t[u-1][2]>r;u--)t[u]=t[u-1];t[u]=[i,n,r]},s.n=t=>{var e=t&&t.__esModule?()=>t.default:()=>t;return s.d(e,{a:e}),e},s.d=(t,e)=>{for(var i in e)s.o(e,i)&&!s.o(t,i)&&Object.defineProperty(t,i,{enumerable:!0,get:e[i]})},s.g=function(){if("object"==typeof globalThis)return globalThis;try{return this||new Function("return this")()}catch(t){if("object"==typeof window)return window}}(),s.o=(t,e)=>Object.prototype.hasOwnProperty.call(t,e),s.r=t=>{"undefined"!=typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(t,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(t,"__esModule",{value:!0})},(()=>{var t={52:0};s.O.j=e=>0===t[e];var e=(e,i)=>{var n,r,[a,o,l]=i,c=0;if(a.some((e=>0!==t[e]))){for(n in o)s.o(o,n)&&(s.m[n]=o[n]);if(l)var u=l(s)}for(e&&e(i);c<a.length;c++)r=a[c],s.o(t,r)&&t[r]&&t[r][0](),t[r]=0;return s.O(u)},i=self.webpackChunk=self.webpackChunk||[];i.forEach(e.bind(null,0)),i.push=e.bind(null,i.push.bind(i))})();var n=s.O(void 0,[515,821,873,314],(()=>s(1488)));n=s.O(n)})();