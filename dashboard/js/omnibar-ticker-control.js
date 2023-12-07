(()=>{"use strict";var e,t={1570:(e,t,o)=>{var n=o(8138),i=o.n(n),s=o(829),a=o(5803),r=o(708),l=o(4170),c=function(e,t,o,n){var i,s=arguments.length,a=s<3?t:null===n?n=Object.getOwnPropertyDescriptor(t,o):n;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)a=Reflect.decorate(e,t,o,n);else for(var r=e.length-1;r>=0;r--)(i=e[r])&&(a=(s<3?i(a):s>3?i(t,o,a):i(t,o))||a);return s>3&&a&&Object.defineProperty(t,o,a),a};const d=new s.SpeedcontrolUtilBrowser(nodecg),p={assetsIntermissionSlides:nodecg.Replicant("assets:intermission-slides"),assetsReaderIntroductionImages:nodecg.Replicant("assets:reader-introduction-images"),bids:nodecg.Replicant("bids"),bigbuttonPlayerMap:nodecg.Replicant("bigbuttonPlayerMap"),commentators:nodecg.Replicant("commentators"),countdown:nodecg.Replicant("countdown"),currentRunDelay:nodecg.Replicant("currentRunDelay"),donationReader:nodecg.Replicant("donationReader"),donationsToRead:nodecg.Replicant("donationsToRead"),donationTotal:nodecg.Replicant("donationTotal"),donationTotalMilestones:nodecg.Replicant("donationTotalMilestones"),gameLayouts:nodecg.Replicant("gameLayouts"),intermissionSlides:nodecg.Replicant("intermissionSlides"),obsData:nodecg.Replicant("obsData"),omnibar:nodecg.Replicant("omnibar"),otherStreamData:nodecg.Replicant("otherStreamData"),prizes:nodecg.Replicant("prizes"),readerIntroduction:nodecg.Replicant("readerIntroduction"),runDataActiveRun:d.runDataActiveRun,runDataActiveRunSurrounding:d.runDataActiveRunSurrounding,runDataArray:d.runDataArray,serverTimestamp:nodecg.Replicant("serverTimestamp"),streamDeckData:nodecg.Replicant("streamDeckData"),timer:d.timer,ttsVoices:nodecg.Replicant("ttsVoices"),upcomingRunID:nodecg.Replicant("upcomingRunID"),videoPlayer:nodecg.Replicant("videoPlayer")};let u,v=class extends l.g4{constructor(){super(...arguments),this.reps={}}get repsTyped(){return this.reps}setState({name:e,val:t}){a.ZP.set(this.reps,e,i()(t))}setReplicant({name:e,val:t}){a.ZP.set(this.reps,e,i()(t)),p[e].value=i()(t)}};c([l.mm],v.prototype,"setState",null),c([l.mm],v.prototype,"setReplicant",null),v=c([(0,l.Yl)({name:"ReplicantModule",namespaced:!0})],v);const f=(0,r.uD)("ReplicantModule");var m=o(3687),g=o(936),h=o(6255),y=o(8821),b=o(7019);const R={randomUUID:"undefined"!=typeof crypto&&crypto.randomUUID&&crypto.randomUUID.bind(crypto)};let _;const x=new Uint8Array(16);function w(){if(!_&&(_="undefined"!=typeof crypto&&crypto.getRandomValues&&crypto.getRandomValues.bind(crypto),!_))throw new Error("crypto.getRandomValues() not supported. See https://github.com/uuidjs/uuid#getrandomvalues-not-supported");return _(x)}const P=[];for(let e=0;e<256;++e)P.push((e+256).toString(16).slice(1));const Z=function(e,t,o){if(R.randomUUID&&!t&&!e)return R.randomUUID();const n=(e=e||{}).random||(e.rng||w)();if(n[6]=15&n[6]|64,n[8]=63&n[8]|128,t){o=o||0;for(let e=0;e<16;++e)t[o+e]=n[e];return t}return function(e,t=0){return P[e[t+0]]+P[e[t+1]]+P[e[t+2]]+P[e[t+3]]+"-"+P[e[t+4]]+P[e[t+5]]+"-"+P[e[t+6]]+P[e[t+7]]+"-"+P[e[t+8]]+P[e[t+9]]+"-"+P[e[t+10]]+P[e[t+11]]+P[e[t+12]]+P[e[t+13]]+P[e[t+14]]+P[e[t+15]]}(n)};var O=o(5925),D=(o(4807),o(7023),o(5654),o(779));function I(e){return void 0===e&&(e={}),function(t,o){(0,D.l)(e,t,o),(0,O.createDecorator)((function(t,o){(t.props||(t.props={}))[o]=e}))(t,o)}}o(8793);var k=o(5612),C=o(4048),S=o.n(C),j=o(9085),M=o(2027);const T=a.ZP.extend({name:"transitionable",props:{mode:String,origin:String,transition:String}});var G=o(4921),L=o(6248);const N=(0,L.Z)(M.Z,j.Z,T).extend({name:"v-speed-dial",directives:{ClickOutside:G.Z},props:{direction:{type:String,default:"top",validator:e=>["top","right","bottom","left"].includes(e)},openOnHover:Boolean,transition:{type:String,default:"scale-transition"}},computed:{classes(){return{"v-speed-dial":!0,"v-speed-dial--top":this.top,"v-speed-dial--right":this.right,"v-speed-dial--bottom":this.bottom,"v-speed-dial--left":this.left,"v-speed-dial--absolute":this.absolute,"v-speed-dial--fixed":this.fixed,[`v-speed-dial--direction-${this.direction}`]:!0,"v-speed-dial--is-active":this.isActive}}},render(e){let t=[];const o={class:this.classes,directives:[{name:"click-outside",value:()=>this.isActive=!1}],on:{click:()=>this.isActive=!this.isActive}};if(this.openOnHover&&(o.on.mouseenter=()=>this.isActive=!0,o.on.mouseleave=()=>this.isActive=!1),this.isActive){let o=0;t=(this.$slots.default||[]).map(((t,n)=>!t.tag||void 0===t.componentOptions||"v-btn"!==t.componentOptions.Ctor.options.name&&"v-tooltip"!==t.componentOptions.Ctor.options.name?(t.key=n,t):(o++,e("div",{style:{transitionDelay:.05*o+"s"},key:n},[t]))))}const n=e("transition-group",{class:"v-speed-dial__list",props:{name:this.transition,mode:this.mode,origin:this.origin,tag:"div"}},t);return e("div",o,[this.$slots.activator,n])}});var E=o(8586),U=function(e,t,o,n){var i,s=arguments.length,a=s<3?t:null===n?n=Object.getOwnPropertyDescriptor(t,o):n;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)a=Reflect.decorate(e,t,o,n);else for(var r=e.length-1;r>=0;r--)(i=e[r])&&(a=(s<3?i(a):s>3?i(t,o,a):i(t,o))||a);return s>3&&a&&Object.defineProperty(t,o,a),a};a.ZP.use(E.ZP);let F=class extends l.g4{constructor(){super(...arguments),this.localRotation=[],this.localEdits=!1,this.editItemId="",this.editDialog=!1}get reps(){return this.context.rootState.ReplicantModule.reps}setLocalRotation({val:e,manual:t=!1}){this.localRotation=i()(e),this.localEdits=t}setGlobalRotation(e){u.setReplicant({name:"omnibar",val:Object.assign(Object.assign({},u.repsTyped.omnibar),{rotation:i()(e)})}),this.localEdits=!1}deleteItem(e){const t=this.localRotation.findIndex((t=>t.id===e));t>=0&&(this.localRotation.splice(t,1),this.localEdits=!0)}changeEditItemId(e){this.editItemId=e||""}toggleEditDialog(e){this.editDialog=e}updateLocalItem(e){const t=this.localRotation.findIndex((t=>t.id===e.id));t>=0&&(a.ZP.set(this.localRotation,t,i()(e)),this.localEdits=!0)}};U([l.mm],F.prototype,"setLocalRotation",null),U([l.mm],F.prototype,"setGlobalRotation",null),U([l.mm],F.prototype,"deleteItem",null),U([l.mm],F.prototype,"changeEditItemId",null),U([l.mm],F.prototype,"toggleEditDialog",null),U([l.mm],F.prototype,"updateLocalItem",null),F=U([(0,l.Yl)({name:"OurModule"})],F);const A=new E.yh({strict:!1,state:{},modules:{ReplicantModule:v,OurModule:F}}),z=A,B=(0,l.rT)(F,A);var H=function(e,t,o,n){var i,s=arguments.length,a=s<3?t:null===n?n=Object.getOwnPropertyDescriptor(t,o):n;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)a=Reflect.decorate(e,t,o,n);else for(var r=e.length-1;r>=0;r--)(i=e[r])&&(a=(s<3?i(a):s>3?i(t,o,a):i(t,o))||a);return s>3&&a&&Object.defineProperty(t,o,a),a};let V=class extends a.ZP{constructor(){super(...arguments),this.fab=!1}edit(){B.changeEditItemId(this.id),B.toggleEditDialog(!0)}del(){B.deleteItem(this.id)}};H([I({type:String,required:!0})],V.prototype,"id",void 0),V=H([O.default],V);const q=V;var $=o(5440);const Y=(0,$.Z)(q,(function(){var e=this,t=e._self._c;return e._self._setupProxy,t(N,{attrs:{top:"",right:"",direction:"left",absolute:""},scopedSlots:e._u([{key:"activator",fn:function(){return[t(h.Z,{attrs:{color:"blue darken-2",fab:"","x-small":""},model:{value:e.fab,callback:function(t){e.fab=t},expression:"fab"}},[e.fab?t(b.Z,[e._v("mdi-close")]):t(b.Z,[e._v("mdi-cog")])],1)]},proxy:!0}]),model:{value:e.fab,callback:function(t){e.fab=t},expression:"fab"}},[e._v(" "),t(h.Z,{attrs:{fab:"","x-small":"",color:"green"},on:{click:e.edit}},[t(b.Z,[e._v("mdi-pencil")])],1),e._v(" "),t(h.Z,{attrs:{fab:"","x-small":"",color:"red"},on:{click:e.del}},[t(b.Z,[e._v("mdi-delete")])],1)],1)}),[],!1,null,null,null).exports;var K=function(e,t,o,n){var i,s=arguments.length,a=s<3?t:null===n?n=Object.getOwnPropertyDescriptor(t,o):n;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)a=Reflect.decorate(e,t,o,n);else for(var r=e.length-1;r>=0;r--)(i=e[r])&&(a=(s<3?i(a):s>3?i(t,o,a):i(t,o))||a);return s>3&&a&&Object.defineProperty(t,o,a),a};let J=class extends a.ZP{};K([I({type:String,required:!0})],J.prototype,"id",void 0),K([I({type:Number,default:25})],J.prototype,"seconds",void 0),J=K([(0,O.default)({name:"Bid",components:{SpeedDial:Y}})],J);const Q=J,W=(0,$.Z)(Q,(function(){var e=this,t=e._self._c;return e._self._setupProxy,t(y.Z,{staticClass:"pa-2"},[t("speed-dial",{attrs:{id:e.id}}),e._v(" "),t("div",[t("span",{staticClass:"font-weight-bold"},[e._v("Type:")]),e._v("\n    Random Bid (favours sooner)\n  ")]),e._v(" "),t("div",[t("span",{staticClass:"font-weight-bold"},[e._v("Length (min):")]),e._v("\n    "+e._s(e.seconds)+" seconds\n  ")])],1)}),[],!1,null,null,null).exports;var X=o(6842),ee=o(6224),te=o(7310),oe=o(7593),ne=o(9500);const ie=(0,L.Z)(ne.Z).extend({name:"v-textarea",props:{autoGrow:Boolean,noResize:Boolean,rowHeight:{type:[Number,String],default:24,validator:e=>!isNaN(parseFloat(e))},rows:{type:[Number,String],default:5,validator:e=>!isNaN(parseInt(e,10))}},computed:{classes(){return{"v-textarea":!0,"v-textarea--auto-grow":this.autoGrow,"v-textarea--no-resize":this.noResizeHandle,...ne.Z.options.computed.classes.call(this)}},noResizeHandle(){return this.noResize||this.autoGrow}},watch:{autoGrow(e){this.$nextTick((()=>{var t;e?this.calculateInputHeight():null===(t=this.$refs.input)||void 0===t||t.style.removeProperty("height")}))},lazyValue(){this.autoGrow&&this.$nextTick(this.calculateInputHeight)},rowHeight(){this.autoGrow&&this.$nextTick(this.calculateInputHeight)}},mounted(){setTimeout((()=>{this.autoGrow&&this.calculateInputHeight()}),0)},methods:{calculateInputHeight(){const e=this.$refs.input;if(!e)return;e.style.height="0";const t=e.scrollHeight,o=parseInt(this.rows,10)*parseFloat(this.rowHeight);e.style.height=Math.max(o,t)+"px"},genInput(){const e=ne.Z.options.methods.genInput.call(this);return e.tag="textarea",delete e.data.attrs.type,e.data.attrs.rows=this.rows,e},onInput(e){ne.Z.options.methods.onInput.call(this,e),this.autoGrow&&this.calculateInputHeight()},onKeyDown(e){this.isFocused&&13===e.keyCode&&e.stopPropagation(),this.$emit("keydown",e)}}});var se=function(e,t,o,n){var i,s=arguments.length,a=s<3?t:null===n?n=Object.getOwnPropertyDescriptor(t,o):n;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)a=Reflect.decorate(e,t,o,n);else for(var r=e.length-1;r>=0;r--)(i=e[r])&&(a=(s<3?i(a):s>3?i(t,o,a):i(t,o))||a);return s>3&&a&&Object.defineProperty(t,o,a),a};let ae=class extends a.ZP{constructor(){super(...arguments),this.item=null,this.isFormValid=!1}get dialog(){return B.editDialog}set dialog(e){B.toggleEditDialog(e)}get secondsStr(){var e;return"Bid"===(null===(e=this.item)||void 0===e?void 0:e.type)?"Minimum Length (seconds)":"Length (seconds)"}get additionalFields(){var e;return"GenericMsg"===(null===(e=this.item)||void 0===e?void 0:e.type)?[{elem:"v-textarea",name:"Message",key:"msg",icon:"mdi-android-messages",rules:[this.isRequired,this.is2LinesOrLess],props:{"no-resize":!0,rows:2}}]:[]}onDialogChanged(e){this.item=e&&i()(B.localRotation.find((e=>e.id===B.editItemId)))||null}isRequired(e){return!!e||"Required"}isNumber(e){return!Number.isNaN(Number(e))||"Must be a number"}isBiggerThan(e){const t=Number(e);return!!t&&t>=5||"Must be 5 or higher"}is2LinesOrLess(e){return e.split("\n").length<=2||"Must be 2 lines or less"}secondsChanged(e){var t,o;(null===(o=null===(t=this.item)||void 0===t?void 0:t.props)||void 0===o?void 0:o.seconds)&&!Number.isNaN(Number(e))&&(this.item.props.seconds=Number(e))}save(){this.item&&(B.updateLocalItem(this.item),this.dialog=!1)}};se([(0,k.R)("dialog")],ae.prototype,"onDialogChanged",null),ae=se([(0,O.default)({components:{VTextarea:ie}})],ae);const re=ae,le=(0,$.Z)(re,(function(){var e=this,t=e._self._c;return e._self._setupProxy,t(ee.Z,{staticClass:"Dialog",attrs:{persistent:""},model:{value:e.dialog,callback:function(t){e.dialog=t},expression:"dialog"}},[t(y.Z,[e.item?t(X.ZB,{staticClass:"pa-4 pb-0"},[t(te.Z,{model:{value:e.isFormValid,callback:function(t){e.isFormValid=t},expression:"isFormValid"}},[t(ne.Z,{attrs:{value:e.item.props.seconds,label:e.secondsStr,"prepend-icon":"mdi-timer",autocomplete:"off",rules:[e.isRequired,e.isNumber,e.isBiggerThan],filled:"",dense:"",type:"number",min:5},on:{change:e.secondsChanged}}),e._v(" "),e._l(e.additionalFields,(function({elem:o,name:n,key:i,icon:s,rules:a,props:r}){return t(o,e._b({key:i,tag:"component",attrs:{label:n,"prepend-icon":s,autocomplete:"off",rules:a,filled:"",dense:""},model:{value:e.item.props[i],callback:function(t){e.$set(e.item.props,i,t)},expression:"item.props[key]"}},"component",r,!1))}))],2)],1):e._e(),e._v(" "),t(X.h7,[t(oe.Z),e._v(" "),t(h.Z,{attrs:{disabled:!e.isFormValid},on:{click:e.save}},[e._v("Save")]),e._v(" "),t(h.Z,{on:{click:function(t){e.dialog=!1}}},[e._v("Cancel")])],1)],1)],1)}),[],!1,null,null,null).exports;var ce=function(e,t,o,n){var i,s=arguments.length,a=s<3?t:null===n?n=Object.getOwnPropertyDescriptor(t,o):n;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)a=Reflect.decorate(e,t,o,n);else for(var r=e.length-1;r>=0;r--)(i=e[r])&&(a=(s<3?i(a):s>3?i(t,o,a):i(t,o))||a);return s>3&&a&&Object.defineProperty(t,o,a),a};let de=class extends a.ZP{constructor(){super(...arguments),this.fab=!1}};ce([I({type:String,required:!0})],de.prototype,"id",void 0),ce([I({type:String,default:"Message?"})],de.prototype,"msg",void 0),ce([I({type:Number,default:25})],de.prototype,"seconds",void 0),de=ce([(0,O.default)({name:"GenericMsg",components:{SpeedDial:Y}})],de);const pe=de,ue=(0,$.Z)(pe,(function(){var e=this,t=e._self._c;return e._self._setupProxy,t(y.Z,{staticClass:"pa-2"},[t("speed-dial",{attrs:{id:e.id}}),e._v(" "),t("div",[t("span",{staticClass:"font-weight-bold"},[e._v("Type:")]),e._v("\n    Generic Message\n  ")]),e._v(" "),t("div",{staticClass:"d-flex"},[t("div",{staticClass:"font-weight-bold mr-1"},[e._v("Message:")]),e._v(" "),t("div",{style:{"white-space":"pre-wrap"}},[e._v(e._s(e.msg))])]),e._v(" "),t("div",[t("span",{staticClass:"font-weight-bold"},[e._v("Length:")]),e._v("\n    "+e._s(e.seconds)+" seconds\n  ")])],1)}),[],!1,null,null,null).exports;var ve=function(e,t,o,n){var i,s=arguments.length,a=s<3?t:null===n?n=Object.getOwnPropertyDescriptor(t,o):n;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)a=Reflect.decorate(e,t,o,n);else for(var r=e.length-1;r>=0;r--)(i=e[r])&&(a=(s<3?i(a):s>3?i(t,o,a):i(t,o))||a);return s>3&&a&&Object.defineProperty(t,o,a),a};let fe=class extends a.ZP{};ve([I({type:String,required:!0})],fe.prototype,"id",void 0),ve([I({type:Number,default:25})],fe.prototype,"seconds",void 0),fe=ve([(0,O.default)({name:"Milestone",components:{SpeedDial:Y}})],fe);const me=fe,ge=(0,$.Z)(me,(function(){var e=this,t=e._self._c;return e._self._setupProxy,t(y.Z,{staticClass:"pa-2"},[t("speed-dial",{attrs:{id:e.id}}),e._v(" "),t("div",[t("span",{staticClass:"font-weight-bold"},[e._v("Type:")]),e._v("\n    Random Milestone\n  ")]),e._v(" "),t("div",[t("span",{staticClass:"font-weight-bold"},[e._v("Length:")]),e._v("\n    "+e._s(e.seconds)+" seconds\n  ")])],1)}),[],!1,null,null,null).exports;var he=function(e,t,o,n){var i,s=arguments.length,a=s<3?t:null===n?n=Object.getOwnPropertyDescriptor(t,o):n;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)a=Reflect.decorate(e,t,o,n);else for(var r=e.length-1;r>=0;r--)(i=e[r])&&(a=(s<3?i(a):s>3?i(t,o,a):i(t,o))||a);return s>3&&a&&Object.defineProperty(t,o,a),a};let ye=class extends a.ZP{};he([I({type:String,required:!0})],ye.prototype,"id",void 0),he([I({type:Number,default:25})],ye.prototype,"seconds",void 0),ye=he([(0,O.default)({name:"Prize",components:{SpeedDial:Y}})],ye);const be=ye,Re=(0,$.Z)(be,(function(){var e=this,t=e._self._c;return e._self._setupProxy,t(y.Z,{staticClass:"pa-2"},[t("speed-dial",{attrs:{id:e.id}}),e._v(" "),t("div",[t("span",{staticClass:"font-weight-bold"},[e._v("Type:")]),e._v("\n    Random Prize\n  ")]),e._v(" "),t("div",[t("span",{staticClass:"font-weight-bold"},[e._v("Length:")]),e._v("\n    "+e._s(e.seconds)+" seconds\n  ")])],1)}),[],!1,null,null,null).exports;var _e=function(e,t,o,n){var i,s=arguments.length,a=s<3?t:null===n?n=Object.getOwnPropertyDescriptor(t,o):n;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)a=Reflect.decorate(e,t,o,n);else for(var r=e.length-1;r>=0;r--)(i=e[r])&&(a=(s<3?i(a):s>3?i(t,o,a):i(t,o))||a);return s>3&&a&&Object.defineProperty(t,o,a),a};let xe=class extends a.ZP{};_e([I({type:String,required:!0})],xe.prototype,"id",void 0),_e([I({type:Number,default:25})],xe.prototype,"seconds",void 0),xe=_e([(0,O.default)({name:"UpcomingRun",components:{SpeedDial:Y}})],xe);const we=xe,Pe=(0,$.Z)(we,(function(){var e=this,t=e._self._c;return e._self._setupProxy,t(y.Z,{staticClass:"pa-2"},[t("speed-dial",{attrs:{id:e.id}}),e._v(" "),t("div",[t("span",{staticClass:"font-weight-bold"},[e._v("Type:")]),e._v("\n    Upcoming Run (1 of next 4)\n  ")]),e._v(" "),t("div",[t("span",{staticClass:"font-weight-bold"},[e._v("Length:")]),e._v("\n    "+e._s(e.seconds)+" seconds\n  ")])],1)}),[],!1,null,null,null).exports;var Ze=function(e,t,o,n){var i,s=arguments.length,a=s<3?t:null===n?n=Object.getOwnPropertyDescriptor(t,o):n;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)a=Reflect.decorate(e,t,o,n);else for(var r=e.length-1;r>=0;r--)(i=e[r])&&(a=(s<3?i(a):s>3?i(t,o,a):i(t,o))||a);return s>3&&a&&Object.defineProperty(t,o,a),a};let Oe=class extends a.ZP{constructor(){super(...arguments),this.availableTypes=[{key:"GenericMsg",name:"Generic Message"},{key:"Bid",name:"Random Bid (favours sooner)"},{key:"Milestone",name:"Random Milestone"},{key:"Prize",name:"Random Prize"},{key:"UpcomingRun",name:"Upcoming Run (1 of next 4)"}]}get localRotation(){return B.localRotation}set localRotation(e){B.setLocalRotation({val:e,manual:!0})}get isEdited(){return B.localEdits}get currentItem(){var e,t,o,n,i,s,a,r;return{index:this.omnibar.rotation.findIndex((e=>{var t;return e.id===(null===(t=this.omnibar.current)||void 0===t?void 0:t.id)})),type:null===(e=this.omnibar.current)||void 0===e?void 0:e.type,name:(null===(t=this.availableTypes.find((e=>{var t;return e.key===(null===(t=this.omnibar.current)||void 0===t?void 0:t.type)})))||void 0===t?void 0:t.name)||(null===(o=this.omnibar.current)||void 0===o?void 0:o.type),seconds:(null===(i=null===(n=this.omnibar.current)||void 0===n?void 0:n.props)||void 0===i?void 0:i.seconds)||0,secondsStr:["Bid","MiniCredits"].includes((null===(s=this.omnibar.current)||void 0===s?void 0:s.type)||"")?"Minimum Length (seconds)":"Length (seconds)",msg:(null===(r=null===(a=this.omnibar.current)||void 0===a?void 0:a.props)||void 0===r?void 0:r.msg)||""}}setLocalRotationFromGlobal(e){B.setLocalRotation({val:i()(e||this.omnibar.rotation)})}onGlobalRotationChange(e){B.localEdits||this.setLocalRotationFromGlobal(e)}created(){this.setLocalRotationFromGlobal()}clone(e){return{type:e.key,id:Z(),props:{seconds:25,msg:"GenericMsg"===e.key?"Message?":void 0}}}save(){B.setGlobalRotation(this.localRotation)}};Ze([f.State((e=>e.reps.omnibar))],Oe.prototype,"omnibar",void 0),Ze([(0,k.R)("omnibar.rotation")],Oe.prototype,"onGlobalRotationChange",null),Oe=Ze([(0,O.default)({components:{EditDialog:le,Draggable:S(),GenericMsg:ue,Bid:W,Milestone:ge,Prize:Re,UpcomingRun:Pe}})],Oe);const De=Oe,Ie=(0,$.Z)(De,(function(){var e=this,t=e._self._c;return e._self._setupProxy,t(g.Z,[t("edit-dialog"),e._v(" "),t("span",{staticClass:"text-h6"},[e._v("New Components")]),e._v(" "),t("draggable",{staticClass:"d-flex flex-wrap",style:{gap:"0px 10px"},attrs:{list:e.availableTypes,group:{name:"ticker",pull:"clone",put:!1},clone:e.clone,sort:!1}},e._l(e.availableTypes,(function(o){return t(y.Z,{key:o.key,staticClass:"pa-2 mt-2"},[e._v("\n      "+e._s(o.name)+"\n    ")])})),1),e._v(" "),t("span",{staticClass:"text-h6 mt-4"},[e._v("Rotation")]),e._v(" "),e.localRotation.length?e._e():t(y.Z,{staticClass:"pa-2 mt-2 font-italic"},[e._v("\n    Drag elements from above to here to add.\n  ")]),e._v(" "),t("draggable",{style:{"max-height":"400px","overflow-y":"auto"},attrs:{group:"ticker","ghost-class":"Ghost",tag:"transition-group",animation:200,componentData:{props:{tag:"div"}}},model:{value:e.localRotation,callback:function(t){e.localRotation=t},expression:"localRotation"}},e._l(e.localRotation,(function(o){return t(o.type,e._b({key:o.id,tag:"component",staticClass:"mt-2",attrs:{id:o.id}},"component",o.props,!1))})),1),e._v(" "),t("div",{staticClass:"d-flex mt-2"},[t(h.Z,{staticClass:"flex-grow-1 mr-2",attrs:{disabled:!e.isEdited},on:{click:e.save}},[e._v("\n      Save\n    ")]),e._v(" "),t(h.Z,{attrs:{disabled:!e.isEdited},on:{click:function(t){return e.setLocalRotationFromGlobal()}}},[t(b.Z,[e._v("mdi-refresh")])],1)],1),e._v(" "),e.currentItem.type?t("div",{staticClass:"text-center mt-4"},[t("span",{staticClass:"font-weight-bold"},[e._v("Current:")]),e._v("\n    "+e._s(e.currentItem.name)+"\n    "),t("br"),t("span",{staticClass:"font-weight-bold"},[e._v(e._s(e.currentItem.secondsStr)+":")]),e._v("\n    "+e._s(e.currentItem.seconds)+" -\n    "),t("span",{staticClass:"font-weight-bold"},[e._v("Position:")]),e._v("\n    "+e._s(e.currentItem.index+1||"?")+"/"+e._s(e.omnibar.rotation.length)+"\n    "),"GenericMsg"===e.currentItem.type?[t("br"),t("span",{staticClass:"font-weight-bold"},[e._v("Message:")]),e._v("\n      "+e._s(e.currentItem.msg)+"\n    ")]:e._e()],2):e._e()],1)}),[],!1,null,"de605696",null).exports;(function(e){return t=this,o=void 0,i=function*(){Object.keys(p).forEach((t=>{p[t].on("change",(o=>{e.commit("ReplicantModule/setState",{name:t,val:o})}))})),yield NodeCG.waitForReplicants(...Object.keys(p).map((e=>p[e]))),u=(0,l.rT)(v,e)},new((n=void 0)||(n=Promise))((function(e,s){function a(e){try{l(i.next(e))}catch(e){s(e)}}function r(e){try{l(i.throw(e))}catch(e){s(e)}}function l(t){var o;t.done?e(t.value):(o=t.value,o instanceof n?o:new n((function(e){e(o)}))).then(a,r)}l((i=i.apply(t,o||[])).next())}));var t,o,n,i})(z).then((()=>{new a.ZP({vuetify:m.Z,store:z,el:"#App",render:e=>e(Ie)})}))}},o={};function n(e){var i=o[e];if(void 0!==i)return i.exports;var s=o[e]={exports:{}};return t[e].call(s.exports,s,s.exports,n),s.exports}n.m=t,e=[],n.O=(t,o,i,s)=>{if(!o){var a=1/0;for(d=0;d<e.length;d++){for(var[o,i,s]=e[d],r=!0,l=0;l<o.length;l++)(!1&s||a>=s)&&Object.keys(n.O).every((e=>n.O[e](o[l])))?o.splice(l--,1):(r=!1,s<a&&(a=s));if(r){e.splice(d--,1);var c=i();void 0!==c&&(t=c)}}return t}s=s||0;for(var d=e.length;d>0&&e[d-1][2]>s;d--)e[d]=e[d-1];e[d]=[o,i,s]},n.n=e=>{var t=e&&e.__esModule?()=>e.default:()=>e;return n.d(t,{a:t}),t},n.d=(e,t)=>{for(var o in t)n.o(t,o)&&!n.o(e,o)&&Object.defineProperty(e,o,{enumerable:!0,get:t[o]})},n.g=function(){if("object"==typeof globalThis)return globalThis;try{return this||new Function("return this")()}catch(e){if("object"==typeof window)return window}}(),n.o=(e,t)=>Object.prototype.hasOwnProperty.call(e,t),n.r=e=>{"undefined"!=typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(e,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(e,"__esModule",{value:!0})},(()=>{var e={922:0,713:0};n.O.j=t=>0===e[t];var t=(t,o)=>{var i,s,[a,r,l]=o,c=0;if(a.some((t=>0!==e[t]))){for(i in r)n.o(r,i)&&(n.m[i]=r[i]);if(l)var d=l(n)}for(t&&t(o);c<a.length;c++)s=a[c],n.o(e,s)&&e[s]&&e[s][0](),e[s]=0;return n.O(d)},o=self.webpackChunk=self.webpackChunk||[];o.forEach(t.bind(null,0)),o.push=t.bind(null,o.push.bind(o))})();var i=n.O(void 0,[965,821,62,40,713,48,177,632],(()=>n(1570)));i=n.O(i)})();