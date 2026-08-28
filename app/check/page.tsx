'use client';
import {Suspense} from 'react'; import {useSearchParams} from 'next/navigation'; import {Layout} from '@/components/Shell'; import {Checker} from '@/components/Checker';
function Content(){const q=useSearchParams();return <Checker demo={q.get('demo')==='1'}/>}; export default function Check(){return <Layout><Suspense><Content/></Suspense></Layout>}
