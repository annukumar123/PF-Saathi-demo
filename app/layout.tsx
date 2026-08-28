import type { Metadata } from 'next';
import './globals.css';
import {I18nProvider} from '@/components/I18n';
export const metadata: Metadata = { title:'PF Saathi — Check Your PF Claim Before You File', description:'PF Saathi helps EPFO members identify common PF claim issues before submitting their claim.' };
export default function RootLayout({children}:{children:React.ReactNode}) { return <html lang="en"><body><I18nProvider>{children}</I18nProvider></body></html>; }
