var c=Object.defineProperty;var n=(s,t,e)=>t in s?c(s,t,{enumerable:!0,configurable:!0,writable:!0,value:e}):s[t]=e;var a=(s,t,e)=>(n(s,typeof t!="symbol"?t+"":t,e),e);(function(){"use strict";const s="CapturingAudioWorkletProcessor",t="stop";class e extends AudioWorkletProcessor{constructor(){super();a(this,"active",!0);this.port.onmessage=r=>{r.data===t&&(this.active=!1)}}process(r){var i;if(!this.active)return!1;const o=(i=r.at(0))==null?void 0:i.at(0);return o!==void 0&&this.port.postMessage(o),!0}}registerProcessor(s,e)})();