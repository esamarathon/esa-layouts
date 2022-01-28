/*! For license information please see countdown-control.js.LICENSE.txt */
(()=>{var t,e={3210:(t,e,i)=>{"use strict";var n=i(5803);function s(t){return s="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(t){return typeof t}:function(t){return t&&"function"==typeof Symbol&&t.constructor===Symbol&&t!==Symbol.prototype?"symbol":typeof t},s(t)}function r(t,e,i){return e in t?Object.defineProperty(t,e,{value:i,enumerable:!0,configurable:!0,writable:!0}):t[e]=i,t}function o(){return"undefined"!=typeof Reflect&&Reflect.defineMetadata&&Reflect.getOwnMetadataKeys}function l(t,e){a(t,e),Object.getOwnPropertyNames(e.prototype).forEach((function(i){a(t.prototype,e.prototype,i)})),Object.getOwnPropertyNames(e).forEach((function(i){a(t,e,i)}))}function a(t,e,i){(i?Reflect.getOwnMetadataKeys(e,i):Reflect.getOwnMetadataKeys(e)).forEach((function(n){var s=i?Reflect.getOwnMetadata(n,e,i):Reflect.getOwnMetadata(n,e);i?Reflect.defineMetadata(n,s,t,i):Reflect.defineMetadata(n,s,t)}))}var u={__proto__:[]}instanceof Array;function c(t,e){var i=e.prototype._init;e.prototype._init=function(){var e=this,i=Object.getOwnPropertyNames(t);if(t.$options.props)for(var n in t.$options.props)t.hasOwnProperty(n)||i.push(n);i.forEach((function(i){Object.defineProperty(e,i,{get:function(){return t[i]},set:function(e){t[i]=e},configurable:!0})}))};var n=new e;e.prototype._init=i;var s={};return Object.keys(n).forEach((function(t){void 0!==n[t]&&(s[t]=n[t])})),s}var h=["data","beforeCreate","created","beforeMount","mounted","beforeDestroy","destroyed","beforeUpdate","updated","activated","deactivated","render","errorCaptured","serverPrefetch"];function d(t){var e=arguments.length>1&&void 0!==arguments[1]?arguments[1]:{};e.name=e.name||t._componentTag||t.name;var i=t.prototype;Object.getOwnPropertyNames(i).forEach((function(t){if("constructor"!==t)if(h.indexOf(t)>-1)e[t]=i[t];else{var n=Object.getOwnPropertyDescriptor(i,t);void 0!==n.value?"function"==typeof n.value?(e.methods||(e.methods={}))[t]=n.value:(e.mixins||(e.mixins=[])).push({data:function(){return r({},t,n.value)}}):(n.get||n.set)&&((e.computed||(e.computed={}))[t]={get:n.get,set:n.set})}})),(e.mixins||(e.mixins=[])).push({data:function(){return c(this,t)}});var s=t.__decorators__;s&&(s.forEach((function(t){return t(e)})),delete t.__decorators__);var a=Object.getPrototypeOf(t.prototype),u=a instanceof n.Z?a.constructor:n.Z,d=u.extend(e);return m(d,t,u),o()&&l(d,t),d}var p={prototype:!0,arguments:!0,callee:!0,caller:!0};function m(t,e,i){Object.getOwnPropertyNames(e).forEach((function(n){if(!p[n]){var r=Object.getOwnPropertyDescriptor(t,n);if(!r||r.configurable){var o,l,a=Object.getOwnPropertyDescriptor(e,n);if(!u){if("cid"===n)return;var c=Object.getOwnPropertyDescriptor(i,n);if(l=s(o=a.value),null!=o&&("object"===l||"function"===l)&&c&&c.value===a.value)return}Object.defineProperty(t,n,a)}}}))}function f(t){return"function"==typeof t?d(t):function(e){return d(e,t)}}f.registerHooks=function(t){var e;h.push.apply(h,function(t){if(Array.isArray(t)){for(var e=0,i=new Array(t.length);e<t.length;e++)i[e]=t[e];return i}}(e=t)||function(t){if(Symbol.iterator in Object(t)||"[object Arguments]"===Object.prototype.toString.call(t))return Array.from(t)}(e)||function(){throw new TypeError("Invalid attempt to spread non-iterable instance")}())};const g=f;i(4807),i(7023),i(5654),i(779),i(8793);var v=i(9299),y=i.n(v);function b(t){return t.toString().padStart(2,"0")}let w=class extends n.Z{constructor(){super(...arguments),this.countdown=null,this.entry=""}get currentCountdown(){var t,e;return function(t){const e=Math.floor(t/1e3%60),i=Math.floor(t/6e4%60);return`${b(Math.floor(t/36e5))}:${b(i)}:${b(e)}`}(1e3*Math.round((null!==(e=null===(t=this.countdown)||void 0===t?void 0:t.remaining)&&void 0!==e?e:0)/1e3))}change(){nodecg.sendMessage("startCountdown",this.entry),this.entry=""}created(){nodecg.Replicant("countdown").on("change",(t=>{n.Z.set(this,"countdown",y()(t))}))}};w=function(t,e,i,n){var s,r=arguments.length,o=r<3?e:null===n?n=Object.getOwnPropertyDescriptor(e,i):n;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)o=Reflect.decorate(t,e,i,n);else for(var l=t.length-1;l>=0;l--)(s=t[l])&&(o=(r<3?s(o):r>3?s(e,i,o):s(e,i))||o);return r>3&&o&&Object.defineProperty(e,i,o),o}([g],w);const k=w;var M=i(5440),P=i(7618),_=i.n(P),S=i(1883),O=i(6255),C=i(1954),$=i(6248),A=i(2377);const x=(0,$.Z)(C.Z).extend({methods:{genPickerButton(t,e,i,n=!1,s=""){const r=this[t]===e;return this.$createElement("div",{staticClass:`v-picker__title__btn ${s}`.trim(),class:{"v-picker__title__btn--active":r,"v-picker__title__btn--readonly":n},on:r||n?void 0:{click:i=>{i.stopPropagation(),this.$emit(`update:${(0,A.GL)(t)}`,e)}}},Array.isArray(i)?i:[i])}}}),j=(t,e=2)=>{return i=t,n=e,s="0",n>>=0,i=String(i),s=String(s),i.length>n?String(i):((n-=i.length)>s.length&&(s+=s.repeat(n/s.length)),s.slice(0,n)+String(i));var i,n,s};var H;!function(t){t[t.Hour=1]="Hour",t[t.Minute=2]="Minute",t[t.Second=3]="Second"}(H||(H={}));const D=(0,$.Z)(x).extend({name:"v-time-picker-title",props:{ampm:Boolean,ampmReadonly:Boolean,disabled:Boolean,hour:Number,minute:Number,second:Number,period:{type:String,validator:t=>"am"===t||"pm"===t},readonly:Boolean,useSeconds:Boolean,selecting:Number},methods:{genTime(){let t=this.hour;this.ampm&&(t=t?(t-1)%12+1:12);const e=null==this.hour?"--":this.ampm?String(t):j(t),i=null==this.minute?"--":j(this.minute),n=[this.genPickerButton("selecting",H.Hour,e,this.disabled),this.$createElement("span",":"),this.genPickerButton("selecting",H.Minute,i,this.disabled)];if(this.useSeconds){const t=null==this.second?"--":j(this.second);n.push(this.$createElement("span",":")),n.push(this.genPickerButton("selecting",H.Second,t,this.disabled))}return this.$createElement("div",{class:"v-time-picker-title__time"},n)},genAmPm(){return this.$createElement("div",{staticClass:"v-time-picker-title__ampm",class:{"v-time-picker-title__ampm--readonly":this.ampmReadonly}},[this.ampmReadonly&&"am"!==this.period?null:this.genPickerButton("period","am",this.$vuetify.lang.t("$vuetify.timePicker.am"),this.disabled||this.readonly),this.ampmReadonly&&"pm"!==this.period?null:this.genPickerButton("period","pm",this.$vuetify.lang.t("$vuetify.timePicker.pm"),this.disabled||this.readonly)])}},render(t){const e=[this.genTime()];return this.ampm&&e.push(this.genAmPm()),t("div",{staticClass:"v-time-picker-title"},e)}});var B=i(9405);const T=(0,$.Z)(C.Z,B.Z).extend({name:"v-time-picker-clock",props:{allowedValues:Function,ampm:Boolean,disabled:Boolean,double:Boolean,format:{type:Function,default:t=>t},max:{type:Number,required:!0},min:{type:Number,required:!0},scrollable:Boolean,readonly:Boolean,rotate:{type:Number,default:0},step:{type:Number,default:1},value:Number},data(){return{inputValue:this.value,isDragging:!1,valueOnMouseDown:null,valueOnMouseUp:null}},computed:{count(){return this.max-this.min+1},degreesPerUnit(){return 360/this.roundCount},degrees(){return this.degreesPerUnit*Math.PI/180},displayedValue(){return null==this.value?this.min:this.value},innerRadiusScale:()=>.62,roundCount(){return this.double?this.count/2:this.count}},watch:{value(t){this.inputValue=t}},methods:{wheel(t){t.preventDefault();const e=Math.sign(-t.deltaY||1);let i=this.displayedValue;do{i+=e,i=(i-this.min+this.count)%this.count+this.min}while(!this.isAllowed(i)&&i!==this.displayedValue);i!==this.displayedValue&&this.update(i)},isInner(t){return this.double&&t-this.min>=this.roundCount},handScale(t){return this.isInner(t)?this.innerRadiusScale:1},isAllowed(t){return!this.allowedValues||this.allowedValues(t)},genValues(){const t=[];for(let e=this.min;e<=this.max;e+=this.step){const i=e===this.value&&(this.color||"accent");t.push(this.$createElement("span",this.setBackgroundColor(i,{staticClass:"v-time-picker-clock__item",class:{"v-time-picker-clock__item--active":e===this.displayedValue,"v-time-picker-clock__item--disabled":this.disabled||!this.isAllowed(e)},style:this.getTransform(e),domProps:{innerHTML:`<span>${this.format(e)}</span>`}})))}return t},genHand(){const t=`scaleY(${this.handScale(this.displayedValue)})`,e=this.rotate+this.degreesPerUnit*(this.displayedValue-this.min),i=null!=this.value&&(this.color||"accent");return this.$createElement("div",this.setBackgroundColor(i,{staticClass:"v-time-picker-clock__hand",class:{"v-time-picker-clock__hand--inner":this.isInner(this.value)},style:{transform:`rotate(${e}deg) ${t}`}}))},getTransform(t){const{x:e,y:i}=this.getPosition(t);return{left:50+50*e+"%",top:50+50*i+"%"}},getPosition(t){const e=this.rotate*Math.PI/180;return{x:Math.sin((t-this.min)*this.degrees+e)*this.handScale(t),y:-Math.cos((t-this.min)*this.degrees+e)*this.handScale(t)}},onMouseDown(t){t.preventDefault(),this.valueOnMouseDown=null,this.valueOnMouseUp=null,this.isDragging=!0,this.onDragMove(t)},onMouseUp(t){t.stopPropagation(),this.isDragging=!1,null!==this.valueOnMouseUp&&this.isAllowed(this.valueOnMouseUp)&&this.$emit("change",this.valueOnMouseUp)},onDragMove(t){if(t.preventDefault(),!this.isDragging&&"click"!==t.type||!this.$refs.clock)return;const{width:e,top:i,left:n}=this.$refs.clock.getBoundingClientRect(),{width:s}=this.$refs.innerClock.getBoundingClientRect(),{clientX:r,clientY:o}="touches"in t?t.touches[0]:t,l={x:e/2,y:-e/2},a={x:r-n,y:i-o},u=Math.round(this.angle(l,a)-this.rotate+360)%360,c=this.double&&this.euclidean(l,a)<(s+s*this.innerRadiusScale)/4,h=Math.ceil(15/this.degreesPerUnit);let d;for(let t=0;t<h;t++){if(d=this.angleToValue(u+t*this.degreesPerUnit,c),this.isAllowed(d))return this.setMouseDownValue(d);if(d=this.angleToValue(u-t*this.degreesPerUnit,c),this.isAllowed(d))return this.setMouseDownValue(d)}},angleToValue(t,e){const i=(Math.round(t/this.degreesPerUnit)+(e?this.roundCount:0))%this.count+this.min;return t<360-this.degreesPerUnit/2?i:e?this.max-this.roundCount+1:this.min},setMouseDownValue(t){null===this.valueOnMouseDown&&(this.valueOnMouseDown=t),this.valueOnMouseUp=t,this.update(t)},update(t){this.inputValue!==t&&(this.inputValue=t,this.$emit("input",t))},euclidean(t,e){const i=e.x-t.x,n=e.y-t.y;return Math.sqrt(i*i+n*n)},angle(t,e){const i=2*Math.atan2(e.y-t.y-this.euclidean(t,e),e.x-t.x);return Math.abs(180*i/Math.PI)}},render(t){const e={staticClass:"v-time-picker-clock",class:{"v-time-picker-clock--indeterminate":null==this.value,...this.themeClasses},on:this.readonly||this.disabled?void 0:{mousedown:this.onMouseDown,mouseup:this.onMouseUp,mouseleave:t=>this.isDragging&&this.onMouseUp(t),touchstart:this.onMouseDown,touchend:this.onMouseUp,mousemove:this.onDragMove,touchmove:this.onDragMove},ref:"clock"};return this.scrollable&&e.on&&(e.on.wheel=this.wheel),t("div",e,[t("div",{staticClass:"v-time-picker-clock__inner",ref:"innerClock"},[this.genHand(),this.genValues()])])}});var E=i(8316);const I=(0,$.Z)(C.Z,E.Z,B.Z).extend({name:"v-picker",props:{flat:Boolean,fullWidth:Boolean,landscape:Boolean,noTitle:Boolean,transition:{type:String,default:"fade-transition"},width:{type:[Number,String],default:290}},computed:{computedTitleColor(){const t=!this.isDark&&(this.color||"primary");return this.color||t}},methods:{genTitle(){return this.$createElement("div",this.setBackgroundColor(this.computedTitleColor,{staticClass:"v-picker__title",class:{"v-picker__title--landscape":this.landscape}}),this.$slots.title)},genBodyTransition(){return this.$createElement("transition",{props:{name:this.transition}},this.$slots.default)},genBody(){return this.$createElement("div",{staticClass:"v-picker__body",class:{"v-picker__body--no-title":this.noTitle,...this.themeClasses},style:this.fullWidth?void 0:{width:(0,A.kb)(this.width)}},[this.genBodyTransition()])},genActions(){return this.$createElement("div",{staticClass:"v-picker__actions v-card__actions",class:{"v-picker__actions--no-title":this.noTitle}},this.$slots.actions)}},render(t){return t("div",{staticClass:"v-picker v-card",class:{"v-picker--flat":this.flat,"v-picker--landscape":this.landscape,"v-picker--full-width":this.fullWidth,...this.themeClasses,...this.elevationClasses}},[this.$slots.title?this.genTitle():null,this.genBody(),this.$slots.actions?this.genActions():null])}}),V=(0,$.Z)(C.Z,E.Z,B.Z).extend({name:"picker",props:{flat:Boolean,fullWidth:Boolean,headerColor:String,landscape:Boolean,noTitle:Boolean,width:{type:[Number,String],default:290}},methods:{genPickerTitle:()=>null,genPickerBody:()=>null,genPickerActionsSlot(){return this.$scopedSlots.default?this.$scopedSlots.default({save:this.save,cancel:this.cancel}):this.$slots.default},genPicker(t){const e=[];if(!this.noTitle){const t=this.genPickerTitle();t&&e.push(t)}const i=this.genPickerBody();return i&&e.push(i),e.push(this.$createElement("template",{slot:"actions"},[this.genPickerActionsSlot()])),this.$createElement(I,{staticClass:t,props:{color:this.headerColor||this.color,dark:this.dark,elevation:this.elevation,flat:this.flat,fullWidth:this.fullWidth,landscape:this.landscape,light:this.light,width:this.width,noTitle:this.noTitle}},e)}}}),R=(0,A.MT)(24),Z=(0,A.MT)(12),N=Z.map((t=>t+12)),U=(0,A.MT)(60),z={1:"hour",2:"minute",3:"second"},L=(0,$.Z)(V,x).extend({name:"v-time-picker",props:{allowedHours:[Function,Array],allowedMinutes:[Function,Array],allowedSeconds:[Function,Array],disabled:Boolean,format:{type:String,default:"ampm",validator:t=>["ampm","24hr"].includes(t)},min:String,max:String,readonly:Boolean,scrollable:Boolean,useSeconds:Boolean,value:null,ampmInTitle:Boolean},data:()=>({inputHour:null,inputMinute:null,inputSecond:null,lazyInputHour:null,lazyInputMinute:null,lazyInputSecond:null,period:"am",selecting:H.Hour}),computed:{selectingHour:{get(){return this.selecting===H.Hour},set(t){this.selecting=H.Hour}},selectingMinute:{get(){return this.selecting===H.Minute},set(t){this.selecting=H.Minute}},selectingSecond:{get(){return this.selecting===H.Second},set(t){this.selecting=H.Second}},isAllowedHourCb(){let t;if(t=this.allowedHours instanceof Array?t=>this.allowedHours.includes(t):this.allowedHours,!this.min&&!this.max)return t;const e=this.min?Number(this.min.split(":")[0]):0,i=this.max?Number(this.max.split(":")[0]):23;return n=>n>=1*e&&n<=1*i&&(!t||t(n))},isAllowedMinuteCb(){let t;const e=!this.isAllowedHourCb||null===this.inputHour||this.isAllowedHourCb(this.inputHour);if(t=this.allowedMinutes instanceof Array?t=>this.allowedMinutes.includes(t):this.allowedMinutes,!this.min&&!this.max)return e?t:()=>!1;const[i,n]=this.min?this.min.split(":").map(Number):[0,0],[s,r]=this.max?this.max.split(":").map(Number):[23,59],o=60*i+1*n,l=60*s+1*r;return i=>{const n=60*this.inputHour+i;return n>=o&&n<=l&&e&&(!t||t(i))}},isAllowedSecondCb(){let t;const e=(!this.isAllowedHourCb||null===this.inputHour||this.isAllowedHourCb(this.inputHour))&&(!this.isAllowedMinuteCb||null===this.inputMinute||this.isAllowedMinuteCb(this.inputMinute));if(t=this.allowedSeconds instanceof Array?t=>this.allowedSeconds.includes(t):this.allowedSeconds,!this.min&&!this.max)return e?t:()=>!1;const[i,n,s]=this.min?this.min.split(":").map(Number):[0,0,0],[r,o,l]=this.max?this.max.split(":").map(Number):[23,59,59],a=3600*i+60*n+1*(s||0),u=3600*r+60*o+1*(l||0);return i=>{const n=3600*this.inputHour+60*this.inputMinute+i;return n>=a&&n<=u&&e&&(!t||t(i))}},isAmPm(){return"ampm"===this.format}},watch:{value:"setInputData"},mounted(){this.setInputData(this.value),this.$on("update:period",this.setPeriod)},methods:{genValue(){return null==this.inputHour||null==this.inputMinute||this.useSeconds&&null==this.inputSecond?null:`${j(this.inputHour)}:${j(this.inputMinute)}`+(this.useSeconds?`:${j(this.inputSecond)}`:"")},emitValue(){const t=this.genValue();null!==t&&this.$emit("input",t)},setPeriod(t){if(this.period=t,null!=this.inputHour){const e=this.inputHour+("am"===t?-12:12);this.inputHour=this.firstAllowed("hour",e),this.emitValue()}},setInputData(t){if(null==t||""===t)this.inputHour=null,this.inputMinute=null,this.inputSecond=null;else if(t instanceof Date)this.inputHour=t.getHours(),this.inputMinute=t.getMinutes(),this.inputSecond=t.getSeconds();else{const[,e,i,,n,s]=t.trim().toLowerCase().match(/^(\d+):(\d+)(:(\d+))?([ap]m)?$/)||new Array(6);this.inputHour=s?this.convert12to24(parseInt(e,10),s):parseInt(e,10),this.inputMinute=parseInt(i,10),this.inputSecond=parseInt(n||0,10)}this.period=null==this.inputHour||this.inputHour<12?"am":"pm"},convert24to12:t=>t?(t-1)%12+1:12,convert12to24:(t,e)=>t%12+("pm"===e?12:0),onInput(t){this.selecting===H.Hour?this.inputHour=this.isAmPm?this.convert12to24(t,this.period):t:this.selecting===H.Minute?this.inputMinute=t:this.inputSecond=t,this.emitValue()},onChange(t){this.$emit(`click:${z[this.selecting]}`,t);const e=this.selecting===(this.useSeconds?H.Second:H.Minute);if(this.selecting===H.Hour?this.selecting=H.Minute:this.useSeconds&&this.selecting===H.Minute&&(this.selecting=H.Second),this.inputHour===this.lazyInputHour&&this.inputMinute===this.lazyInputMinute&&(!this.useSeconds||this.inputSecond===this.lazyInputSecond))return;const i=this.genValue();null!==i&&(this.lazyInputHour=this.inputHour,this.lazyInputMinute=this.inputMinute,this.useSeconds&&(this.lazyInputSecond=this.inputSecond),e&&this.$emit("change",i))},firstAllowed(t,e){const i="hour"===t?this.isAllowedHourCb:"minute"===t?this.isAllowedMinuteCb:this.isAllowedSecondCb;if(!i)return e;const n="minute"===t||"second"===t?U:this.isAmPm?e<12?Z:N:R;return((n.find((t=>i((t+e)%n.length+n[0])))||0)+e)%n.length+n[0]},genClock(){return this.$createElement(T,{props:{allowedValues:this.selecting===H.Hour?this.isAllowedHourCb:this.selecting===H.Minute?this.isAllowedMinuteCb:this.isAllowedSecondCb,color:this.color,dark:this.dark,disabled:this.disabled,double:this.selecting===H.Hour&&!this.isAmPm,format:this.selecting===H.Hour?this.isAmPm?this.convert24to12:t=>t:t=>j(t,2),light:this.light,max:this.selecting===H.Hour?this.isAmPm&&"am"===this.period?11:23:59,min:this.selecting===H.Hour&&this.isAmPm&&"pm"===this.period?12:0,readonly:this.readonly,scrollable:this.scrollable,size:Number(this.width)-(!this.fullWidth&&this.landscape?80:20),step:this.selecting===H.Hour?1:5,value:this.selecting===H.Hour?this.inputHour:this.selecting===H.Minute?this.inputMinute:this.inputSecond},on:{input:this.onInput,change:this.onChange},ref:"clock"})},genClockAmPm(){return this.$createElement("div",this.setTextColor(this.color||"primary",{staticClass:"v-time-picker-clock__ampm"}),[this.genPickerButton("period","am",this.$vuetify.lang.t("$vuetify.timePicker.am"),this.disabled||this.readonly),this.genPickerButton("period","pm",this.$vuetify.lang.t("$vuetify.timePicker.pm"),this.disabled||this.readonly)])},genPickerBody(){return this.$createElement("div",{staticClass:"v-time-picker-clock__container",key:this.selecting},[!this.ampmInTitle&&this.isAmPm&&this.genClockAmPm(),this.genClock()])},genPickerTitle(){return this.$createElement(D,{props:{ampm:this.isAmPm,ampmReadonly:this.isAmPm&&!this.ampmInTitle,disabled:this.disabled,hour:this.inputHour,minute:this.inputMinute,second:this.inputSecond,period:this.period,readonly:this.readonly,useSeconds:this.useSeconds,selecting:this.selecting},on:{"update:selecting":t=>this.selecting=t,"update:period":t=>this.$emit("update:period",t)},ref:"title",slot:"title"})}},render(){return this.genPicker("v-picker--time")}});var F=(0,M.Z)(k,(function(){var t=this,e=t.$createElement,i=t._self._c||e;return i("v-app",[i("div",[t._v("\n    Current Countdown: "+t._s(t.currentCountdown)+"\n  ")]),t._v(" "),i("v-time-picker",{attrs:{format:"24hr","full-width":""},model:{value:t.entry,callback:function(e){t.entry=e},expression:"entry"}}),t._v(" "),i("v-btn",{on:{click:function(e){return t.change()}}},[t._v("\n    Apply\n  ")])],1)}),[],!1,null,null,null);const W=F.exports;_()(F,{VApp:S.Z,VBtn:O.Z,VTimePicker:L});const q=W;var K=i(9459);new n.Z({vuetify:K.Z,el:"#App",render:t=>t(q)})},779:(t,e,i)=>{"use strict";"undefined"!=typeof Reflect&&Reflect.getMetadata},9405:(t,e,i)=>{"use strict";i.d(e,{Z:()=>n});const n=i(5803).Z.extend().extend({name:"themeable",provide(){return{theme:this.themeableProvide}},inject:{theme:{default:{isDark:!1}}},props:{dark:{type:Boolean,default:null},light:{type:Boolean,default:null}},data:()=>({themeableProvide:{isDark:!1}}),computed:{appIsDark(){return this.$vuetify.theme.dark||!1},isDark(){return!0===this.dark||!0!==this.light&&this.theme.isDark},themeClasses(){return{"theme--dark":this.isDark,"theme--light":!this.isDark}},rootIsDark(){return!0===this.dark||!0!==this.light&&this.appIsDark},rootThemeClasses(){return{"theme--dark":this.rootIsDark,"theme--light":!this.rootIsDark}}},watch:{isDark:{handler(t,e){t!==e&&(this.themeableProvide.isDark=this.isDark)},immediate:!0}}})},9085:(t,e,i)=>{"use strict";i.d(e,{d:()=>s});var n=i(5803);function s(t="value",e="input"){return n.Z.extend({name:"toggleable",model:{prop:t,event:e},props:{[t]:{required:!1}},data(){return{isActive:!!this[t]}},watch:{[t](t){this.isActive=!!t},isActive(i){!!i!==this[t]&&this.$emit(e,i)}}})}s()},2377:(t,e,i)=>{"use strict";i.d(e,{qw:()=>s,vO:()=>r,MT:()=>o,ji:()=>l,kb:()=>a,GL:()=>u,Do:()=>h,XP:()=>d,uZ:()=>p,Ee:()=>m});let n=!1;try{if("undefined"!=typeof window){const t=Object.defineProperty({},"passive",{get:()=>{n=!0}});window.addEventListener("testListener",t,t),window.removeEventListener("testListener",t,t)}}catch(t){console.warn(t)}function s(t,e,i){const n=e.length-1;if(n<0)return void 0===t?i:t;for(let s=0;s<n;s++){if(null==t)return i;t=t[e[s]]}return null==t||void 0===t[e[n]]?i:t[e[n]]}function r(t,e,i){return null!=t&&e&&"string"==typeof e?void 0!==t[e]?t[e]:s(t,(e=(e=e.replace(/\[(\w+)\]/g,".$1")).replace(/^\./,"")).split("."),i):i}function o(t){return Array.from({length:t},((t,e)=>e))}function l(t,e){const i={};for(let n=0;n<e.length;n++){const s=e[n];void 0!==t[s]&&(i[s]=t[s])}return i}function a(t,e="px"){return null==t||""===t?void 0:isNaN(+t)?String(t):`${Number(t)}${e}`}function u(t){return(t||"").replace(/([a-z])([A-Z])/g,"$1-$2").toLowerCase()}function c(t){return null!==t&&"object"==typeof t}const h=Object.freeze({enter:13,tab:9,delete:46,esc:27,space:32,up:38,down:40,left:37,right:39,end:35,home:36,del:46,backspace:8,insert:45,pageup:33,pagedown:34,shift:16});function d(t){return Object.keys(t)}function p(t,e=0,i=1){return Math.max(e,Math.min(i,t))}function m(t={},e={}){for(const i in e){const n=t[i],s=e[i];c(n)&&c(s)?t[i]=m(n,s):t[i]=s}return t}},9299:t=>{var e=function(){"use strict";function t(t,e){return null!=e&&t instanceof e}var e,i,n;try{e=Map}catch(t){e=function(){}}try{i=Set}catch(t){i=function(){}}try{n=Promise}catch(t){n=function(){}}function s(r,l,a,u,c){"object"==typeof l&&(a=l.depth,u=l.prototype,c=l.includeNonEnumerable,l=l.circular);var h=[],d=[],p="undefined"!=typeof Buffer;return void 0===l&&(l=!0),void 0===a&&(a=1/0),function r(a,m){if(null===a)return null;if(0===m)return a;var f,g;if("object"!=typeof a)return a;if(t(a,e))f=new e;else if(t(a,i))f=new i;else if(t(a,n))f=new n((function(t,e){a.then((function(e){t(r(e,m-1))}),(function(t){e(r(t,m-1))}))}));else if(s.__isArray(a))f=[];else if(s.__isRegExp(a))f=new RegExp(a.source,o(a)),a.lastIndex&&(f.lastIndex=a.lastIndex);else if(s.__isDate(a))f=new Date(a.getTime());else{if(p&&Buffer.isBuffer(a))return f=Buffer.allocUnsafe?Buffer.allocUnsafe(a.length):new Buffer(a.length),a.copy(f),f;t(a,Error)?f=Object.create(a):void 0===u?(g=Object.getPrototypeOf(a),f=Object.create(g)):(f=Object.create(u),g=u)}if(l){var v=h.indexOf(a);if(-1!=v)return d[v];h.push(a),d.push(f)}for(var y in t(a,e)&&a.forEach((function(t,e){var i=r(e,m-1),n=r(t,m-1);f.set(i,n)})),t(a,i)&&a.forEach((function(t){var e=r(t,m-1);f.add(e)})),a){var b;g&&(b=Object.getOwnPropertyDescriptor(g,y)),b&&null==b.set||(f[y]=r(a[y],m-1))}if(Object.getOwnPropertySymbols){var w=Object.getOwnPropertySymbols(a);for(y=0;y<w.length;y++){var k=w[y];(!(P=Object.getOwnPropertyDescriptor(a,k))||P.enumerable||c)&&(f[k]=r(a[k],m-1),P.enumerable||Object.defineProperty(f,k,{enumerable:!1}))}}if(c){var M=Object.getOwnPropertyNames(a);for(y=0;y<M.length;y++){var P,_=M[y];(P=Object.getOwnPropertyDescriptor(a,_))&&P.enumerable||(f[_]=r(a[_],m-1),Object.defineProperty(f,_,{enumerable:!1}))}}return f}(r,a)}function r(t){return Object.prototype.toString.call(t)}function o(t){var e="";return t.global&&(e+="g"),t.ignoreCase&&(e+="i"),t.multiline&&(e+="m"),e}return s.clonePrototype=function(t){if(null===t)return null;var e=function(){};return e.prototype=t,new e},s.__objToStr=r,s.__isDate=function(t){return"object"==typeof t&&"[object Date]"===r(t)},s.__isArray=function(t){return"object"==typeof t&&"[object Array]"===r(t)},s.__isRegExp=function(t){return"object"==typeof t&&"[object RegExp]"===r(t)},s.__getRegExpFlags=o,s}();t.exports&&(t.exports=e)}},i={};function n(t){var s=i[t];if(void 0!==s)return s.exports;var r=i[t]={exports:{}};return e[t](r,r.exports,n),r.exports}n.m=e,t=[],n.O=(e,i,s,r)=>{if(!i){var o=1/0;for(c=0;c<t.length;c++){for(var[i,s,r]=t[c],l=!0,a=0;a<i.length;a++)(!1&r||o>=r)&&Object.keys(n.O).every((t=>n.O[t](i[a])))?i.splice(a--,1):(l=!1,r<o&&(o=r));if(l){t.splice(c--,1);var u=s();void 0!==u&&(e=u)}}return e}r=r||0;for(var c=t.length;c>0&&t[c-1][2]>r;c--)t[c]=t[c-1];t[c]=[i,s,r]},n.n=t=>{var e=t&&t.__esModule?()=>t.default:()=>t;return n.d(e,{a:e}),e},n.d=(t,e)=>{for(var i in e)n.o(e,i)&&!n.o(t,i)&&Object.defineProperty(t,i,{enumerable:!0,get:e[i]})},n.g=function(){if("object"==typeof globalThis)return globalThis;try{return this||new Function("return this")()}catch(t){if("object"==typeof window)return window}}(),n.o=(t,e)=>Object.prototype.hasOwnProperty.call(t,e),n.r=t=>{"undefined"!=typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(t,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(t,"__esModule",{value:!0})},(()=>{var t={785:0};n.O.j=e=>0===t[e];var e=(e,i)=>{var s,r,[o,l,a]=i,u=0;if(o.some((e=>0!==t[e]))){for(s in l)n.o(l,s)&&(n.m[s]=l[s]);if(a)var c=a(n)}for(e&&e(i);u<o.length;u++)r=o[u],n.o(t,r)&&t[r]&&t[r][0](),t[r]=0;return n.O(c)},i=self.webpackChunk=self.webpackChunk||[];i.forEach(e.bind(null,0)),i.push=e.bind(null,i.push.bind(i))})();var s=n.O(void 0,[888,291],(()=>n(3210)));s=n.O(s)})();