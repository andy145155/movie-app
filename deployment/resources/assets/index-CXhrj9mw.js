const pe="Logging",_e="NoHubcallbackProvidedException";var g;(function(t){t.DEBUG="DEBUG",t.ERROR="ERROR",t.INFO="INFO",t.WARN="WARN",t.VERBOSE="VERBOSE",t.NONE="NONE"})(g||(g={}));const K={VERBOSE:1,DEBUG:2,INFO:3,WARN:4,ERROR:5,NONE:6};class y{constructor(e,n=g.WARN){this.name=e,this.level=n,this._pluggables=[]}_padding(e){return e<10?"0"+e:""+e}_ts(){const e=new Date;return[this._padding(e.getMinutes()),this._padding(e.getSeconds())].join(":")+"."+e.getMilliseconds()}configure(e){return e?(this._config=e,this._config):this._config}_log(e,...n){let i=this.level;y.LOG_LEVEL&&(i=y.LOG_LEVEL),typeof window<"u"&&window.LOG_LEVEL&&(i=window.LOG_LEVEL);const o=K[i];if(!(K[e]>=o))return;let a=console.log.bind(console);e===g.ERROR&&console.error&&(a=console.error.bind(console)),e===g.WARN&&console.warn&&(a=console.warn.bind(console)),y.BIND_ALL_LOG_LEVELS&&(e===g.INFO&&console.info&&(a=console.info.bind(console)),e===g.DEBUG&&console.debug&&(a=console.debug.bind(console)));const u=`[${e}] ${this._ts()} ${this.name}`;let c="";if(n.length===1&&typeof n[0]=="string")c=`${u} - ${n[0]}`,a(c);else if(n.length===1)c=`${u} ${n[0]}`,a(u,n[0]);else if(typeof n[0]=="string"){let r=n.slice(1);r.length===1&&(r=r[0]),c=`${u} - ${n[0]} ${r}`,a(`${u} - ${n[0]}`,r)}else c=`${u} ${n}`,a(u,n);for(const r of this._pluggables){const f={message:c,timestamp:Date.now()};r.pushLogs([f])}}log(...e){this._log(g.INFO,...e)}info(...e){this._log(g.INFO,...e)}warn(...e){this._log(g.WARN,...e)}error(...e){this._log(g.ERROR,...e)}debug(...e){this._log(g.DEBUG,...e)}verbose(...e){this._log(g.VERBOSE,...e)}addPluggable(e){e&&e.getCategoryName()===pe&&(this._pluggables.push(e),e.configure(this._config))}listPluggables(){return this._pluggables}}y.LOG_LEVEL=null;y.BIND_ALL_LOG_LEVELS=!1;class v extends Error{constructor({message:e,name:n,recoverySuggestion:i,underlyingError:o}){super(e),this.name=n,this.underlyingError=o,this.recoverySuggestion=i,this.constructor=v,Object.setPrototypeOf(this,v.prototype)}}const X=typeof Symbol<"u"?Symbol("amplify_default"):"@@amplify_default",C=new y("Hub");class J{constructor(e){this.listeners=new Map,this.protectedChannels=["core","auth","api","analytics","interactions","pubsub","storage","ui","xr"],this.name=e}_remove(e,n){const i=this.listeners.get(e);if(!i){C.warn(`No listeners for ${e}`);return}this.listeners.set(e,[...i.filter(({callback:o})=>o!==n)])}dispatch(e,n,i,o){typeof e=="string"&&this.protectedChannels.indexOf(e)>-1&&(o===X||C.warn(`WARNING: ${e} is protected and dispatching on it can have unintended consequences`));const s={channel:e,payload:{...n},source:i,patternInfo:[]};try{this._toListeners(s)}catch(a){C.error(a)}}listen(e,n,i="noname"){let o;if(typeof n!="function")throw new v({name:_e,message:"No callback supplied to Hub"});o=n;let s=this.listeners.get(e);return s||(s=[],this.listeners.set(e,s)),s.push({name:i,callback:o}),()=>{this._remove(e,o)}}_toListeners(e){const{channel:n,payload:i}=e,o=this.listeners.get(n);o&&o.forEach(s=>{C.debug(`Dispatching to ${n} with `,i);try{s.callback(e)}catch(a){C.error(a)}})}}const ge=new J("__default__"),pt=new J("internal-hub"),Z=t=>{const e=Reflect.ownKeys(t);for(const n of e){const i=t[n];(i&&typeof i=="object"||typeof i=="function")&&Z(i)}return Object.freeze(t)},Ee=new y("parseAWSExports"),be={API_KEY:"apiKey",AWS_IAM:"iam",AMAZON_COGNITO_USER_POOLS:"userPool",OPENID_CONNECT:"oidc",NONE:"none",AWS_LAMBDA:"lambda",LAMBDA:"lambda"},we=(t={})=>{var D,k,q,$,F,H;if(!Object.prototype.hasOwnProperty.call(t,"aws_project_region"))throw new v({name:"InvalidParameterException",message:"Invalid config parameter.",recoverySuggestion:"Ensure passing the config object imported from  `amplifyconfiguration.json`."});const{aws_appsync_apiKey:e,aws_appsync_authenticationType:n,aws_appsync_graphqlEndpoint:i,aws_appsync_region:o,aws_bots_config:s,aws_cognito_identity_pool_id:a,aws_cognito_sign_up_verification_method:u,aws_cognito_mfa_configuration:c,aws_cognito_mfa_types:r,aws_cognito_password_protection_settings:f,aws_cognito_verification_mechanisms:h,aws_cognito_signup_attributes:d,aws_cognito_social_providers:p,aws_cognito_username_attributes:b,aws_mandatory_sign_in:I,aws_mobile_analytics_app_id:L,aws_mobile_analytics_app_region:O,aws_user_files_s3_bucket:N,aws_user_files_s3_bucket_region:ie,aws_user_files_s3_dangerously_connect_to_http_endpoint_for_testing:oe,aws_user_pools_id:P,aws_user_pools_web_client_id:se,geo:M,oauth:S,predictions:w,aws_cloud_logic_custom:U,Notifications:re,modelIntrospection:B}=t,_={};L&&(_.Analytics={Pinpoint:{appId:L,region:O}});const{InAppMessaging:A,Push:m}=re??{};if(A!=null&&A.AWSPinpoint||m!=null&&m.AWSPinpoint){if(A!=null&&A.AWSPinpoint){const{appId:l,region:x}=A.AWSPinpoint;_.Notifications={InAppMessaging:{Pinpoint:{appId:l,region:x}}}}if(m!=null&&m.AWSPinpoint){const{appId:l,region:x}=m.AWSPinpoint;_.Notifications={..._.Notifications,PushNotification:{Pinpoint:{appId:l,region:x}}}}}if(Array.isArray(s)&&(_.Interactions={LexV1:Object.fromEntries(s.map(l=>[l.name,l]))}),i){const l=be[n];l||Ee.debug(`Invalid authentication type ${n}. Falling back to IAM.`),_.API={GraphQL:{endpoint:i,apiKey:e,region:o,defaultAuthMode:l??"iam"}},B&&(_.API.GraphQL.modelIntrospection=B)}const ae=c?{status:c&&c.toLowerCase(),totpEnabled:(r==null?void 0:r.includes("TOTP"))??!1,smsEnabled:(r==null?void 0:r.includes("SMS"))??!1}:void 0,ce=f?{minLength:f.passwordPolicyMinLength,requireLowercase:((D=f.passwordPolicyCharacters)==null?void 0:D.includes("REQUIRES_LOWERCASE"))??!1,requireUppercase:((k=f.passwordPolicyCharacters)==null?void 0:k.includes("REQUIRES_UPPERCASE"))??!1,requireNumbers:((q=f.passwordPolicyCharacters)==null?void 0:q.includes("REQUIRES_NUMBERS"))??!1,requireSpecialCharacters:(($=f.passwordPolicyCharacters)==null?void 0:$.includes("REQUIRES_SYMBOLS"))??!1}:void 0,ue=Array.from(new Set([...h??[],...d??[]])).reduce((l,x)=>({...l,[x.toLowerCase()]:{required:!0}}),{}),G=(b==null?void 0:b.includes("EMAIL"))??!1,W=(b==null?void 0:b.includes("PHONE_NUMBER"))??!1;(a||P)&&(_.Auth={Cognito:{identityPoolId:a,allowGuestAccess:I!=="enable",signUpVerificationMethod:u,userAttributes:ue,userPoolClientId:se,userPoolId:P,mfa:ae,passwordFormat:ce,loginWith:{username:!(G||W),email:G,phone:W}}});const fe=S?Object.keys(S).length>0:!1,de=p?p.length>0:!1;if(_.Auth&&fe&&(_.Auth.Cognito.loginWith={..._.Auth.Cognito.loginWith,oauth:{...ye(S),...de&&{providers:Ae(p)}}}),N&&(_.Storage={S3:{bucket:N,region:ie,dangerouslyConnectToHttpEndpointForTesting:oe}}),M){const{amazon_location_service:l}=M;_.Geo={LocationService:{maps:l.maps,geofenceCollections:l.geofenceCollections,searchIndices:l.search_indices,region:l.region}}}if(U&&(_.API={..._.API,REST:U.reduce((l,x)=>{const{name:he,endpoint:le,region:j,service:z}=x;return{...l,[he]:{endpoint:le,...z?{service:z}:void 0,...j?{region:j}:void 0}}},{})}),w){const{VoiceId:l}=((H=(F=w==null?void 0:w.convert)==null?void 0:F.speechGenerator)==null?void 0:H.defaults)??{};_.Predictions=l?{...w,convert:{...w.convert,speechGenerator:{...w.convert.speechGenerator,defaults:{voiceId:l}}}}:w}return _},V=t=>(t==null?void 0:t.split(","))??[],ye=({domain:t,scope:e,redirectSignIn:n,redirectSignOut:i,responseType:o})=>({domain:t,scopes:e,redirectSignIn:V(n),redirectSignOut:V(i),responseType:o}),Ae=t=>t.map(e=>{const n=e.toLowerCase();return n.charAt(0).toUpperCase()+n.slice(1)}),me=Symbol("oauth-listener");function xe(t){const{version:e}=t;return e?e.startsWith("1"):!1}function Le(t){if(!t)return;const{bucket_name:e,aws_region:n}=t;return{S3:{bucket:e,region:n}}}function Ce(t){if(!t)return;const{user_pool_id:e,user_pool_client_id:n,identity_pool_id:i,password_policy:o,mfa_configuration:s,mfa_methods:a,unauthenticated_identities_enabled:u,oauth:c,username_attributes:r,standard_required_attributes:f}=t,h={Cognito:{userPoolId:e,userPoolClientId:n}};return i&&(h.Cognito={...h.Cognito,identityPoolId:i}),o&&(h.Cognito.passwordFormat={requireLowercase:o.require_lowercase,requireNumbers:o.require_numbers,requireUppercase:o.require_uppercase,requireSpecialCharacters:o.require_symbols,minLength:o.min_length??6}),s&&(h.Cognito.mfa={status:Ue(s),smsEnabled:a==null?void 0:a.includes("SMS"),totpEnabled:a==null?void 0:a.includes("TOTP")}),u&&(h.Cognito.allowGuestAccess=u),c&&(h.Cognito.loginWith={oauth:{domain:c.domain,redirectSignIn:c.redirect_sign_in_uri,redirectSignOut:c.redirect_sign_out_uri,responseType:c.response_type==="token"?"token":"code",scopes:c.scopes,providers:Me(c.identity_providers)}}),r&&(h.Cognito.loginWith={...h.Cognito.loginWith,email:r.includes("email"),phone:r.includes("phone_number"),username:r.includes("username")}),f&&(h.Cognito.userAttributes=f.reduce((d,p)=>({...d,[p]:{required:!0}}),{})),h}function ve(t){if(!(t!=null&&t.amazon_pinpoint))return;const{amazon_pinpoint:e}=t;return{Pinpoint:{appId:e.app_id,region:e.aws_region}}}function Re(t){if(!t)return;const{aws_region:e,geofence_collections:n,maps:i,search_indices:o}=t;return{LocationService:{region:e,searchIndices:o,geofenceCollections:n,maps:i}}}function Ie(t){if(!t)return;const{aws_region:e,default_authorization_type:n,url:i,api_key:o,model_introspection:s}=t;return{GraphQL:{endpoint:i,defaultAuthMode:Ne(n),region:e,apiKey:o,modelIntrospection:s}}}function Oe(t){if(!t)return;const{aws_region:e,channels:n,amazon_pinpoint_app_id:i}=t,o=n.includes("IN_APP_MESSAGING"),s=n.includes("APNS")||n.includes("FCM");if(!(o||s))return;const a={};return o&&(a.InAppMessaging={Pinpoint:{appId:i,region:e}}),s&&(a.PushNotification={Pinpoint:{appId:i,region:e}}),a}function Se(t){const e={};return t.storage&&(e.Storage=Le(t.storage)),t.auth&&(e.Auth=Ce(t.auth)),t.analytics&&(e.Analytics=ve(t.analytics)),t.geo&&(e.Geo=Re(t.geo)),t.data&&(e.API=Ie(t.data)),t.notifications&&(e.Notifications=Oe(t.notifications)),e}const Te={AMAZON_COGNITO_USER_POOLS:"userPool",API_KEY:"apiKey",AWS_IAM:"iam",AWS_LAMBDA:"lambda",OPENID_CONNECT:"oidc"};function Ne(t){return Te[t]}const Pe={GOOGLE:"Google",LOGIN_WITH_AMAZON:"Amazon",FACEBOOK:"Facebook",SIGN_IN_WITH_APPLE:"Apple"};function Me(t=[]){return t.map(e=>Pe[e])}function Ue(t){return t==="OPTIONAL"?"optional":t==="REQUIRED"?"on":"off"}const Be=t=>Object.keys(t).some(e=>e.startsWith("aws_"))?we(t):xe(t)?Se(t):t;function _t({expiresAt:t,clockDrift:e}){return Date.now()+e>t}class Ge{configure(e,n){this.authConfig=e,this.authOptions=n}async fetchAuthSession(e={}){var s,a,u,c,r,f;let n,i;const o=await this.getTokens(e);return o?(i=(a=(s=o.accessToken)==null?void 0:s.payload)==null?void 0:a.sub,n=await((c=(u=this.authOptions)==null?void 0:u.credentialsProvider)==null?void 0:c.getCredentialsAndIdentityId({authConfig:this.authConfig,tokens:o,authenticated:!0,forceRefresh:e.forceRefresh}))):n=await((f=(r=this.authOptions)==null?void 0:r.credentialsProvider)==null?void 0:f.getCredentialsAndIdentityId({authConfig:this.authConfig,authenticated:!1,forceRefresh:e.forceRefresh})),{tokens:o,credentials:n==null?void 0:n.credentials,identityId:n==null?void 0:n.identityId,userSub:i}}async clearCredentials(){var e,n;await((n=(e=this.authOptions)==null?void 0:e.credentialsProvider)==null?void 0:n.clearCredentialsAndIdentityId())}async getTokens(e){var n,i;return await((i=(n=this.authOptions)==null?void 0:n.tokenProvider)==null?void 0:i.getTokens(e))??void 0}}function We(t,e,n,i){function o(s){return s instanceof n?s:new n(function(a){a(s)})}return new(n||(n=Promise))(function(s,a){function u(f){try{r(i.next(f))}catch(h){a(h)}}function c(f){try{r(i.throw(f))}catch(h){a(h)}}function r(f){f.done?s(f.value):o(f.value).then(u,c)}r((i=i.apply(t,e||[])).next())})}function De(t,e){var n={label:0,sent:function(){if(s[0]&1)throw s[1];return s[1]},trys:[],ops:[]},i,o,s,a;return a={next:u(0),throw:u(1),return:u(2)},typeof Symbol=="function"&&(a[Symbol.iterator]=function(){return this}),a;function u(r){return function(f){return c([r,f])}}function c(r){if(i)throw new TypeError("Generator is already executing.");for(;a&&(a=0,r[0]&&(n=0)),n;)try{if(i=1,o&&(s=r[0]&2?o.return:r[0]?o.throw||((s=o.return)&&s.call(o),0):o.next)&&!(s=s.call(o,r[1])).done)return s;switch(o=0,s&&(r=[r[0]&2,s.value]),r[0]){case 0:case 1:s=r;break;case 4:return n.label++,{value:r[1],done:!1};case 5:n.label++,o=r[1],r=[0];continue;case 7:r=n.ops.pop(),n.trys.pop();continue;default:if(s=n.trys,!(s=s.length>0&&s[s.length-1])&&(r[0]===6||r[0]===2)){n=0;continue}if(r[0]===3&&(!s||r[1]>s[0]&&r[1]<s[3])){n.label=r[1];break}if(r[0]===6&&n.label<s[1]){n.label=s[1],s=r;break}if(s&&n.label<s[2]){n.label=s[2],n.ops.push(r);break}s[2]&&n.ops.pop(),n.trys.pop();continue}r=e.call(t,n)}catch(f){r=[6,f],o=0}finally{i=s=0}if(r[0]&5)throw r[1];return{value:r[0]?r[1]:void 0,done:!0}}}var E=64,ke=32,qe=new Uint32Array([1116352408,1899447441,3049323471,3921009573,961987163,1508970993,2453635748,2870763221,3624381080,310598401,607225278,1426881987,1925078388,2162078206,2614888103,3248222580,3835390401,4022224774,264347078,604807628,770255983,1249150122,1555081692,1996064986,2554220882,2821834349,2952996808,3210313671,3336571891,3584528711,113926993,338241895,666307205,773529912,1294757372,1396182291,1695183700,1986661051,2177026350,2456956037,2730485921,2820302411,3259730800,3345764771,3516065817,3600352804,4094571909,275423344,430227734,506948616,659060556,883997877,958139571,1322822218,1537002063,1747873779,1955562222,2024104815,2227730452,2361852424,2428436474,2756734187,3204031479,3329325298]),$e=[1779033703,3144134277,1013904242,2773480762,1359893119,2600822924,528734635,1541459225],Fe=Math.pow(2,53)-1,R=function(){function t(){this.state=Int32Array.from($e),this.temp=new Int32Array(64),this.buffer=new Uint8Array(64),this.bufferLength=0,this.bytesHashed=0,this.finished=!1}return t.prototype.update=function(e){if(this.finished)throw new Error("Attempted to update an already finished hash.");var n=0,i=e.byteLength;if(this.bytesHashed+=i,this.bytesHashed*8>Fe)throw new Error("Cannot hash more than 2^53 - 1 bits");for(;i>0;)this.buffer[this.bufferLength++]=e[n++],i--,this.bufferLength===E&&(this.hashBuffer(),this.bufferLength=0)},t.prototype.digest=function(){if(!this.finished){var e=this.bytesHashed*8,n=new DataView(this.buffer.buffer,this.buffer.byteOffset,this.buffer.byteLength),i=this.bufferLength;if(n.setUint8(this.bufferLength++,128),i%E>=E-8){for(var o=this.bufferLength;o<E;o++)n.setUint8(o,0);this.hashBuffer(),this.bufferLength=0}for(var o=this.bufferLength;o<E-8;o++)n.setUint8(o,0);n.setUint32(E-8,Math.floor(e/4294967296),!0),n.setUint32(E-4,e),this.hashBuffer(),this.finished=!0}for(var s=new Uint8Array(ke),o=0;o<8;o++)s[o*4]=this.state[o]>>>24&255,s[o*4+1]=this.state[o]>>>16&255,s[o*4+2]=this.state[o]>>>8&255,s[o*4+3]=this.state[o]>>>0&255;return s},t.prototype.hashBuffer=function(){for(var e=this,n=e.buffer,i=e.state,o=i[0],s=i[1],a=i[2],u=i[3],c=i[4],r=i[5],f=i[6],h=i[7],d=0;d<E;d++){if(d<16)this.temp[d]=(n[d*4]&255)<<24|(n[d*4+1]&255)<<16|(n[d*4+2]&255)<<8|n[d*4+3]&255;else{var p=this.temp[d-2],b=(p>>>17|p<<15)^(p>>>19|p<<13)^p>>>10;p=this.temp[d-15];var I=(p>>>7|p<<25)^(p>>>18|p<<14)^p>>>3;this.temp[d]=(b+this.temp[d-7]|0)+(I+this.temp[d-16]|0)}var L=(((c>>>6|c<<26)^(c>>>11|c<<21)^(c>>>25|c<<7))+(c&r^~c&f)|0)+(h+(qe[d]+this.temp[d]|0)|0)|0,O=((o>>>2|o<<30)^(o>>>13|o<<19)^(o>>>22|o<<10))+(o&s^o&a^s&a)|0;h=f,f=r,r=c,c=u+L|0,u=a,a=s,s=o,o=L+O|0}i[0]+=o,i[1]+=s,i[2]+=a,i[3]+=u,i[4]+=c,i[5]+=r,i[6]+=f,i[7]+=h},t}();const He=t=>new TextEncoder().encode(t);var je=typeof Buffer<"u"&&Buffer.from?function(t){return Buffer.from(t,"utf8")}:He;function ee(t){return t instanceof Uint8Array?t:typeof t=="string"?je(t):ArrayBuffer.isView(t)?new Uint8Array(t.buffer,t.byteOffset,t.byteLength/Uint8Array.BYTES_PER_ELEMENT):new Uint8Array(t)}function ze(t){return typeof t=="string"?t.length===0:t.byteLength===0}var gt=function(){function t(e){this.secret=e,this.hash=new R,this.reset()}return t.prototype.update=function(e){if(!(ze(e)||this.error))try{this.hash.update(ee(e))}catch(n){this.error=n}},t.prototype.digestSync=function(){if(this.error)throw this.error;return this.outer?(this.outer.finished||this.outer.update(this.hash.digest()),this.outer.digest()):this.hash.digest()},t.prototype.digest=function(){return We(this,void 0,void 0,function(){return De(this,function(e){return[2,this.digestSync()]})})},t.prototype.reset=function(){if(this.hash=new R,this.secret){this.outer=new R;var e=Ke(this.secret),n=new Uint8Array(E);n.set(e);for(var i=0;i<E;i++)e[i]^=54,n[i]^=92;this.hash.update(e),this.outer.update(n);for(var i=0;i<e.byteLength;i++)e[i]=0}},t}();function Ke(t){var e=ee(t);if(e.byteLength>E){var n=new R;n.update(e),e=n.digest()}var i=new Uint8Array(E);return i.set(e),i}const te={};for(let t=0;t<256;t++){let e=t.toString(16).toLowerCase();e.length===1&&(e=`0${e}`),te[t]=e}function Et(t){let e="";for(let n=0;n<t.byteLength;n++)e+=te[t[n]];return e}class Ve{constructor(){this.oAuthListener=void 0,this.resourcesConfig={},this.libraryOptions={},this.Auth=new Ge}configure(e,n){const i=Be(e);this.resourcesConfig=i,n&&(this.libraryOptions=n),this.resourcesConfig=Z(this.resourcesConfig),this.Auth.configure(this.resourcesConfig.Auth,this.libraryOptions.Auth),ge.dispatch("core",{event:"configure",data:this.resourcesConfig},"Configure",X),this.notifyOAuthListener()}getConfig(){return this.resourcesConfig}[me](e){var n,i,o;(i=(n=this.resourcesConfig.Auth)==null?void 0:n.Cognito.loginWith)!=null&&i.oauth?e((o=this.resourcesConfig.Auth)==null?void 0:o.Cognito):this.oAuthListener=e}notifyOAuthListener(){var e,n,i;!((n=(e=this.resourcesConfig.Auth)==null?void 0:e.Cognito.loginWith)!=null&&n.oauth)||!this.oAuthListener||(this.oAuthListener((i=this.resourcesConfig.Auth)==null?void 0:i.Cognito),this.oAuthListener=void 0)}}const bt=new Ve,ne=t=>{const{headers:e,statusCode:n}=t;return{...Ye(t)?t.$metadata:{},httpStatusCode:n,requestId:e["x-amzn-requestid"]??e["x-amzn-request-id"]??e["x-amz-request-id"],extendedRequestId:e["x-amz-id-2"],cfId:e["x-amz-cf-id"]}},Ye=t=>typeof(t==null?void 0:t.$metadata)=="object",wt=async t=>{if(!t||t.statusCode<300)return;const e=await Qe(t),i=(a=>{const[u]=a.toString().split(/[,:]+/);return u.includes("#")?u.split("#")[1]:u})(t.headers["x-amzn-errortype"]??e.code??e.__type??"UnknownError"),o=e.message??e.Message??"Unknown error",s=new Error(o);return Object.assign(s,{name:i,$metadata:ne(t)})},Qe=async t=>{if(!t.body)throw new Error("Missing response payload");const e=await t.body.json();return Object.assign(e,{$metadata:ne(t)})},Xe=3,Je=({maxAttempts:t=Xe,retryDecider:e,computeDelay:n,abortSignal:i})=>{if(t<1)throw new Error("maxAttempts must be greater than 0");return(o,s)=>async function(u){let c,r=s.attemptsCount??0,f;const h=()=>{if(f)return Y(f,r),f;throw Y(c,r),c};for(;!(i!=null&&i.aborted)&&r<t;){try{f=await o(u),c=void 0}catch(d){c=d,f=void 0}if(r=(s.attemptsCount??0)>r?s.attemptsCount??0:r+1,s.attemptsCount=r,await e(f,c)){if(!(i!=null&&i.aborted)&&r<t){const d=n(r);await Ze(d,i)}continue}else return h()}if(i!=null&&i.aborted)throw new Error("Request aborted.");return h()}},Ze=(t,e)=>{if(e!=null&&e.aborted)return Promise.resolve();let n,i;const o=new Promise(s=>{i=s,n=setTimeout(s,t)});return e==null||e.addEventListener("abort",function s(a){clearTimeout(n),e==null||e.removeEventListener("abort",s),i()}),o},Y=(t,e)=>{Object.prototype.toString.call(t)==="[object Object]"&&(t.$metadata={...t.$metadata??{},attempts:e})},et=({userAgentHeader:t="x-amz-user-agent",userAgentValue:e=""})=>n=>async function(o){if(e.trim().length===0)return await n(o);{const s=t.toLowerCase();return o.headers[s]=o.headers[s]?`${o.headers[s]} ${e}`:e,await n(o)}},tt=(t,e)=>(n,i)=>{const o={};let s=a=>t(a,i);for(let a=e.length-1;a>=0;a--){const u=e[a];s=u(i)(s,o)}return s(n)},T=t=>{let e;return()=>(e||(e=t()),e)},nt=t=>!["HEAD","GET","DELETE"].includes(t.toUpperCase()),it=async({url:t,method:e,headers:n,body:i},{abortSignal:o,cache:s,withCrossDomainCredentials:a})=>{var h;let u;try{u=await fetch(t,{method:e,headers:n,body:nt(e)?i:void 0,signal:o,cache:s,credentials:a?"include":"same-origin"})}catch(d){throw d instanceof TypeError?new Error("Network error"):d}const c={};(h=u.headers)==null||h.forEach((d,p)=>{c[p.toLowerCase()]=d});const r={statusCode:u.status,headers:c,body:null},f=Object.assign(u.body??{},{text:T(()=>u.text()),blob:T(()=>u.blob()),json:T(()=>u.json())});return{...r,body:f}},yt=tt(it,[et,Je]),ot=5*60*1e3;function st(t=ot){return i=>{const o=2**i*100+100*Math.random();return o>t?!1:o}}const Q=5*60*1e3,At=t=>{const n=st(Q)(t);return n===!1?Q:n},rt=["AuthFailure","InvalidSignatureException","RequestExpired","RequestInTheFuture","RequestTimeTooSkewed","SignatureDoesNotMatch","BadRequestException"],at=t=>!!t&&rt.includes(t),mt=t=>async(e,n)=>{const i=n??await t(e)??void 0,o=(i==null?void 0:i.code)||(i==null?void 0:i.name),s=e==null?void 0:e.statusCode;return dt(n)||ft(s,o)||at(o)||ht(s,o)},ct=["BandwidthLimitExceeded","EC2ThrottledException","LimitExceededException","PriorRequestNotComplete","ProvisionedThroughputExceededException","RequestLimitExceeded","RequestThrottled","RequestThrottledException","SlowDown","ThrottledException","Throttling","ThrottlingException","TooManyRequestsException"],ut=["TimeoutError","RequestTimeout","RequestTimeoutException"],ft=(t,e)=>t===429||!!e&&ct.includes(e),dt=t=>(t==null?void 0:t.name)==="Network error",ht=(t,e)=>!!t&&[500,502,503,504].includes(t)||!!e&&ut.includes(e),xt=URL,Lt=URLSearchParams;export{bt as A,y as C,ge as H,gt as S,v as a,xt as b,tt as c,Lt as d,yt as e,it as f,mt as g,Qe as h,ne as i,At as j,_t as k,X as l,pt as m,Be as n,wt as p,Je as r,Et as t,et as u};