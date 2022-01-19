"use strict";(self.webpackChunk=self.webpackChunk||[]).push([[946],{7261:()=>{},7604:(t,e,i)=>{i.d(e,{np:()=>p,OV:()=>h,Nz:()=>m,rl:()=>g});var s=i(8138),a=i.n(s),n=i(829),o=i(5803),r=i(708),l=i(4170),u=function(t,e,i,s){var a,n=arguments.length,o=n<3?e:null===s?s=Object.getOwnPropertyDescriptor(e,i):s;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)o=Reflect.decorate(t,e,i,s);else for(var r=t.length-1;r>=0;r--)(a=t[r])&&(o=(n<3?a(o):n>3?a(e,i,o):a(e,i))||o);return n>3&&o&&Object.defineProperty(e,i,o),o};const d=new n.SpeedcontrolUtilBrowser(nodecg),c={bids:nodecg.Replicant("bids"),commentators:nodecg.Replicant("commentators"),countdown:nodecg.Replicant("countdown"),currentRunDelay:nodecg.Replicant("currentRunDelay"),donationReader:nodecg.Replicant("donationReader"),donationsToRead:nodecg.Replicant("donationsToRead"),donationTotal:nodecg.Replicant("donationTotal"),donationTotalMilestones:nodecg.Replicant("donationTotalMilestones"),gameLayouts:nodecg.Replicant("gameLayouts"),obsData:nodecg.Replicant("obsData"),omnibarPin:nodecg.Replicant("omnibarPin"),runDataActiveRunSurrounding:d.runDataActiveRunSurrounding,runDataArray:d.runDataArray,serverTimestamp:nodecg.Replicant("serverTimestamp"),streamDeckData:nodecg.Replicant("streamDeckData"),ttsVoices:nodecg.Replicant("ttsVoices"),upcomingRunID:nodecg.Replicant("upcomingRunID"),videoPlayer:nodecg.Replicant("videoPlayer")};let h,p=class extends l.g4{constructor(){super(...arguments),this.reps={}}get repsTyped(){return this.reps}setState({name:t,val:e}){o.Z.set(this.reps,t,a()(e))}setReplicant({name:t,val:e}){o.Z.set(this.reps,t,a()(e)),c[t].value=a()(e)}};u([l.mm],p.prototype,"setState",null),u([l.mm],p.prototype,"setReplicant",null),p=u([(0,l.Yl)({name:"ReplicantModule",namespaced:!0})],p);const m=(0,r.uD)("ReplicantModule");function g(t){return e=this,i=void 0,a=function*(){Object.keys(c).forEach((e=>{c[e].on("change",(i=>{t.commit("ReplicantModule/setState",{name:e,val:i})}))})),yield NodeCG.waitForReplicants(...Object.keys(c).map((t=>c[t]))),h=(0,l.rT)(p,t)},new((s=void 0)||(s=Promise))((function(t,n){function o(t){try{l(a.next(t))}catch(t){n(t)}}function r(t){try{l(a.throw(t))}catch(t){n(t)}}function l(e){var i;e.done?t(e.value):(i=e.value,i instanceof s?i:new s((function(t){t(i)}))).then(o,r)}l((a=a.apply(e,i||[])).next())}));var e,i,s,a}},3335:(t,e,i)=>{i.d(e,{Z:()=>g});var s=i(7874),a=i(5095),n=i(2873),o=i(7653),r=i(1954),l=i(3844),u=i(3944),d=i(9405),c=i(557),h=i(2377),p=i(6248),m=i(2138);const g=(0,p.Z)(o.Z,r.Z,u.Z,(0,l.d)("radioGroup"),d.Z).extend().extend({name:"v-radio",inheritAttrs:!1,props:{disabled:Boolean,id:String,label:String,name:String,offIcon:{type:String,default:"$radioOff"},onIcon:{type:String,default:"$radioOn"},readonly:Boolean,value:{default:null}},data:()=>({isFocused:!1}),computed:{classes(){return{"v-radio--is-disabled":this.isDisabled,"v-radio--is-focused":this.isFocused,...this.themeClasses,...this.groupClasses}},computedColor(){return c.Z.options.computed.computedColor.call(this)},computedIcon(){return this.isActive?this.onIcon:this.offIcon},computedId(){return n.Z.options.computed.computedId.call(this)},hasLabel:n.Z.options.computed.hasLabel,hasState(){return(this.radioGroup||{}).hasState},isDisabled(){return this.disabled||!!this.radioGroup&&this.radioGroup.isDisabled},isReadonly(){return this.readonly||!!this.radioGroup&&this.radioGroup.isReadonly},computedName(){return this.name||!this.radioGroup?this.name:this.radioGroup.name||`radio-${this.radioGroup._uid}`},rippleState(){return c.Z.options.computed.rippleState.call(this)},validationState(){return(this.radioGroup||{}).validationState||this.computedColor}},methods:{genInput(t){return c.Z.options.methods.genInput.call(this,"radio",t)},genLabel(){return this.hasLabel?this.$createElement(s.Z,{on:{click:c.X},attrs:{for:this.computedId},props:{color:this.validationState,focused:this.hasState}},(0,h.z9)(this,"label")||this.label):null},genRadio(){const{title:t,...e}=this.attrs$;return this.$createElement("div",{staticClass:"v-input--selection-controls__input"},[this.$createElement(a.Z,this.setTextColor(this.validationState,{props:{dense:this.radioGroup&&this.radioGroup.dense}}),this.computedIcon),this.genInput({name:this.computedName,value:this.value,...e}),this.genRipple(this.setTextColor(this.rippleState))])},onFocus(t){this.isFocused=!0,this.$emit("focus",t)},onBlur(t){this.isFocused=!1,this.$emit("blur",t)},onChange(){this.isDisabled||this.isReadonly||this.isActive||this.toggle()},onKeydown:()=>{}},render(t){return t("div",{staticClass:"v-radio",class:this.classes,on:(0,m.bp)({click:this.onChange},this.listeners$),attrs:{title:this.attrs$.title}},[this.genRadio(),this.genLabel()])}})},6123:(t,e,i)=>{i.d(e,{Z:()=>d}),i(7261);var s=i(2873),a=i(3157),n=i(312),o=i(9405),r=i(6248),l=i(8298);const u=(0,r.Z)(a.Z,n.Z,o.Z).extend({name:"base-item-group",props:{activeClass:{type:String,default:"v-item--active"},mandatory:Boolean,max:{type:[Number,String],default:null},multiple:Boolean,tag:{type:String,default:"div"}},data(){return{internalLazyValue:void 0!==this.value?this.value:this.multiple?[]:void 0,items:[]}},computed:{classes(){return{"v-item-group":!0,...this.themeClasses}},selectedIndex(){return this.selectedItem&&this.items.indexOf(this.selectedItem)||-1},selectedItem(){if(!this.multiple)return this.selectedItems[0]},selectedItems(){return this.items.filter(((t,e)=>this.toggleMethod(this.getValue(t,e))))},selectedValues(){return null==this.internalValue?[]:Array.isArray(this.internalValue)?this.internalValue:[this.internalValue]},toggleMethod(){if(!this.multiple)return t=>this.valueComparator(this.internalValue,t);const t=this.internalValue;return Array.isArray(t)?e=>t.some((t=>this.valueComparator(t,e))):()=>!1}},watch:{internalValue:"updateItemsState",items:"updateItemsState"},created(){this.multiple&&!Array.isArray(this.internalValue)&&(0,l.Kd)("Model must be bound to an array if the multiple property is true.",this)},methods:{genData(){return{class:this.classes}},getValue:(t,e)=>void 0===t.value?e:t.value,onClick(t){this.updateInternalValue(this.getValue(t,this.items.indexOf(t)))},register(t){const e=this.items.push(t)-1;t.$on("change",(()=>this.onClick(t))),this.mandatory&&!this.selectedValues.length&&this.updateMandatory(),this.updateItem(t,e)},unregister(t){if(this._isDestroyed)return;const e=this.items.indexOf(t),i=this.getValue(t,e);if(this.items.splice(e,1),!(this.selectedValues.indexOf(i)<0)){if(!this.mandatory)return this.updateInternalValue(i);this.multiple&&Array.isArray(this.internalValue)?this.internalValue=this.internalValue.filter((t=>t!==i)):this.internalValue=void 0,this.selectedItems.length||this.updateMandatory(!0)}},updateItem(t,e){const i=this.getValue(t,e);t.isActive=this.toggleMethod(i)},updateItemsState(){this.$nextTick((()=>{if(this.mandatory&&!this.selectedItems.length)return this.updateMandatory();this.items.forEach(this.updateItem)}))},updateInternalValue(t){this.multiple?this.updateMultiple(t):this.updateSingle(t)},updateMandatory(t){if(!this.items.length)return;const e=this.items.slice();t&&e.reverse();const i=e.find((t=>!t.disabled));if(!i)return;const s=this.items.indexOf(i);this.updateInternalValue(this.getValue(i,s))},updateMultiple(t){const e=(Array.isArray(this.internalValue)?this.internalValue:[]).slice(),i=e.findIndex((e=>e===t));this.mandatory&&i>-1&&e.length-1<1||null!=this.max&&i<0&&e.length+1>this.max||(i>-1?e.splice(i,1):e.push(t),this.internalValue=e)},updateSingle(t){const e=t===this.internalValue;this.mandatory&&e||(this.internalValue=e?void 0:t)}},render(t){return t(this.tag,this.genData(),this.$slots.default)}}),d=(u.extend({name:"v-item-group",provide(){return{itemGroup:this}}}),(0,r.Z)(u,s.Z).extend({name:"v-radio-group",provide(){return{radioGroup:this}},props:{column:{type:Boolean,default:!0},height:{type:[Number,String],default:"auto"},name:String,row:Boolean,value:null},computed:{classes(){return{...s.Z.options.computed.classes.call(this),"v-input--selection-controls v-input--radio-group":!0,"v-input--radio-group--column":this.column&&!this.row,"v-input--radio-group--row":this.row}}},methods:{genDefaultSlot(){return this.$createElement("div",{staticClass:"v-input--radio-group__input",attrs:{id:this.id,role:"radiogroup","aria-labelledby":this.computedId}},s.Z.options.methods.genDefaultSlot.call(this))},genInputSlot(){const t=s.Z.options.methods.genInputSlot.call(this);return delete t.data.on.click,t},genLabel(){const t=s.Z.options.methods.genLabel.call(this);return t?(t.data.attrs.id=this.computedId,delete t.data.attrs.for,t.tag="legend",t):null},onClick:u.options.methods.onClick},render(t){const e=s.Z.options.render.call(this,t);return this._b(e.data,"div",this.attrs$),e}}))},3157:(t,e,i)=>{i.d(e,{Z:()=>n});var s=i(5803),a=i(2377);const n=s.Z.extend({name:"comparable",props:{valueComparator:{type:Function,default:a.vZ}}})},3944:(t,e,i)=>{i.d(e,{Z:()=>a});var s=i(2385);const a=i(5803).Z.extend({name:"rippleable",directives:{ripple:s.Z},props:{ripple:{type:[Boolean,Object],default:!0}},methods:{genRipple(t={}){return this.ripple?(t.staticClass="v-input--selection-controls__ripple",t.directives=t.directives||[],t.directives.push({name:"ripple",value:{center:!0}}),this.$createElement("div",t)):null}}})},557:(t,e,i)=>{i.d(e,{X:()=>o,Z:()=>r});var s=i(2873),a=i(3944),n=i(3157);function o(t){t.preventDefault()}const r=(0,i(6248).Z)(s.Z,a.Z,n.Z).extend({name:"selectable",model:{prop:"inputValue",event:"change"},props:{id:String,inputValue:null,falseValue:null,trueValue:null,multiple:{type:Boolean,default:null},label:String},data(){return{hasColor:this.inputValue,lazyValue:this.inputValue}},computed:{computedColor(){if(this.isActive)return this.color?this.color:this.isDark&&!this.appIsDark?"white":"primary"},isMultiple(){return!0===this.multiple||null===this.multiple&&Array.isArray(this.internalValue)},isActive(){const t=this.value,e=this.internalValue;return this.isMultiple?!!Array.isArray(e)&&e.some((e=>this.valueComparator(e,t))):void 0===this.trueValue||void 0===this.falseValue?t?this.valueComparator(t,e):Boolean(e):this.valueComparator(e,this.trueValue)},isDirty(){return this.isActive},rippleState(){return this.isDisabled||this.validationState?this.validationState:void 0}},watch:{inputValue(t){this.lazyValue=t,this.hasColor=t}},methods:{genLabel(){const t=s.Z.options.methods.genLabel.call(this);return t?(t.data.on={click:o},t):t},genInput(t,e){return this.$createElement("input",{attrs:Object.assign({"aria-checked":this.isActive.toString(),disabled:this.isDisabled,id:this.computedId,role:t,type:t},e),domProps:{value:this.value,checked:this.isActive},on:{blur:this.onBlur,change:this.onChange,focus:this.onFocus,keydown:this.onKeydown,click:o},ref:"input"})},onBlur(){this.isFocused=!1},onClick(t){this.onChange(),this.$emit("click",t)},onChange(){if(!this.isInteractive)return;const t=this.value;let e=this.internalValue;if(this.isMultiple){Array.isArray(e)||(e=[]);const i=e.length;e=e.filter((e=>!this.valueComparator(e,t))),e.length===i&&e.push(t)}else e=void 0!==this.trueValue&&void 0!==this.falseValue?this.valueComparator(e,this.trueValue)?this.falseValue:this.trueValue:t?this.valueComparator(e,t)?null:t:!e;this.validate(!0,e),this.internalValue=e,this.hasColor=e},onFocus(){this.isFocused=!0},onKeydown(t){}}})},2138:(t,e,i)=>{i.d(e,{ZP:()=>r,bp:()=>d});var s=i(2377);const a=/;(?![^(]*\))/g,n=/:(.*)/;function o(t){const e={};for(const i of t.split(a)){let[t,a]=i.split(n);t=t.trim(),t&&("string"==typeof a&&(a=a.trim()),e[(0,s._A)(t)]=a)}return e}function r(){const t={};let e,i=arguments.length;for(;i--;)for(e of Object.keys(arguments[i]))switch(e){case"class":case"directives":arguments[i][e]&&(t[e]=u(t[e],arguments[i][e]));break;case"style":arguments[i][e]&&(t[e]=l(t[e],arguments[i][e]));break;case"staticClass":if(!arguments[i][e])break;void 0===t[e]&&(t[e]=""),t[e]&&(t[e]+=" "),t[e]+=arguments[i][e].trim();break;case"on":case"nativeOn":arguments[i][e]&&(t[e]=d(t[e],arguments[i][e]));break;case"attrs":case"props":case"domProps":case"scopedSlots":case"staticStyle":case"hook":case"transition":if(!arguments[i][e])break;t[e]||(t[e]={}),t[e]={...arguments[i][e],...t[e]};break;default:t[e]||(t[e]=arguments[i][e])}return t}function l(t,e){return t?e?(t=(0,s.TI)("string"==typeof t?o(t):t)).concat("string"==typeof e?o(e):e):t:e}function u(t,e){return e?t&&t?(0,s.TI)(t).concat(e):e:t}function d(...t){if(!t[0])return t[1];if(!t[1])return t[0];const e={};for(let i=2;i--;){const s=t[i];for(const t in s)s[t]&&(e[t]?e[t]=[].concat(s[t],e[t]):e[t]=s[t])}return e}}}]);