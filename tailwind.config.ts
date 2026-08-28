import type { Config } from 'tailwindcss';
export default { content: ['./app/**/*.{ts,tsx}', './components/**/*.{ts,tsx}'], theme: { extend: { colors: { ink:'#12345b', saffron:'#d97706', mist:'#f4f8fc', teal:'#147a6a' }, boxShadow: { card:'0 4px 18px rgba(21,52,91,.08)' } } }, plugins: [] } satisfies Config;
