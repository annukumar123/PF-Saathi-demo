'use client';
import Link from 'next/link'; import {useState,useEffect} from 'react'; import {Menu,ShieldCheck,Languages,X,ExternalLink,User,LogOut,LogIn} from 'lucide-react'; import {LanguageSelect,useI18n} from './I18n'; import {getAuthUser,logoutUser,AuthUser} from '@/lib/api';
export const Button=({children,href,onClick,secondary=false,type='button',disabled=false}:{children:React.ReactNode;href?:string;onClick?:()=>void;secondary?:boolean;type?:'button'|'submit';disabled?:boolean})=>{const c=`inline-flex min-h-12 items-center justify-center gap-2 rounded-lg px-5 text-sm font-bold transition hover:-translate-y-px disabled:cursor-not-allowed disabled:opacity-60 ${secondary?'border border-[#12345b] bg-white text-ink':'bg-ink text-white shadow-card hover:bg-[#0d2949]'}`;return href?<Link className={c} href={href}>{children}</Link>:<button disabled={disabled} type={type} onClick={onClick} className={c}>{children}</button>}
export function Header(){
  const [open,setOpen]=useState(false);
  const [user,setUser]=useState<AuthUser|null>(null);
  const {lang}=useI18n();

  useEffect(()=>{
    setUser(getAuthUser());
    const handleAuthChange=()=>setUser(getAuthUser());
    window.addEventListener('auth-change',handleAuthChange);
    return ()=>window.removeEventListener('auth-change',handleAuthChange);
  },[]);

  const copy=lang==='hi'?['होम','कैसे काम करता है','सहायता','पीएफ जाँच शुरू करें']:lang==='te'?['హోమ్','ఎలా పనిచేస్తుంది','సహాయం','పీఎఫ్ తనిఖీ ప్రారంభించండి']:['Home','How it works','Help','Start PF Check'];
  const subtitle=lang==='hi'?'पीएफ क्लेम तैयारी जाँचकर्ता':lang==='te'?'పీఎఫ్ క్లెయిమ్ సిద్ధత తనిఖీదారు':'PF Claim Readiness Checker';

  return (
    <header className="border-b border-slate-200 bg-white">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3">
        <Link href="/" className="flex items-center gap-2">
          <span className="grid h-10 w-10 place-items-center rounded-lg bg-ink text-white"><ShieldCheck size={23}/></span>
          <span><b className="block text-lg leading-5 text-ink">PF Saathi</b><small className="text-xs text-slate-600">{subtitle}</small></span>
        </Link>
        <nav className="hidden items-center gap-5 text-sm font-semibold md:flex">
          <Link href="/">{copy[0]}</Link>
          <Link href="/how-it-works">{copy[1]}</Link>
          <Link href="/resources">{copy[2]}</Link>
          <div className="flex items-center gap-1">
            <Languages size={17}/>
            <LanguageSelect/>
          </div>
          {user ? (
            <div className="flex items-center gap-3">
              <span className="inline-flex items-center gap-1.5 rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-xs font-bold text-ink">
                <User size={14} className="text-slate-600"/>
                {user.name}
              </span>
              <button onClick={()=>logoutUser()} title="Log Out" className="flex items-center gap-1 text-xs font-semibold text-rose-700 hover:underline">
                <LogOut size={14}/> Log Out
              </button>
            </div>
          ) : (
            <Link href="/login" className="flex items-center gap-1 text-ink hover:underline">
              <LogIn size={16}/> Log In
            </Link>
          )}
          <Link href="/check" className="rounded-lg bg-ink px-3.5 py-2 text-white transition hover:bg-[#0d2949]">{copy[3]}</Link>
        </nav>
        <button className="min-h-11 min-w-11 md:hidden" aria-label="Open menu" onClick={()=>setOpen(!open)}>{open?<X/>:<Menu/>}</button>
      </div>
      {open&&(
        <nav className="border-t px-4 py-3 md:hidden">
          <div className="mx-auto flex max-w-6xl flex-col gap-3 font-semibold">
            <Link href="/">{copy[0]}</Link>
            <Link href="/how-it-works">{copy[1]}</Link>
            <Link href="/resources">{copy[2]}</Link>
            <Link href="/check">{copy[3]}</Link>
            <div className="flex items-center gap-1 py-1">
              <Languages size={17}/>
              <LanguageSelect/>
            </div>
            {user ? (
              <div className="flex items-center justify-between border-t pt-3">
                <span className="flex items-center gap-1.5 text-xs font-bold text-ink">
                  <User size={14}/> {user.name}
                </span>
                <button onClick={()=>logoutUser()} className="flex items-center gap-1 text-xs font-semibold text-rose-700">
                  <LogOut size={14}/> Log Out
                </button>
              </div>
            ) : (
              <Link href="/login" className="flex items-center gap-1 text-ink py-1 border-t pt-2">
                <LogIn size={16}/> Log In
              </Link>
            )}
          </div>
        </nav>
      )}
    </header>
  );
}
export function TrustBanner(){return <div className="border-b border-amber-200 bg-amber-50"><div className="mx-auto max-w-6xl px-4 py-2 text-center text-xs text-amber-950"><b>Independent tool:</b> PF Saathi is not an official EPFO service. Never enter passwords, OTPs, Aadhaar, PAN, or bank-account numbers.</div></div>}
export function Footer(){return <footer className="mt-16 bg-ink text-slate-200"><div className="mx-auto max-w-6xl px-4 py-10"><div className="flex flex-col justify-between gap-5 sm:flex-row"><div><b className="text-lg text-white">PF Saathi</b><p className="mt-1 text-sm">Check before you claim.</p><p className="mt-2 max-w-lg text-xs leading-5 text-slate-300">Independent public-service assistance tool. PF Saathi does not access or modify EPFO records and does not guarantee claim approval.</p></div><div className="flex flex-wrap gap-x-5 gap-y-2 text-sm"><Link href="/about">About</Link><Link href="/how-it-works">How it works</Link><Link href="/resources">Official resources</Link><Link href="/privacy">Privacy</Link><Link href="/disclaimer">Disclaimer</Link><Link href="/accessibility">Accessibility</Link></div></div></div></footer>}
export function Layout({children}:{children:React.ReactNode}){return <><Header/><TrustBanner/>{children}<Footer/></>}
export const External=({href,children}:{href:string;children:React.ReactNode})=><a className="inline-flex items-center gap-1 font-bold text-ink underline" href={href} target="_blank" rel="noreferrer">{children}<ExternalLink size={15}/></a>;
