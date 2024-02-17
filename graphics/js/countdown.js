(()=>{var e,t={7548:(e,t,n)=>{"use strict";var r=n(9804),o=n.n(r),i=n(7795),a=n(9340),c=n(305),s=n(3578),l=d("computed",s.aH),u=d("computed",s.L8),f=d("methods",s.i0),p=d("methods",s.PY);function d(e,t){function n(n,r){return(0,c.u1)((function(o,i){o[e]||(o[e]={});var a,c=((a={})[i]=n,a);o[e][i]=void 0!==r?t(r,c)[i]:t(c)[i]}))}return function(e,t){if("string"==typeof t){var r=t,o=e;return n(r,void 0)(o,r)}return n(e,function(e){var t=e&&e.namespace;if("string"==typeof t)return"/"!==t[t.length-1]?t+"/":t}(t))}}var g=n(899),y=function(e,t,n,r){var o,i=arguments.length,a=i<3?t:null===r?r=Object.getOwnPropertyDescriptor(t,n):r;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)a=Reflect.decorate(e,t,n,r);else for(var c=e.length-1;c>=0;c--)(o=e[c])&&(a=(i<3?o(a):i>3?o(t,n,a):o(t,n))||a);return i>3&&a&&Object.defineProperty(t,n,a),a};const v=new i.SpeedcontrolUtilBrowser(nodecg),m={assetsDonationAlertAssets:nodecg.Replicant("assets:donation-alert-assets"),assetsIntermissionSlides:nodecg.Replicant("assets:intermission-slides"),assetsReaderIntroductionImages:nodecg.Replicant("assets:reader-introduction-images"),bids:nodecg.Replicant("bids"),bigbuttonPlayerMap:nodecg.Replicant("bigbuttonPlayerMap"),commentators:nodecg.Replicant("commentators"),commentatorsNew:nodecg.Replicant("commentatorsNew"),countdown:nodecg.Replicant("countdown"),currentRunDelay:nodecg.Replicant("currentRunDelay"),donationAlerts:nodecg.Replicant("donationAlerts"),donationReader:nodecg.Replicant("donationReader"),donationReaderNew:nodecg.Replicant("donationReaderNew"),donationsToRead:nodecg.Replicant("donationsToRead"),donationTotal:nodecg.Replicant("donationTotal"),donationTotalMilestones:nodecg.Replicant("donationTotalMilestones"),gameLayouts:nodecg.Replicant("gameLayouts"),intermissionSlides:nodecg.Replicant("intermissionSlides"),musicData:nodecg.Replicant("musicData"),obsData:nodecg.Replicant("obsData"),omnibar:nodecg.Replicant("omnibar"),otherStreamData:nodecg.Replicant("otherStreamData"),prizes:nodecg.Replicant("prizes"),readerIntroduction:nodecg.Replicant("readerIntroduction"),runDataActiveRun:v.runDataActiveRun,runDataActiveRunSurrounding:v.runDataActiveRunSurrounding,runDataArray:v.runDataArray,serverTimestamp:nodecg.Replicant("serverTimestamp"),streamDeckData:nodecg.Replicant("streamDeckData"),timer:v.timer,ttsVoices:nodecg.Replicant("ttsVoices"),upcomingRunID:nodecg.Replicant("upcomingRunID"),videoPlayer:nodecg.Replicant("videoPlayer")};let h,b=class extends g.hw{constructor(){super(...arguments),this.reps={}}get repsTyped(){return this.reps}setState({name:e,val:t}){a.Ay.set(this.reps,e,o()(t))}setReplicant({name:e,val:t}){a.Ay.set(this.reps,e,o()(t)),m[e].value=o()(t)}};y([g.sM],b.prototype,"setState",null),y([g.sM],b.prototype,"setReplicant",null),b=y([(0,g.nV)({name:"ReplicantModule",namespaced:!0})],b),function(e,t){function n(t){return function(n,r){if("string"==typeof r){var o=r,i=n;return t(o,{namespace:e})(i,o)}var a=n,c=function(e,t){var n={};return[e,t].forEach((function(e){Object.keys(e).forEach((function(t){n[t]=e[t]}))})),n}(r||{},{namespace:e});return t(a,c)}}n(l),n(u),n(p),n(f)}("ReplicantModule"),n(7378),n(5716),n(9906),n(2633),n(3889),n(5757);var R=n(728),w=n.n(R);function O(e){return e.toString().padStart(2,"0")}function j(e){const t=Math.floor(e/1e3%60),n=Math.floor(e/6e4%60);return`${O(Math.floor(e/36e5))}:${O(n)}:${O(t)}`}let _=class extends a.Ay{constructor(){super(...arguments),this.countdown=null}get remaining(){var e,t;return null!==(t=null===(e=this.countdown)||void 0===e?void 0:e.remaining)&&void 0!==t?t:0}get currentCountdown(){const e=Math.round(this.remaining/1e3);return e>=36e3?j(1e3*e):e>=3600?j(1e3*e).slice(1):j(1e3*e).slice(3)}created(){nodecg.Replicant("countdown").on("change",(e=>{a.Ay.set(this,"countdown",w()(e))}))}};_=function(e,t,n,r){var o,i=arguments.length,a=i<3?t:null===r?r=Object.getOwnPropertyDescriptor(t,n):r;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)a=Reflect.decorate(e,t,n,r);else for(var c=e.length-1;c>=0;c--)(o=e[c])&&(a=(i<3?o(a):i>3?o(t,n,a):o(t,n))||a);return i>3&&a&&Object.defineProperty(t,n,a),a}([c.Ay],_);const x=_;var D=n(7270);const P=(0,D.A)(x,(function(){var e=this,t=e._self._c;return e._self._setupProxy,t("div",{style:{"text-align":"center"}},[t("div",{style:{"font-size":"70px"}},[e.remaining>0?t("span",[e._v("\n      Event Starts In\n    ")]):t("span",[e._v("\n      Event Starts Soon\n    ")])]),e._v(" "),t("div",{style:{"font-size":"200px","margin-top":"-0.2em",color:"white","font-weight":"600",opacity:e.remaining>0?1:0}},[e._v("\n    "+e._s(e.currentCountdown)+"\n  ")])])}),[],!1,null,null,null).exports,S=nodecg.bundleConfig;let A=class extends a.Ay{constructor(){super(...arguments),this.zoom=`calc(${S.obs.canvasResolution.height}/1080)`}};A=function(e,t,n,r){var o,i=arguments.length,a=i<3?t:null===r?r=Object.getOwnPropertyDescriptor(t,n):r;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)a=Reflect.decorate(e,t,n,r);else for(var c=e.length-1;c>=0;c--)(o=e[c])&&(a=(i<3?o(a):i>3?o(t,n,a):o(t,n))||a);return i>3&&a&&Object.defineProperty(t,n,a),a}([(0,c.Ay)({components:{Countdown:P}})],A);const M=A,E=(0,D.A)(M,(function(){var e=this,t=e._self._c;return e._self._setupProxy,t("div",{style:{zoom:e.zoom},attrs:{id:"Countdown"}},[t("div",{attrs:{id:"Background"}}),e._v(" "),t("div",{staticClass:"Flex",style:{"flex-direction":"column",height:"1080px"},attrs:{id:"Layout"}},[t("img",{staticClass:"Logo"}),e._v(" "),t("countdown",{style:{"margin-top":"50px"}})],1)])}),[],!1,null,null,null).exports;a.Ay.use(s.Ay);let T=class extends g.hw{get reps(){return this.context.rootState.ReplicantModule.reps}};T=function(e,t,n,r){var o,i=arguments.length,a=i<3?t:null===r?r=Object.getOwnPropertyDescriptor(t,n):r;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)a=Reflect.decorate(e,t,n,r);else for(var c=e.length-1;c>=0;c--)(o=e[c])&&(a=(i<3?o(a):i>3?o(t,n,a):o(t,n))||a);return i>3&&a&&Object.defineProperty(t,n,a),a}([(0,g.nV)({name:"OurModule"})],T);const k=new s.il({strict:!1,state:{},modules:{ReplicantModule:b,OurModule:T}}),C=k;(0,g.f_)(T,k),function(e){return t=this,n=void 0,o=function*(){Object.keys(m).forEach((t=>{m[t].on("change",(n=>{e.commit("ReplicantModule/setState",{name:t,val:n})}))})),yield NodeCG.waitForReplicants(...Object.keys(m).map((e=>m[e]))),h=(0,g.f_)(b,e)},new((r=void 0)||(r=Promise))((function(e,i){function a(e){try{s(o.next(e))}catch(e){i(e)}}function c(e){try{s(o.throw(e))}catch(e){i(e)}}function s(t){var n;t.done?e(t.value):(n=t.value,n instanceof r?n:new r((function(e){e(n)}))).then(a,c)}s((o=o.apply(t,n||[])).next())}));var t,n,r,o}(C).then((()=>{new a.Ay({store:C,el:"#App",render:e=>e(E)})}))},3889:(e,t,n)=>{"use strict";"undefined"!=typeof Reflect&&Reflect.getMetadata},728:e=>{var t=function(){"use strict";function e(e,t){return null!=t&&e instanceof t}var t,n,r;try{t=Map}catch(e){t=function(){}}try{n=Set}catch(e){n=function(){}}try{r=Promise}catch(e){r=function(){}}function o(i,c,s,l,u){"object"==typeof c&&(s=c.depth,l=c.prototype,u=c.includeNonEnumerable,c=c.circular);var f=[],p=[],d="undefined"!=typeof Buffer;return void 0===c&&(c=!0),void 0===s&&(s=1/0),function i(s,g){if(null===s)return null;if(0===g)return s;var y,v;if("object"!=typeof s)return s;if(e(s,t))y=new t;else if(e(s,n))y=new n;else if(e(s,r))y=new r((function(e,t){s.then((function(t){e(i(t,g-1))}),(function(e){t(i(e,g-1))}))}));else if(o.__isArray(s))y=[];else if(o.__isRegExp(s))y=new RegExp(s.source,a(s)),s.lastIndex&&(y.lastIndex=s.lastIndex);else if(o.__isDate(s))y=new Date(s.getTime());else{if(d&&Buffer.isBuffer(s))return y=Buffer.allocUnsafe?Buffer.allocUnsafe(s.length):new Buffer(s.length),s.copy(y),y;e(s,Error)?y=Object.create(s):void 0===l?(v=Object.getPrototypeOf(s),y=Object.create(v)):(y=Object.create(l),v=l)}if(c){var m=f.indexOf(s);if(-1!=m)return p[m];f.push(s),p.push(y)}for(var h in e(s,t)&&s.forEach((function(e,t){var n=i(t,g-1),r=i(e,g-1);y.set(n,r)})),e(s,n)&&s.forEach((function(e){var t=i(e,g-1);y.add(t)})),s){var b;v&&(b=Object.getOwnPropertyDescriptor(v,h)),b&&null==b.set||(y[h]=i(s[h],g-1))}if(Object.getOwnPropertySymbols){var R=Object.getOwnPropertySymbols(s);for(h=0;h<R.length;h++){var w=R[h];(!(j=Object.getOwnPropertyDescriptor(s,w))||j.enumerable||u)&&(y[w]=i(s[w],g-1),j.enumerable||Object.defineProperty(y,w,{enumerable:!1}))}}if(u){var O=Object.getOwnPropertyNames(s);for(h=0;h<O.length;h++){var j,_=O[h];(j=Object.getOwnPropertyDescriptor(s,_))&&j.enumerable||(y[_]=i(s[_],g-1),Object.defineProperty(y,_,{enumerable:!1}))}}return y}(i,s)}function i(e){return Object.prototype.toString.call(e)}function a(e){var t="";return e.global&&(t+="g"),e.ignoreCase&&(t+="i"),e.multiline&&(t+="m"),t}return o.clonePrototype=function(e){if(null===e)return null;var t=function(){};return t.prototype=e,new t},o.__objToStr=i,o.__isDate=function(e){return"object"==typeof e&&"[object Date]"===i(e)},o.__isArray=function(e){return"object"==typeof e&&"[object Array]"===i(e)},o.__isRegExp=function(e){return"object"==typeof e&&"[object RegExp]"===i(e)},o.__getRegExpFlags=a,o}();e.exports&&(e.exports=t)}},n={};function r(e){var o=n[e];if(void 0!==o)return o.exports;var i=n[e]={id:e,exports:{}};return t[e].call(i.exports,i,i.exports,r),i.exports}r.m=t,e=[],r.O=(t,n,o,i)=>{if(!n){var a=1/0;for(u=0;u<e.length;u++){for(var[n,o,i]=e[u],c=!0,s=0;s<n.length;s++)(!1&i||a>=i)&&Object.keys(r.O).every((e=>r.O[e](n[s])))?n.splice(s--,1):(c=!1,i<a&&(a=i));if(c){e.splice(u--,1);var l=o();void 0!==l&&(t=l)}}return t}i=i||0;for(var u=e.length;u>0&&e[u-1][2]>i;u--)e[u]=e[u-1];e[u]=[n,o,i]},r.n=e=>{var t=e&&e.__esModule?()=>e.default:()=>e;return r.d(t,{a:t}),t},r.d=(e,t)=>{for(var n in t)r.o(t,n)&&!r.o(e,n)&&Object.defineProperty(e,n,{enumerable:!0,get:t[n]})},r.g=function(){if("object"==typeof globalThis)return globalThis;try{return this||new Function("return this")()}catch(e){if("object"==typeof window)return window}}(),r.o=(e,t)=>Object.prototype.hasOwnProperty.call(e,t),r.r=e=>{"undefined"!=typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(e,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(e,"__esModule",{value:!0})},(()=>{var e;r.g.importScripts&&(e=r.g.location+"");var t=r.g.document;if(!e&&t&&(t.currentScript&&(e=t.currentScript.src),!e)){var n=t.getElementsByTagName("script");if(n.length)for(var o=n.length-1;o>-1&&(!e||!/^http(s?):/.test(e));)e=n[o--].src}if(!e)throw new Error("Automatic publicPath is not supported in this browser");e=e.replace(/#.*$/,"").replace(/\?.*$/,"").replace(/\/[^\/]+$/,"/"),r.p=e+"../"})(),(()=>{var e={416:0,935:0};r.O.j=t=>0===e[t];var t=(t,n)=>{var o,i,[a,c,s]=n,l=0;if(a.some((t=>0!==e[t]))){for(o in c)r.o(c,o)&&(r.m[o]=c[o]);if(s)var u=s(r)}for(t&&t(n);l<a.length;l++)i=a[l],r.o(e,i)&&e[i]&&e[i][0](),e[i]=0;return r.O(u)},n=self.webpackChunk=self.webpackChunk||[];n.forEach(t.bind(null,0)),n.push=t.bind(null,n.push.bind(n))})(),r.nc=void 0;var o=r.O(void 0,[537,935,342,378],(()=>r(7548)));o=r.O(o)})();