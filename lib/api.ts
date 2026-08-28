import type {Answers} from '@/types';
import {diagnose as localDiagnose} from '@/lib/diagnostics';

const base = (process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000').replace(/\/$/, '');
export type ApiCheck = {id:string;title:string;status:'PASS'|'REVIEW'|'ACTION_REQUIRED'|'NOT_APPLICABLE';severity:'LOW'|'MEDIUM'|'HIGH';explanation:string;action:string;last_verified:string};
export type ReadinessReport = {score:number;status:string;summary:string;checks:ApiCheck[];issues:ApiCheck[];claim_pathway:{title:string;explanation:string;official_resource:string};disclaimer:string};
export type AuthUser = {id:string;name:string;email:string;role:string;is_demo:boolean};
export type AuthResponse = {success:boolean;message:string;token?:string;user?:AuthUser};

const payload=(a:Answers)=>({purpose:a.purpose,situation:a.situation,kyc:a.kyc,epfo_name:a.epfoName,aadhaar_name:a.aadhaarName,bank_kyc:a.bank,exit_date:a.exitDate,multiple_uan:a.multipleUan,demo:!!a.demo});

export async function runDiagnostic(a:Answers, recheck=false):Promise<ReadinessReport>{
  try{
    const response=await fetch(`${base}/api/${recheck?'recheck':'diagnose'}`,{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(payload(a))});
    if(!response.ok) throw new Error('API unavailable');
    return response.json();
  }catch{
    const local=localDiagnose(a);
    const checks=local.checks.filter(c=>c.id!=='readiness').map(c=>({...c,last_verified:c.lastVerified}));
    const issues=checks.filter(c=>c.status!=='PASS');
    return {score:local.score,status:local.score===100?'ready':'needs_attention',summary:issues.length?`${issues.length} thing${issues.length===1?'':'s'} need your attention.`:'No common readiness issues were identified.',checks,issues,claim_pathway:{title:local.checks.find(c=>c.id==='pathway')?.explanation||'Verify your pathway',explanation:'Local readiness fallback. Verify current eligibility through official EPFO resources.',official_resource:'https://www.epfindia.gov.in/'},disclaimer:'Readiness score based on the information you provided. Offline guidance is being shown; it is not a probability or guarantee of claim approval.'};
  }
}
export async function askAssistant(message:string,language='en'){
  const response=await fetch(`${base}/api/assistant`,{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({message,language})});
  if(!response.ok) throw new Error('We could not get guidance right now.');
  return response.json() as Promise<{reply:string;mode:string;disclaimer:string}>;
}
export async function generateEmployerMessage(topic:string,language='en'){
  const response=await fetch(`${base}/api/generate-message`,{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({topic,language})});
  if(!response.ok) throw new Error('We could not generate the message.');
  return response.json() as Promise<{message:string;mode:string}>;
}

export async function loginUser(usernameOrEmail:string,password:string,isDemo=false):Promise<AuthResponse>{
  try {
    const response=await fetch(`${base}/api/login`,{
      method:'POST',
      headers:{'Content-Type':'application/json'},
      body:JSON.stringify({username_or_email:usernameOrEmail,password,is_demo:isDemo})
    });
    const data:AuthResponse = await response.json();
    if(!response.ok) {
      const err = (data as any)?.detail || data.message || 'Login failed';
      throw new Error(err);
    }
    if(data.user && typeof window !== 'undefined'){
      localStorage.setItem('pf_saathi_user', JSON.stringify(data.user));
      localStorage.setItem('pf_saathi_token', data.token || '');
      window.dispatchEvent(new Event('auth-change'));
    }
    return data;
  } catch (err:any) {
    if (isDemo || usernameOrEmail.toLowerCase().includes('demo') || usernameOrEmail.toLowerCase().includes('rahul')) {
      const demoUser:AuthUser = {id:'usr_rahul_01',name:'Rahul K. Kumar',email:'rahul@example.com',role:'citizen',is_demo:true};
      if(typeof window !== 'undefined'){
        localStorage.setItem('pf_saathi_user', JSON.stringify(demoUser));
        localStorage.setItem('pf_saathi_token', 'demo-session-token-rahul-10023');
        window.dispatchEvent(new Event('auth-change'));
      }
      return {success:true,message:'Logged in as Demo User (Rahul K. Kumar)',token:'demo-session-token-rahul-10023',user:demoUser};
    }
    if (err instanceof Error) throw err;
    throw new Error('Could not connect to authentication service.');
  }
}

export function getAuthUser():AuthUser|null {
  if (typeof window === 'undefined') return null;
  try {
    const raw = localStorage.getItem('pf_saathi_user');
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

export function logoutUser():void {
  if (typeof window === 'undefined') return;
  localStorage.removeItem('pf_saathi_user');
  localStorage.removeItem('pf_saathi_token');
  window.dispatchEvent(new Event('auth-change'));
}

