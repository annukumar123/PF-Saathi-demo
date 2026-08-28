'use client';
import {createContext,useContext,useEffect,useState} from 'react';
type Lang='en'|'hi'|'te'; const labels={en:'English',hi:'हिन्दी',te:'తెలుగు'};
const C=createContext<{lang:Lang;setLang:(l:Lang)=>void}>({lang:'en',setLang:()=>{}});
export function I18nProvider({children}:{children:React.ReactNode}){const [lang,setLangState]=useState<Lang>('en');useEffect(()=>{const saved=localStorage.getItem('pf-saathi-language') as Lang|null;if(saved){setLangState(saved);document.documentElement.lang=saved}},[]);const setLang=(l:Lang)=>{setLangState(l);localStorage.setItem('pf-saathi-language',l);document.documentElement.lang=l};return <C.Provider value={{lang,setLang}}>{children}</C.Provider>}
export const useI18n=()=>useContext(C);
export function LanguageSelect(){const {lang,setLang}=useI18n();return <label className="flex items-center gap-1 text-sm"><span className="sr-only">Language</span><select className="bg-transparent font-semibold" aria-label="Language selector" value={lang} onChange={e=>setLang(e.target.value as Lang)}>{Object.entries(labels).map(([k,v])=><option value={k} key={k}>{v}</option>)}</select></label>}
