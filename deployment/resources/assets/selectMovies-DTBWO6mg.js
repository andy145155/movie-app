import{u as h,r as f,U as x,j as s,P as g,R as o}from"./index-CTP4-05Q.js";import{m as y,B as O}from"./button-CcWOtIlM.js";import{s as w,a as P}from"./apis-Bx2pEyGk.js";import"./index-CXhrj9mw.js";function N(){const e=h(),{user:t}=f.useContext(x),r=()=>{t.selectedMovies.length!==0&&e(g.HOME)};return s.jsxs("nav",{className:"flex h-navBar border-b justify-between lg:px-80 md:px-30 px-16",children:[s.jsx("img",{className:"py-4 cursor-pointer",alt:"Netflix logo",src:y,onClick:()=>r()}),s.jsx("div",{className:"text-gray-600 text-xl font-bold py-6",children:"Help"})]})}function C({selectedMovies:e}){const{user:t,setSelectedMovies:r,setRecommenedMovies:n}=f.useContext(x),a=h();async function i(){const l=await w({email:t.email,selectedMovies:e.map(c=>({movieId:c.movieId,similarity:c.similarity}))});l&&(r(l.selectedMovies),n(l.recommendedMovies),a(g.HOME))}return s.jsxs("div",{className:"flex flex-col text-center gap-y-5 p-5",children:[s.jsx("h1",{className:"font-bold text-3xl",children:"Choose three you like!!"}),s.jsxs("div",{className:"text-base",children:["It will help us find TV shows & movies you'll love! ",s.jsxs("b",{children:["You have choose ",e.length]})]}),s.jsx("div",{children:s.jsx(O,{onClick:i,children:"Continue"})})]})}var j={color:void 0,size:void 0,className:void 0,style:void 0,attr:void 0},v=o.createContext&&o.createContext(j),E=["attr","size","title"];function I(e,t){if(e==null)return{};var r=S(e,t),n,a;if(Object.getOwnPropertySymbols){var i=Object.getOwnPropertySymbols(e);for(a=0;a<i.length;a++)n=i[a],!(t.indexOf(n)>=0)&&Object.prototype.propertyIsEnumerable.call(e,n)&&(r[n]=e[n])}return r}function S(e,t){if(e==null)return{};var r={};for(var n in e)if(Object.prototype.hasOwnProperty.call(e,n)){if(t.indexOf(n)>=0)continue;r[n]=e[n]}return r}function m(){return m=Object.assign?Object.assign.bind():function(e){for(var t=1;t<arguments.length;t++){var r=arguments[t];for(var n in r)Object.prototype.hasOwnProperty.call(r,n)&&(e[n]=r[n])}return e},m.apply(this,arguments)}function p(e,t){var r=Object.keys(e);if(Object.getOwnPropertySymbols){var n=Object.getOwnPropertySymbols(e);t&&(n=n.filter(function(a){return Object.getOwnPropertyDescriptor(e,a).enumerable})),r.push.apply(r,n)}return r}function d(e){for(var t=1;t<arguments.length;t++){var r=arguments[t]!=null?arguments[t]:{};t%2?p(Object(r),!0).forEach(function(n){M(e,n,r[n])}):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(r)):p(Object(r)).forEach(function(n){Object.defineProperty(e,n,Object.getOwnPropertyDescriptor(r,n))})}return e}function M(e,t,r){return t=z(t),t in e?Object.defineProperty(e,t,{value:r,enumerable:!0,configurable:!0,writable:!0}):e[t]=r,e}function z(e){var t=_(e,"string");return typeof t=="symbol"?t:t+""}function _(e,t){if(typeof e!="object"||!e)return e;var r=e[Symbol.toPrimitive];if(r!==void 0){var n=r.call(e,t||"default");if(typeof n!="object")return n;throw new TypeError("@@toPrimitive must return a primitive value.")}return(t==="string"?String:Number)(e)}function b(e){return e&&e.map((t,r)=>o.createElement(t.tag,d({key:r},t.attr),b(t.child)))}function H(e){return t=>o.createElement(B,m({attr:d({},e.attr)},t),b(e.child))}function B(e){var t=r=>{var{attr:n,size:a,title:i}=e,l=I(e,E),c=a||r.size||"1em",u;return r.className&&(u=r.className),e.className&&(u=(u?u+" ":"")+e.className),o.createElement("svg",m({stroke:"currentColor",fill:"currentColor",strokeWidth:"0"},r.attr,n,l,{className:u,style:d(d({color:e.color||r.color},r.style),e.style),height:c,width:c,xmlns:"http://www.w3.org/2000/svg"}),i&&o.createElement("title",null,i),e.children)};return v!==void 0?o.createElement(v.Consumer,null,r=>t(r)):t(j)}function D(e){return H({tag:"svg",attr:{viewBox:"0 0 1024 1024"},child:[{tag:"path",attr:{d:"M885.9 533.7c16.8-22.2 26.1-49.4 26.1-77.7 0-44.9-25.1-87.4-65.5-111.1a67.67 67.67 0 0 0-34.3-9.3H572.4l6-122.9c1.4-29.7-9.1-57.9-29.5-79.4A106.62 106.62 0 0 0 471 99.9c-52 0-98 35-111.8 85.1l-85.9 311H144c-17.7 0-32 14.3-32 32v364c0 17.7 14.3 32 32 32h601.3c9.2 0 18.2-1.8 26.5-5.4 47.6-20.3 78.3-66.8 78.3-118.4 0-12.6-1.8-25-5.4-37 16.8-22.2 26.1-49.4 26.1-77.7 0-12.6-1.8-25-5.4-37 16.8-22.2 26.1-49.4 26.1-77.7-.2-12.6-2-25.1-5.6-37.1zM184 852V568h81v284h-81zm636.4-353l-21.9 19 13.9 25.4a56.2 56.2 0 0 1 6.9 27.3c0 16.5-7.2 32.2-19.6 43l-21.9 19 13.9 25.4a56.2 56.2 0 0 1 6.9 27.3c0 16.5-7.2 32.2-19.6 43l-21.9 19 13.9 25.4a56.2 56.2 0 0 1 6.9 27.3c0 22.4-13.2 42.6-33.6 51.8H329V564.8l99.5-360.5a44.1 44.1 0 0 1 42.2-32.3c7.6 0 15.1 2.2 21.1 6.7 9.9 7.4 15.2 18.6 14.6 30.5l-9.6 198.4h314.4C829 418.5 840 436.9 840 456c0 16.5-7.2 32.1-19.6 43z"},child:[]}]})(e)}const R=({movie:e,isClicked:t,onClick:r})=>s.jsxs("div",{className:"relative cursor-pointer w-64 p-3 hover:scale-105 duration-500 transition-transform",onClick:r,children:[s.jsx("img",{src:e.poster,alt:e.poster}),t&&s.jsx("div",{className:"absolute top-0 left-0 bg-white w-full h-full opacity-45",children:s.jsx(D,{className:"w-full h-full"})})]});function T({selectedMovies:e,setSelectedMovies:t}){const[r,n]=f.useState([]);f.useEffect(()=>{P({limit:50,random:!1}).then(i=>{i&&n(i)})},[]);const a=i=>{if(e.find(l=>i.movieId===l.movieId))t(e.filter(l=>i.movieId!==l.movieId));else{if(e.length>=3)return;t([...e,i])}};return s.jsx("div",{className:"flex flex-wrap justify-center",children:r.map(i=>s.jsx(R,{movie:i,onClick:()=>a(i),isClicked:e.filter(l=>i.movieId===l.movieId).length>0},i.movieId))})}function V(){const[e,t]=f.useState([]);return s.jsxs("div",{className:"bg-white",children:[s.jsx(N,{}),s.jsx(C,{selectedMovies:e}),s.jsx(T,{selectedMovies:e,setSelectedMovies:t})]})}export{V as default};