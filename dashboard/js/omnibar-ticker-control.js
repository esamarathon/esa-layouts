(()=>{"use strict";var e,t={7023:(e,t,o)=>{var n=o(9804),i=o.n(n),s=o(7795),a=o(9340),r=o(3609),l=o(899),c=function(e,t,o,n){var i,s=arguments.length,a=s<3?t:null===n?n=Object.getOwnPropertyDescriptor(t,o):n;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)a=Reflect.decorate(e,t,o,n);else for(var r=e.length-1;r>=0;r--)(i=e[r])&&(a=(s<3?i(a):s>3?i(t,o,a):i(t,o))||a);return s>3&&a&&Object.defineProperty(t,o,a),a};const d=new s.SpeedcontrolUtilBrowser(nodecg),p={assetsDonationAlertAssets:nodecg.Replicant("assets:donation-alert-assets"),assetsIntermissionSlides:nodecg.Replicant("assets:intermission-slides"),assetsReaderIntroductionImages:nodecg.Replicant("assets:reader-introduction-images"),bids:nodecg.Replicant("bids"),bigbuttonPlayerMap:nodecg.Replicant("bigbuttonPlayerMap"),commentators:nodecg.Replicant("commentators"),commentatorsNew:nodecg.Replicant("commentatorsNew"),countdown:nodecg.Replicant("countdown"),currentRunDelay:nodecg.Replicant("currentRunDelay"),donationAlerts:nodecg.Replicant("donationAlerts"),donationReader:nodecg.Replicant("donationReader"),donationReaderNew:nodecg.Replicant("donationReaderNew"),donationsToRead:nodecg.Replicant("donationsToRead"),donationTotal:nodecg.Replicant("donationTotal"),donationTotalMilestones:nodecg.Replicant("donationTotalMilestones"),gameLayouts:nodecg.Replicant("gameLayouts"),intermissionSlides:nodecg.Replicant("intermissionSlides"),musicData:nodecg.Replicant("musicData"),obsData:nodecg.Replicant("obsData"),omnibar:nodecg.Replicant("omnibar"),otherStreamData:nodecg.Replicant("otherStreamData"),prizes:nodecg.Replicant("prizes"),readerIntroduction:nodecg.Replicant("readerIntroduction"),runDataActiveRun:d.runDataActiveRun,runDataActiveRunSurrounding:d.runDataActiveRunSurrounding,runDataArray:d.runDataArray,serverTimestamp:nodecg.Replicant("serverTimestamp"),streamDeckData:nodecg.Replicant("streamDeckData"),timer:d.timer,ttsVoices:nodecg.Replicant("ttsVoices"),upcomingRunID:nodecg.Replicant("upcomingRunID"),videoPlayer:nodecg.Replicant("videoPlayer")};let u,v=class extends l.hw{constructor(){super(...arguments),this.reps={}}get repsTyped(){return this.reps}setState({name:e,val:t}){a.Ay.set(this.reps,e,i()(t))}setReplicant({name:e,val:t}){a.Ay.set(this.reps,e,i()(t)),p[e].value=i()(t)}};c([l.sM],v.prototype,"setState",null),c([l.sM],v.prototype,"setReplicant",null),v=c([(0,l.nV)({name:"ReplicantModule",namespaced:!0})],v);const f=(0,r.MF)("ReplicantModule");var g=o(3825),m=o(9357),h=o(694),y=o(5224),b=o(3572);const _={randomUUID:"undefined"!=typeof crypto&&crypto.randomUUID&&crypto.randomUUID.bind(crypto)};let R;const x=new Uint8Array(16);function w(){if(!R&&(R="undefined"!=typeof crypto&&crypto.getRandomValues&&crypto.getRandomValues.bind(crypto),!R))throw new Error("crypto.getRandomValues() not supported. See https://github.com/uuidjs/uuid#getrandomvalues-not-supported");return R(x)}const A=[];for(let e=0;e<256;++e)A.push((e+256).toString(16).slice(1));const O=function(e,t,o){if(_.randomUUID&&!t&&!e)return _.randomUUID();const n=(e=e||{}).random||(e.rng||w)();if(n[6]=15&n[6]|64,n[8]=63&n[8]|128,t){o=o||0;for(let e=0;e<16;++e)t[o+e]=n[e];return t}return function(e,t=0){return A[e[t+0]]+A[e[t+1]]+A[e[t+2]]+A[e[t+3]]+"-"+A[e[t+4]]+A[e[t+5]]+"-"+A[e[t+6]]+A[e[t+7]]+"-"+A[e[t+8]]+A[e[t+9]]+"-"+A[e[t+10]]+A[e[t+11]]+A[e[t+12]]+A[e[t+13]]+A[e[t+14]]+A[e[t+15]]}(n)};var D=o(305),C=(o(5716),o(9906),o(2633),o(3889));function k(e){return void 0===e&&(e={}),function(t,o){(0,C.A)(e,t,o),(0,D.createDecorator)((function(t,o){(t.props||(t.props={}))[o]=e}))(t,o)}}o(5757);var I=o(9284),M=o(5307),S=o.n(M),P=o(1290),j=o(1509);const T=a.Ay.extend({name:"transitionable",props:{mode:String,origin:String,transition:String}});var N=o(3884),L=o(3041),G=o(7290);const E=(0,L.A)(j.A,P.A,T).extend({name:"v-speed-dial",directives:{ClickOutside:N.A},props:{direction:{type:String,default:"top",validator:e=>["top","right","bottom","left"].includes(e)},openOnHover:Boolean,transition:{type:String,default:"scale-transition"}},computed:{classes(){return{"v-speed-dial":!0,"v-speed-dial--top":this.top,"v-speed-dial--right":this.right,"v-speed-dial--bottom":this.bottom,"v-speed-dial--left":this.left,"v-speed-dial--absolute":this.absolute,"v-speed-dial--fixed":this.fixed,[`v-speed-dial--direction-${this.direction}`]:!0,"v-speed-dial--is-active":this.isActive}}},render(e){let t=[];const o={class:this.classes,directives:[{name:"click-outside",value:()=>this.isActive=!1}],on:{click:()=>this.isActive=!this.isActive}};if(this.openOnHover&&(o.on.mouseenter=()=>this.isActive=!0,o.on.mouseleave=()=>this.isActive=!1),this.isActive){let o=0;t=((0,G.$c)(this)||[]).map(((t,n)=>!t.tag||void 0===t.componentOptions||"v-btn"!==t.componentOptions.Ctor.options.name&&"v-tooltip"!==t.componentOptions.Ctor.options.name?(t.key=n,t):(o++,e("div",{style:{transitionDelay:.05*o+"s"},key:n},[t]))))}const n=e("transition-group",{class:"v-speed-dial__list",props:{name:this.transition,mode:this.mode,origin:this.origin,tag:"div"}},t);return e("div",o,[(0,G.$c)(this,"activator"),n])}});var U=o(3578),F=function(e,t,o,n){var i,s=arguments.length,a=s<3?t:null===n?n=Object.getOwnPropertyDescriptor(t,o):n;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)a=Reflect.decorate(e,t,o,n);else for(var r=e.length-1;r>=0;r--)(i=e[r])&&(a=(s<3?i(a):s>3?i(t,o,a):i(t,o))||a);return s>3&&a&&Object.defineProperty(t,o,a),a};a.Ay.use(U.Ay);let z=class extends l.hw{constructor(){super(...arguments),this.localRotation=[],this.localEdits=!1,this.editItemId="",this.editDialog=!1}get reps(){return this.context.rootState.ReplicantModule.reps}setLocalRotation({val:e,manual:t=!1}){this.localRotation=i()(e),this.localEdits=t}setGlobalRotation(e){u.setReplicant({name:"omnibar",val:Object.assign(Object.assign({},u.repsTyped.omnibar),{rotation:i()(e)})}),this.localEdits=!1}deleteItem(e){const t=this.localRotation.findIndex((t=>t.id===e));t>=0&&(this.localRotation.splice(t,1),this.localEdits=!0)}changeEditItemId(e){this.editItemId=e||""}toggleEditDialog(e){this.editDialog=e}updateLocalItem(e){const t=this.localRotation.findIndex((t=>t.id===e.id));t>=0&&(a.Ay.set(this.localRotation,t,i()(e)),this.localEdits=!0)}};F([l.sM],z.prototype,"setLocalRotation",null),F([l.sM],z.prototype,"setGlobalRotation",null),F([l.sM],z.prototype,"deleteItem",null),F([l.sM],z.prototype,"changeEditItemId",null),F([l.sM],z.prototype,"toggleEditDialog",null),F([l.sM],z.prototype,"updateLocalItem",null),z=F([(0,l.nV)({name:"OurModule"})],z);const H=new U.il({strict:!1,state:{},modules:{ReplicantModule:v,OurModule:z}}),V=H,B=(0,l.f_)(z,H);var q=function(e,t,o,n){var i,s=arguments.length,a=s<3?t:null===n?n=Object.getOwnPropertyDescriptor(t,o):n;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)a=Reflect.decorate(e,t,o,n);else for(var r=e.length-1;r>=0;r--)(i=e[r])&&(a=(s<3?i(a):s>3?i(t,o,a):i(t,o))||a);return s>3&&a&&Object.defineProperty(t,o,a),a};let $=class extends a.Ay{constructor(){super(...arguments),this.fab=!1}edit(){B.changeEditItemId(this.id),B.toggleEditDialog(!0)}del(){B.deleteItem(this.id)}};q([k({type:String,required:!0})],$.prototype,"id",void 0),$=q([D.default],$);const K=$;var Q=o(7270);const J=(0,Q.A)(K,(function(){var e=this,t=e._self._c;return e._self._setupProxy,t(E,{attrs:{top:"",right:"",direction:"left",absolute:""},scopedSlots:e._u([{key:"activator",fn:function(){return[t(h.A,{attrs:{color:"blue darken-2",fab:"","x-small":""},model:{value:e.fab,callback:function(t){e.fab=t},expression:"fab"}},[e.fab?t(b.A,[e._v("mdi-close")]):t(b.A,[e._v("mdi-cog")])],1)]},proxy:!0}]),model:{value:e.fab,callback:function(t){e.fab=t},expression:"fab"}},[e._v(" "),t(h.A,{attrs:{fab:"","x-small":"",color:"green"},on:{click:e.edit}},[t(b.A,[e._v("mdi-pencil")])],1),e._v(" "),t(h.A,{attrs:{fab:"","x-small":"",color:"red"},on:{click:e.del}},[t(b.A,[e._v("mdi-delete")])],1)],1)}),[],!1,null,null,null).exports;var W=function(e,t,o,n){var i,s=arguments.length,a=s<3?t:null===n?n=Object.getOwnPropertyDescriptor(t,o):n;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)a=Reflect.decorate(e,t,o,n);else for(var r=e.length-1;r>=0;r--)(i=e[r])&&(a=(s<3?i(a):s>3?i(t,o,a):i(t,o))||a);return s>3&&a&&Object.defineProperty(t,o,a),a};let X=class extends a.Ay{};W([k({type:String,required:!0})],X.prototype,"id",void 0),W([k({type:Number,default:25})],X.prototype,"seconds",void 0),X=W([(0,D.default)({name:"Bid",components:{SpeedDial:J}})],X);const Y=X,Z=(0,Q.A)(Y,(function(){var e=this,t=e._self._c;return e._self._setupProxy,t(y.A,{staticClass:"pa-2"},[t("speed-dial",{attrs:{id:e.id}}),e._v(" "),t("div",[t("span",{staticClass:"font-weight-bold"},[e._v("Type:")]),e._v("\n    Random Bid (favours sooner)\n  ")]),e._v(" "),t("div",[t("span",{staticClass:"font-weight-bold"},[e._v("Length (min):")]),e._v("\n    "+e._s(e.seconds)+" seconds\n  ")])],1)}),[],!1,null,null,null).exports;var ee=o(3808),te=o(6827),oe=o(5324),ne=o(220),ie=o(156);const se=(0,L.A)(ie.A).extend({name:"v-textarea",props:{autoGrow:Boolean,noResize:Boolean,rowHeight:{type:[Number,String],default:24,validator:e=>!isNaN(parseFloat(e))},rows:{type:[Number,String],default:5,validator:e=>!isNaN(parseInt(e,10))}},computed:{classes(){return{"v-textarea":!0,"v-textarea--auto-grow":this.autoGrow,"v-textarea--no-resize":this.noResizeHandle,...ie.A.options.computed.classes.call(this)}},noResizeHandle(){return this.noResize||this.autoGrow}},watch:{autoGrow(e){this.$nextTick((()=>{var t;e?this.calculateInputHeight():null===(t=this.$refs.input)||void 0===t||t.style.removeProperty("height")}))},lazyValue(){this.autoGrow&&this.$nextTick(this.calculateInputHeight)},rowHeight(){this.autoGrow&&this.$nextTick(this.calculateInputHeight)}},mounted(){setTimeout((()=>{this.autoGrow&&this.calculateInputHeight()}),0)},methods:{calculateInputHeight(){const e=this.$refs.input;if(!e)return;e.style.height="0";const t=e.scrollHeight,o=parseInt(this.rows,10)*parseFloat(this.rowHeight);e.style.height=Math.max(o,t)+"px"},genInput(){const e=ie.A.options.methods.genInput.call(this);return e.tag="textarea",delete e.data.attrs.type,e.data.attrs.rows=this.rows,e},onInput(e){ie.A.options.methods.onInput.call(this,e),this.autoGrow&&this.calculateInputHeight()},onKeyDown(e){this.isFocused&&13===e.keyCode&&e.stopPropagation(),this.$emit("keydown",e)}}});var ae=function(e,t,o,n){var i,s=arguments.length,a=s<3?t:null===n?n=Object.getOwnPropertyDescriptor(t,o):n;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)a=Reflect.decorate(e,t,o,n);else for(var r=e.length-1;r>=0;r--)(i=e[r])&&(a=(s<3?i(a):s>3?i(t,o,a):i(t,o))||a);return s>3&&a&&Object.defineProperty(t,o,a),a};let re=class extends a.Ay{constructor(){super(...arguments),this.item=null,this.isFormValid=!1}get dialog(){return B.editDialog}set dialog(e){B.toggleEditDialog(e)}get secondsStr(){var e;return"Bid"===(null===(e=this.item)||void 0===e?void 0:e.type)?"Minimum Length (seconds)":"Length (seconds)"}get additionalFields(){var e;return"GenericMsg"===(null===(e=this.item)||void 0===e?void 0:e.type)?[{elem:"v-textarea",name:"Message",key:"msg",icon:"mdi-android-messages",rules:[this.isRequired,this.is2LinesOrLess],props:{"no-resize":!0,rows:2}}]:[]}onDialogChanged(e){this.item=e&&i()(B.localRotation.find((e=>e.id===B.editItemId)))||null}isRequired(e){return!!e||"Required"}isNumber(e){return!Number.isNaN(Number(e))||"Must be a number"}isBiggerThan(e){const t=Number(e);return!!t&&t>=5||"Must be 5 or higher"}is2LinesOrLess(e){return e.split("\n").length<=2||"Must be 2 lines or less"}secondsChanged(e){var t,o;(null===(o=null===(t=this.item)||void 0===t?void 0:t.props)||void 0===o?void 0:o.seconds)&&!Number.isNaN(Number(e))&&(this.item.props.seconds=Number(e))}save(){this.item&&(B.updateLocalItem(this.item),this.dialog=!1)}};ae([(0,I.o)("dialog")],re.prototype,"onDialogChanged",null),re=ae([(0,D.default)({components:{VTextarea:se}})],re);const le=re,ce=(0,Q.A)(le,(function(){var e=this,t=e._self._c;return e._self._setupProxy,t(te.A,{staticClass:"Dialog",attrs:{persistent:""},model:{value:e.dialog,callback:function(t){e.dialog=t},expression:"dialog"}},[t(y.A,[e.item?t(ee.OQ,{staticClass:"pa-4 pb-0"},[t(oe.A,{model:{value:e.isFormValid,callback:function(t){e.isFormValid=t},expression:"isFormValid"}},[t(ie.A,{attrs:{value:e.item.props.seconds,label:e.secondsStr,"prepend-icon":"mdi-timer",autocomplete:"off",rules:[e.isRequired,e.isNumber,e.isBiggerThan],filled:"",dense:"",type:"number",min:5},on:{change:e.secondsChanged}}),e._v(" "),e._l(e.additionalFields,(function({elem:o,name:n,key:i,icon:s,rules:a,props:r}){return t(o,e._b({key:i,tag:"component",attrs:{label:n,"prepend-icon":s,autocomplete:"off",rules:a,filled:"",dense:""},model:{value:e.item.props[i],callback:function(t){e.$set(e.item.props,i,t)},expression:"item.props[key]"}},"component",r,!1))}))],2)],1):e._e(),e._v(" "),t(ee.SL,[t(ne.A),e._v(" "),t(h.A,{attrs:{disabled:!e.isFormValid},on:{click:e.save}},[e._v("Save")]),e._v(" "),t(h.A,{on:{click:function(t){e.dialog=!1}}},[e._v("Cancel")])],1)],1)],1)}),[],!1,null,null,null).exports;var de=function(e,t,o,n){var i,s=arguments.length,a=s<3?t:null===n?n=Object.getOwnPropertyDescriptor(t,o):n;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)a=Reflect.decorate(e,t,o,n);else for(var r=e.length-1;r>=0;r--)(i=e[r])&&(a=(s<3?i(a):s>3?i(t,o,a):i(t,o))||a);return s>3&&a&&Object.defineProperty(t,o,a),a};let pe=class extends a.Ay{constructor(){super(...arguments),this.fab=!1}};de([k({type:String,required:!0})],pe.prototype,"id",void 0),de([k({type:String,default:"Message?"})],pe.prototype,"msg",void 0),de([k({type:Number,default:25})],pe.prototype,"seconds",void 0),pe=de([(0,D.default)({name:"GenericMsg",components:{SpeedDial:J}})],pe);const ue=pe,ve=(0,Q.A)(ue,(function(){var e=this,t=e._self._c;return e._self._setupProxy,t(y.A,{staticClass:"pa-2"},[t("speed-dial",{attrs:{id:e.id}}),e._v(" "),t("div",[t("span",{staticClass:"font-weight-bold"},[e._v("Type:")]),e._v("\n    Generic Message\n  ")]),e._v(" "),t("div",{staticClass:"d-flex"},[t("div",{staticClass:"font-weight-bold mr-1"},[e._v("Message:")]),e._v(" "),t("div",{style:{"white-space":"pre-wrap"}},[e._v(e._s(e.msg))])]),e._v(" "),t("div",[t("span",{staticClass:"font-weight-bold"},[e._v("Length:")]),e._v("\n    "+e._s(e.seconds)+" seconds\n  ")])],1)}),[],!1,null,null,null).exports;var fe=function(e,t,o,n){var i,s=arguments.length,a=s<3?t:null===n?n=Object.getOwnPropertyDescriptor(t,o):n;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)a=Reflect.decorate(e,t,o,n);else for(var r=e.length-1;r>=0;r--)(i=e[r])&&(a=(s<3?i(a):s>3?i(t,o,a):i(t,o))||a);return s>3&&a&&Object.defineProperty(t,o,a),a};let ge=class extends a.Ay{};fe([k({type:String,required:!0})],ge.prototype,"id",void 0),fe([k({type:Number,default:25})],ge.prototype,"seconds",void 0),ge=fe([(0,D.default)({name:"Milestone",components:{SpeedDial:J}})],ge);const me=ge,he=(0,Q.A)(me,(function(){var e=this,t=e._self._c;return e._self._setupProxy,t(y.A,{staticClass:"pa-2"},[t("speed-dial",{attrs:{id:e.id}}),e._v(" "),t("div",[t("span",{staticClass:"font-weight-bold"},[e._v("Type:")]),e._v("\n    Random Milestone\n  ")]),e._v(" "),t("div",[t("span",{staticClass:"font-weight-bold"},[e._v("Length:")]),e._v("\n    "+e._s(e.seconds)+" seconds\n  ")])],1)}),[],!1,null,null,null).exports;var ye=function(e,t,o,n){var i,s=arguments.length,a=s<3?t:null===n?n=Object.getOwnPropertyDescriptor(t,o):n;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)a=Reflect.decorate(e,t,o,n);else for(var r=e.length-1;r>=0;r--)(i=e[r])&&(a=(s<3?i(a):s>3?i(t,o,a):i(t,o))||a);return s>3&&a&&Object.defineProperty(t,o,a),a};let be=class extends a.Ay{};ye([k({type:String,required:!0})],be.prototype,"id",void 0),ye([k({type:Number,default:25})],be.prototype,"seconds",void 0),be=ye([(0,D.default)({name:"Prize",components:{SpeedDial:J}})],be);const _e=be,Re=(0,Q.A)(_e,(function(){var e=this,t=e._self._c;return e._self._setupProxy,t(y.A,{staticClass:"pa-2"},[t("speed-dial",{attrs:{id:e.id}}),e._v(" "),t("div",[t("span",{staticClass:"font-weight-bold"},[e._v("Type:")]),e._v("\n    Random Prize\n  ")]),e._v(" "),t("div",[t("span",{staticClass:"font-weight-bold"},[e._v("Length:")]),e._v("\n    "+e._s(e.seconds)+" seconds\n  ")])],1)}),[],!1,null,null,null).exports;var xe=function(e,t,o,n){var i,s=arguments.length,a=s<3?t:null===n?n=Object.getOwnPropertyDescriptor(t,o):n;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)a=Reflect.decorate(e,t,o,n);else for(var r=e.length-1;r>=0;r--)(i=e[r])&&(a=(s<3?i(a):s>3?i(t,o,a):i(t,o))||a);return s>3&&a&&Object.defineProperty(t,o,a),a};let we=class extends a.Ay{};xe([k({type:String,required:!0})],we.prototype,"id",void 0),xe([k({type:Number,default:25})],we.prototype,"seconds",void 0),we=xe([(0,D.default)({name:"UpcomingRun",components:{SpeedDial:J}})],we);const Ae=we,Oe=(0,Q.A)(Ae,(function(){var e=this,t=e._self._c;return e._self._setupProxy,t(y.A,{staticClass:"pa-2"},[t("speed-dial",{attrs:{id:e.id}}),e._v(" "),t("div",[t("span",{staticClass:"font-weight-bold"},[e._v("Type:")]),e._v("\n    Upcoming Run (1 of next 4)\n  ")]),e._v(" "),t("div",[t("span",{staticClass:"font-weight-bold"},[e._v("Length:")]),e._v("\n    "+e._s(e.seconds)+" seconds\n  ")])],1)}),[],!1,null,null,null).exports;var De=function(e,t,o,n){var i,s=arguments.length,a=s<3?t:null===n?n=Object.getOwnPropertyDescriptor(t,o):n;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)a=Reflect.decorate(e,t,o,n);else for(var r=e.length-1;r>=0;r--)(i=e[r])&&(a=(s<3?i(a):s>3?i(t,o,a):i(t,o))||a);return s>3&&a&&Object.defineProperty(t,o,a),a};let Ce=class extends a.Ay{};De([k({type:String,required:!0})],Ce.prototype,"id",void 0),De([k({type:Number,default:25})],Ce.prototype,"seconds",void 0),Ce=De([(0,D.default)({name:"UpcomingRun",components:{SpeedDial:J}})],Ce);const ke=Ce,Ie=(0,Q.A)(ke,(function(){var e=this,t=e._self._c;return e._self._setupProxy,t(y.A,{staticClass:"pa-2"},[t("speed-dial",{attrs:{id:e.id}}),e._v(" "),t("div",[t("span",{staticClass:"font-weight-bold"},[e._v("Type:")]),e._v("\n    Current song\n  ")]),e._v(" "),t("div",[t("span",{staticClass:"font-weight-bold"},[e._v("Length:")]),e._v("\n    "+e._s(e.seconds)+" seconds\n  ")])],1)}),[],!1,null,null,null).exports;var Me=function(e,t,o,n){var i,s=arguments.length,a=s<3?t:null===n?n=Object.getOwnPropertyDescriptor(t,o):n;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)a=Reflect.decorate(e,t,o,n);else for(var r=e.length-1;r>=0;r--)(i=e[r])&&(a=(s<3?i(a):s>3?i(t,o,a):i(t,o))||a);return s>3&&a&&Object.defineProperty(t,o,a),a};let Se=class extends a.Ay{constructor(){super(...arguments),this.availableTypes=[{key:"GenericMsg",name:"Generic Message"},{key:"MusicTrack",name:"Current song"},{key:"Bid",name:"Random Bid (favours sooner)"},{key:"Milestone",name:"Random Milestone"},{key:"Prize",name:"Random Prize"},{key:"UpcomingRun",name:"Upcoming Run (1 of next 4)"}]}get localRotation(){return B.localRotation}set localRotation(e){B.setLocalRotation({val:e,manual:!0})}get isEdited(){return B.localEdits}get currentItem(){var e,t,o,n,i,s,a,r;return{index:this.omnibar.rotation.findIndex((e=>{var t;return e.id===(null===(t=this.omnibar.current)||void 0===t?void 0:t.id)})),type:null===(e=this.omnibar.current)||void 0===e?void 0:e.type,name:(null===(t=this.availableTypes.find((e=>{var t;return e.key===(null===(t=this.omnibar.current)||void 0===t?void 0:t.type)})))||void 0===t?void 0:t.name)||(null===(o=this.omnibar.current)||void 0===o?void 0:o.type),seconds:(null===(i=null===(n=this.omnibar.current)||void 0===n?void 0:n.props)||void 0===i?void 0:i.seconds)||0,secondsStr:["Bid","MiniCredits"].includes((null===(s=this.omnibar.current)||void 0===s?void 0:s.type)||"")?"Minimum Length (seconds)":"Length (seconds)",msg:(null===(r=null===(a=this.omnibar.current)||void 0===a?void 0:a.props)||void 0===r?void 0:r.msg)||""}}setLocalRotationFromGlobal(e){B.setLocalRotation({val:i()(e||this.omnibar.rotation)})}onGlobalRotationChange(e){B.localEdits||this.setLocalRotationFromGlobal(e)}created(){this.setLocalRotationFromGlobal()}clone(e){return{type:e.key,id:O(),props:{seconds:25,msg:"GenericMsg"===e.key?"Message?":void 0}}}save(){B.setGlobalRotation(this.localRotation)}};Me([f.State((e=>e.reps.omnibar))],Se.prototype,"omnibar",void 0),Me([(0,I.o)("omnibar.rotation")],Se.prototype,"onGlobalRotationChange",null),Se=Me([(0,D.default)({components:{EditDialog:ce,Draggable:S(),GenericMsg:ve,Bid:Z,Milestone:he,Prize:Re,UpcomingRun:Oe,MusicTrack:Ie}})],Se);const Pe=Se,je=(0,Q.A)(Pe,(function(){var e=this,t=e._self._c;return e._self._setupProxy,t(m.A,[t("edit-dialog"),e._v(" "),t("span",{staticClass:"text-h6"},[e._v("New Components")]),e._v(" "),t("draggable",{staticClass:"d-flex flex-wrap",style:{gap:"0px 10px"},attrs:{list:e.availableTypes,group:{name:"ticker",pull:"clone",put:!1},clone:e.clone,sort:!1}},e._l(e.availableTypes,(function(o){return t(y.A,{key:o.key,staticClass:"pa-2 mt-2"},[e._v("\n      "+e._s(o.name)+"\n    ")])})),1),e._v(" "),t("span",{staticClass:"text-h6 mt-4"},[e._v("Rotation")]),e._v(" "),e.localRotation.length?e._e():t(y.A,{staticClass:"pa-2 mt-2 font-italic"},[e._v("\n    Drag elements from above to here to add.\n  ")]),e._v(" "),t("draggable",{style:{"max-height":"400px","overflow-y":"auto"},attrs:{group:"ticker","ghost-class":"Ghost",tag:"transition-group",animation:200,componentData:{props:{tag:"div"}}},model:{value:e.localRotation,callback:function(t){e.localRotation=t},expression:"localRotation"}},e._l(e.localRotation,(function(o){return t(o.type,e._b({key:o.id,tag:"component",staticClass:"mt-2",attrs:{id:o.id}},"component",o.props,!1))})),1),e._v(" "),t("div",{staticClass:"d-flex mt-2"},[t(h.A,{staticClass:"flex-grow-1 mr-2",attrs:{disabled:!e.isEdited},on:{click:e.save}},[e._v("\n      Save\n    ")]),e._v(" "),t(h.A,{attrs:{disabled:!e.isEdited},on:{click:function(t){return e.setLocalRotationFromGlobal()}}},[t(b.A,[e._v("mdi-refresh")])],1)],1),e._v(" "),e.currentItem.type?t("div",{staticClass:"text-center mt-4"},[t("span",{staticClass:"font-weight-bold"},[e._v("Current:")]),e._v("\n    "+e._s(e.currentItem.name)+"\n    "),t("br"),t("span",{staticClass:"font-weight-bold"},[e._v(e._s(e.currentItem.secondsStr)+":")]),e._v("\n    "+e._s(e.currentItem.seconds)+" -\n    "),t("span",{staticClass:"font-weight-bold"},[e._v("Position:")]),e._v("\n    "+e._s(e.currentItem.index+1||"?")+"/"+e._s(e.omnibar.rotation.length)+"\n    "),"GenericMsg"===e.currentItem.type?[t("br"),t("span",{staticClass:"font-weight-bold"},[e._v("Message:")]),e._v("\n      "+e._s(e.currentItem.msg)+"\n    ")]:e._e()],2):e._e()],1)}),[],!1,null,"0808564a",null).exports;(function(e){return t=this,o=void 0,i=function*(){Object.keys(p).forEach((t=>{p[t].on("change",(o=>{e.commit("ReplicantModule/setState",{name:t,val:o})}))})),yield NodeCG.waitForReplicants(...Object.keys(p).map((e=>p[e]))),u=(0,l.f_)(v,e)},new((n=void 0)||(n=Promise))((function(e,s){function a(e){try{l(i.next(e))}catch(e){s(e)}}function r(e){try{l(i.throw(e))}catch(e){s(e)}}function l(t){var o;t.done?e(t.value):(o=t.value,o instanceof n?o:new n((function(e){e(o)}))).then(a,r)}l((i=i.apply(t,o||[])).next())}));var t,o,n,i})(V).then((()=>{new a.Ay({vuetify:g.A,store:V,el:"#App",render:e=>e(je)})}))}},o={};function n(e){var i=o[e];if(void 0!==i)return i.exports;var s=o[e]={exports:{}};return t[e].call(s.exports,s,s.exports,n),s.exports}n.m=t,e=[],n.O=(t,o,i,s)=>{if(!o){var a=1/0;for(d=0;d<e.length;d++){for(var[o,i,s]=e[d],r=!0,l=0;l<o.length;l++)(!1&s||a>=s)&&Object.keys(n.O).every((e=>n.O[e](o[l])))?o.splice(l--,1):(r=!1,s<a&&(a=s));if(r){e.splice(d--,1);var c=i();void 0!==c&&(t=c)}}return t}s=s||0;for(var d=e.length;d>0&&e[d-1][2]>s;d--)e[d]=e[d-1];e[d]=[o,i,s]},n.n=e=>{var t=e&&e.__esModule?()=>e.default:()=>e;return n.d(t,{a:t}),t},n.d=(e,t)=>{for(var o in t)n.o(t,o)&&!n.o(e,o)&&Object.defineProperty(e,o,{enumerable:!0,get:t[o]})},n.g=function(){if("object"==typeof globalThis)return globalThis;try{return this||new Function("return this")()}catch(e){if("object"==typeof window)return window}}(),n.o=(e,t)=>Object.prototype.hasOwnProperty.call(e,t),n.r=e=>{"undefined"!=typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(e,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(e,"__esModule",{value:!0})},(()=>{var e={338:0,531:0};n.O.j=t=>0===e[t];var t=(t,o)=>{var i,s,[a,r,l]=o,c=0;if(a.some((t=>0!==e[t]))){for(i in r)n.o(r,i)&&(n.m[i]=r[i]);if(l)var d=l(n)}for(t&&t(o);c<a.length;c++)s=a[c],n.o(e,s)&&e[s]&&e[s][0](),e[s]=0;return n.O(d)},o=self.webpackChunk=self.webpackChunk||[];o.forEach(t.bind(null,0)),o.push=t.bind(null,o.push.bind(o))})();var i=n.O(void 0,[294,857,842,654,531,259,104,279],(()=>n(7023)));i=n.O(i)})();