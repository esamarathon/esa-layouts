"use strict";(self.webpackChunk=self.webpackChunk||[]).push([[629],{1570:(e,t,i)=>{i.d(t,{Z:()=>h});var s=i(7653),n=i(1954),r=i(8316),l=i(2895);const o=i(5803).Z.extend({name:"roundable",props:{rounded:[Boolean,String],tile:Boolean},computed:{roundedClasses(){const e=[],t="string"==typeof this.rounded?String(this.rounded):!0===this.rounded;if(this.tile)e.push("rounded-0");else if("string"==typeof t){const i=t.split(" ");for(const t of i)e.push(`rounded-${t}`)}else t&&e.push("rounded");return e.length>0?{[e.join(" ")]:!0}:{}}}});var a=i(9405);const h=(0,i(6248).Z)(s.Z,n.Z,r.Z,l.Z,o,a.Z).extend({name:"v-sheet",props:{outlined:Boolean,shaped:Boolean,tag:{type:String,default:"div"}},computed:{classes(){return{"v-sheet":!0,"v-sheet--outlined":this.outlined,"v-sheet--shaped":this.shaped,...this.themeClasses,...this.elevationClasses,...this.roundedClasses}},styles(){return this.measurableStyles}},render(e){const t={class:this.classes,style:this.styles,on:this.listeners$};return e(this.tag,this.setBackgroundColor(this.color,t),this.$slots.default)}})},690:(e,t,i)=>{i.d(t,{Z:()=>s});const s=i(1570).Z},7433:(e,t,i)=>{i.d(t,{Z:()=>$});var s=i(9050),n=i(9405),r=i(6248);const l=(0,r.Z)(n.Z).extend({name:"v-counter",functional:!0,props:{value:{type:[Number,String],default:""},max:[Number,String]},render(e,t){const{props:i}=t,s=parseInt(i.max,10),r=parseInt(i.value,10),l=s?`${r} / ${s}`:String(i.value);return e("div",{staticClass:"v-counter",class:{"error--text":s&&r>s,...(0,n.X)(t)}},l)}});var o=i(683),a=i(3777),h=i(8298),d=i(5803),u=i(3614),c=i(8732);const p={inserted:function(e,t){const i=t.value,s=t.options||{passive:!0};window.addEventListener("resize",i,s),e._onResize={callback:i,options:s},t.modifiers&&t.modifiers.quiet||i()},unbind:function(e){if(!e._onResize)return;const{callback:t,options:i}=e._onResize;window.removeEventListener("resize",t,i),delete e._onResize}},f=p;var g=i(7202),v=i(714),m=i(2377);const b=(0,r.Z)(s.Z,(y={onVisible:["onResize","tryAutofocus"]},d.Z.extend({name:"intersectable",mounted(){a.Z.inserted(this.$el,{name:"intersect",value:this.onObserve})},destroyed(){a.Z.unbind(this.$el)},methods:{onObserve(e,t,i){if(i)for(let e=0,t=y.onVisible.length;e<t;e++){const t=this[y.onVisible[e]];"function"!=typeof t?(0,h.Kd)(y.onVisible[e]+" method is not available on the instance but referenced in intersectable mixin options"):t()}}}})),u.Z);var y;const x=["color","file","time","date","datetime-local","week","month"],$=b.extend().extend({name:"v-text-field",directives:{resize:f,ripple:g.Z},inheritAttrs:!1,props:{appendOuterIcon:String,autofocus:Boolean,clearable:Boolean,clearIcon:{type:String,default:"$clear"},counter:[Boolean,Number,String],counterValue:Function,filled:Boolean,flat:Boolean,fullWidth:Boolean,label:String,outlined:Boolean,placeholder:String,prefix:String,prependInnerIcon:String,persistentPlaceholder:Boolean,reverse:Boolean,rounded:Boolean,shaped:Boolean,singleLine:Boolean,solo:Boolean,soloInverted:Boolean,suffix:String,type:{type:String,default:"text"}},data:()=>({badInput:!1,labelWidth:0,prefixWidth:0,prependWidth:0,initialValue:null,isBooted:!1,isClearing:!1}),computed:{classes(){return{...s.Z.options.computed.classes.call(this),"v-text-field":!0,"v-text-field--full-width":this.fullWidth,"v-text-field--prefix":this.prefix,"v-text-field--single-line":this.isSingle,"v-text-field--solo":this.isSolo,"v-text-field--solo-inverted":this.soloInverted,"v-text-field--solo-flat":this.flat,"v-text-field--filled":this.filled,"v-text-field--is-booted":this.isBooted,"v-text-field--enclosed":this.isEnclosed,"v-text-field--reverse":this.reverse,"v-text-field--outlined":this.outlined,"v-text-field--placeholder":this.placeholder,"v-text-field--rounded":this.rounded,"v-text-field--shaped":this.shaped}},computedColor(){const e=c.Z.options.computed.computedColor.call(this);return this.soloInverted&&this.isFocused?this.color||"primary":e},computedCounterValue(){return"function"==typeof this.counterValue?this.counterValue(this.internalValue):[...(this.internalValue||"").toString()].length},hasCounter(){return!1!==this.counter&&null!=this.counter},hasDetails(){return s.Z.options.computed.hasDetails.call(this)||this.hasCounter},internalValue:{get(){return this.lazyValue},set(e){this.lazyValue=e,this.$emit("input",this.lazyValue)}},isDirty(){var e;return(null==(e=this.lazyValue)?void 0:e.toString().length)>0||this.badInput},isEnclosed(){return this.filled||this.isSolo||this.outlined},isLabelActive(){return this.isDirty||x.includes(this.type)},isSingle(){return this.isSolo||this.singleLine||this.fullWidth||this.filled&&!this.hasLabel},isSolo(){return this.solo||this.soloInverted},labelPosition(){let e=this.prefix&&!this.labelValue?this.prefixWidth:0;return this.labelValue&&this.prependWidth&&(e-=this.prependWidth),this.$vuetify.rtl===this.reverse?{left:e,right:"auto"}:{left:"auto",right:e}},showLabel(){return this.hasLabel&&!(this.isSingle&&this.labelValue)},labelValue(){return this.isFocused||this.isLabelActive||this.persistentPlaceholder}},watch:{outlined:"setLabelWidth",label(){this.$nextTick(this.setLabelWidth)},prefix(){this.$nextTick(this.setPrefixWidth)},isFocused:"updateValue",value(e){this.lazyValue=e}},created(){this.$attrs.hasOwnProperty("box")&&(0,h.fK)("box","filled",this),this.$attrs.hasOwnProperty("browser-autocomplete")&&(0,h.fK)("browser-autocomplete","autocomplete",this),this.shaped&&!(this.filled||this.outlined||this.isSolo)&&(0,h.Kd)("shaped should be used with either filled or outlined",this)},mounted(){this.$watch((()=>this.labelValue),this.setLabelWidth),this.autofocus&&this.tryAutofocus(),requestAnimationFrame((()=>this.isBooted=!0))},methods:{focus(){this.onFocus()},blur(e){window.requestAnimationFrame((()=>{this.$refs.input&&this.$refs.input.blur()}))},clearableCallback(){this.$refs.input&&this.$refs.input.focus(),this.$nextTick((()=>this.internalValue=null))},genAppendSlot(){const e=[];return this.$slots["append-outer"]?e.push(this.$slots["append-outer"]):this.appendOuterIcon&&e.push(this.genIcon("appendOuter")),this.genSlot("append","outer",e)},genPrependInnerSlot(){const e=[];return this.$slots["prepend-inner"]?e.push(this.$slots["prepend-inner"]):this.prependInnerIcon&&e.push(this.genIcon("prependInner")),this.genSlot("prepend","inner",e)},genIconSlot(){const e=[];return this.$slots.append?e.push(this.$slots.append):this.appendIcon&&e.push(this.genIcon("append")),this.genSlot("append","inner",e)},genInputSlot(){const e=s.Z.options.methods.genInputSlot.call(this),t=this.genPrependInnerSlot();return t&&(e.children=e.children||[],e.children.unshift(t)),e},genClearIcon(){return this.clearable?this.isDirty?this.genSlot("append","inner",[this.genIcon("clear",this.clearableCallback)]):this.genSlot("append","inner",[this.$createElement("div")]):null},genCounter(){var e,t,i;if(!this.hasCounter)return null;const s=!0===this.counter?this.attrs$.maxlength:this.counter,n={dark:this.dark,light:this.light,max:s,value:this.computedCounterValue};return null!=(e=null==(t=(i=this.$scopedSlots).counter)?void 0:t.call(i,{props:n}))?e:this.$createElement(l,{props:n})},genControl(){return s.Z.options.methods.genControl.call(this)},genDefaultSlot(){return[this.genFieldset(),this.genTextFieldSlot(),this.genClearIcon(),this.genIconSlot(),this.genProgress()]},genFieldset(){return this.outlined?this.$createElement("fieldset",{attrs:{"aria-hidden":!0}},[this.genLegend()]):null},genLabel(){if(!this.showLabel)return null;const e={props:{absolute:!0,color:this.validationState,dark:this.dark,disabled:this.isDisabled,focused:!this.isSingle&&(this.isFocused||!!this.validationState),for:this.computedId,left:this.labelPosition.left,light:this.light,right:this.labelPosition.right,value:this.labelValue}};return this.$createElement(o.Z,e,this.$slots.label||this.label)},genLegend(){const e=this.singleLine||!this.labelValue&&!this.isDirty?0:this.labelWidth,t=this.$createElement("span",{domProps:{innerHTML:"&#8203;"},staticClass:"notranslate"});return this.$createElement("legend",{style:{width:this.isSingle?void 0:(0,m.kb)(e)}},[t])},genInput(){const e=Object.assign({},this.listeners$);delete e.change;const{title:t,...i}=this.attrs$;return this.$createElement("input",{style:{},domProps:{value:"number"===this.type&&Object.is(this.lazyValue,-0)?"-0":this.lazyValue},attrs:{...i,autofocus:this.autofocus,disabled:this.isDisabled,id:this.computedId,placeholder:this.persistentPlaceholder||this.isFocused||!this.hasLabel?this.placeholder:void 0,readonly:this.isReadonly,type:this.type},on:Object.assign(e,{blur:this.onBlur,input:this.onInput,focus:this.onFocus,keydown:this.onKeyDown}),ref:"input",directives:[{name:"resize",modifiers:{quiet:!0},value:this.onResize}]})},genMessages(){if(!this.showDetails)return null;const e=s.Z.options.methods.genMessages.call(this),t=this.genCounter();return this.$createElement("div",{staticClass:"v-text-field__details"},[e,t])},genTextFieldSlot(){return this.$createElement("div",{staticClass:"v-text-field__slot"},[this.genLabel(),this.prefix?this.genAffix("prefix"):null,this.genInput(),this.suffix?this.genAffix("suffix"):null])},genAffix(e){return this.$createElement("div",{class:`v-text-field__${e}`,ref:e},this[e])},onBlur(e){this.isFocused=!1,e&&this.$nextTick((()=>this.$emit("blur",e)))},onClick(){this.isFocused||this.isDisabled||!this.$refs.input||this.$refs.input.focus()},onFocus(e){if(!this.$refs.input)return;const t=(0,v.e)(this.$el);return t?t.activeElement!==this.$refs.input?this.$refs.input.focus():void(this.isFocused||(this.isFocused=!0,e&&this.$emit("focus",e))):void 0},onInput(e){const t=e.target;this.internalValue=t.value,this.badInput=t.validity&&t.validity.badInput},onKeyDown(e){e.keyCode===m.Do.enter&&this.lazyValue!==this.initialValue&&(this.initialValue=this.lazyValue,this.$emit("change",this.initialValue)),this.$emit("keydown",e)},onMouseDown(e){e.target!==this.$refs.input&&(e.preventDefault(),e.stopPropagation()),s.Z.options.methods.onMouseDown.call(this,e)},onMouseUp(e){this.hasMouseDown&&this.focus(),s.Z.options.methods.onMouseUp.call(this,e)},setLabelWidth(){this.outlined&&(this.labelWidth=this.$refs.label?Math.min(.75*this.$refs.label.scrollWidth+6,this.$el.offsetWidth-24):0)},setPrefixWidth(){this.$refs.prefix&&(this.prefixWidth=this.$refs.prefix.offsetWidth)},setPrependWidth(){this.outlined&&this.$refs["prepend-inner"]&&(this.prependWidth=this.$refs["prepend-inner"].offsetWidth)},tryAutofocus(){if(!this.autofocus||"undefined"==typeof document||!this.$refs.input)return!1;const e=(0,v.e)(this.$el);return!(!e||e.activeElement===this.$refs.input||(this.$refs.input.focus(),0))},updateValue(e){this.hasColor=e,e?this.initialValue=this.lazyValue:this.initialValue!==this.lazyValue&&this.$emit("change",this.lazyValue)},onResize(){this.setLabelWidth(),this.setPrefixWidth(),this.setPrependWidth()}}})},2727:(e,t,i)=>{i.d(t,{q:()=>r,x:()=>l});var s=i(2138);function n(e=[],...t){return Array().concat(e,...t)}function r(e,t="top center 0",i){return{name:e,functional:!0,props:{group:{type:Boolean,default:!1},hideOnLeave:{type:Boolean,default:!1},leaveAbsolute:{type:Boolean,default:!1},mode:{type:String,default:i},origin:{type:String,default:t}},render(t,i){const r="transition"+(i.props.group?"-group":""),l={props:{name:e,mode:i.props.mode},on:{beforeEnter(e){e.style.transformOrigin=i.props.origin,e.style.webkitTransformOrigin=i.props.origin}}};return i.props.leaveAbsolute&&(l.on.leave=n(l.on.leave,(e=>{const{offsetTop:t,offsetLeft:i,offsetWidth:s,offsetHeight:n}=e;e._transitionInitialStyles={position:e.style.position,top:e.style.top,left:e.style.left,width:e.style.width,height:e.style.height},e.style.position="absolute",e.style.top=t+"px",e.style.left=i+"px",e.style.width=s+"px",e.style.height=n+"px"})),l.on.afterLeave=n(l.on.afterLeave,(e=>{if(e&&e._transitionInitialStyles){const{position:t,top:i,left:s,width:n,height:r}=e._transitionInitialStyles;delete e._transitionInitialStyles,e.style.position=t||"",e.style.top=i||"",e.style.left=s||"",e.style.width=n||"",e.style.height=r||""}}))),i.props.hideOnLeave&&(l.on.leave=n(l.on.leave,(e=>{e._initialDisplay=[e.style.display,e.style.getPropertyPriority("display")],e.style.setProperty("display","none","important")})),l.on.afterLeave=n(l.on.afterLeave,(e=>{e&&(e._initialDisplay?e.style.setProperty("display",...e._initialDisplay):e.style.removeProperty("display"))}))),t(r,(0,s.ZP)(i.data,l),i.children)}}}function l(e,t,i="in-out"){return{name:e,functional:!0,props:{mode:{type:String,default:i}},render:(i,n)=>i("transition",(0,s.ZP)(n.data,{props:{name:e},on:t}),n.children)}}},4240:(e,t,i)=>{i.d(t,{Z:()=>n});var s=i(2377);function n(e="",t=!1){const i=t?"width":"height",n=`offset${(0,s.jC)(i)}`;return{beforeEnter(e){e._parent=e.parentNode,e._initialStyle={transition:e.style.transition,overflow:e.style.overflow,[i]:e.style[i]}},enter(t){const s=t._initialStyle;t.style.setProperty("transition","none","important"),t.style.overflow="hidden";const r=`${t[n]}px`;t.style[i]="0",t.offsetHeight,t.style.transition=s.transition,e&&t._parent&&t._parent.classList.add(e),requestAnimationFrame((()=>{t.style[i]=r}))},afterEnter:l,enterCancelled:l,leave(e){e._initialStyle={transition:"",overflow:e.style.overflow,[i]:e.style[i]},e.style.overflow="hidden",e.style[i]=`${e[n]}px`,e.offsetHeight,requestAnimationFrame((()=>e.style[i]="0"))},afterLeave:r,leaveCancelled:r};function r(t){e&&t._parent&&t._parent.classList.remove(e),l(t)}function l(e){const t=e._initialStyle[i];e.style.overflow=e._initialStyle.overflow,null!=t&&(e.style[i]=t),delete e._initialStyle}}},3777:(e,t,i)=>{function s(e){e._observe&&(e._observe.observer.unobserve(e),delete e._observe)}i.d(t,{Z:()=>n});const n={inserted:function(e,t){if("undefined"==typeof window||!("IntersectionObserver"in window))return;const i=t.modifiers||{},n=t.value,{handler:r,options:l}="object"==typeof n?n:{handler:n,options:{}},o=new IntersectionObserver(((t=[],n)=>{if(!e._observe)return;const l=t.some((e=>e.isIntersecting));!r||i.quiet&&!e._observe.init||i.once&&!l&&e._observe.init||r(t,n,l),l&&i.once?s(e):e._observe.init=!0}),l);e._observe={init:!1,observer:o},o.observe(e)},unbind:s}},8316:(e,t,i)=>{i.d(t,{Z:()=>s});const s=i(5803).Z.extend({name:"elevatable",props:{elevation:[Number,String]},computed:{computedElevation(){return this.elevation},elevationClasses(){const e=this.computedElevation;return null==e||isNaN(parseInt(e))?{}:{[`elevation-${this.elevation}`]:!0}}}})},3614:(e,t,i)=>{i.d(t,{Z:()=>c});var s=i(5803),n=i(1058),r=i(3777),l=i(1954),o=i(2027),a=i(312),h=i(9405),d=i(2377);const u=(0,i(6248).Z)(l.Z,(0,o.d)(["absolute","fixed","top","bottom"]),a.Z,h.Z).extend({name:"v-progress-linear",directives:{intersect:r.Z},props:{active:{type:Boolean,default:!0},backgroundColor:{type:String,default:null},backgroundOpacity:{type:[Number,String],default:null},bufferValue:{type:[Number,String],default:100},color:{type:String,default:"primary"},height:{type:[Number,String],default:4},indeterminate:Boolean,query:Boolean,reverse:Boolean,rounded:Boolean,stream:Boolean,striped:Boolean,value:{type:[Number,String],default:0}},data(){return{internalLazyValue:this.value||0,isVisible:!0}},computed:{__cachedBackground(){return this.$createElement("div",this.setBackgroundColor(this.backgroundColor||this.color,{staticClass:"v-progress-linear__background",style:this.backgroundStyle}))},__cachedBar(){return this.$createElement(this.computedTransition,[this.__cachedBarType])},__cachedBarType(){return this.indeterminate?this.__cachedIndeterminate:this.__cachedDeterminate},__cachedBuffer(){return this.$createElement("div",{staticClass:"v-progress-linear__buffer",style:this.styles})},__cachedDeterminate(){return this.$createElement("div",this.setBackgroundColor(this.color,{staticClass:"v-progress-linear__determinate",style:{width:(0,d.kb)(this.normalizedValue,"%")}}))},__cachedIndeterminate(){return this.$createElement("div",{staticClass:"v-progress-linear__indeterminate",class:{"v-progress-linear__indeterminate--active":this.active}},[this.genProgressBar("long"),this.genProgressBar("short")])},__cachedStream(){return this.stream?this.$createElement("div",this.setTextColor(this.color,{staticClass:"v-progress-linear__stream",style:{width:(0,d.kb)(100-this.normalizedBuffer,"%")}})):null},backgroundStyle(){return{opacity:null==this.backgroundOpacity?this.backgroundColor?1:.3:parseFloat(this.backgroundOpacity),[this.isReversed?"right":"left"]:(0,d.kb)(this.normalizedValue,"%"),width:(0,d.kb)(Math.max(0,this.normalizedBuffer-this.normalizedValue),"%")}},classes(){return{"v-progress-linear--absolute":this.absolute,"v-progress-linear--fixed":this.fixed,"v-progress-linear--query":this.query,"v-progress-linear--reactive":this.reactive,"v-progress-linear--reverse":this.isReversed,"v-progress-linear--rounded":this.rounded,"v-progress-linear--striped":this.striped,"v-progress-linear--visible":this.isVisible,...this.themeClasses}},computedTransition(){return this.indeterminate?n.Z5:n.Qn},isReversed(){return this.$vuetify.rtl!==this.reverse},normalizedBuffer(){return this.normalize(this.bufferValue)},normalizedValue(){return this.normalize(this.internalLazyValue)},reactive(){return Boolean(this.$listeners.change)},styles(){const e={};return this.active||(e.height=0),this.indeterminate||100===parseFloat(this.normalizedBuffer)||(e.width=(0,d.kb)(this.normalizedBuffer,"%")),e}},methods:{genContent(){const e=(0,d.z9)(this,"default",{value:this.internalLazyValue});return e?this.$createElement("div",{staticClass:"v-progress-linear__content"},e):null},genListeners(){const e=this.$listeners;return this.reactive&&(e.click=this.onClick),e},genProgressBar(e){return this.$createElement("div",this.setBackgroundColor(this.color,{staticClass:"v-progress-linear__indeterminate",class:{[e]:!0}}))},onClick(e){if(!this.reactive)return;const{width:t}=this.$el.getBoundingClientRect();this.internalValue=e.offsetX/t*100},onObserve(e,t,i){this.isVisible=i},normalize:e=>e<0?0:e>100?100:parseFloat(e)},render(e){return e("div",{staticClass:"v-progress-linear",attrs:{role:"progressbar","aria-valuemin":0,"aria-valuemax":this.normalizedBuffer,"aria-valuenow":this.indeterminate?void 0:this.normalizedValue},class:this.classes,directives:[{name:"intersect",value:this.onObserve}],style:{bottom:this.bottom?0:void 0,height:this.active?(0,d.kb)(this.height):0,top:this.top?0:void 0},on:this.genListeners()},[this.__cachedStream,this.__cachedBackground,this.__cachedBuffer,this.__cachedBar,this.genContent()])}}),c=s.Z.extend().extend({name:"loadable",props:{loading:{type:[Boolean,String],default:!1},loaderHeight:{type:[Number,String],default:2}},methods:{genProgress(){return!1===this.loading?null:this.$slots.progress||this.$createElement(u,{props:{absolute:!0,color:!0===this.loading||""===this.loading?this.color||"primary":this.loading,height:this.loaderHeight,indeterminate:!0}})}}})},2895:(e,t,i)=>{i.d(t,{Z:()=>n});var s=i(2377);const n=i(5803).Z.extend({name:"measurable",props:{height:[Number,String],maxHeight:[Number,String],maxWidth:[Number,String],minHeight:[Number,String],minWidth:[Number,String],width:[Number,String]},computed:{measurableStyles(){const e={},t=(0,s.kb)(this.height),i=(0,s.kb)(this.minHeight),n=(0,s.kb)(this.minWidth),r=(0,s.kb)(this.maxHeight),l=(0,s.kb)(this.maxWidth),o=(0,s.kb)(this.width);return t&&(e.height=t),i&&(e.minHeight=i),n&&(e.minWidth=n),r&&(e.maxHeight=r),l&&(e.maxWidth=l),o&&(e.width=o),e}}})},312:(e,t,i)=>{i.d(t,{Z:()=>n});var s=i(5803);const n=function(e="value",t="change"){return s.Z.extend({name:"proxyable",model:{prop:e,event:t},props:{[e]:{required:!1}},data(){return{internalLazyValue:this[e]}},computed:{internalValue:{get(){return this.internalLazyValue},set(e){e!==this.internalLazyValue&&(this.internalLazyValue=e,this.$emit(t,e))}}},watch:{[e](e){this.internalLazyValue=e}}})}()},9657:(e,t,i)=>{i.d(t,{Z:()=>l});var s=i(5803),n=i(7202),r=i(2377);const l=s.Z.extend({name:"routable",directives:{Ripple:n.Z},props:{activeClass:String,append:Boolean,disabled:Boolean,exact:{type:Boolean,default:void 0},exactPath:Boolean,exactActiveClass:String,link:Boolean,href:[String,Object],to:[String,Object],nuxt:Boolean,replace:Boolean,ripple:{type:[Boolean,Object],default:null},tag:String,target:String},data:()=>({isActive:!1,proxyClass:""}),computed:{classes(){const e={};return this.to||(this.activeClass&&(e[this.activeClass]=this.isActive),this.proxyClass&&(e[this.proxyClass]=this.isActive)),e},computedRipple(){var e;return null!=(e=this.ripple)?e:!this.disabled&&this.isClickable},isClickable(){return!this.disabled&&Boolean(this.isLink||this.$listeners.click||this.$listeners["!click"]||this.$attrs.tabindex)},isLink(){return this.to||this.href||this.link},styles:()=>({})},watch:{$route:"onRouteChange"},methods:{click(e){this.$emit("click",e)},generateRouteLink(){let e,t=this.exact;const i={attrs:{tabindex:"tabindex"in this.$attrs?this.$attrs.tabindex:void 0},class:this.classes,style:this.styles,props:{},directives:[{name:"ripple",value:this.computedRipple}],[this.to?"nativeOn":"on"]:{...this.$listeners,click:this.click},ref:"link"};if(void 0===this.exact&&(t="/"===this.to||this.to===Object(this.to)&&"/"===this.to.path),this.to){let s=this.activeClass,n=this.exactActiveClass||s;this.proxyClass&&(s=`${s} ${this.proxyClass}`.trim(),n=`${n} ${this.proxyClass}`.trim()),e=this.nuxt?"nuxt-link":"router-link",Object.assign(i.props,{to:this.to,exact:t,exactPath:this.exactPath,activeClass:s,exactActiveClass:n,append:this.append,replace:this.replace})}else e=(this.href?"a":this.tag)||"div","a"===e&&this.href&&(i.attrs.href=this.href);return this.target&&(i.attrs.target=this.target),{tag:e,data:i}},onRouteChange(){if(!this.to||!this.$refs.link||!this.$route)return;const e=`_vnode.data.class.${`${this.activeClass} ${this.proxyClass||""}`.trim()}`;this.$nextTick((()=>{(0,r.vO)(this.$refs.link,e)&&this.toggle()}))},toggle:()=>{}}})},714:(e,t,i)=>{function s(e){if("function"!=typeof e.getRootNode){for(;e.parentNode;)e=e.parentNode;return e!==document?null:document}const t=e.getRootNode();return t!==document&&t.getRootNode({composed:!0})!==document?null:t}i.d(t,{e:()=>s})}}]);