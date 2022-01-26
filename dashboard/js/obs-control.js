(()=>{"use strict";var t,e={7978:(t,e,n)=>{var i=n(8138),s=n.n(i),o=n(829),a=n(5803),r=n(708),l=n(4170),c=function(t,e,n,i){var s,o=arguments.length,a=o<3?e:null===i?i=Object.getOwnPropertyDescriptor(e,n):i;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)a=Reflect.decorate(t,e,n,i);else for(var r=t.length-1;r>=0;r--)(s=t[r])&&(a=(o<3?s(a):o>3?s(e,n,a):s(e,n))||a);return o>3&&a&&Object.defineProperty(e,n,a),a};const u=new o.SpeedcontrolUtilBrowser(nodecg),d={bids:nodecg.Replicant("bids"),bigbuttonPlayerMap:nodecg.Replicant("bigbuttonPlayerMap"),commentators:nodecg.Replicant("commentators"),countdown:nodecg.Replicant("countdown"),currentRunDelay:nodecg.Replicant("currentRunDelay"),donationReader:nodecg.Replicant("donationReader"),donationsToRead:nodecg.Replicant("donationsToRead"),donationTotal:nodecg.Replicant("donationTotal"),donationTotalMilestones:nodecg.Replicant("donationTotalMilestones"),gameLayouts:nodecg.Replicant("gameLayouts"),obsData:nodecg.Replicant("obsData"),omnibar:nodecg.Replicant("omnibar"),otherStreamData:nodecg.Replicant("otherStreamData"),prizes:nodecg.Replicant("prizes"),runDataActiveRun:u.runDataActiveRun,runDataActiveRunSurrounding:u.runDataActiveRunSurrounding,runDataArray:u.runDataArray,serverTimestamp:nodecg.Replicant("serverTimestamp"),streamDeckData:nodecg.Replicant("streamDeckData"),timer:u.timer,ttsVoices:nodecg.Replicant("ttsVoices"),upcomingRunID:nodecg.Replicant("upcomingRunID"),videoPlayer:nodecg.Replicant("videoPlayer")};let p,h=class extends l.g4{constructor(){super(...arguments),this.reps={}}get repsTyped(){return this.reps}setState({name:t,val:e}){a.Z.set(this.reps,t,s()(e))}setReplicant({name:t,val:e}){a.Z.set(this.reps,t,s()(e)),d[t].value=s()(e)}};c([l.mm],h.prototype,"setState",null),c([l.mm],h.prototype,"setReplicant",null),h=c([(0,l.Yl)({name:"ReplicantModule",namespaced:!0})],h);const f=(0,r.uD)("ReplicantModule");var v=n(9459),g=n(5925);n(4807),n(7023),n(5654),n(779),n(8793);var m=function(t,e,n,i){var s,o=arguments.length,a=o<3?e:null===i?i=Object.getOwnPropertyDescriptor(e,n):i;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)a=Reflect.decorate(t,e,n,i);else for(var r=t.length-1;r>=0;r--)(s=t[r])&&(a=(o<3?s(a):o>3?s(e,n,a):s(e,n))||a);return o>3&&a&&Object.defineProperty(e,n,a),a};let y=class extends a.Z{constructor(){super(...arguments),this.evtConfig=nodecg.bundleConfig.event,this.obsConfig=nodecg.bundleConfig.obs,this.gameLayoutPreviewToggle=!0}disableButton(t){return this.obsData.transitioning||t===this.obsData.scene||this.obsData.disableTransitioning}get disableIntermission(){const t=[this.obsConfig.names.scenes.commercials,this.obsConfig.names.scenes.intermission,this.obsConfig.names.scenes.intermissionPlayer,this.obsConfig.names.scenes.countdown];return this.obsData.transitioning||this.obsData.disableTransitioning||!!t.find((t=>{var e;return null===(e=this.obsData.scene)||void 0===e?void 0:e.startsWith(t)}))}startIntermission(){nodecg.sendMessage("startIntermission")}changeScene(t){nodecg.sendMessage("obsChangeScene",{scene:t})}};m([f.State((t=>t.reps.obsData))],y.prototype,"obsData",void 0),m([f.State((t=>t.reps.currentRunDelay))],y.prototype,"currentRunDelay",void 0),m([f.State((t=>t.reps.serverTimestamp))],y.prototype,"serverTimestamp",void 0),m([f.State((t=>t.reps.videoPlayer))],y.prototype,"videoPlayer",void 0),y=m([g.default],y);const b=y;var w=n(5440),_=n(7618),C=n.n(_),S=n(1883),D=n(6255),R=n(7019),T=n(2873),x=n(2385);const O=a.Z.extend({name:"rippleable",directives:{ripple:x.Z},props:{ripple:{type:[Boolean,Object],default:!0}},methods:{genRipple(t={}){return this.ripple?(t.staticClass="v-input--selection-controls__ripple",t.directives=t.directives||[],t.directives.push({name:"ripple",value:{center:!0}}),this.$createElement("div",t)):null}}});var P=n(2377);const k=a.Z.extend({name:"comparable",props:{valueComparator:{type:Function,default:P.vZ}}});function A(t){t.preventDefault()}const L=(0,n(6248).Z)(T.Z,O,k).extend({name:"selectable",model:{prop:"inputValue",event:"change"},props:{id:String,inputValue:null,falseValue:null,trueValue:null,multiple:{type:Boolean,default:null},label:String},data(){return{hasColor:this.inputValue,lazyValue:this.inputValue}},computed:{computedColor(){if(this.isActive)return this.color?this.color:this.isDark&&!this.appIsDark?"white":"primary"},isMultiple(){return!0===this.multiple||null===this.multiple&&Array.isArray(this.internalValue)},isActive(){const t=this.value,e=this.internalValue;return this.isMultiple?!!Array.isArray(e)&&e.some((e=>this.valueComparator(e,t))):void 0===this.trueValue||void 0===this.falseValue?t?this.valueComparator(t,e):Boolean(e):this.valueComparator(e,this.trueValue)},isDirty(){return this.isActive},rippleState(){return this.isDisabled||this.validationState?this.validationState:void 0}},watch:{inputValue(t){this.lazyValue=t,this.hasColor=t}},methods:{genLabel(){const t=T.Z.options.methods.genLabel.call(this);return t?(t.data.on={click:A},t):t},genInput(t,e){return this.$createElement("input",{attrs:Object.assign({"aria-checked":this.isActive.toString(),disabled:this.isDisabled,id:this.computedId,role:t,type:t},e),domProps:{value:this.value,checked:this.isActive},on:{blur:this.onBlur,change:this.onChange,focus:this.onFocus,keydown:this.onKeydown,click:A},ref:"input"})},onBlur(){this.isFocused=!1},onClick(t){this.onChange(),this.$emit("click",t)},onChange(){if(!this.isInteractive)return;const t=this.value;let e=this.internalValue;if(this.isMultiple){Array.isArray(e)||(e=[]);const n=e.length;e=e.filter((e=>!this.valueComparator(e,t))),e.length===n&&e.push(t)}else e=void 0!==this.trueValue&&void 0!==this.falseValue?this.valueComparator(e,this.trueValue)?this.falseValue:this.trueValue:t?this.valueComparator(e,t)?null:t:!e;this.validate(!0,e),this.internalValue=e,this.hasColor=e},onFocus(){this.isFocused=!0},onKeydown(t){}}});function j(t){const e={touchstartX:0,touchstartY:0,touchendX:0,touchendY:0,touchmoveX:0,touchmoveY:0,offsetX:0,offsetY:0,left:t.left,right:t.right,up:t.up,down:t.down,start:t.start,move:t.move,end:t.end};return{touchstart:t=>function(t,e){const n=t.changedTouches[0];e.touchstartX=n.clientX,e.touchstartY=n.clientY,e.start&&e.start(Object.assign(t,e))}(t,e),touchend:t=>function(t,e){const n=t.changedTouches[0];e.touchendX=n.clientX,e.touchendY=n.clientY,e.end&&e.end(Object.assign(t,e)),(t=>{const{touchstartX:e,touchendX:n,touchstartY:i,touchendY:s}=t;t.offsetX=n-e,t.offsetY=s-i,Math.abs(t.offsetY)<.5*Math.abs(t.offsetX)&&(t.left&&n<e-16&&t.left(t),t.right&&n>e+16&&t.right(t)),Math.abs(t.offsetX)<.5*Math.abs(t.offsetY)&&(t.up&&s<i-16&&t.up(t),t.down&&s>i+16&&t.down(t))})(e)}(t,e),touchmove:t=>function(t,e){const n=t.changedTouches[0];e.touchmoveX=n.clientX,e.touchmoveY=n.clientY,e.move&&e.move(Object.assign(t,e))}(t,e)}}const $={inserted:function(t,e,n){const i=e.value,s=i.parent?t.parentElement:t,o=i.options||{passive:!0};if(!s)return;const a=j(e.value);s._touchHandlers=Object(s._touchHandlers),s._touchHandlers[n.context._uid]=a,(0,P.XP)(a).forEach((t=>{s.addEventListener(t,a[t],o)}))},unbind:function(t,e,n){const i=e.value.parent?t.parentElement:t;if(!i||!i._touchHandlers)return;const s=i._touchHandlers[n.context._uid];(0,P.XP)(s).forEach((t=>{i.removeEventListener(t,s[t])})),delete i._touchHandlers[n.context._uid]}};var V=n(2138);function Z(t=[],...e){return Array().concat(t,...e)}function M(t,e="top center 0",n){return{name:t,functional:!0,props:{group:{type:Boolean,default:!1},hideOnLeave:{type:Boolean,default:!1},leaveAbsolute:{type:Boolean,default:!1},mode:{type:String,default:n},origin:{type:String,default:e}},render(e,n){const i="transition"+(n.props.group?"-group":""),s={props:{name:t,mode:n.props.mode},on:{beforeEnter(t){t.style.transformOrigin=n.props.origin,t.style.webkitTransformOrigin=n.props.origin}}};return n.props.leaveAbsolute&&(s.on.leave=Z(s.on.leave,(t=>{const{offsetTop:e,offsetLeft:n,offsetWidth:i,offsetHeight:s}=t;t._transitionInitialStyles={position:t.style.position,top:t.style.top,left:t.style.left,width:t.style.width,height:t.style.height},t.style.position="absolute",t.style.top=e+"px",t.style.left=n+"px",t.style.width=i+"px",t.style.height=s+"px"})),s.on.afterLeave=Z(s.on.afterLeave,(t=>{if(t&&t._transitionInitialStyles){const{position:e,top:n,left:i,width:s,height:o}=t._transitionInitialStyles;delete t._transitionInitialStyles,t.style.position=e||"",t.style.top=n||"",t.style.left=i||"",t.style.width=s||"",t.style.height=o||""}}))),n.props.hideOnLeave&&(s.on.leave=Z(s.on.leave,(t=>{t.style.setProperty("display","none","important")}))),e(i,(0,V.ZP)(n.data,s),n.children)}}}function E(t,e,n="in-out"){return{name:t,functional:!0,props:{mode:{type:String,default:n}},render:(n,i)=>n("transition",(0,V.ZP)(i.data,{props:{name:t},on:e}),i.children)}}function F(t="",e=!1){const n=e?"width":"height",i=`offset${(0,P.jC)(n)}`;return{beforeEnter(t){t._parent=t.parentNode,t._initialStyle={transition:t.style.transition,overflow:t.style.overflow,[n]:t.style[n]}},enter(e){const s=e._initialStyle;e.style.setProperty("transition","none","important"),e.style.overflow="hidden";const o=`${e[i]}px`;e.style[n]="0",e.offsetHeight,e.style.transition=s.transition,t&&e._parent&&e._parent.classList.add(t),requestAnimationFrame((()=>{e.style[n]=o}))},afterEnter:o,enterCancelled:o,leave(t){t._initialStyle={transition:"",overflow:t.style.overflow,[n]:t.style[n]},t.style.overflow="hidden",t.style[n]=`${t[i]}px`,t.offsetHeight,requestAnimationFrame((()=>t.style[n]="0"))},afterLeave:s,leaveCancelled:s};function s(e){t&&e._parent&&e._parent.classList.remove(t),o(e)}function o(t){const e=t._initialStyle[n];t.style.overflow=t._initialStyle.overflow,null!=e&&(t.style[n]=e),delete t._initialStyle}}M("carousel-transition"),M("carousel-reverse-transition"),M("tab-transition"),M("tab-reverse-transition"),M("menu-transition");const I=M("fab-transition","center center","out-in");M("dialog-transition"),M("dialog-bottom-transition"),M("dialog-top-transition"),M("fade-transition"),M("scale-transition"),M("scroll-x-transition"),M("scroll-x-reverse-transition"),M("scroll-y-transition"),M("scroll-y-reverse-transition"),M("slide-x-transition"),M("slide-x-reverse-transition"),M("slide-y-transition"),M("slide-y-reverse-transition"),E("expand-transition",F()),E("expand-x-transition",F("",!0));var B=n(2506);const X=L.extend({name:"v-switch",directives:{Touch:$},props:{inset:Boolean,loading:{type:[Boolean,String],default:!1},flat:{type:Boolean,default:!1}},computed:{classes(){return{...T.Z.options.computed.classes.call(this),"v-input--selection-controls v-input--switch":!0,"v-input--switch--flat":this.flat,"v-input--switch--inset":this.inset}},attrs(){return{"aria-checked":String(this.isActive),"aria-disabled":String(this.isDisabled),role:"switch"}},validationState(){return this.hasError&&this.shouldValidate?"error":this.hasSuccess?"success":null!==this.hasColor?this.computedColor:void 0},switchData(){return this.setTextColor(this.loading?void 0:this.validationState,{class:this.themeClasses})}},methods:{genDefaultSlot(){return[this.genSwitch(),this.genLabel()]},genSwitch(){const{title:t,...e}=this.attrs$;return this.$createElement("div",{staticClass:"v-input--selection-controls__input"},[this.genInput("checkbox",{...this.attrs,...e}),this.genRipple(this.setTextColor(this.validationState,{directives:[{name:"touch",value:{left:this.onSwipeLeft,right:this.onSwipeRight}}]})),this.$createElement("div",{staticClass:"v-input--switch__track",...this.switchData}),this.$createElement("div",{staticClass:"v-input--switch__thumb",...this.switchData},[this.genProgress()])])},genProgress(){return this.$createElement(I,{},[!1===this.loading?null:this.$slots.progress||this.$createElement(B.Z,{props:{color:!0===this.loading||""===this.loading?this.color||"primary":this.loading,size:16,width:2,indeterminate:!0}})])},onSwipeLeft(){this.isActive&&this.onChange()},onSwipeRight(){this.isActive||this.onChange()},onKeydown(t){(t.keyCode===P.Do.left&&this.isActive||t.keyCode===P.Do.right&&!this.isActive)&&this.onChange()}}});var Y=(0,w.Z)(b,(function(){var t=this,e=t.$createElement,n=t._self._c||e;return n("v-app",[t.obsConfig.enabled?t.obsData.connected?[n("div",{staticClass:"mb-1"},[t.obsData.transitionTimestamp>t.serverTimestamp?n("span",{staticClass:"red--text font-weight-bold"},[n("v-icon",{attrs:{color:"red"}},[t._v("mdi-alert")]),t._v("\n        Transitioning in "+t._s(((t.obsData.transitionTimestamp-t.serverTimestamp)/1e3).toFixed(1))+"s\n      ")],1):t.obsData.transitioning?n("span",{staticClass:"red--text font-weight-bold"},[n("v-icon",{attrs:{color:"red"}},[t._v("mdi-alert")]),t._v("\n        Transitioning\n      ")],1):t.videoPlayer.estimatedFinishTimestamp>t.serverTimestamp?n("span",{staticClass:"red--text font-weight-bold"},[n("v-icon",{attrs:{color:"red"}},[t._v("mdi-alert")]),t._v("\n        Playlist will finish in ~"+t._s(((t.videoPlayer.estimatedFinishTimestamp-t.serverTimestamp)/1e3).toFixed(1))+"s\n      ")],1):t.obsData.disableTransitioning?n("span",{staticClass:"red--text font-weight-bold"},[n("v-icon",{attrs:{color:"red"}},[t._v("mdi-alert")]),t._v("\n        Transitioning Disabled\n      ")],1):n("span",{staticClass:"font-italic"},[t._v("\n        Not Currently Transitioning\n      ")])]),t._v(" "),n("div",{staticClass:"mb-1"},[t._v("\n      Streaming Status:\n      "),t.obsData.streaming?n("span",{style:{"font-weight":"bold",color:"#58CF00"}},[t._v("\n        Connected\n      ")]):n("span",{style:{"font-weight":"bold",color:"#FF5F5C"}},[t._v("\n        Disconnected\n      ")])]),t._v(" "),n("v-btn",{attrs:{disabled:t.disableIntermission},on:{click:t.startIntermission}},[t._v("\n      Start Intermission\n      "),t.currentRunDelay.audio?[t._v("\n        ("+t._s((t.currentRunDelay.audio/1e3).toFixed(1))+"s delay)\n      ")]:t._e()],2),t._v(" "),n("v-btn",{staticClass:"mt-1",attrs:{disabled:t.disableButton(t.obsConfig.names.scenes.gameLayout)},on:{click:function(e){return t.changeScene(t.obsConfig.names.scenes.gameLayout)}}},[t._v("\n      Start Run\n      "),t.currentRunDelay.audio?[t._v("\n        ("+t._s((t.currentRunDelay.audio/1e3).toFixed(1))+"s delay)\n      ")]:t._e()],2),t._v(" "),n("div",{staticClass:"d-flex mt-3 mb-1"},[t._v("\n      Change to Specific Scene:\n    ")]),t._v(" "),t._l(t.obsData.sceneList,(function(e,i){return n("v-btn",{key:i,class:{"mt-1":0!==i},attrs:{disabled:t.disableButton(e)},on:{click:function(n){return t.changeScene(e)}}},[t._v("\n      "+t._s(e)+"\n      "),e!==t.obsData.scene&&t.currentRunDelay.audio&&(e===t.obsConfig.names.scenes.gameLayout||e!==t.obsConfig.names.scenes.gameLayout&&t.obsData.scene===t.obsConfig.names.scenes.gameLayout)?[t._v("\n        ("+t._s((t.currentRunDelay.audio/1e3).toFixed(1))+"s delay)\n      ")]:t._e()],2)})),t._v(" "),t.evtConfig.online&&t.obsData.gameLayoutScreenshot&&t.gameLayoutPreviewToggle?[n("div",{staticClass:"mt-3 mb-1"},[t._v('\n        "Game Layout" Preview (refreshes every second):\n      ')]),t._v(" "),n("img",{style:{width:"100%"},attrs:{src:t.obsData.gameLayoutScreenshot}})]:t._e(),t._v(" "),t.evtConfig.online?n("v-switch",{staticClass:"ma-2 mb-0",attrs:{"hide-details":"",label:'Toggle "Game Layout" Preview',inset:""},model:{value:t.gameLayoutPreviewToggle,callback:function(e){t.gameLayoutPreviewToggle=e},expression:"gameLayoutPreviewToggle"}}):t._e()]:n("div",{style:{"font-style":"italic"}},[t._v("\n    OBS connection currently disconnected.\n  ")]):n("div",{style:{"font-style":"italic"}},[t._v("\n    This feature is not enabled.\n  ")])],2)}),[],!1,null,null,null);const H=Y.exports;C()(Y,{VApp:S.Z,VBtn:D.Z,VIcon:R.Z,VSwitch:X});var z=n(8586);a.Z.use(z.ZP);let N=class extends l.g4{get reps(){return this.context.rootState.ReplicantModule.reps}};N=function(t,e,n,i){var s,o=arguments.length,a=o<3?e:null===i?i=Object.getOwnPropertyDescriptor(e,n):i;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)a=Reflect.decorate(t,e,n,i);else for(var r=t.length-1;r>=0;r--)(s=t[r])&&(a=(o<3?s(a):o>3?s(e,n,a):s(e,n))||a);return o>3&&a&&Object.defineProperty(e,n,a),a}([(0,l.Yl)({name:"OurModule"})],N);const q=new z.yh({strict:!1,state:{},modules:{ReplicantModule:h,OurModule:N}}),G=q;(0,l.rT)(N,q),function(t){return e=this,n=void 0,s=function*(){Object.keys(d).forEach((e=>{d[e].on("change",(n=>{t.commit("ReplicantModule/setState",{name:e,val:n})}))})),yield NodeCG.waitForReplicants(...Object.keys(d).map((t=>d[t]))),p=(0,l.rT)(h,t)},new((i=void 0)||(i=Promise))((function(t,o){function a(t){try{l(s.next(t))}catch(t){o(t)}}function r(t){try{l(s.throw(t))}catch(t){o(t)}}function l(e){var n;e.done?t(e.value):(n=e.value,n instanceof i?n:new i((function(t){t(n)}))).then(a,r)}l((s=s.apply(e,n||[])).next())}));var e,n,i,s}(G).then((()=>{new a.Z({vuetify:v.Z,store:G,el:"#App",render:t=>t(H)})}))},779:(t,e,n)=>{"undefined"!=typeof Reflect&&Reflect.getMetadata},9085:(t,e,n)=>{n.d(e,{d:()=>s});var i=n(5803);function s(t="value",e="input"){return i.Z.extend({name:"toggleable",model:{prop:t,event:e},props:{[t]:{required:!1}},data(){return{isActive:!!this[t]}},watch:{[t](t){this.isActive=!!t},isActive(n){!!n!==this[t]&&this.$emit(e,n)}}})}s()},2377:(t,e,n)=>{n.d(e,{qw:()=>s,vZ:()=>o,vO:()=>a,ji:()=>r,kb:()=>l,GL:()=>c,Do:()=>d,RB:()=>p,XP:()=>h,_A:()=>v,jC:()=>g,TI:()=>m,z9:()=>y,uZ:()=>b,Ee:()=>w});let i=!1;try{if("undefined"!=typeof window){const t=Object.defineProperty({},"passive",{get:()=>{i=!0}});window.addEventListener("testListener",t,t),window.removeEventListener("testListener",t,t)}}catch(t){console.warn(t)}function s(t,e,n){const i=e.length-1;if(i<0)return void 0===t?n:t;for(let s=0;s<i;s++){if(null==t)return n;t=t[e[s]]}return null==t||void 0===t[e[i]]?n:t[e[i]]}function o(t,e){if(t===e)return!0;if(t instanceof Date&&e instanceof Date&&t.getTime()!==e.getTime())return!1;if(t!==Object(t)||e!==Object(e))return!1;const n=Object.keys(t);return n.length===Object.keys(e).length&&n.every((n=>o(t[n],e[n])))}function a(t,e,n){return null!=t&&e&&"string"==typeof e?void 0!==t[e]?t[e]:s(t,(e=(e=e.replace(/\[(\w+)\]/g,".$1")).replace(/^\./,"")).split("."),n):n}function r(t,e){const n={};for(let i=0;i<e.length;i++){const s=e[i];void 0!==t[s]&&(n[s]=t[s])}return n}function l(t,e="px"){return null==t||""===t?void 0:isNaN(+t)?String(t):`${Number(t)}${e}`}function c(t){return(t||"").replace(/([a-z])([A-Z])/g,"$1-$2").toLowerCase()}function u(t){return null!==t&&"object"==typeof t}const d=Object.freeze({enter:13,tab:9,delete:46,esc:27,space:32,up:38,down:40,left:37,right:39,end:35,home:36,del:46,backspace:8,insert:45,pageup:33,pagedown:34,shift:16});function p(t,e){const n=t.$vuetify.icons.component;if(e.startsWith("$")){const n=a(t,`$vuetify.icons.values.${e.split("$").pop().split(".").pop()}`,e);if("string"!=typeof n)return n;e=n}return null==n?e:{component:n,props:{icon:e}}}function h(t){return Object.keys(t)}const f=/-(\w)/g,v=t=>t.replace(f,((t,e)=>e?e.toUpperCase():""));function g(t){return t.charAt(0).toUpperCase()+t.slice(1)}function m(t){return null!=t?Array.isArray(t)?t:[t]:[]}function y(t,e="default",n,i=!1){return t.$scopedSlots.hasOwnProperty(e)?t.$scopedSlots[e](n instanceof Function?n():n):!t.$slots.hasOwnProperty(e)||n&&!i?void 0:t.$slots[e]}function b(t,e=0,n=1){return Math.max(e,Math.min(n,t))}function w(t={},e={}){for(const n in e){const i=t[n],s=e[n];u(i)&&u(s)?t[n]=w(i,s):t[n]=s}return t}},2138:(t,e,n)=>{n.d(e,{ZP:()=>r});var i=n(2377);const s=/;(?![^(]*\))/g,o=/:(.*)/;function a(t){const e={};for(const n of t.split(s)){let[t,s]=n.split(o);t=t.trim(),t&&("string"==typeof s&&(s=s.trim()),e[(0,i._A)(t)]=s)}return e}function r(){const t={};let e,n=arguments.length;for(;n--;)for(e of Object.keys(arguments[n]))switch(e){case"class":case"directives":arguments[n][e]&&(t[e]=c(t[e],arguments[n][e]));break;case"style":arguments[n][e]&&(t[e]=l(t[e],arguments[n][e]));break;case"staticClass":if(!arguments[n][e])break;void 0===t[e]&&(t[e]=""),t[e]&&(t[e]+=" "),t[e]+=arguments[n][e].trim();break;case"on":case"nativeOn":arguments[n][e]&&(t[e]=u(t[e],arguments[n][e]));break;case"attrs":case"props":case"domProps":case"scopedSlots":case"staticStyle":case"hook":case"transition":if(!arguments[n][e])break;t[e]||(t[e]={}),t[e]={...arguments[n][e],...t[e]};break;default:t[e]||(t[e]=arguments[n][e])}return t}function l(t,e){return t?e?(t=(0,i.TI)("string"==typeof t?a(t):t)).concat("string"==typeof e?a(e):e):t:e}function c(t,e){return e?t&&t?(0,i.TI)(t).concat(e):e:t}function u(...t){if(!t[0])return t[1];if(!t[1])return t[0];const e={};for(let n=2;n--;){const i=t[n];for(const t in i)i[t]&&(e[t]?e[t]=[].concat(i[t],e[t]):e[t]=i[t])}return e}}},n={};function i(t){var s=n[t];if(void 0!==s)return s.exports;var o=n[t]={exports:{}};return e[t].call(o.exports,o,o.exports,i),o.exports}i.m=e,t=[],i.O=(e,n,s,o)=>{if(!n){var a=1/0;for(u=0;u<t.length;u++){for(var[n,s,o]=t[u],r=!0,l=0;l<n.length;l++)(!1&o||a>=o)&&Object.keys(i.O).every((t=>i.O[t](n[l])))?n.splice(l--,1):(r=!1,o<a&&(a=o));if(r){t.splice(u--,1);var c=s();void 0!==c&&(e=c)}}return e}o=o||0;for(var u=t.length;u>0&&t[u-1][2]>o;u--)t[u]=t[u-1];t[u]=[n,s,o]},i.n=t=>{var e=t&&t.__esModule?()=>t.default:()=>t;return i.d(e,{a:e}),e},i.d=(t,e)=>{for(var n in e)i.o(e,n)&&!i.o(t,n)&&Object.defineProperty(t,n,{enumerable:!0,get:e[n]})},i.g=function(){if("object"==typeof globalThis)return globalThis;try{return this||new Function("return this")()}catch(t){if("object"==typeof window)return window}}(),i.o=(t,e)=>Object.prototype.hasOwnProperty.call(t,e),i.r=t=>{"undefined"!=typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(t,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(t,"__esModule",{value:!0})},(()=>{var t={800:0};i.O.j=e=>0===t[e];var e=(e,n)=>{var s,o,[a,r,l]=n,c=0;if(a.some((e=>0!==t[e]))){for(s in r)i.o(r,s)&&(i.m[s]=r[s]);if(l)var u=l(i)}for(e&&e(n);c<a.length;c++)o=a[c],i.o(t,o)&&t[o]&&t[o][0](),t[o]=0;return i.O(u)},n=self.webpackChunk=self.webpackChunk||[];n.forEach(e.bind(null,0)),n.push=e.bind(null,n.push.bind(n))})();var s=i.O(void 0,[515,821,873,291],(()=>i(7978)));s=i.O(s)})();