/*! For license information please see intermission-hosts.js.LICENSE.txt */
(()=>{var t,e={8138:t=>{var e=function(){"use strict";function t(t,e){return null!=e&&t instanceof e}var e,r,n;try{e=Map}catch(t){e=function(){}}try{r=Set}catch(t){r=function(){}}try{n=Promise}catch(t){n=function(){}}function o(i,a,s,u,f){"object"==typeof a&&(s=a.depth,u=a.prototype,f=a.includeNonEnumerable,a=a.circular);var l=[],p=[],d="undefined"!=typeof Buffer;return void 0===a&&(a=!0),void 0===s&&(s=1/0),function i(s,h){if(null===s)return null;if(0===h)return s;var v,y;if("object"!=typeof s)return s;if(t(s,e))v=new e;else if(t(s,r))v=new r;else if(t(s,n))v=new n((function(t,e){s.then((function(e){t(i(e,h-1))}),(function(t){e(i(t,h-1))}))}));else if(o.__isArray(s))v=[];else if(o.__isRegExp(s))v=new RegExp(s.source,c(s)),s.lastIndex&&(v.lastIndex=s.lastIndex);else if(o.__isDate(s))v=new Date(s.getTime());else{if(d&&Buffer.isBuffer(s))return v=Buffer.allocUnsafe?Buffer.allocUnsafe(s.length):new Buffer(s.length),s.copy(v),v;t(s,Error)?v=Object.create(s):void 0===u?(y=Object.getPrototypeOf(s),v=Object.create(y)):(v=Object.create(u),y=u)}if(a){var m=l.indexOf(s);if(-1!=m)return p[m];l.push(s),p.push(v)}for(var g in t(s,e)&&s.forEach((function(t,e){var r=i(e,h-1),n=i(t,h-1);v.set(r,n)})),t(s,r)&&s.forEach((function(t){var e=i(t,h-1);v.add(e)})),s){var b;y&&(b=Object.getOwnPropertyDescriptor(y,g)),b&&null==b.set||(v[g]=i(s[g],h-1))}if(Object.getOwnPropertySymbols){var _=Object.getOwnPropertySymbols(s);for(g=0;g<_.length;g++){var w=_[g];(!(j=Object.getOwnPropertyDescriptor(s,w))||j.enumerable||f)&&(v[w]=i(s[w],h-1),j.enumerable||Object.defineProperty(v,w,{enumerable:!1}))}}if(f){var O=Object.getOwnPropertyNames(s);for(g=0;g<O.length;g++){var j,x=O[g];(j=Object.getOwnPropertyDescriptor(s,x))&&j.enumerable||(v[x]=i(s[x],h-1),Object.defineProperty(v,x,{enumerable:!1}))}}return v}(i,s)}function i(t){return Object.prototype.toString.call(t)}function c(t){var e="";return t.global&&(e+="g"),t.ignoreCase&&(e+="i"),t.multiline&&(e+="m"),e}return o.clonePrototype=function(t){if(null===t)return null;var e=function(){};return e.prototype=t,new e},o.__objToStr=i,o.__isDate=function(t){return"object"==typeof t&&"[object Date]"===i(t)},o.__isArray=function(t){return"object"==typeof t&&"[object Array]"===i(t)},o.__isRegExp=function(t){return"object"==typeof t&&"[object RegExp]"===i(t)},o.__getRegExpFlags=c,o}();t.exports&&(t.exports=e)},2223:(t,e,r)=>{"use strict";var n=r(5803);function o(t){return o="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(t){return typeof t}:function(t){return t&&"function"==typeof Symbol&&t.constructor===Symbol&&t!==Symbol.prototype?"symbol":typeof t},o(t)}function i(t,e,r){return e in t?Object.defineProperty(t,e,{value:r,enumerable:!0,configurable:!0,writable:!0}):t[e]=r,t}function c(){return"undefined"!=typeof Reflect&&Reflect.defineMetadata&&Reflect.getOwnMetadataKeys}function a(t,e){s(t,e),Object.getOwnPropertyNames(e.prototype).forEach((function(r){s(t.prototype,e.prototype,r)})),Object.getOwnPropertyNames(e).forEach((function(r){s(t,e,r)}))}function s(t,e,r){(r?Reflect.getOwnMetadataKeys(e,r):Reflect.getOwnMetadataKeys(e)).forEach((function(n){var o=r?Reflect.getOwnMetadata(n,e,r):Reflect.getOwnMetadata(n,e);r?Reflect.defineMetadata(n,o,t,r):Reflect.defineMetadata(n,o,t)}))}var u={__proto__:[]}instanceof Array;function f(t){return function(e,r,n){var o="function"==typeof e?e:e.constructor;o.__decorators__||(o.__decorators__=[]),"number"!=typeof n&&(n=void 0),o.__decorators__.push((function(e){return t(e,r,n)}))}}function l(t,e){var r=e.prototype._init;e.prototype._init=function(){var e=this,r=Object.getOwnPropertyNames(t);if(t.$options.props)for(var n in t.$options.props)t.hasOwnProperty(n)||r.push(n);r.forEach((function(r){Object.defineProperty(e,r,{get:function(){return t[r]},set:function(e){t[r]=e},configurable:!0})}))};var n=new e;e.prototype._init=r;var o={};return Object.keys(n).forEach((function(t){void 0!==n[t]&&(o[t]=n[t])})),o}var p=["data","beforeCreate","created","beforeMount","mounted","beforeDestroy","destroyed","beforeUpdate","updated","activated","deactivated","render","errorCaptured","serverPrefetch"];function d(t){var e=arguments.length>1&&void 0!==arguments[1]?arguments[1]:{};e.name=e.name||t._componentTag||t.name;var r=t.prototype;Object.getOwnPropertyNames(r).forEach((function(t){if("constructor"!==t)if(p.indexOf(t)>-1)e[t]=r[t];else{var n=Object.getOwnPropertyDescriptor(r,t);void 0!==n.value?"function"==typeof n.value?(e.methods||(e.methods={}))[t]=n.value:(e.mixins||(e.mixins=[])).push({data:function(){return i({},t,n.value)}}):(n.get||n.set)&&((e.computed||(e.computed={}))[t]={get:n.get,set:n.set})}})),(e.mixins||(e.mixins=[])).push({data:function(){return l(this,t)}});var o=t.__decorators__;o&&(o.forEach((function(t){return t(e)})),delete t.__decorators__);var s=Object.getPrototypeOf(t.prototype),u=s instanceof n.Z?s.constructor:n.Z,f=u.extend(e);return v(f,t,u),c()&&a(f,t),f}var h={prototype:!0,arguments:!0,callee:!0,caller:!0};function v(t,e,r){Object.getOwnPropertyNames(e).forEach((function(n){if(!h[n]){var i=Object.getOwnPropertyDescriptor(t,n);if(!i||i.configurable){var c,a,s=Object.getOwnPropertyDescriptor(e,n);if(!u){if("cid"===n)return;var f=Object.getOwnPropertyDescriptor(r,n);if(a=o(c=s.value),null!=c&&("object"===a||"function"===a)&&f&&f.value===s.value)return}Object.defineProperty(t,n,s)}}}))}function y(t){return"function"==typeof t?d(t):function(e){return d(e,t)}}y.registerHooks=function(t){var e;p.push.apply(p,function(t){if(Array.isArray(t)){for(var e=0,r=new Array(t.length);e<t.length;e++)r[e]=t[e];return r}}(e=t)||function(t){if(Symbol.iterator in Object(t)||"[object Arguments]"===Object.prototype.toString.call(t))return Array.from(t)}(e)||function(){throw new TypeError("Invalid attempt to spread non-iterable instance")}())};const m=y;r(4807),r(7023),r(5654);var g=r(779);r(8793);var b=("undefined"!=typeof window?window:void 0!==r.g?r.g:{}).__VUE_DEVTOOLS_GLOBAL_HOOK__;function _(t,e){if(void 0===e&&(e=[]),null===t||"object"!=typeof t)return t;var r,n=(r=function(e){return e.original===t},e.filter(r)[0]);if(n)return n.copy;var o=Array.isArray(t)?[]:{};return e.push({original:t,copy:o}),Object.keys(t).forEach((function(r){o[r]=_(t[r],e)})),o}function w(t,e){Object.keys(t).forEach((function(r){return e(t[r],r)}))}function O(t){return null!==t&&"object"==typeof t}var j=function(t,e){this.runtime=e,this._children=Object.create(null),this._rawModule=t;var r=t.state;this.state=("function"==typeof r?r():r)||{}},x={namespaced:{configurable:!0}};x.namespaced.get=function(){return!!this._rawModule.namespaced},j.prototype.addChild=function(t,e){this._children[t]=e},j.prototype.removeChild=function(t){delete this._children[t]},j.prototype.getChild=function(t){return this._children[t]},j.prototype.hasChild=function(t){return t in this._children},j.prototype.update=function(t){this._rawModule.namespaced=t.namespaced,t.actions&&(this._rawModule.actions=t.actions),t.mutations&&(this._rawModule.mutations=t.mutations),t.getters&&(this._rawModule.getters=t.getters)},j.prototype.forEachChild=function(t){w(this._children,t)},j.prototype.forEachGetter=function(t){this._rawModule.getters&&w(this._rawModule.getters,t)},j.prototype.forEachAction=function(t){this._rawModule.actions&&w(this._rawModule.actions,t)},j.prototype.forEachMutation=function(t){this._rawModule.mutations&&w(this._rawModule.mutations,t)},Object.defineProperties(j.prototype,x);var E,M=function(t){this.register([],t,!1)};function P(t,e,r){if(e.update(r),r.modules)for(var n in r.modules){if(!e.getChild(n))return;P(t.concat(n),e.getChild(n),r.modules[n])}}M.prototype.get=function(t){return t.reduce((function(t,e){return t.getChild(e)}),this.root)},M.prototype.getNamespace=function(t){var e=this.root;return t.reduce((function(t,r){return t+((e=e.getChild(r)).namespaced?r+"/":"")}),"")},M.prototype.update=function(t){P([],this.root,t)},M.prototype.register=function(t,e,r){var n=this;void 0===r&&(r=!0);var o=new j(e,r);0===t.length?this.root=o:this.get(t.slice(0,-1)).addChild(t[t.length-1],o),e.modules&&w(e.modules,(function(e,o){n.register(t.concat(o),e,r)}))},M.prototype.unregister=function(t){var e=this.get(t.slice(0,-1)),r=t[t.length-1],n=e.getChild(r);n&&n.runtime&&e.removeChild(r)},M.prototype.isRegistered=function(t){var e=this.get(t.slice(0,-1)),r=t[t.length-1];return!!e&&e.hasChild(r)};var C=function(t){var e=this;void 0===t&&(t={}),!E&&"undefined"!=typeof window&&window.Vue&&D(window.Vue);var r=t.plugins;void 0===r&&(r=[]);var n=t.strict;void 0===n&&(n=!1),this._committing=!1,this._actions=Object.create(null),this._actionSubscribers=[],this._mutations=Object.create(null),this._wrappedGetters=Object.create(null),this._modules=new M(t),this._modulesNamespaceMap=Object.create(null),this._subscribers=[],this._watcherVM=new E,this._makeLocalGettersCache=Object.create(null);var o=this,i=this.dispatch,c=this.commit;this.dispatch=function(t,e){return i.call(o,t,e)},this.commit=function(t,e,r){return c.call(o,t,e,r)},this.strict=n;var a=this._modules.root.state;R(this,a,[],this._modules.root),S(this,a),r.forEach((function(t){return t(e)})),(void 0!==t.devtools?t.devtools:E.config.devtools)&&function(t){b&&(t._devtoolHook=b,b.emit("vuex:init",t),b.on("vuex:travel-to-state",(function(e){t.replaceState(e)})),t.subscribe((function(t,e){b.emit("vuex:mutation",t,e)}),{prepend:!0}),t.subscribeAction((function(t,e){b.emit("vuex:action",t,e)}),{prepend:!0}))}(this)},$={state:{configurable:!0}};function A(t,e,r){return e.indexOf(t)<0&&(r&&r.prepend?e.unshift(t):e.push(t)),function(){var r=e.indexOf(t);r>-1&&e.splice(r,1)}}function k(t,e){t._actions=Object.create(null),t._mutations=Object.create(null),t._wrappedGetters=Object.create(null),t._modulesNamespaceMap=Object.create(null);var r=t.state;R(t,r,[],t._modules.root,!0),S(t,r,e)}function S(t,e,r){var n=t._vm;t.getters={},t._makeLocalGettersCache=Object.create(null);var o=t._wrappedGetters,i={};w(o,(function(e,r){i[r]=function(t,e){return function(){return t(e)}}(e,t),Object.defineProperty(t.getters,r,{get:function(){return t._vm[r]},enumerable:!0})}));var c=E.config.silent;E.config.silent=!0,t._vm=new E({data:{$$state:e},computed:i}),E.config.silent=c,t.strict&&function(t){t._vm.$watch((function(){return this._data.$$state}),(function(){}),{deep:!0,sync:!0})}(t),n&&(r&&t._withCommit((function(){n._data.$$state=null})),E.nextTick((function(){return n.$destroy()})))}function R(t,e,r,n,o){var i=!r.length,c=t._modules.getNamespace(r);if(n.namespaced&&(t._modulesNamespaceMap[c],t._modulesNamespaceMap[c]=n),!i&&!o){var a=G(e,r.slice(0,-1)),s=r[r.length-1];t._withCommit((function(){E.set(a,s,n.state)}))}var u=n.context=function(t,e,r){var n=""===e,o={dispatch:n?t.dispatch:function(r,n,o){var i=N(r,n,o),c=i.payload,a=i.options,s=i.type;return a&&a.root||(s=e+s),t.dispatch(s,c)},commit:n?t.commit:function(r,n,o){var i=N(r,n,o),c=i.payload,a=i.options,s=i.type;a&&a.root||(s=e+s),t.commit(s,c,a)}};return Object.defineProperties(o,{getters:{get:n?function(){return t.getters}:function(){return function(t,e){if(!t._makeLocalGettersCache[e]){var r={},n=e.length;Object.keys(t.getters).forEach((function(o){if(o.slice(0,n)===e){var i=o.slice(n);Object.defineProperty(r,i,{get:function(){return t.getters[o]},enumerable:!0})}})),t._makeLocalGettersCache[e]=r}return t._makeLocalGettersCache[e]}(t,e)}},state:{get:function(){return G(t.state,r)}}}),o}(t,c,r);n.forEachMutation((function(e,r){!function(t,e,r,n){(t._mutations[e]||(t._mutations[e]=[])).push((function(e){r.call(t,n.state,e)}))}(t,c+r,e,u)})),n.forEachAction((function(e,r){var n=e.root?r:c+r,o=e.handler||e;!function(t,e,r,n){(t._actions[e]||(t._actions[e]=[])).push((function(e){var o,i=r.call(t,{dispatch:n.dispatch,commit:n.commit,getters:n.getters,state:n.state,rootGetters:t.getters,rootState:t.state},e);return(o=i)&&"function"==typeof o.then||(i=Promise.resolve(i)),t._devtoolHook?i.catch((function(e){throw t._devtoolHook.emit("vuex:error",e),e})):i}))}(t,n,o,u)})),n.forEachGetter((function(e,r){!function(t,e,r,n){t._wrappedGetters[e]||(t._wrappedGetters[e]=function(t){return r(n.state,n.getters,t.state,t.getters)})}(t,c+r,e,u)})),n.forEachChild((function(n,i){R(t,e,r.concat(i),n,o)}))}function G(t,e){return e.reduce((function(t,e){return t[e]}),t)}function N(t,e,r){return O(t)&&t.type&&(r=e,e=t,t=t.type),{type:t,payload:e,options:r}}function D(t){E&&t===E||function(t){if(Number(t.version.split(".")[0])>=2)t.mixin({beforeCreate:r});else{var e=t.prototype._init;t.prototype._init=function(t){void 0===t&&(t={}),t.init=t.init?[r].concat(t.init):r,e.call(this,t)}}function r(){var t=this.$options;t.store?this.$store="function"==typeof t.store?t.store():t.store:t.parent&&t.parent.$store&&(this.$store=t.parent.$store)}}(E=t)}$.state.get=function(){return this._vm._data.$$state},$.state.set=function(t){},C.prototype.commit=function(t,e,r){var n=this,o=N(t,e,r),i=o.type,c=o.payload,a=(o.options,{type:i,payload:c}),s=this._mutations[i];s&&(this._withCommit((function(){s.forEach((function(t){t(c)}))})),this._subscribers.slice().forEach((function(t){return t(a,n.state)})))},C.prototype.dispatch=function(t,e){var r=this,n=N(t,e),o=n.type,i=n.payload,c={type:o,payload:i},a=this._actions[o];if(a){try{this._actionSubscribers.slice().filter((function(t){return t.before})).forEach((function(t){return t.before(c,r.state)}))}catch(t){}var s=a.length>1?Promise.all(a.map((function(t){return t(i)}))):a[0](i);return new Promise((function(t,e){s.then((function(e){try{r._actionSubscribers.filter((function(t){return t.after})).forEach((function(t){return t.after(c,r.state)}))}catch(t){}t(e)}),(function(t){try{r._actionSubscribers.filter((function(t){return t.error})).forEach((function(e){return e.error(c,r.state,t)}))}catch(t){}e(t)}))}))}},C.prototype.subscribe=function(t,e){return A(t,this._subscribers,e)},C.prototype.subscribeAction=function(t,e){return A("function"==typeof t?{before:t}:t,this._actionSubscribers,e)},C.prototype.watch=function(t,e,r){var n=this;return this._watcherVM.$watch((function(){return t(n.state,n.getters)}),e,r)},C.prototype.replaceState=function(t){var e=this;this._withCommit((function(){e._vm._data.$$state=t}))},C.prototype.registerModule=function(t,e,r){void 0===r&&(r={}),"string"==typeof t&&(t=[t]),this._modules.register(t,e),R(this,this.state,t,this._modules.get(t),r.preserveState),S(this,this.state)},C.prototype.unregisterModule=function(t){var e=this;"string"==typeof t&&(t=[t]),this._modules.unregister(t),this._withCommit((function(){var r=G(e.state,t.slice(0,-1));E.delete(r,t[t.length-1])})),k(this)},C.prototype.hasModule=function(t){return"string"==typeof t&&(t=[t]),this._modules.isRegistered(t)},C.prototype.hotUpdate=function(t){this._modules.update(t),k(this,!0)},C.prototype._withCommit=function(t){var e=this._committing;this._committing=!0,t(),this._committing=e},Object.defineProperties(C.prototype,$);var L=B((function(t,e){var r={};return H(e).forEach((function(e){var n=e.key,o=e.val;r[n]=function(){var e=this.$store.state,r=this.$store.getters;if(t){var n=V(this.$store,0,t);if(!n)return;e=n.context.state,r=n.context.getters}return"function"==typeof o?o.call(this,e,r):e[o]},r[n].vuex=!0})),r})),T=B((function(t,e){var r={};return H(e).forEach((function(e){var n=e.key,o=e.val;r[n]=function(){for(var e=[],r=arguments.length;r--;)e[r]=arguments[r];var n=this.$store.commit;if(t){var i=V(this.$store,0,t);if(!i)return;n=i.context.commit}return"function"==typeof o?o.apply(this,[n].concat(e)):n.apply(this.$store,[o].concat(e))}})),r})),F=B((function(t,e){var r={};return H(e).forEach((function(e){var n=e.key,o=e.val;o=t+o,r[n]=function(){if(!t||V(this.$store,0,t))return this.$store.getters[o]},r[n].vuex=!0})),r})),Z=B((function(t,e){var r={};return H(e).forEach((function(e){var n=e.key,o=e.val;r[n]=function(){for(var e=[],r=arguments.length;r--;)e[r]=arguments[r];var n=this.$store.dispatch;if(t){var i=V(this.$store,0,t);if(!i)return;n=i.context.dispatch}return"function"==typeof o?o.apply(this,[n].concat(e)):n.apply(this.$store,[o].concat(e))}})),r}));function H(t){return function(t){return Array.isArray(t)||O(t)}(t)?Array.isArray(t)?t.map((function(t){return{key:t,val:t}})):Object.keys(t).map((function(e){return{key:e,val:t[e]}})):[]}function B(t){return function(e,r){return"string"!=typeof e?(r=e,e=""):"/"!==e.charAt(e.length-1)&&(e+="/"),t(e,r)}}function V(t,e,r){return t._modulesNamespaceMap[r]}function U(t,e,r){var n=r?t.groupCollapsed:t.group;try{n.call(t,e)}catch(r){t.log(e)}}function I(t){try{t.groupEnd()}catch(e){t.log("—— log end ——")}}function K(){var t=new Date;return" @ "+z(t.getHours(),2)+":"+z(t.getMinutes(),2)+":"+z(t.getSeconds(),2)+"."+z(t.getMilliseconds(),3)}function z(t,e){return"0",r=e-t.toString().length,new Array(r+1).join("0")+t;var r}var q={Store:C,install:D,version:"3.6.2",mapState:L,mapMutations:T,mapGetters:F,mapActions:Z,createNamespacedHelpers:function(t){return{mapState:L.bind(null,t),mapGetters:F.bind(null,t),mapMutations:T.bind(null,t),mapActions:Z.bind(null,t)}},createLogger:function(t){void 0===t&&(t={});var e=t.collapsed;void 0===e&&(e=!0);var r=t.filter;void 0===r&&(r=function(t,e,r){return!0});var n=t.transformer;void 0===n&&(n=function(t){return t});var o=t.mutationTransformer;void 0===o&&(o=function(t){return t});var i=t.actionFilter;void 0===i&&(i=function(t,e){return!0});var c=t.actionTransformer;void 0===c&&(c=function(t){return t});var a=t.logMutations;void 0===a&&(a=!0);var s=t.logActions;void 0===s&&(s=!0);var u=t.logger;return void 0===u&&(u=console),function(t){var f=_(t.state);void 0!==u&&(a&&t.subscribe((function(t,i){var c=_(i);if(r(t,f,c)){var a=K(),s=o(t),l="mutation "+t.type+a;U(u,l,e),u.log("%c prev state","color: #9E9E9E; font-weight: bold",n(f)),u.log("%c mutation","color: #03A9F4; font-weight: bold",s),u.log("%c next state","color: #4CAF50; font-weight: bold",n(c)),I(u)}f=c})),s&&t.subscribeAction((function(t,r){if(i(t,r)){var n=K(),o=c(t),a="action "+t.type+n;U(u,a,e),u.log("%c action","color: #03A9F4; font-weight: bold",o),I(u)}})))}}};const J=q;var Q=W("computed",L);function W(t,e){function r(r,n){return f((function(o,i){o[t]||(o[t]={});var c,a=((c={})[i]=r,c);o[t][i]=void 0!==n?e(n,a)[i]:e(a)[i]}))}return function(t,e){if("string"==typeof e){var n=e,o=t;return r(n,void 0)(o,n)}return r(t,function(t){var e=t&&t.namespace;if("string"==typeof e)return"/"!==e[e.length-1]?e+"/":e}(e))}}W("computed",F),W("methods",Z),W("methods",T);var X=function(t,e,r,n){var o,i=arguments.length,c=i<3?e:null===n?n=Object.getOwnPropertyDescriptor(e,r):n;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)c=Reflect.decorate(t,e,r,n);else for(var a=t.length-1;a>=0;a--)(o=t[a])&&(c=(i<3?o(c):i>3?o(e,r,c):o(e,r))||c);return i>3&&c&&Object.defineProperty(e,r,c),c};let Y=class extends n.Z{};var tt;X([Q],Y.prototype,"users",void 0),X([(tt={default:"middle",validator:t=>["left","midleft","middle","midright","right"].includes(t)},void 0===tt&&(tt={}),function(t,e){(0,g.l)(tt,t,e),f((function(t,e){(t.props||(t.props={}))[e]=tt}))(t,e)})],Y.prototype,"pos",void 0),Y=X([m],Y);const et=Y;var rt=r(5440);const nt=(0,rt.Z)(et,(function(){var t=this,e=t.$createElement,r=t._self._c||e;return t.users&&t.users.hosts&&t.users.hosts[t.pos]?r("div",{staticClass:"Flex",style:{"background-color":"rgba(0,0,0,0.5)",height:"50px",padding:"15px","font-size":"40px"}},[t._v("\n  "+t._s(t.users.hosts[t.pos].display_name)+"\n  "),t.users.hosts[t.pos].country_code?r("img",{key:t.users.hosts[t.pos].country_code,style:{height:"100%","padding-left":"10px"},attrs:{src:"/bundles/esa-layouts/flags/"+t.users.hosts[t.pos].country_code.toLowerCase()+".png"}}):t._e()]):t._e()}),[],!1,null,null,null).exports;let ot=class extends n.Z{};ot=function(t,e,r,n){var o,i=arguments.length,c=i<3?e:null===n?n=Object.getOwnPropertyDescriptor(e,r):n;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)c=Reflect.decorate(t,e,r,n);else for(var a=t.length-1;a>=0;a--)(o=t[a])&&(c=(i<3?o(c):i>3?o(e,r,c):o(e,r))||c);return i>3&&c&&Object.defineProperty(e,r,c),c}([m({components:{Host:nt}})],ot);const it=ot,ct=(0,rt.Z)(it,(function(){var t=this,e=t.$createElement,r=t._self._c||e;return r("div",{staticClass:"Layout Flex",style:{"box-sizing":"border-box",color:"white",height:"1000px","justify-content":"space-evenly","align-items":"flex-end",padding:"50px"}},t._l(["left","midleft","middle","midright","right"],(function(t){return r("host",{key:t,attrs:{pos:t}})})),1)}),[],!1,null,null,null).exports;var at=r(8138),st=r.n(at);n.Z.use(J);const ut={users:nodecg.Replicant("users","speedcontrol-flagcarrier")},ft=new J.Store({state:{},mutations:{setState(t,{name:e,val:r}){n.Z.set(t,e,r)}}});var lt,pt,dt,ht;Object.keys(ut).forEach((t=>{ut[t].on("change",(e=>{ft.commit("setState",{name:t,val:st()(e)})}))})),(lt=void 0,pt=void 0,dt=void 0,ht=function*(){return yield NodeCG.waitForReplicants(...Object.keys(ut).map((t=>ut[t]))),ft},new(dt||(dt=Promise))((function(t,e){function r(t){try{o(ht.next(t))}catch(t){e(t)}}function n(t){try{o(ht.throw(t))}catch(t){e(t)}}function o(e){var o;e.done?t(e.value):(o=e.value,o instanceof dt?o:new dt((function(t){t(o)}))).then(r,n)}o((ht=ht.apply(lt,pt||[])).next())}))).then((t=>{new n.Z({store:t,el:"#App",render:t=>t(ct)})}))},779:(t,e,r)=>{"use strict";r.d(e,{l:()=>o});var n="undefined"!=typeof Reflect&&void 0!==Reflect.getMetadata;function o(t,e,r){if(n&&!Array.isArray(t)&&"function"!=typeof t&&!t.hasOwnProperty("type")&&void 0===t.type){var o=Reflect.getMetadata("design:type",e,r);o!==Object&&(t.type=o)}}}},r={};function n(t){var o=r[t];if(void 0!==o)return o.exports;var i=r[t]={exports:{}};return e[t](i,i.exports,n),i.exports}n.m=e,t=[],n.O=(e,r,o,i)=>{if(!r){var c=1/0;for(f=0;f<t.length;f++){for(var[r,o,i]=t[f],a=!0,s=0;s<r.length;s++)(!1&i||c>=i)&&Object.keys(n.O).every((t=>n.O[t](r[s])))?r.splice(s--,1):(a=!1,i<c&&(c=i));if(a){t.splice(f--,1);var u=o();void 0!==u&&(e=u)}}return e}i=i||0;for(var f=t.length;f>0&&t[f-1][2]>i;f--)t[f]=t[f-1];t[f]=[r,o,i]},n.n=t=>{var e=t&&t.__esModule?()=>t.default:()=>t;return n.d(e,{a:e}),e},n.d=(t,e)=>{for(var r in e)n.o(e,r)&&!n.o(t,r)&&Object.defineProperty(t,r,{enumerable:!0,get:e[r]})},n.g=function(){if("object"==typeof globalThis)return globalThis;try{return this||new Function("return this")()}catch(t){if("object"==typeof window)return window}}(),n.o=(t,e)=>Object.prototype.hasOwnProperty.call(t,e),(()=>{var t={126:0,155:0};n.O.j=e=>0===t[e];var e=(e,r)=>{var o,i,[c,a,s]=r,u=0;if(c.some((e=>0!==t[e]))){for(o in a)n.o(a,o)&&(n.m[o]=a[o]);if(s)var f=s(n)}for(e&&e(r);u<c.length;u++)i=c[u],n.o(t,i)&&t[i]&&t[i][0](),t[c[u]]=0;return n.O(f)},r=self.webpackChunk=self.webpackChunk||[];r.forEach(e.bind(null,0)),r.push=e.bind(null,r.push.bind(r))})();var o=n.O(void 0,[835,155],(()=>n(2223)));o=n.O(o)})();