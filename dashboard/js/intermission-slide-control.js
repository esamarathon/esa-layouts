(()=>{"use strict";var t,e={8657:(t,e,i)=>{var s=i(8138),n=i.n(s),o=i(829),r=i(5803),a=i(708),l=i(4170),c=function(t,e,i,s){var n,o=arguments.length,r=o<3?e:null===s?s=Object.getOwnPropertyDescriptor(e,i):s;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)r=Reflect.decorate(t,e,i,s);else for(var a=t.length-1;a>=0;a--)(n=t[a])&&(r=(o<3?n(r):o>3?n(e,i,r):n(e,i))||r);return o>3&&r&&Object.defineProperty(e,i,r),r};const d=new o.SpeedcontrolUtilBrowser(nodecg),h={assetsIntermissionSlides:nodecg.Replicant("assets:intermission-slides"),assetsReaderIntroductionImages:nodecg.Replicant("assets:reader-introduction-images"),bids:nodecg.Replicant("bids"),bigbuttonPlayerMap:nodecg.Replicant("bigbuttonPlayerMap"),commentators:nodecg.Replicant("commentators"),countdown:nodecg.Replicant("countdown"),currentRunDelay:nodecg.Replicant("currentRunDelay"),donationReader:nodecg.Replicant("donationReader"),donationsToRead:nodecg.Replicant("donationsToRead"),donationTotal:nodecg.Replicant("donationTotal"),donationTotalMilestones:nodecg.Replicant("donationTotalMilestones"),gameLayouts:nodecg.Replicant("gameLayouts"),intermissionSlides:nodecg.Replicant("intermissionSlides"),obsData:nodecg.Replicant("obsData"),omnibar:nodecg.Replicant("omnibar"),otherStreamData:nodecg.Replicant("otherStreamData"),prizes:nodecg.Replicant("prizes"),readerIntroduction:nodecg.Replicant("readerIntroduction"),runDataActiveRun:d.runDataActiveRun,runDataActiveRunSurrounding:d.runDataActiveRunSurrounding,runDataArray:d.runDataArray,serverTimestamp:nodecg.Replicant("serverTimestamp"),streamDeckData:nodecg.Replicant("streamDeckData"),timer:d.timer,ttsVoices:nodecg.Replicant("ttsVoices"),upcomingRunID:nodecg.Replicant("upcomingRunID"),videoPlayer:nodecg.Replicant("videoPlayer")};let u,p=class extends l.g4{constructor(){super(...arguments),this.reps={}}get repsTyped(){return this.reps}setState({name:t,val:e}){r.ZP.set(this.reps,t,n()(e))}setReplicant({name:t,val:e}){r.ZP.set(this.reps,t,n()(e)),h[t].value=n()(e)}};c([l.mm],p.prototype,"setState",null),c([l.mm],p.prototype,"setReplicant",null),p=c([(0,l.Yl)({name:"ReplicantModule",namespaced:!0})],p);const g=(0,a.uD)("ReplicantModule");var m=i(3687),v=i(936),f=i(690),b=i(3777),y=i(1954),R=i(2377);const S=y.Z.extend({name:"v-progress-circular",directives:{intersect:b.Z},props:{button:Boolean,indeterminate:Boolean,rotate:{type:[Number,String],default:0},size:{type:[Number,String],default:32},width:{type:[Number,String],default:4},value:{type:[Number,String],default:0}},data:()=>({radius:20,isVisible:!0}),computed:{calculatedSize(){return Number(this.size)+(this.button?8:0)},circumference(){return 2*Math.PI*this.radius},classes(){return{"v-progress-circular--visible":this.isVisible,"v-progress-circular--indeterminate":this.indeterminate,"v-progress-circular--button":this.button}},normalizedValue(){return this.value<0?0:this.value>100?100:parseFloat(this.value)},strokeDashArray(){return Math.round(1e3*this.circumference)/1e3},strokeDashOffset(){return(100-this.normalizedValue)/100*this.circumference+"px"},strokeWidth(){return Number(this.width)/+this.size*this.viewBoxSize*2},styles(){return{height:(0,R.kb)(this.calculatedSize),width:(0,R.kb)(this.calculatedSize)}},svgStyles(){return{transform:`rotate(${Number(this.rotate)}deg)`}},viewBoxSize(){return this.radius/(1-Number(this.width)/+this.size)}},methods:{genCircle(t,e){return this.$createElement("circle",{class:`v-progress-circular__${t}`,attrs:{fill:"transparent",cx:2*this.viewBoxSize,cy:2*this.viewBoxSize,r:this.radius,"stroke-width":this.strokeWidth,"stroke-dasharray":this.strokeDashArray,"stroke-dashoffset":e}})},genSvg(){const t=[this.indeterminate||this.genCircle("underlay",0),this.genCircle("overlay",this.strokeDashOffset)];return this.$createElement("svg",{style:this.svgStyles,attrs:{xmlns:"http://www.w3.org/2000/svg",viewBox:`${this.viewBoxSize} ${this.viewBoxSize} ${2*this.viewBoxSize} ${2*this.viewBoxSize}`}},t)},genInfo(){return this.$createElement("div",{staticClass:"v-progress-circular__info"},this.$slots.default)},onObserve(t,e,i){this.isVisible=i}},render(t){return t("div",this.setTextColor(this.color,{staticClass:"v-progress-circular",attrs:{role:"progressbar","aria-valuemin":0,"aria-valuemax":100,"aria-valuenow":this.indeterminate?void 0:this.normalizedValue},class:this.classes,directives:[{name:"intersect",value:this.onObserve}],style:this.styles,on:this.$listeners}),[this.genSvg(),this.genInfo()])}});var _=i(3844);function x(t="value",e="input"){return r.ZP.extend({name:"toggleable",model:{prop:t,event:e},props:{[t]:{required:!1}},data(){return{isActive:!!this[t]}},watch:{[t](t){this.isActive=!!t},isActive(i){!!i!==this[t]&&this.$emit(e,i)}}})}x();var w=i(8316),$=i(2027),C=i(9657),k=i(5010),P=i(6248),B=i(8298);const z=(0,P.Z)(f.Z,C.Z,$.Z,k.Z,(0,_.d)("btnToggle"),x("inputValue")).extend().extend({name:"v-btn",props:{activeClass:{type:String,default(){return this.btnToggle?this.btnToggle.activeClass:""}},block:Boolean,depressed:Boolean,fab:Boolean,icon:Boolean,loading:Boolean,outlined:Boolean,plain:Boolean,retainFocusOnClick:Boolean,rounded:Boolean,tag:{type:String,default:"button"},text:Boolean,tile:Boolean,type:{type:String,default:"button"},value:null},data:()=>({proxyClass:"v-btn--active"}),computed:{classes(){return{"v-btn":!0,...C.Z.options.computed.classes.call(this),"v-btn--absolute":this.absolute,"v-btn--block":this.block,"v-btn--bottom":this.bottom,"v-btn--disabled":this.disabled,"v-btn--is-elevated":this.isElevated,"v-btn--fab":this.fab,"v-btn--fixed":this.fixed,"v-btn--has-bg":this.hasBg,"v-btn--icon":this.icon,"v-btn--left":this.left,"v-btn--loading":this.loading,"v-btn--outlined":this.outlined,"v-btn--plain":this.plain,"v-btn--right":this.right,"v-btn--round":this.isRound,"v-btn--rounded":this.rounded,"v-btn--router":this.to,"v-btn--text":this.text,"v-btn--tile":this.tile,"v-btn--top":this.top,...this.themeClasses,...this.groupClasses,...this.elevationClasses,...this.sizeableClasses}},computedElevation(){if(!this.disabled)return w.Z.options.computed.computedElevation.call(this)},computedRipple(){var t;const e=!this.icon&&!this.fab||{circle:!0};return!this.disabled&&(null!==(t=this.ripple)&&void 0!==t?t:e)},hasBg(){return!(this.text||this.plain||this.outlined||this.icon)},isElevated(){return Boolean(!(this.icon||this.text||this.outlined||this.depressed||this.disabled||this.plain||!(null==this.elevation||Number(this.elevation)>0)))},isRound(){return Boolean(this.icon||this.fab)},styles(){return{...this.measurableStyles}}},created(){[["flat","text"],["outline","outlined"],["round","rounded"]].forEach((([t,e])=>{this.$attrs.hasOwnProperty(t)&&(0,B.fK)(t,e,this)}))},methods:{click(t){!this.retainFocusOnClick&&!this.fab&&t.detail&&this.$el.blur(),this.$emit("click",t),this.btnToggle&&this.toggle()},genContent(){return this.$createElement("span",{staticClass:"v-btn__content"},this.$slots.default)},genLoader(){return this.$createElement("span",{class:"v-btn__loader"},this.$slots.loader||[this.$createElement(S,{props:{indeterminate:!0,size:23,width:2}})])}},render(t){const e=[this.genContent(),this.loading&&this.genLoader()],{tag:i,data:s}=this.generateRouteLink(),n=this.hasBg?this.setBackgroundColor:this.setTextColor;return"button"===i&&(s.attrs.type=this.type,s.attrs.disabled=this.disabled),s.attrs.value=["string","number"].includes(typeof this.value)?this.value:JSON.stringify(this.value),t(i,this.disabled?s:n(this.color,s),e)}});var D,O=i(7653),Z=i(9405);!function(t){t.xSmall="12px",t.small="16px",t.default="24px",t.medium="28px",t.large="36px",t.xLarge="40px"}(D||(D={}));const I=(0,P.Z)(O.Z,y.Z,k.Z,Z.Z).extend({name:"v-icon",props:{dense:Boolean,disabled:Boolean,left:Boolean,right:Boolean,size:[Number,String],tag:{type:String,required:!1,default:"i"}},computed:{medium:()=>!1,hasClickListener(){return Boolean(this.listeners$.click||this.listeners$["!click"])}},methods:{getIcon(){let t="";return this.$slots.default&&(t=this.$slots.default[0].text.trim()),(0,R.RB)(this,t)},getSize(){const t={xSmall:this.xSmall,small:this.small,medium:this.medium,large:this.large,xLarge:this.xLarge},e=(0,R.XP)(t).find((e=>t[e]));return e&&D[e]||(0,R.kb)(this.size)},getDefaultData(){return{staticClass:"v-icon notranslate",class:{"v-icon--disabled":this.disabled,"v-icon--left":this.left,"v-icon--link":this.hasClickListener,"v-icon--right":this.right,"v-icon--dense":this.dense},attrs:{"aria-hidden":!this.hasClickListener,disabled:this.hasClickListener&&this.disabled,type:this.hasClickListener?"button":void 0,...this.attrs$},on:this.listeners$}},getSvgWrapperData(){const t=this.getSize(),e={...this.getDefaultData(),style:t?{fontSize:t,height:t,width:t}:void 0};return this.applyColors(e),e},applyColors(t){t.class={...t.class,...this.themeClasses},this.setTextColor(this.color,t)},renderFontIcon(t,e){const i=[],s=this.getDefaultData();let n="material-icons";const o=t.indexOf("-"),r=o<=-1;r?i.push(t):(n=t.slice(0,o),function(t){return["fas","far","fal","fab","fad","fak"].some((e=>t.includes(e)))}(n)&&(n="")),s.class[n]=!0,s.class[t]=!r;const a=this.getSize();return a&&(s.style={fontSize:a}),this.applyColors(s),e(this.hasClickListener?"button":this.tag,s,i)},renderSvgIcon(t,e){const i={class:"v-icon__svg",attrs:{xmlns:"http://www.w3.org/2000/svg",viewBox:"0 0 24 24",role:"img","aria-hidden":!0}},s=this.getSize();return s&&(i.style={fontSize:s,height:s,width:s}),e(this.hasClickListener?"button":"span",this.getSvgWrapperData(),[e("svg",i,[e("path",{attrs:{d:t}})])])},renderSvgIconComponent(t,e){const i={class:{"v-icon__component":!0}},s=this.getSize();s&&(i.style={fontSize:s,height:s,width:s}),this.applyColors(i);const n=t.component;return i.props=t.props,i.nativeOn=i.on,e(this.hasClickListener?"button":"span",this.getSvgWrapperData(),[e(n,i)])}},render(t){const e=this.getIcon();return"string"==typeof e?function(t){return/^[mzlhvcsqta]\s*[-+.0-9][^mlhvzcsqta]+/i.test(t)&&/[\dz]$/i.test(t)&&t.length>4}(e)?this.renderSvgIcon(e,t):this.renderFontIcon(e,t):this.renderSvgIconComponent(e,t)}}),j=r.ZP.extend({name:"v-icon",$_wrapperFor:I,functional:!0,render(t,{data:e,children:i}){let s="";return e.domProps&&(s=e.domProps.textContent||e.domProps.innerHTML||s,delete e.domProps.textContent,delete e.domProps.innerHTML),t(I,e,s?[s]:i)}});var E=i(5925);i(4807),i(7023),i(5654),i(779),i(8793);var L=i(5612),A=i(4519),N=i(2895);const T=(0,P.Z)(N.Z).extend({name:"v-responsive",props:{aspectRatio:[String,Number],contentClass:String},computed:{computedAspectRatio(){return Number(this.aspectRatio)},aspectStyle(){return this.computedAspectRatio?{paddingBottom:1/this.computedAspectRatio*100+"%"}:void 0},__cachedSizer(){return this.aspectStyle?this.$createElement("div",{style:this.aspectStyle,staticClass:"v-responsive__sizer"}):[]}},methods:{genContent(){return this.$createElement("div",{staticClass:"v-responsive__content",class:this.contentClass},(0,R.z9)(this))}},render(t){return t("div",{staticClass:"v-responsive",style:this.measurableStyles,on:this.$listeners},[this.__cachedSizer,this.genContent()])}});var U=i(2138);const M="undefined"!=typeof window&&"IntersectionObserver"in window,W=(0,P.Z)(T,Z.Z).extend({name:"v-img",directives:{intersect:b.Z},props:{alt:String,contain:Boolean,eager:Boolean,gradient:String,lazySrc:String,options:{type:Object,default:()=>({root:void 0,rootMargin:void 0,threshold:void 0})},position:{type:String,default:"center center"},sizes:String,src:{type:[String,Object],default:""},srcset:String,transition:{type:[Boolean,String],default:"fade-transition"}},data:()=>({currentSrc:"",image:null,isLoading:!0,calculatedAspectRatio:void 0,naturalWidth:void 0,hasError:!1}),computed:{computedAspectRatio(){return Number(this.normalisedSrc.aspect||this.calculatedAspectRatio)},normalisedSrc(){return this.src&&"object"==typeof this.src?{src:this.src.src,srcset:this.srcset||this.src.srcset,lazySrc:this.lazySrc||this.src.lazySrc,aspect:Number(this.aspectRatio||this.src.aspect)}:{src:this.src,srcset:this.srcset,lazySrc:this.lazySrc,aspect:Number(this.aspectRatio||0)}},__cachedImage(){if(!(this.normalisedSrc.src||this.normalisedSrc.lazySrc||this.gradient))return[];const t=[],e=this.isLoading?this.normalisedSrc.lazySrc:this.currentSrc;this.gradient&&t.push(`linear-gradient(${this.gradient})`),e&&t.push(`url("${e}")`);const i=this.$createElement("div",{staticClass:"v-image__image",class:{"v-image__image--preload":this.isLoading,"v-image__image--contain":this.contain,"v-image__image--cover":!this.contain},style:{backgroundImage:t.join(", "),backgroundPosition:this.position},key:+this.isLoading});return this.transition?this.$createElement("transition",{attrs:{name:this.transition,mode:"in-out"}},[i]):i}},watch:{src(){this.isLoading?this.loadImage():this.init(void 0,void 0,!0)},"$vuetify.breakpoint.width":"getSrc"},mounted(){this.init()},methods:{init(t,e,i){if(!M||i||this.eager){if(this.normalisedSrc.lazySrc){const t=new Image;t.src=this.normalisedSrc.lazySrc,this.pollForSize(t,null)}this.normalisedSrc.src&&this.loadImage()}},onLoad(){this.getSrc(),this.isLoading=!1,this.$emit("load",this.src),this.image&&(this.normalisedSrc.src.endsWith(".svg")||this.normalisedSrc.src.startsWith("data:image/svg+xml"))&&(this.image.naturalHeight&&this.image.naturalWidth?(this.naturalWidth=this.image.naturalWidth,this.calculatedAspectRatio=this.image.naturalWidth/this.image.naturalHeight):this.calculatedAspectRatio=1)},onError(){this.hasError=!0,this.$emit("error",this.src)},getSrc(){this.image&&(this.currentSrc=this.image.currentSrc||this.image.src)},loadImage(){const t=new Image;this.image=t,t.onload=()=>{t.decode?t.decode().catch((t=>{(0,B.Kd)(`Failed to decode image, trying to render anyway\n\nsrc: ${this.normalisedSrc.src}`+(t.message?`\nOriginal error: ${t.message}`:""),this)})).then(this.onLoad):this.onLoad()},t.onerror=this.onError,this.hasError=!1,this.sizes&&(t.sizes=this.sizes),this.normalisedSrc.srcset&&(t.srcset=this.normalisedSrc.srcset),t.src=this.normalisedSrc.src,this.$emit("loadstart",this.normalisedSrc.src),this.aspectRatio||this.pollForSize(t),this.getSrc()},pollForSize(t,e=100){const i=()=>{const{naturalHeight:s,naturalWidth:n}=t;s||n?(this.naturalWidth=n,this.calculatedAspectRatio=n/s):t.complete||!this.isLoading||this.hasError||null==e||setTimeout(i,e)};i()},genContent(){const t=T.options.methods.genContent.call(this);return this.naturalWidth&&this._b(t.data,"div",{style:{width:`${this.naturalWidth}px`}}),t},__genPlaceholder(){const t=(0,R.z9)(this,"placeholder");if(t){const e=this.isLoading?[this.$createElement("div",{staticClass:"v-image__placeholder"},t)]:[];return this.transition?this.$createElement("transition",{props:{appear:!0,name:this.transition}},e):e[0]}}},render(t){const e=T.options.render.call(this,t),i=(0,U.ZP)(e.data,{staticClass:"v-image",attrs:{"aria-label":this.alt,role:this.alt?"img":void 0},class:this.themeClasses,directives:M?[{name:"intersect",modifiers:{once:!0},value:{handler:this.init,options:this.options}}]:void 0});return e.children=[this.__cachedSizer,this.__cachedImage,this.__genPlaceholder(),this.genContent()],t(e.tag,i,e.children)}}),V=(A.Z.extend({name:"v-toolbar",props:{absolute:Boolean,bottom:Boolean,collapse:Boolean,dense:Boolean,extended:Boolean,extensionHeight:{default:48,type:[Number,String]},flat:Boolean,floating:Boolean,prominent:Boolean,short:Boolean,src:{type:[String,Object],default:""},tag:{type:String,default:"header"}},data:()=>({isExtended:!1}),computed:{computedHeight(){const t=this.computedContentHeight;if(!this.isExtended)return t;const e=parseInt(this.extensionHeight);return this.isCollapsed?t:t+(isNaN(e)?0:e)},computedContentHeight(){return this.height?parseInt(this.height):this.isProminent&&this.dense?96:this.isProminent&&this.short?112:this.isProminent?128:this.dense?48:this.short||this.$vuetify.breakpoint.smAndDown?56:64},classes(){return{...A.Z.options.computed.classes.call(this),"v-toolbar":!0,"v-toolbar--absolute":this.absolute,"v-toolbar--bottom":this.bottom,"v-toolbar--collapse":this.collapse,"v-toolbar--collapsed":this.isCollapsed,"v-toolbar--dense":this.dense,"v-toolbar--extended":this.isExtended,"v-toolbar--flat":this.flat,"v-toolbar--floating":this.floating,"v-toolbar--prominent":this.isProminent}},isCollapsed(){return this.collapse},isProminent(){return this.prominent},styles(){return{...this.measurableStyles,height:(0,R.kb)(this.computedHeight)}}},created(){[["app","<v-app-bar app>"],["manual-scroll",'<v-app-bar :value="false">'],["clipped-left","<v-app-bar clipped-left>"],["clipped-right","<v-app-bar clipped-right>"],["inverted-scroll","<v-app-bar inverted-scroll>"],["scroll-off-screen","<v-app-bar scroll-off-screen>"],["scroll-target","<v-app-bar scroll-target>"],["scroll-threshold","<v-app-bar scroll-threshold>"],["card","<v-app-bar flat>"]].forEach((([t,e])=>{this.$attrs.hasOwnProperty(t)&&(0,B.fK)(t,e,this)}))},methods:{genBackground(){const t={height:(0,R.kb)(this.computedHeight),src:this.src},e=this.$scopedSlots.img?this.$scopedSlots.img({props:t}):this.$createElement(W,{props:t});return this.$createElement("div",{staticClass:"v-toolbar__image"},[e])},genContent(){return this.$createElement("div",{staticClass:"v-toolbar__content",style:{height:(0,R.kb)(this.computedContentHeight)}},(0,R.z9)(this))},genExtension(){return this.$createElement("div",{staticClass:"v-toolbar__extension",style:{height:(0,R.kb)(this.extensionHeight)}},(0,R.z9)(this,"extension"))}},render(t){this.isExtended=this.extended||!!this.$scopedSlots.extension;const e=[this.genContent()],i=this.setBackgroundColor(this.color,{class:this.classes,style:this.styles,on:this.$listeners});return this.isExtended&&e.push(this.genExtension()),(this.src||this.$scopedSlots.img)&&e.unshift(this.genBackground()),t(this.tag,i,e)}}),(0,R.Ji)("v-toolbar__title"));(0,R.Ji)("v-toolbar__items");var F=i(4341);const H=(0,P.Z)(F.Z,C.Z,f.Z).extend({name:"v-card",props:{flat:Boolean,hover:Boolean,img:String,link:Boolean,loaderHeight:{type:[Number,String],default:4},raised:Boolean},computed:{classes(){return{"v-card":!0,...C.Z.options.computed.classes.call(this),"v-card--flat":this.flat,"v-card--hover":this.hover,"v-card--link":this.isClickable,"v-card--loading":this.loading,"v-card--disabled":this.disabled,"v-card--raised":this.raised,...f.Z.options.computed.classes.call(this)}},styles(){const t={...f.Z.options.computed.styles.call(this)};return this.img&&(t.background=`url("${this.img}") center center / cover no-repeat`),t}},methods:{genProgress(){const t=F.Z.options.methods.genProgress.call(this);return t?this.$createElement("div",{staticClass:"v-card__progress",key:"progress"},[t]):null}},render(t){const{tag:e,data:i}=this.generateRouteLink();return i.style=this.styles,this.isClickable&&(i.attrs=i.attrs||{},i.attrs.tabindex=0),t(e,this.setBackgroundColor(this.color,i),[this.genProgress(),this.$slots.default])}});let G=class extends r.ZP{};G=function(t,e,i,s){var n,o=arguments.length,r=o<3?e:null===s?s=Object.getOwnPropertyDescriptor(e,i):s;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)r=Reflect.decorate(t,e,i,s);else for(var a=t.length-1;a>=0;a--)(n=t[a])&&(r=(o<3?n(r):o>3?n(e,i,r):n(e,i))||r);return o>3&&r&&Object.defineProperty(e,i,r),r}([E.default],G);const K=G;var q=i(5440);const J=(0,q.Z)(K,(function(){var t=this,e=t._self._c;return t._self._setupProxy,e(H,{style:{"text-align":"center",padding:"5px","margin-top":"10px","white-space":"nowrap",overflow:"hidden"}},[t._t("default")],2)}),[],!1,null,null,null).exports,X={randomUUID:"undefined"!=typeof crypto&&crypto.randomUUID&&crypto.randomUUID.bind(crypto)};let Y;const Q=new Uint8Array(16);function tt(){if(!Y&&(Y="undefined"!=typeof crypto&&crypto.getRandomValues&&crypto.getRandomValues.bind(crypto),!Y))throw new Error("crypto.getRandomValues() not supported. See https://github.com/uuidjs/uuid#getrandomvalues-not-supported");return Y(Q)}const et=[];for(let t=0;t<256;++t)et.push((t+256).toString(16).slice(1));const it=function(t,e,i){if(X.randomUUID&&!e&&!t)return X.randomUUID();const s=(t=t||{}).random||(t.rng||tt)();if(s[6]=15&s[6]|64,s[8]=63&s[8]|128,e){i=i||0;for(let t=0;t<16;++t)e[i+t]=s[t];return e}return function(t,e=0){return et[t[e+0]]+et[t[e+1]]+et[t[e+2]]+et[t[e+3]]+"-"+et[t[e+4]]+et[t[e+5]]+"-"+et[t[e+6]]+et[t[e+7]]+"-"+et[t[e+8]]+et[t[e+9]]+"-"+et[t[e+10]]+et[t[e+11]]+et[t[e+12]]+et[t[e+13]]+et[t[e+14]]+et[t[e+15]]}(s)};var st=i(4048),nt=i.n(st),ot=function(t,e,i,s){var n,o=arguments.length,r=o<3?e:null===s?s=Object.getOwnPropertyDescriptor(e,i):s;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)r=Reflect.decorate(t,e,i,s);else for(var a=t.length-1;a>=0;a--)(n=t[a])&&(r=(o<3?n(r):o>3?n(e,i,r):n(e,i))||r);return o>3&&r&&Object.defineProperty(e,i,r),r};let rt=class extends r.ZP{constructor(){super(...arguments),this.bundleName=nodecg.bundleName}clone(t){return{type:"Media",id:it(),mediaUUID:t.sum}}};ot([g.State((t=>t.reps.assetsIntermissionSlides))],rt.prototype,"media",void 0),rt=ot([(0,E.default)({components:{Draggable:nt(),MediaCard:J}})],rt);const at=rt,lt=(0,q.Z)(at,(function(){var t=this,e=t._self._c;return t._self._setupProxy,e("div",[e(V,[t._v("\n    Available Images/Videos\n  ")]),t._v(" "),e("div",{style:{"max-height":"400px","overflow-y":"auto"}},[t.media.length?e("draggable",{attrs:{list:t.media,group:{name:"intermission",pull:"clone",put:!1},sort:!1,clone:t.clone}},t._l(t.media,(function(i){return e("media-card",{key:i.sum,attrs:{title:i.name}},[t._v("\n        "+t._s(i.name)+"\n      ")])})),1):e("media-card",{style:{"font-style":"italic","white-space":"unset"}},[t._v('\n      Add images/videos under "Assets" > "'+t._s(t.bundleName)+'" > "Intermission Slide Images/Videos".\n    ')])],1)],1)}),[],!1,null,null,null).exports;var ct=i(8586),dt=function(t,e,i,s){var n,o=arguments.length,r=o<3?e:null===s?s=Object.getOwnPropertyDescriptor(e,i):s;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)r=Reflect.decorate(t,e,i,s);else for(var a=t.length-1;a>=0;a--)(n=t[a])&&(r=(o<3?n(r):o>3?n(e,i,r):n(e,i))||r);return o>3&&r&&Object.defineProperty(e,i,r),r};r.ZP.use(ct.ZP);let ht=class extends l.g4{constructor(){super(...arguments),this.localRotation=[],this.localEdits=!1}get reps(){return this.context.rootState.ReplicantModule.reps}setLocalRotation({val:t,manual:e=!1}){this.localRotation=n()(t),this.localEdits=e}setGlobalRotation(t){u.setReplicant({name:"intermissionSlides",val:Object.assign(Object.assign({},u.repsTyped.intermissionSlides),{rotation:n()(t)})}),this.localEdits=!1}deleteItem(t){const e=this.localRotation.findIndex((e=>e.id===t));e>=0&&(this.localRotation.splice(e,1),this.localEdits=!0)}};dt([l.mm],ht.prototype,"setLocalRotation",null),dt([l.mm],ht.prototype,"setGlobalRotation",null),dt([l.mm],ht.prototype,"deleteItem",null),ht=dt([(0,l.Yl)({name:"OurModule"})],ht);const ut=new ct.yh({strict:!1,state:{},modules:{ReplicantModule:p,OurModule:ht}}),pt=ut,gt=(0,l.rT)(ht,ut);let mt=class extends r.ZP{get current(){return gt.reps.intermissionSlides.current}get rotationLength(){return gt.reps.intermissionSlides.rotation.length}get currentPosition(){return gt.reps.intermissionSlides.rotation.findIndex((t=>{var e;return t.id===(null===(e=this.current)||void 0===e?void 0:e.id)}))}get name(){var t,e,i,s,n;let o="";return"Media"===(null===(t=this.current)||void 0===t?void 0:t.type)?o=(null===(e=gt.reps.assetsIntermissionSlides.find((t=>{var e;return t.sum===(null===(e=this.current)||void 0===e?void 0:e.mediaUUID)})))||void 0===e?void 0:e.name)||"":"UpcomingRuns"===(null===(i=this.current)||void 0===i?void 0:i.type)?o="Upcoming Runs":"RandomBid"===(null===(s=this.current)||void 0===s?void 0:s.type)?o="Random Bid":"RandomPrize"===(null===(n=this.current)||void 0===n?void 0:n.type)&&(o="Random Prize"),o||"?"}};mt=function(t,e,i,s){var n,o=arguments.length,r=o<3?e:null===s?s=Object.getOwnPropertyDescriptor(e,i):s;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)r=Reflect.decorate(t,e,i,s);else for(var a=t.length-1;a>=0;a--)(n=t[a])&&(r=(o<3?n(r):o>3?n(e,i,r):n(e,i))||r);return o>3&&r&&Object.defineProperty(e,i,r),r}([E.default],mt);const vt=mt,ft=(0,q.Z)(vt,(function(){var t=this,e=t._self._c;return t._self._setupProxy,e("div",{staticClass:"text-center"},[t.current?[e("span",{staticClass:"font-weight-bold"},[t._v("Current:")]),t._v("\n    "+t._s(t.name)+"\n    "),e("br"),e("span",{staticClass:"font-weight-bold"},[t._v("Position:")]),t._v("\n    "+t._s(t.currentPosition+1||"?")+"/"+t._s(t.rotationLength)+"\n  ")]:[t._v("\n    No slide current displaying.\n  ")]],2)}),[],!1,null,null,null).exports;let bt=class extends r.ZP{constructor(){super(...arguments),this.selection=[{type:"UpcomingRuns",name:"Upcoming Runs"},{type:"RandomBid",name:"Random Bid"},{type:"RandomPrize",name:"Random Prize"}]}clone(t){return{type:t.type,id:it(),mediaUUID:"-1"}}};bt=function(t,e,i,s){var n,o=arguments.length,r=o<3?e:null===s?s=Object.getOwnPropertyDescriptor(e,i):s;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)r=Reflect.decorate(t,e,i,s);else for(var a=t.length-1;a>=0;a--)(n=t[a])&&(r=(o<3?n(r):o>3?n(e,i,r):n(e,i))||r);return o>3&&r&&Object.defineProperty(e,i,r),r}([(0,E.default)({components:{Draggable:nt(),MediaCard:J}})],bt);const yt=bt,Rt=(0,q.Z)(yt,(function(){var t=this,e=t._self._c;return t._self._setupProxy,e("div",[e(V,[t._v("\n    Other Slides\n  ")]),t._v(" "),e("div",{style:{"max-height":"400px","overflow-y":"auto"}},[e("draggable",{attrs:{list:t.selection,group:{name:"intermission",pull:"clone",put:!1},sort:!1,clone:t.clone}},t._l(t.selection,(function(i){return e("media-card",{key:i.type,attrs:{title:i.name}},[t._v("\n        "+t._s(i.name)+"\n      ")])})),1)],1)],1)}),[],!1,null,null,null).exports;let St=class extends r.ZP{get localRotation(){return gt.localRotation}set localRotation(t){gt.setLocalRotation({val:t,manual:!0})}name(t){var e;let i="";return"Media"===t.type?i=(null===(e=gt.reps.assetsIntermissionSlides.find((e=>e.sum===t.mediaUUID)))||void 0===e?void 0:e.name)||"":"UpcomingRuns"===t.type?i="Upcoming Runs":"RandomBid"===t.type?i="Random Bid":"RandomPrize"===t.type&&(i="Random Prize"),i||"?"}del(t){gt.deleteItem(t)}};St=function(t,e,i,s){var n,o=arguments.length,r=o<3?e:null===s?s=Object.getOwnPropertyDescriptor(e,i):s;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)r=Reflect.decorate(t,e,i,s);else for(var a=t.length-1;a>=0;a--)(n=t[a])&&(r=(o<3?n(r):o>3?n(e,i,r):n(e,i))||r);return o>3&&r&&Object.defineProperty(e,i,r),r}([(0,E.default)({components:{Draggable:nt(),MediaCard:J}})],St);const _t=St,xt=(0,q.Z)(_t,(function(){var t=this,e=t._self._c;return t._self._setupProxy,e("div",[e(V,[t._v("\n    Rotation\n  ")]),t._v(" "),e("div",{style:{"max-height":"400px","overflow-y":"auto"}},[t.localRotation.length?t._e():e("media-card",{style:{"font-style":"italic"}},[t._v("\n      Drag elements from above to here to configure.\n    ")]),t._v(" "),e("draggable",{attrs:{group:"intermission"},model:{value:t.localRotation,callback:function(e){t.localRotation=e},expression:"localRotation"}},t._l(t.localRotation,(function(i){return e("media-card",{key:i.id,staticClass:"d-flex"},[e("div",{staticClass:"d-flex align-center justify-center flex-grow-1",style:{overflow:"hidden"}},[t._v("\n          "+t._s(t.name(i))+"\n        ")]),t._v(" "),e("div",{staticClass:"d-flex"},[e(j,{on:{click:function(e){return t.del(i.id)}}},[t._v("\n            mdi-delete\n          ")])],1)])})),1)],1)],1)}),[],!1,null,null,null).exports;var wt=function(t,e,i,s){var n,o=arguments.length,r=o<3?e:null===s?s=Object.getOwnPropertyDescriptor(e,i):s;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)r=Reflect.decorate(t,e,i,s);else for(var a=t.length-1;a>=0;a--)(n=t[a])&&(r=(o<3?n(r):o>3?n(e,i,r):n(e,i))||r);return o>3&&r&&Object.defineProperty(e,i,r),r};let $t=class extends r.ZP{get localRotation(){return gt.localRotation}get isEdited(){return gt.localEdits}setLocalRotationFromGlobal(t){gt.setLocalRotation({val:n()(t||this.iSlides.rotation)})}onGlobalRotationChange(t){gt.localEdits||this.setLocalRotationFromGlobal(t)}created(){this.setLocalRotationFromGlobal()}save(){gt.setGlobalRotation(this.localRotation)}};wt([g.State((t=>t.reps.intermissionSlides))],$t.prototype,"iSlides",void 0),wt([(0,L.R)("omnibar.rotation")],$t.prototype,"onGlobalRotationChange",null),$t=wt([(0,E.default)({components:{AvailableImagesVideos:lt,Rotation:xt,OtherSlides:Rt,CurrentItem:ft}})],$t);const Ct=$t,kt=(0,q.Z)(Ct,(function(){var t=this,e=t._self._c;return t._self._setupProxy,e(v.Z,[e("available-images-videos"),t._v(" "),e("other-slides",{style:{"margin-top":"20px"}}),t._v(" "),e("rotation",{style:{"margin-top":"20px"},model:{value:t.localRotation,callback:function(e){t.localRotation=e},expression:"localRotation"}}),t._v(" "),e("div",{staticClass:"d-flex mt-4"},[e(z,{staticClass:"flex-grow-1 mr-2",attrs:{disabled:!t.isEdited},on:{click:t.save}},[t._v("\n      Save\n    ")]),t._v(" "),e(z,{attrs:{disabled:!t.isEdited},on:{click:function(e){return t.setLocalRotationFromGlobal()}}},[e(j,[t._v("mdi-refresh")])],1)],1),t._v(" "),e("current-item",{style:{"margin-top":"20px"}})],1)}),[],!1,null,null,null).exports;(function(t){return e=this,i=void 0,n=function*(){Object.keys(h).forEach((e=>{h[e].on("change",(i=>{t.commit("ReplicantModule/setState",{name:e,val:i})}))})),yield NodeCG.waitForReplicants(...Object.keys(h).map((t=>h[t]))),u=(0,l.rT)(p,t)},new((s=void 0)||(s=Promise))((function(t,o){function r(t){try{l(n.next(t))}catch(t){o(t)}}function a(t){try{l(n.throw(t))}catch(t){o(t)}}function l(e){var i;e.done?t(e.value):(i=e.value,i instanceof s?i:new s((function(t){t(i)}))).then(r,a)}l((n=n.apply(e,i||[])).next())}));var e,i,s,n})(pt).then((()=>{new r.ZP({vuetify:m.Z,store:pt,el:"#App",render:t=>t(kt)})}))},779:(t,e,i)=>{"undefined"!=typeof Reflect&&Reflect.getMetadata},2027:(t,e,i)=>{i.d(e,{Z:()=>a,d:()=>r});var s=i(5803),n=i(2377);const o={absolute:Boolean,bottom:Boolean,fixed:Boolean,left:Boolean,right:Boolean,top:Boolean};function r(t=[]){return s.ZP.extend({name:"positionable",props:t.length?(0,n.ji)(o,t):o})}const a=r()},4185:(t,e,i)=>{i.d(e,{f:()=>r});var s=i(5803),n=i(8298);function o(t,e){return()=>(0,n.Kd)(`The ${t} component must be used inside a ${e}`)}function r(t,e,i){const n=e&&i?{register:o(e,i),unregister:o(e,i)}:null;return s.ZP.extend({name:"registrable-inject",inject:{[t]:{default:n}}})}},9405:(t,e,i)=>{i.d(e,{Z:()=>s});const s=i(5803).ZP.extend().extend({name:"themeable",provide(){return{theme:this.themeableProvide}},inject:{theme:{default:{isDark:!1}}},props:{dark:{type:Boolean,default:null},light:{type:Boolean,default:null}},data:()=>({themeableProvide:{isDark:!1}}),computed:{appIsDark(){return this.$vuetify.theme.dark||!1},isDark(){return!0===this.dark||!0!==this.light&&this.theme.isDark},themeClasses(){return{"theme--dark":this.isDark,"theme--light":!this.isDark}},rootIsDark(){return!0===this.dark||!0!==this.light&&this.appIsDark},rootThemeClasses(){return{"theme--dark":this.rootIsDark,"theme--light":!this.rootIsDark}}},watch:{isDark:{handler(t,e){t!==e&&(this.themeableProvide.isDark=this.isDark)},immediate:!0}}})},8298:(t,e,i)=>{i.d(e,{Kd:()=>o,N6:()=>r,fK:()=>a});var s=i(243);function n(t,e,i){if(!s.Z.config.silent){if(i&&(e={_isVue:!0,$parent:i,$options:e}),e){if(e.$_alreadyWarned=e.$_alreadyWarned||[],e.$_alreadyWarned.includes(t))return;e.$_alreadyWarned.push(t)}return`[Vuetify] ${t}`+(e?function(t){if(t._isVue&&t.$parent){const e=[];let i=0;for(;t;){if(e.length>0){const s=e[e.length-1];if(s.constructor===t.constructor){i++,t=t.$parent;continue}i>0&&(e[e.length-1]=[s,i],i=0)}e.push(t),t=t.$parent}return"\n\nfound in\n\n"+e.map(((t,e)=>`${0===e?"---\x3e ":" ".repeat(5+2*e)}${Array.isArray(t)?`${d(t[0])}... (${t[1]} recursive calls)`:d(t)}`)).join("\n")}return`\n\n(found in ${d(t)})`}(e):"")}}function o(t,e,i){const s=n(t,e,i);null!=s&&console.warn(s)}function r(t,e,i){const s=n(t,e,i);null!=s&&console.error(s)}function a(t,e,i,s){r(`[BREAKING] '${t}' has been removed, use '${e}' instead. For more information, see the upgrade guide https://github.com/vuetifyjs/vuetify/releases/tag/v2.0.0#user-content-upgrade-guide`,i,s)}const l=/(?:^|[-_])(\w)/g,c=t=>t.replace(l,(t=>t.toUpperCase())).replace(/[-_]/g,"");function d(t,e){if(t.$root===t)return"<Root>";const i="function"==typeof t&&null!=t.cid?t.options:t._isVue?t.$options||t.constructor.options:t||{};let s=i.name||i._componentTag;const n=i.__file;if(!s&&n){const t=n.match(/([^/\\]+)\.vue$/);s=t&&t[1]}return(s?`<${c(s)}>`:"<Anonymous>")+(n&&!1!==e?` at ${n}`:"")}},2377:(t,e,i)=>{i.d(e,{Do:()=>h,Ee:()=>R,Ji:()=>n,RB:()=>u,TI:()=>f,XP:()=>p,_A:()=>m,jC:()=>v,ji:()=>l,kb:()=>c,qw:()=>r,uZ:()=>y,vO:()=>a,z9:()=>b});var s=i(5803);function n(t,e="div",i){return s.ZP.extend({name:i||t.replace(/__/g,"-"),functional:!0,props:{tag:{type:String,default:e}},render:(e,{data:i,props:s,children:n})=>(i.staticClass=`${t} ${i.staticClass||""}`.trim(),e(s.tag,i,n))})}let o=!1;try{if("undefined"!=typeof window){const t=Object.defineProperty({},"passive",{get:()=>{o=!0}});window.addEventListener("testListener",t,t),window.removeEventListener("testListener",t,t)}}catch(t){console.warn(t)}function r(t,e,i){const s=e.length-1;if(s<0)return void 0===t?i:t;for(let n=0;n<s;n++){if(null==t)return i;t=t[e[n]]}return null==t||void 0===t[e[s]]?i:t[e[s]]}function a(t,e,i){return null!=t&&e&&"string"==typeof e?void 0!==t[e]?t[e]:r(t,(e=(e=e.replace(/\[(\w+)\]/g,".$1")).replace(/^\./,"")).split("."),i):i}function l(t,e){const i={};for(let s=0;s<e.length;s++){const n=e[s];void 0!==t[n]&&(i[n]=t[n])}return i}function c(t,e="px"){return null==t||""===t?void 0:isNaN(+t)?String(t):`${Number(t)}${e}`}function d(t){return null!==t&&"object"==typeof t}const h=Object.freeze({enter:13,tab:9,delete:46,esc:27,space:32,up:38,down:40,left:37,right:39,end:35,home:36,del:46,backspace:8,insert:45,pageup:33,pagedown:34,shift:16});function u(t,e){const i=t.$vuetify.icons.component;if(e.startsWith("$")){const i=a(t,`$vuetify.icons.values.${e.split("$").pop().split(".").pop()}`,e);if("string"!=typeof i)return i;e=i}return null==i?e:{component:i,props:{icon:e}}}function p(t){return Object.keys(t)}const g=/-(\w)/g,m=t=>t.replace(g,((t,e)=>e?e.toUpperCase():""));function v(t){return t.charAt(0).toUpperCase()+t.slice(1)}function f(t){return null!=t?Array.isArray(t)?t:[t]:[]}function b(t,e="default",i,s=!1){return t.$scopedSlots.hasOwnProperty(e)?t.$scopedSlots[e](i instanceof Function?i():i):!t.$slots.hasOwnProperty(e)||i&&!s?void 0:t.$slots[e]}function y(t,e=0,i=1){return Math.max(e,Math.min(i,t))}function R(t={},e={}){for(const i in e){const s=t[i],n=e[i];d(s)&&d(n)?t[i]=R(s,n):t[i]=n}return t}}},i={};function s(t){var n=i[t];if(void 0!==n)return n.exports;var o=i[t]={exports:{}};return e[t].call(o.exports,o,o.exports,s),o.exports}s.m=e,t=[],s.O=(e,i,n,o)=>{if(!i){var r=1/0;for(d=0;d<t.length;d++){for(var[i,n,o]=t[d],a=!0,l=0;l<i.length;l++)(!1&o||r>=o)&&Object.keys(s.O).every((t=>s.O[t](i[l])))?i.splice(l--,1):(a=!1,o<r&&(r=o));if(a){t.splice(d--,1);var c=n();void 0!==c&&(e=c)}}return e}o=o||0;for(var d=t.length;d>0&&t[d-1][2]>o;d--)t[d]=t[d-1];t[d]=[i,n,o]},s.n=t=>{var e=t&&t.__esModule?()=>t.default:()=>t;return s.d(e,{a:e}),e},s.d=(t,e)=>{for(var i in e)s.o(e,i)&&!s.o(t,i)&&Object.defineProperty(t,i,{enumerable:!0,get:e[i]})},s.g=function(){if("object"==typeof globalThis)return globalThis;try{return this||new Function("return this")()}catch(t){if("object"==typeof window)return window}}(),s.o=(t,e)=>Object.prototype.hasOwnProperty.call(t,e),s.r=t=>{"undefined"!=typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(t,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(t,"__esModule",{value:!0})},(()=>{var t={257:0};s.O.j=e=>0===t[e];var e=(e,i)=>{var n,o,[r,a,l]=i,c=0;if(r.some((e=>0!==t[e]))){for(n in a)s.o(a,n)&&(s.m[n]=a[n]);if(l)var d=l(s)}for(e&&e(i);c<r.length;c++)o=r[c],s.o(t,o)&&t[o]&&t[o][0](),t[o]=0;return s.O(d)},i=self.webpackChunk=self.webpackChunk||[];i.forEach(e.bind(null,0)),i.push=e.bind(null,i.push.bind(i))})();var n=s.O(void 0,[965,821,40,177],(()=>s(8657)));n=s.O(n)})();