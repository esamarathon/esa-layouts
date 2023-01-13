(()=>{"use strict";var t,e={6798:(t,e,i)=>{var n=i(2725),o=i(3687),s=i(5803),a=i(936),l=i(6255),r=i(8019),d=i(2404),c=i(7593),u=i(5925),h=(i(4807),i(7023),i(5654),i(6070)),p=(i(8793),i(6635)),m=i(8138),v=i.n(m),f=i(1004),g=i(8586),b=i(4170),_=function(t,e,i,n){var o,s=arguments.length,a=s<3?e:null===n?n=Object.getOwnPropertyDescriptor(e,i):n;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)a=Reflect.decorate(t,e,i,n);else for(var l=t.length-1;l>=0;l--)(o=t[l])&&(a=(s<3?o(a):s>3?o(e,i,a):o(e,i))||a);return s>3&&a&&Object.defineProperty(e,i,a),a};s.ZP.use(g.ZP);let y=class extends b.g4{get reps(){return this.context.rootState.ReplicantModule.reps}addBlankItem(){const t=v()(n.OV.repsTyped.donationTotalMilestones);t.push({id:(0,f.Z)(),name:"Default Milestone Name",enabled:!1}),n.OV.setReplicant({name:"donationTotalMilestones",val:t})}toggleItem({id:t,enabled:e}){const i=v()(n.OV.repsTyped.donationTotalMilestones),o=i.find((e=>e.id===t));o&&(o.addition||o.amount)&&(o.enabled=e,o.addition&&(o.amount=e?n.OV.repsTyped.donationTotal+o.addition:void 0),n.OV.setReplicant({name:"donationTotalMilestones",val:i}))}pinItem({id:t,pinned:e}){n.OV.setReplicant({name:"omnibar",val:Object.assign(Object.assign({},n.OV.repsTyped.omnibar),{pin:e?{type:"Milestone",id:t}:null})})}editItem(t){const e=v()(n.OV.repsTyped.donationTotalMilestones),i=e.findIndex((e=>e.id===t.id));i>=0&&(e[i]=v()(t),n.OV.setReplicant({name:"donationTotalMilestones",val:e}))}removeItem(t){const e=v()(n.OV.repsTyped.donationTotalMilestones),i=e.findIndex((e=>e.id===t));i>=0&&!e[i].enabled&&(e.splice(i,1),n.OV.setReplicant({name:"donationTotalMilestones",val:e}))}};_([b.mm],y.prototype,"addBlankItem",null),_([b.mm],y.prototype,"toggleItem",null),_([b.mm],y.prototype,"pinItem",null),_([b.mm],y.prototype,"editItem",null),_([b.mm],y.prototype,"removeItem",null),y=_([(0,b.Yl)({name:"OurModule"})],y);const x=new g.yh({strict:!1,state:{},modules:{ReplicantModule:n.np,OurModule:y}}),O=x,w=(0,b.rT)(y,x);var E=i(8821),T=i(6842),Z=(i(8037),i(5095)),S=i(6062),k=i(557);const C=k.Z.extend({name:"v-checkbox",props:{indeterminate:Boolean,indeterminateIcon:{type:String,default:"$checkboxIndeterminate"},offIcon:{type:String,default:"$checkboxOff"},onIcon:{type:String,default:"$checkboxOn"}},data(){return{inputIndeterminate:this.indeterminate}},computed:{classes(){return{...S.Z.options.computed.classes.call(this),"v-input--selection-controls":!0,"v-input--checkbox":!0,"v-input--indeterminate":this.inputIndeterminate}},computedIcon(){return this.inputIndeterminate?this.indeterminateIcon:this.isActive?this.onIcon:this.offIcon},validationState(){if(!this.isDisabled||this.inputIndeterminate)return this.hasError&&this.shouldValidate?"error":this.hasSuccess?"success":null!==this.hasColor?this.computedColor:void 0}},watch:{indeterminate(t){this.$nextTick((()=>this.inputIndeterminate=t))},inputIndeterminate(t){this.$emit("update:indeterminate",t)},isActive(){this.indeterminate&&(this.inputIndeterminate=!1)}},methods:{genCheckbox(){const{title:t,...e}=this.attrs$;return this.$createElement("div",{staticClass:"v-input--selection-controls__input"},[this.$createElement(Z.Z,this.setTextColor(this.validationState,{props:{dense:this.dense,dark:this.dark,light:this.light}}),this.computedIcon),this.genInput("checkbox",{...e,"aria-checked":this.inputIndeterminate?"mixed":this.isActive.toString()}),this.genRipple(this.setTextColor(this.rippleState))])},genDefaultSlot(){return[this.genCheckbox(),this.genLabel()]}}});var I=i(6224),M=i(7310),P=i(7019),R=i(2377);function j(t){const e={touchstartX:0,touchstartY:0,touchendX:0,touchendY:0,touchmoveX:0,touchmoveY:0,offsetX:0,offsetY:0,left:t.left,right:t.right,up:t.up,down:t.down,start:t.start,move:t.move,end:t.end};return{touchstart:t=>function(t,e){const i=t.changedTouches[0];e.touchstartX=i.clientX,e.touchstartY=i.clientY,e.start&&e.start(Object.assign(t,e))}(t,e),touchend:t=>function(t,e){const i=t.changedTouches[0];e.touchendX=i.clientX,e.touchendY=i.clientY,e.end&&e.end(Object.assign(t,e)),(t=>{const{touchstartX:e,touchendX:i,touchstartY:n,touchendY:o}=t;t.offsetX=i-e,t.offsetY=o-n,Math.abs(t.offsetY)<.5*Math.abs(t.offsetX)&&(t.left&&i<e-16&&t.left(t),t.right&&i>e+16&&t.right(t)),Math.abs(t.offsetX)<.5*Math.abs(t.offsetY)&&(t.up&&o<n-16&&t.up(t),t.down&&o>n+16&&t.down(t))})(e)}(t,e),touchmove:t=>function(t,e){const i=t.changedTouches[0];e.touchmoveX=i.clientX,e.touchmoveY=i.clientY,e.move&&e.move(Object.assign(t,e))}(t,e)}}const q={inserted:function(t,e,i){const n=e.value,o=n.parent?t.parentElement:t,s=n.options||{passive:!0};if(!o)return;const a=j(e.value);o._touchHandlers=Object(o._touchHandlers),o._touchHandlers[i.context._uid]=a,(0,R.XP)(a).forEach((t=>{o.addEventListener(t,a[t],s)}))},unbind:function(t,e,i){const n=e.value.parent?t.parentElement:t;if(!n||!n._touchHandlers)return;const o=n._touchHandlers[i.context._uid];(0,R.XP)(o).forEach((t=>{n.removeEventListener(t,o[t])})),delete n._touchHandlers[i.context._uid]}};var N=i(1058),A=i(2506);const V=k.Z.extend({name:"v-switch",directives:{Touch:q},props:{inset:Boolean,loading:{type:[Boolean,String],default:!1},flat:{type:Boolean,default:!1}},computed:{classes(){return{...S.Z.options.computed.classes.call(this),"v-input--selection-controls v-input--switch":!0,"v-input--switch--flat":this.flat,"v-input--switch--inset":this.inset}},attrs(){return{"aria-checked":String(this.isActive),"aria-disabled":String(this.isDisabled),role:"switch"}},validationState(){return this.hasError&&this.shouldValidate?"error":this.hasSuccess?"success":null!==this.hasColor?this.computedColor:void 0},switchData(){return this.setTextColor(this.loading?void 0:this.validationState,{class:this.themeClasses})}},methods:{genDefaultSlot(){return[this.genSwitch(),this.genLabel()]},genSwitch(){const{title:t,...e}=this.attrs$;return this.$createElement("div",{staticClass:"v-input--selection-controls__input"},[this.genInput("checkbox",{...this.attrs,...e}),this.genRipple(this.setTextColor(this.validationState,{directives:[{name:"touch",value:{left:this.onSwipeLeft,right:this.onSwipeRight}}]})),this.$createElement("div",{staticClass:"v-input--switch__track",...this.switchData}),this.$createElement("div",{staticClass:"v-input--switch__thumb",...this.switchData},[this.genProgress()])])},genProgress(){return this.$createElement(N.b0,{},[!1===this.loading?null:this.$slots.progress||this.$createElement(A.Z,{props:{color:!0===this.loading||""===this.loading?this.color||"primary":this.loading,size:16,width:2,indeterminate:!0}})])},onSwipeLeft(){this.isActive&&this.onChange()},onSwipeRight(){this.isActive||this.onChange()},onKeydown(t){(t.keyCode===R.Do.left&&this.isActive||t.keyCode===R.Do.right&&!this.isActive)&&this.onChange()}}});var $=i(197);let D=class extends s.ZP{};D=function(t,e,i,n){var o,s=arguments.length,a=s<3?e:null===n?n=Object.getOwnPropertyDescriptor(e,i):n;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)a=Reflect.decorate(t,e,i,n);else for(var l=t.length-1;l>=0;l--)(o=t[l])&&(a=(s<3?o(a):s>3?o(e,i,a):o(e,i))||a);return s>3&&a&&Object.defineProperty(e,i,a),a}([u.default],D);const X=D;var B=i(5440);const Y=(0,B.Z)(X,(function(){var t=this,e=t._self._c;return t._self._setupProxy,e(E.Z,{style:{"text-align":"center",padding:"5px","margin-top":"10px","white-space":"nowrap",overflow:"hidden"}},[t._t("default")],2)}),[],!1,null,null,null).exports;var F=function(t,e,i,n){var o,s=arguments.length,a=s<3?e:null===n?n=Object.getOwnPropertyDescriptor(e,i):n;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)a=Reflect.decorate(t,e,i,n);else for(var l=t.length-1;l>=0;l--)(o=t[l])&&(a=(s<3?o(a):s>3?o(e,i,a):o(e,i))||a);return s>3&&a&&Object.defineProperty(e,i,a),a};let L=class extends s.ZP{constructor(){super(...arguments),this.dialog=!1,this.nameEdit="",this.additionToggleEdit=!1,this.additionEdit="0",this.amountEdit="0",this.isFormValid=!1}get toggle(){return this.milestone.enabled}set toggle(t){w.toggleItem({id:this.milestone.id,enabled:t})}isRequired(t){return!!t||"Required"}isNumber(t){return!Number.isNaN(Number(t))||"Must be a number"}isBiggerThanZero(t){const e=Number(t);return!!e&&e>0||"Must be bigger than 0"}formatAmount(t){return t.toLocaleString("en-US",{maximumFractionDigits:0})}get disableSave(){return!(this.nameEdit&&(this.additionToggleEdit&&this.additionEdit||!this.additionToggleEdit&&this.amountEdit))}get isMet(){return!!(this.milestone.amount&&this.total>=this.milestone.amount)}get isPinned(){var t;return"Milestone"===(null===(t=this.currentPin)||void 0===t?void 0:t.type)&&this.currentPin.id===this.milestone.id}pin(){w.pinItem({id:this.milestone.id,pinned:!this.isPinned})}edit(){var t,e,i,n;this.dialog=!0,this.nameEdit=this.milestone.name,this.additionToggleEdit=!!this.milestone.addition,this.additionEdit=null!==(e=null===(t=this.milestone.addition)||void 0===t?void 0:t.toString())&&void 0!==e?e:"0",this.amountEdit=null!==(n=null===(i=this.milestone.amount)||void 0===i?void 0:i.toString())&&void 0!==n?n:"0"}save(){const t={id:this.milestone.id,name:this.nameEdit,enabled:this.milestone.enabled};this.milestone.enabled?(t.addition=this.milestone.addition,t.amount=this.milestone.amount):(t.addition=this.additionToggleEdit?Number(this.additionEdit):void 0,t.amount=this.additionToggleEdit?void 0:Number(this.amountEdit)),w.editItem(t),this.dialog=!1}remove(){w.removeItem(this.milestone.id)}};F([(0,h.f)({type:Object,required:!0})],L.prototype,"milestone",void 0),F([(0,h.f)({type:Number,required:!0})],L.prototype,"index",void 0),F([n.Nz.State((t=>t.reps.donationTotal))],L.prototype,"total",void 0),F([n.Nz.State((t=>t.reps.omnibar.pin))],L.prototype,"currentPin",void 0),L=F([(0,u.default)({components:{MediaCard:Y}})],L);const H=L,z=(0,B.Z)(H,(function(){var t=this,e=t._self._c;return t._self._setupProxy,e("media-card",{staticClass:"d-flex align-center px-2",style:{"text-align":"unset",height:"40px","margin-top":t.index>0?"10px":0}},[e(I.Z,{model:{value:t.dialog,callback:function(e){t.dialog=e},expression:"dialog"}},[e(E.Z,[e(T.ZB,{staticClass:"pa-4 pb-0"},[e(M.Z,{model:{value:t.isFormValid,callback:function(e){t.isFormValid=e},expression:"isFormValid"}},[e($.Z,{attrs:{"prepend-icon":"mdi-application",autocomplete:"off",rules:[t.isRequired],filled:"",dense:""},model:{value:t.nameEdit,callback:function(e){t.nameEdit=e},expression:"nameEdit"}}),t._v(" "),e(V,{staticClass:"pa-0 ma-0 pb-2 pl-10",attrs:{label:'Toggle "Addition" Mode',"hide-details":"",inset:"",disabled:t.milestone.enabled},model:{value:t.additionToggleEdit,callback:function(e){t.additionToggleEdit=e},expression:"additionToggleEdit"}}),t._v(" "),t.additionToggleEdit?e($.Z,{attrs:{"prepend-icon":"mdi-cash-plus",autocomplete:"off",rules:[t.isRequired,t.isNumber,t.isBiggerThanZero],filled:"",dense:"",disabled:t.milestone.enabled},model:{value:t.additionEdit,callback:function(e){t.additionEdit=e},expression:"additionEdit"}}):e($.Z,{attrs:{"prepend-icon":"mdi-cash",autocomplete:"off",rules:[t.isRequired,t.isNumber,t.isBiggerThanZero],filled:"",dense:"",disabled:t.milestone.enabled},model:{value:t.amountEdit,callback:function(e){t.amountEdit=e},expression:"amountEdit"}})],1)],1),t._v(" "),e(T.h7,[e(c.Z),t._v(" "),e(l.Z,{attrs:{disabled:!t.isFormValid},on:{click:t.save}},[t._v("Save")]),t._v(" "),e(l.Z,{on:{click:function(e){t.dialog=!1}}},[t._v("Cancel")])],1)],1)],1),t._v(" "),e(C,{staticClass:"pa-0 ma-0",attrs:{"hide-details":"",disabled:!t.milestone.amount&&!t.milestone.addition},model:{value:t.toggle,callback:function(e){t.toggle=e},expression:"toggle"}}),t._v(" "),e("div",{staticClass:"flex-grow-1"},[t._v(t._s(t.milestone.name))]),t._v(" "),t.isMet?e("div",{staticClass:"light-green--text accent-3 font-weight-bold pr-2"},[t._v("MET!")]):t._e(),t._v(" "),t.milestone.amount?e("div",{staticClass:"d-flex pr-2"},[e(P.Z,{staticClass:"pr-1"},[t._v("mdi-cash")]),t._v(" "),e("div",[t._v("$"+t._s(t.formatAmount(t.milestone.amount)))])],1):t._e(),t._v(" "),t.milestone.addition?e("div",{staticClass:"d-flex pr-2"},[e(P.Z,{staticClass:"pr-1"},[t._v("mdi-cash-plus")]),t._v("\n    $"+t._s(t.formatAmount(t.milestone.addition))+"\n  ")],1):t._e(),t._v(" "),e(P.Z,{attrs:{disabled:!t.milestone.amount&&!t.milestone.addition||!t.milestone.enabled},on:{click:t.pin}},[t.isPinned?[t._v("mdi-pin-off")]:[t._v("mdi-pin")]],2),t._v(" "),e(P.Z,{on:{click:t.edit}},[t._v("\n    mdi-pencil\n  ")]),t._v(" "),e(P.Z,{attrs:{disabled:t.milestone.enabled},on:{click:t.remove}},[t._v("\n    mdi-delete\n  ")])],1)}),[],!1,null,null,null).exports;var U=function(t,e,i,n){var o,s=arguments.length,a=s<3?e:null===n?n=Object.getOwnPropertyDescriptor(e,i):n;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)a=Reflect.decorate(t,e,i,n);else for(var l=t.length-1;l>=0;l--)(o=t[l])&&(a=(s<3?o(a):s>3?o(e,i,a):o(e,i))||a);return s>3&&a&&Object.defineProperty(e,i,a),a};let K=class extends s.ZP{constructor(){super(...arguments),this.sortOpt=2}get milestonesSorted(){return 1===this.sortOpt?(0,p.sortBy)(this.milestones,["name"]):2===this.sortOpt?(0,p.sortBy)(this.milestones,(t=>t.addition?this.total+t.addition:t.amount)):this.milestones}formatAmount(t){return t.toLocaleString("en-US",{maximumFractionDigits:0})}addBlank(){w.addBlankItem()}};U([n.Nz.State((t=>t.reps.donationTotal))],K.prototype,"total",void 0),U([n.Nz.State((t=>t.reps.donationTotalMilestones))],K.prototype,"milestones",void 0),K=U([(0,u.default)({components:{Milestone:z}})],K);const Q=K,G=(0,B.Z)(Q,(function(){var t=this,e=t._self._c;return t._self._setupProxy,e(a.Z,[e("div",{staticClass:"mb-2 d-flex"},[e("div",[e("span",{staticClass:"font-weight-bold"},[t._v("Donation Total:")]),t._v("\n      $"+t._s(t.formatAmount(t.total))+"\n    ")]),t._v(" "),e(c.Z),t._v(" "),e("div",[e(d.Z,{staticClass:"pa-0 ma-0",attrs:{row:"","hide-details":"",label:"Sort By"},model:{value:t.sortOpt,callback:function(e){t.sortOpt=e},expression:"sortOpt"}},[e(r.Z,{attrs:{label:"Added",value:0}}),t._v(" "),e(r.Z,{attrs:{label:"Name",value:1}}),t._v(" "),e(r.Z,{staticClass:"mr-0",attrs:{label:"Amount",value:2}})],1)],1)],1),t._v(" "),e(l.Z,{on:{click:t.addBlank}},[t._v("Add New Milestone")]),t._v(" "),t.milestonesSorted.length?e("div",{style:{height:"350px","overflow-y":"scroll","margin-top":"10px"}},t._l(t.milestonesSorted,(function(t,i){return e("milestone",{key:t.id,attrs:{milestone:t,index:i}})})),1):e("div",{staticClass:"pa-3 font-italic"},[t._v("\n    No milestones created, add a new one with the button above.\n  ")])],1)}),[],!1,null,null,null).exports;(0,n.rl)(O).then((()=>{new s.ZP({vuetify:o.Z,store:O,el:"#App",render:t=>t(G)})}))},1058:(t,e,i)=>{i.d(e,{Qn:()=>l,Z5:()=>a,b0:()=>s});var n=i(2727),o=i(4240);(0,n.q)("carousel-transition"),(0,n.q)("carousel-reverse-transition"),(0,n.q)("tab-transition"),(0,n.q)("tab-reverse-transition"),(0,n.q)("menu-transition");const s=(0,n.q)("fab-transition","center center","out-in"),a=((0,n.q)("dialog-transition"),(0,n.q)("dialog-bottom-transition"),(0,n.q)("dialog-top-transition"),(0,n.q)("fade-transition")),l=((0,n.q)("scale-transition"),(0,n.q)("scroll-x-transition"),(0,n.q)("scroll-x-reverse-transition"),(0,n.q)("scroll-y-transition"),(0,n.q)("scroll-y-reverse-transition"),(0,n.q)("slide-x-transition"));(0,n.q)("slide-x-reverse-transition"),(0,n.q)("slide-y-transition"),(0,n.q)("slide-y-reverse-transition"),(0,n.x)("expand-transition",(0,o.Z)()),(0,n.x)("expand-x-transition",(0,o.Z)("",!0))}},i={};function n(t){var o=i[t];if(void 0!==o)return o.exports;var s=i[t]={id:t,loaded:!1,exports:{}};return e[t].call(s.exports,s,s.exports,n),s.loaded=!0,s.exports}n.m=e,t=[],n.O=(e,i,o,s)=>{if(!i){var a=1/0;for(c=0;c<t.length;c++){for(var[i,o,s]=t[c],l=!0,r=0;r<i.length;r++)(!1&s||a>=s)&&Object.keys(n.O).every((t=>n.O[t](i[r])))?i.splice(r--,1):(l=!1,s<a&&(a=s));if(l){t.splice(c--,1);var d=o();void 0!==d&&(e=d)}}return e}s=s||0;for(var c=t.length;c>0&&t[c-1][2]>s;c--)t[c]=t[c-1];t[c]=[i,o,s]},n.n=t=>{var e=t&&t.__esModule?()=>t.default:()=>t;return n.d(e,{a:e}),e},n.d=(t,e)=>{for(var i in e)n.o(e,i)&&!n.o(t,i)&&Object.defineProperty(t,i,{enumerable:!0,get:e[i]})},n.g=function(){if("object"==typeof globalThis)return globalThis;try{return this||new Function("return this")()}catch(t){if("object"==typeof window)return window}}(),n.o=(t,e)=>Object.prototype.hasOwnProperty.call(t,e),n.r=t=>{"undefined"!=typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(t,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(t,"__esModule",{value:!0})},n.nmd=t=>(t.paths=[],t.children||(t.children=[]),t),(()=>{var t={461:0};n.O.j=e=>0===t[e];var e=(e,i)=>{var o,s,[a,l,r]=i,d=0;if(a.some((e=>0!==t[e]))){for(o in l)n.o(l,o)&&(n.m[o]=l[o]);if(r)var c=r(n)}for(e&&e(i);d<a.length;d++)s=a[d],n.o(t,s)&&t[s]&&t[s][0](),t[s]=0;return n.O(c)},i=self.webpackChunk=self.webpackChunk||[];i.forEach(e.bind(null,0)),i.push=e.bind(null,i.push.bind(i))})();var o=n.O(void 0,[965,821,62,923,116,902,635,481],(()=>n(6798)));o=n.O(o)})();