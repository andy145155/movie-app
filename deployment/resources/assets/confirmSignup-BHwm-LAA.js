import{u as g,r as n,U as v,j as e,P as l}from"./index-CTP4-05Q.js";import{b as h,T as b,I as j}from"./input-DNvPMUtx.js";import{c as S,r as N}from"./auth-BPi0zGVC.js";import{B as m}from"./button-CcWOtIlM.js";import"./index-CXhrj9mw.js";function I(){const i=g(),{user:s}=n.useContext(v),[o,d]=n.useState(""),[r,c]=n.useState(120);n.useEffect(()=>{{const a=setInterval(()=>{c(t=>t-1)},1e3);return()=>{clearInterval(a)}}},[]);const u=async a=>{a.preventDefault();const t=await S({username:s.email,confirmationCode:o});t!=null&&t.isSignUpComplete?i(l.SIGNIN):alert(t==null?void 0:t.nextStep.signUpStep)},x=async()=>{if(!s.email){alert("Please enter your email");return}await N({username:s.email}),c(120)},f=a=>{const t=Math.floor(a/60),p=a%60;return`${String(t).padStart(2,"0")}:${String(p).padStart(2,"0")}`};return e.jsx("div",{className:"bg-cover",style:{backgroundImage:`url(${h})`},children:e.jsxs("div",{className:"bg-black bg-opacity-40 bg-gradient-to-t from-black via-transparent to-black",children:[e.jsx(b,{}),e.jsx("div",{className:"flex justify-center items-center h-content",children:e.jsxs("div",{className:"bg-black/[.75] text-white p-16",children:[e.jsx("h1",{className:"text-3xl font-semibold text-left",children:"Email verification"}),e.jsx("div",{className:"text-gray-500 font-semibold text-sm mt-3",children:"We sent an email with a verification code to"}),e.jsxs("div",{className:"flex gap-x-1 text-sm",children:[e.jsx("span",{children:s.email}),e.jsx("span",{className:"hover:text-gray-500 hover:cursor-pointer",onClick:()=>i(l.REGISTER),children:"not you?"})]}),e.jsxs("form",{onSubmit:u,children:[e.jsx(j,{type:"password",required:!0,className:"mt-5",placeholder:"Verification code",onChange:a=>d(a.target.value),value:o}),e.jsx(m,{type:"submit",className:"rounded-md mt-8 w-full",children:"Send now"})]}),e.jsxs(m,{className:"rounded-md mt-5 w-full bg-red-500",onClick:x,disabled:r>0,children:["Resend code ",r>0?f(r):null]})]})})]})})}export{I as default};
