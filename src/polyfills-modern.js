// Minimal polyfill shim for modern browsers.
// All Baseline-2021 and earlier features (Array.at, Object.hasOwn, flat/flatMap,
// Object.fromEntries, trimStart/trimEnd, Promise.finally) are dropped — they are
// natively supported in every browser released since late 2021.
// URL.canParse is kept: it landed in Chrome 120 (Dec 2023) and ~83% global coverage.
"canParse"in URL||(URL.canParse=function(e,t){try{return!!new URL(e,t)}catch(e){return!1}});