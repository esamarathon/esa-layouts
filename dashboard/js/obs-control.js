(()=>{"use strict";var t,e={4704:(t,e,i)=>{var n=i(7508),s=i(3072),o=i(8428),a=i(6648),r=i(3448),l=i(3160),c=i(3476),u=i(8676);const d=s.cp.extend({name:"rippleable",directives:{ripple:u.c},props:{ripple:{type:[Boolean,Object],default:!0}},methods:{genRipple(t={}){return this.ripple?(t.staticClass="v-input--selection-controls__ripple",t.directives=t.directives||[],t.directives.push({name:"ripple",value:{center:!0}}),this.$createElement("div",t)):null}}});var h=i(148);const p=s.cp.extend({name:"comparable",props:{valueComparator:{type:Function,default:h.IN}}});function v(t){t.preventDefault()}const f=(0,i(2356).c)(c.c,d,p).extend({name:"selectable",model:{prop:"inputValue",event:"change"},props:{id:String,inputValue:null,falseValue:null,trueValue:null,multiple:{type:Boolean,default:null},label:String},data(){return{hasColor:this.inputValue,lazyValue:this.inputValue}},computed:{computedColor(){if(this.isActive)return this.color?this.color:this.isDark&&!this.appIsDark?"white":"primary"},isMultiple(){return!0===this.multiple||null===this.multiple&&Array.isArray(this.internalValue)},isActive(){const t=this.value,e=this.internalValue;return this.isMultiple?!!Array.isArray(e)&&e.some((e=>this.valueComparator(e,t))):void 0===this.trueValue||void 0===this.falseValue?t?this.valueComparator(t,e):Boolean(e):this.valueComparator(e,this.trueValue)},isDirty(){return this.isActive},rippleState(){return this.isDisabled||this.validationState?this.validationState:void 0}},watch:{inputValue(t){this.lazyValue=t,this.hasColor=t}},methods:{genLabel(){const t=c.c.options.methods.genLabel.call(this);return t?(t.data.on={click:v},t):t},genInput(t,e){return this.$createElement("input",{attrs:Object.assign({"aria-checked":this.isActive.toString(),disabled:this.isDisabled,id:this.computedId,role:t,type:t},e),domProps:{value:this.value,checked:this.isActive},on:{blur:this.onBlur,change:this.onChange,focus:this.onFocus,keydown:this.onKeydown,click:v},ref:"input"})},onClick(t){this.onChange(),this.$emit("click",t)},onChange(){if(!this.isInteractive)return;const t=this.value;let e=this.internalValue;if(this.isMultiple){Array.isArray(e)||(e=[]);const i=e.length;e=e.filter((e=>!this.valueComparator(e,t))),e.length===i&&e.push(t)}else e=void 0!==this.trueValue&&void 0!==this.falseValue?this.valueComparator(e,this.trueValue)?this.falseValue:this.trueValue:t?this.valueComparator(e,t)?null:t:!e;this.validate(!0,e),this.internalValue=e,this.hasColor=e},onFocus(t){this.isFocused=!0,this.$emit("focus",t)},onBlur(t){this.isFocused=!1,this.$emit("blur",t)},onKeydown(t){}}});function g(t){const e={touchstartX:0,touchstartY:0,touchendX:0,touchendY:0,touchmoveX:0,touchmoveY:0,offsetX:0,offsetY:0,left:t.left,right:t.right,up:t.up,down:t.down,start:t.start,move:t.move,end:t.end};return{touchstart:t=>function(t,e){const i=t.changedTouches[0];e.touchstartX=i.clientX,e.touchstartY=i.clientY,e.start&&e.start(Object.assign(t,e))}(t,e),touchend:t=>function(t,e){const i=t.changedTouches[0];e.touchendX=i.clientX,e.touchendY=i.clientY,e.end&&e.end(Object.assign(t,e)),(t=>{const{touchstartX:e,touchendX:i,touchstartY:n,touchendY:s}=t;t.offsetX=i-e,t.offsetY=s-n,Math.abs(t.offsetY)<.5*Math.abs(t.offsetX)&&(t.left&&i<e-16&&t.left(t),t.right&&i>e+16&&t.right(t)),Math.abs(t.offsetX)<.5*Math.abs(t.offsetY)&&(t.up&&s<n-16&&t.up(t),t.down&&s>n+16&&t.down(t))})(e)}(t,e),touchmove:t=>function(t,e){const i=t.changedTouches[0];e.touchmoveX=i.clientX,e.touchmoveY=i.clientY,e.move&&e.move(Object.assign(t,e))}(t,e)}}const m={inserted:function(t,e,i){const n=e.value,s=n.parent?t.parentElement:t,o=n.options||{passive:!0};if(!s)return;const a=g(e.value);s._touchHandlers=Object(s._touchHandlers),s._touchHandlers[i.context._uid]=a,(0,h.C_)(a).forEach((t=>{s.addEventListener(t,a[t],o)}))},unbind:function(t,e,i){const n=e.value.parent?t.parentElement:t;if(!n||!n._touchHandlers)return;const s=n._touchHandlers[i.context._uid];(0,h.C_)(s).forEach((t=>{n.removeEventListener(t,s[t])})),delete n._touchHandlers[i.context._uid]}};var y=i(9448);function b(t=[],...e){return Array().concat(t,...e)}function _(t,e="top center 0",i){return{name:t,functional:!0,props:{group:{type:Boolean,default:!1},hideOnLeave:{type:Boolean,default:!1},leaveAbsolute:{type:Boolean,default:!1},mode:{type:String,default:i},origin:{type:String,default:e}},render(e,i){const n="transition"+(i.props.group?"-group":""),s={props:{name:t,mode:i.props.mode},on:{beforeEnter(t){t.style.transformOrigin=i.props.origin,t.style.webkitTransformOrigin=i.props.origin}}};return i.props.leaveAbsolute&&(s.on.leave=b(s.on.leave,(t=>{const{offsetTop:e,offsetLeft:i,offsetWidth:n,offsetHeight:s}=t;t._transitionInitialStyles={position:t.style.position,top:t.style.top,left:t.style.left,width:t.style.width,height:t.style.height},t.style.position="absolute",t.style.top=e+"px",t.style.left=i+"px",t.style.width=n+"px",t.style.height=s+"px"})),s.on.afterLeave=b(s.on.afterLeave,(t=>{if(t&&t._transitionInitialStyles){const{position:e,top:i,left:n,width:s,height:o}=t._transitionInitialStyles;delete t._transitionInitialStyles,t.style.position=e||"",t.style.top=i||"",t.style.left=n||"",t.style.width=s||"",t.style.height=o||""}}))),i.props.hideOnLeave&&(s.on.leave=b(s.on.leave,(t=>{t.style.setProperty("display","none","important")}))),e(n,(0,y.cp)(i.data,s),i.children)}}}function w(t,e,i="in-out"){return{name:t,functional:!0,props:{mode:{type:String,default:i}},render:(i,n)=>i("transition",(0,y.cp)(n.data,{props:{name:t},on:e}),n.children)}}function C(t="",e=!1){const i=e?"width":"height",n=`offset${(0,h.__)(i)}`;return{beforeEnter(t){t._parent=t.parentNode,t._initialStyle={transition:t.style.transition,overflow:t.style.overflow,[i]:t.style[i]}},enter(e){const s=e._initialStyle;e.style.setProperty("transition","none","important"),e.style.overflow="hidden";const o=`${e[n]}px`;e.style[i]="0",e.offsetHeight,e.style.transition=s.transition,t&&e._parent&&e._parent.classList.add(t),requestAnimationFrame((()=>{e.style[i]=o}))},afterEnter:o,enterCancelled:o,leave(t){t._initialStyle={transition:"",overflow:t.style.overflow,[i]:t.style[i]},t.style.overflow="hidden",t.style[i]=`${t[n]}px`,t.offsetHeight,requestAnimationFrame((()=>t.style[i]="0"))},afterLeave:s,leaveCancelled:s};function s(e){t&&e._parent&&e._parent.classList.remove(t),o(e)}function o(t){const e=t._initialStyle[i];t.style.overflow=t._initialStyle.overflow,null!=e&&(t.style[i]=e),delete t._initialStyle}}_("carousel-transition"),_("carousel-reverse-transition"),_("tab-transition"),_("tab-reverse-transition"),_("menu-transition");const S=_("fab-transition","center center","out-in");_("dialog-transition"),_("dialog-bottom-transition"),_("dialog-top-transition"),_("fade-transition"),_("scale-transition"),_("scroll-x-transition"),_("scroll-x-reverse-transition"),_("scroll-y-transition"),_("scroll-y-reverse-transition"),_("slide-x-transition"),_("slide-x-reverse-transition"),_("slide-y-transition"),_("slide-y-reverse-transition"),w("expand-transition",C()),w("expand-x-transition",C("",!0));var x=i(7e3);const D=f.extend({name:"v-switch",directives:{Touch:m},props:{inset:Boolean,loading:{type:[Boolean,String],default:!1},flat:{type:Boolean,default:!1}},computed:{classes(){return{...c.c.options.computed.classes.call(this),"v-input--selection-controls v-input--switch":!0,"v-input--switch--flat":this.flat,"v-input--switch--inset":this.inset}},attrs(){return{"aria-checked":String(this.isActive),"aria-disabled":String(this.isDisabled),role:"switch"}},validationState(){return this.hasError&&this.shouldValidate?"error":this.hasSuccess?"success":null!==this.hasColor?this.computedColor:void 0},switchData(){return this.setTextColor(this.loading?void 0:this.validationState,{class:this.themeClasses})}},methods:{genDefaultSlot(){return[this.genSwitch(),this.genLabel()]},genSwitch(){const{title:t,...e}=this.attrs$;return this.$createElement("div",{staticClass:"v-input--selection-controls__input"},[this.genInput("checkbox",{...this.attrs,...e}),this.genRipple(this.setTextColor(this.validationState,{directives:[{name:"touch",value:{left:this.onSwipeLeft,right:this.onSwipeRight}}]})),this.$createElement("div",{staticClass:"v-input--switch__track",...this.switchData}),this.$createElement("div",{staticClass:"v-input--switch__thumb",...this.switchData},[this.genProgress()])])},genProgress(){return this.$createElement(S,{},[!1===this.loading?null:(0,h.ag)(this,"progress")||this.$createElement(x.c,{props:{color:!0===this.loading||""===this.loading?this.color||"primary":this.loading,size:16,width:2,indeterminate:!0}})])},onSwipeLeft(){this.isActive&&this.onChange()},onSwipeRight(){this.isActive||this.onChange()},onKeydown(t){(t.keyCode===h.cJ.left&&this.isActive||t.keyCode===h.cJ.right&&!this.isActive)&&this.onChange()}}});var T=i(2240),O=(i(6e3),i(4996),i(796),i(476),i(7248),function(t,e,i,n){var s,o=arguments.length,a=o<3?e:null===n?n=Object.getOwnPropertyDescriptor(e,i):n;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)a=Reflect.decorate(t,e,i,n);else for(var r=t.length-1;r>=0;r--)(s=t[r])&&(a=(o<3?s(a):o>3?s(e,i,a):s(e,i))||a);return o>3&&a&&Object.defineProperty(e,i,a),a});let L=class extends s.cp{constructor(){super(...arguments),this.evtConfig=nodecg.bundleConfig.event,this.obsConfig=nodecg.bundleConfig.obs,this.gameLayoutPreviewToggle=!0}disableButton(t){return this.obsData.transitioning||t===this.obsData.scene||this.obsData.disableTransitioning}get disableIntermission(){const t=[this.obsConfig.names.scenes.commercials,this.obsConfig.names.scenes.intermission,this.obsConfig.names.scenes.intermissionPlayer,this.obsConfig.names.scenes.countdown];return this.obsData.transitioning||this.obsData.disableTransitioning||!!t.find((t=>{var e;return null===(e=this.obsData.scene)||void 0===e?void 0:e.startsWith(t)}))||["running","paused"].includes(this.timer.state)}startIntermission(){nodecg.sendMessage("startIntermission")}changeScene(t){nodecg.sendMessage("obsChangeScene",{scene:t})}};O([n.SW.State((t=>t.reps.obsData))],L.prototype,"obsData",void 0),O([n.SW.State((t=>t.reps.currentRunDelay))],L.prototype,"currentRunDelay",void 0),O([n.SW.State((t=>t.reps.serverTimestamp))],L.prototype,"serverTimestamp",void 0),O([n.SW.State((t=>t.reps.videoPlayer))],L.prototype,"videoPlayer",void 0),O([n.SW.State((t=>t.reps.timer))],L.prototype,"timer",void 0),L=O([T.default],L);const P=L,k=(0,i(4296).c)(P,(function(){var t=this,e=t._self._c;return t._self._setupProxy,e(a.c,[t.obsConfig.enabled?t.obsData.connected?[e("div",{staticClass:"mb-1"},[t.obsData.transitionTimestamp>t.serverTimestamp?e("span",{staticClass:"red--text font-weight-bold"},[e(l.c,{attrs:{color:"red"}},[t._v("mdi-alert")]),t._v("\n        Transitioning in "+t._s(((t.obsData.transitionTimestamp-t.serverTimestamp)/1e3).toFixed(1))+"s\n      ")],1):t.obsData.transitioning?e("span",{staticClass:"red--text font-weight-bold"},[e(l.c,{attrs:{color:"red"}},[t._v("mdi-alert")]),t._v("\n        Transitioning\n      ")],1):t.videoPlayer.estimatedFinishTimestamp>t.serverTimestamp?e("span",{staticClass:"red--text font-weight-bold"},[e(l.c,{attrs:{color:"red"}},[t._v("mdi-alert")]),t._v("\n        Playlist will finish in ~"+t._s(((t.videoPlayer.estimatedFinishTimestamp-t.serverTimestamp)/1e3).toFixed(1))+"s\n      ")],1):t.obsData.disableTransitioning?e("span",{staticClass:"red--text font-weight-bold"},[e(l.c,{attrs:{color:"red"}},[t._v("mdi-alert")]),t._v("\n        Transitioning Disabled\n      ")],1):e("span",{staticClass:"font-italic"},[t._v("\n        Not Currently Transitioning\n      ")])]),t._v(" "),e("div",{staticClass:"mb-1"},[t._v("\n      Streaming Status:\n      "),t.obsData.streaming?e("span",{style:{"font-weight":"bold",color:"#58CF00"}},[t._v("\n        Connected\n      ")]):e("span",{style:{"font-weight":"bold",color:"#FF5F5C"}},[t._v("\n        Disconnected\n      ")])]),t._v(" "),e(r.c,{attrs:{disabled:t.disableIntermission},on:{click:t.startIntermission}},[t._v("\n      Start Intermission\n      "),t.currentRunDelay.audio?[t._v("\n        ("+t._s((t.currentRunDelay.audio/1e3).toFixed(1))+"s delay)\n      ")]:t._e()],2),t._v(" "),e(r.c,{staticClass:"mt-1",attrs:{disabled:t.disableButton(t.obsConfig.names.scenes.gameLayout)},on:{click:function(e){return t.changeScene(t.obsConfig.names.scenes.gameLayout)}}},[t._v("\n      Start Run\n      "),t.currentRunDelay.audio?[t._v("\n        ("+t._s((t.currentRunDelay.audio/1e3).toFixed(1))+"s delay)\n      ")]:t._e()],2),t._v(" "),e("div",{staticClass:"d-flex mt-3 mb-1"},[t._v("\n      Change to Specific Scene:\n    ")]),t._v(" "),t._l(t.obsData.sceneList,(function(i,n){return e(r.c,{key:n,class:{"mt-1":0!==n},attrs:{disabled:t.disableButton(i)},on:{click:function(e){return t.changeScene(i)}}},[t._v("\n      "+t._s(i)+"\n      "),i!==t.obsData.scene&&t.currentRunDelay.audio&&(i===t.obsConfig.names.scenes.gameLayout||i!==t.obsConfig.names.scenes.gameLayout&&t.obsData.scene===t.obsConfig.names.scenes.gameLayout)?[t._v("\n        ("+t._s((t.currentRunDelay.audio/1e3).toFixed(1))+"s delay)\n      ")]:t._e()],2)})),t._v(" "),t.evtConfig.online&&t.obsData.gameLayoutScreenshot&&t.gameLayoutPreviewToggle?[e("div",{staticClass:"mt-3 mb-1"},[t._v('\n        "Game Layout" Preview (refreshes every second):\n      ')]),t._v(" "),e("img",{style:{width:"100%"},attrs:{src:t.obsData.gameLayoutScreenshot}})]:t._e(),t._v(" "),t.evtConfig.online?e(D,{staticClass:"ma-2 mb-0",attrs:{"hide-details":"",label:'Toggle "Game Layout" Preview',inset:""},model:{value:t.gameLayoutPreviewToggle,callback:function(e){t.gameLayoutPreviewToggle=e},expression:"gameLayoutPreviewToggle"}}):t._e()]:e("div",{style:{"font-style":"italic"}},[t._v("\n    OBS connection currently disconnected.\n  ")]):e("div",{style:{"font-style":"italic"}},[t._v("\n    This feature is not enabled.\n  ")])],2)}),[],!1,null,null,null).exports;var A=i(4368),V=i(9844);s.cp.use(A.cp);let R=class extends V.y6{get reps(){return this.context.rootState.ReplicantModule.reps}};R=function(t,e,i,n){var s,o=arguments.length,a=o<3?e:null===n?n=Object.getOwnPropertyDescriptor(e,i):n;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)a=Reflect.decorate(t,e,i,n);else for(var r=t.length-1;r>=0;r--)(s=t[r])&&(a=(o<3?s(a):o>3?s(e,i,a):s(e,i))||a);return o>3&&a&&Object.defineProperty(e,i,a),a}([(0,V.gB)({name:"OurModule"})],R);const j=new A.m_({strict:!1,state:{},modules:{ReplicantModule:n.Gg,OurModule:R}}),F=j;(0,V.GM)(R,j),(0,n.Cg)(F).then((()=>{new s.cp({vuetify:o.c,store:F,el:"#App",render:t=>t(k)})}))}},i={};function n(t){var s=i[t];if(void 0!==s)return s.exports;var o=i[t]={exports:{}};return e[t].call(o.exports,o,o.exports,n),o.exports}n.m=e,t=[],n.O=(e,i,s,o)=>{if(!i){var a=1/0;for(u=0;u<t.length;u++){for(var[i,s,o]=t[u],r=!0,l=0;l<i.length;l++)(!1&o||a>=o)&&Object.keys(n.O).every((t=>n.O[t](i[l])))?i.splice(l--,1):(r=!1,o<a&&(a=o));if(r){t.splice(u--,1);var c=s();void 0!==c&&(e=c)}}return e}o=o||0;for(var u=t.length;u>0&&t[u-1][2]>o;u--)t[u]=t[u-1];t[u]=[i,s,o]},n.n=t=>{var e=t&&t.__esModule?()=>t.default:()=>t;return n.d(e,{a:e}),e},n.d=(t,e)=>{for(var i in e)n.o(e,i)&&!n.o(t,i)&&Object.defineProperty(t,i,{enumerable:!0,get:e[i]})},n.g=function(){if("object"==typeof globalThis)return globalThis;try{return this||new Function("return this")()}catch(t){if("object"==typeof window)return window}}(),n.o=(t,e)=>Object.prototype.hasOwnProperty.call(t,e),n.r=t=>{"undefined"!=typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(t,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(t,"__esModule",{value:!0})},(()=>{var t={700:0};n.O.j=e=>0===t[e];var e=(e,i)=>{var s,o,[a,r,l]=i,c=0;if(a.some((e=>0!==t[e]))){for(s in r)n.o(r,s)&&(n.m[s]=r[s]);if(l)var u=l(n)}for(e&&e(i);c<a.length;c++)o=a[c],n.o(t,o)&&t[o]&&t[o][0](),t[o]=0;return n.O(u)},i=self.webpackChunk=self.webpackChunk||[];i.forEach(e.bind(null,0)),i.push=e.bind(null,i.push.bind(i))})();var s=n.O(void 0,[208,540,476,368,112],(()=>n(4704)));s=n.O(s)})();