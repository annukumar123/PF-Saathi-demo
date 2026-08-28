export type NameMatch = { kind:'MATCH'|'MINOR_DIFFERENCE'|'POSSIBLE_MISMATCH'|'REVIEW'; detail:string };
const clean=(s:string)=>s.toLowerCase().trim().replace(/[.,'’_-]/g,'').replace(/\s+/g,' ');
export function compareNames(left:string,right:string):NameMatch {
  const a=clean(left), b=clean(right); if(!a||!b) return {kind:'REVIEW',detail:'Enter both names to compare them.'};
  if(a===b) return {kind:'MATCH',detail:'The names match after normalising spaces, case and punctuation.'};
  const at=a.split(' '), bt=b.split(' '); const nonInitial=(x:string[])=>x.filter(t=>t.length>1);
  if(nonInitial(at).join(' ')===nonInitial(bt).join(' ')) return {kind:'MINOR_DIFFERENCE',detail:'The difference appears to be an extra or missing initial.'};
  const dist=lev(a,b); const ratio=dist/Math.max(a.length,b.length);
  if(ratio<=.2) return {kind:'MINOR_DIFFERENCE',detail:'The names have a small spelling or formatting difference.'};
  return {kind:'POSSIBLE_MISMATCH',detail:'The names are materially different and may need to be checked.'};
}
function lev(a:string,b:string){const p=Array.from({length:b.length+1},(_,i)=>i); for(let i=1;i<=a.length;i++){let q=i;for(let j=1;j<=b.length;j++){const t=Math.min(p[j]+1,q+1,p[j-1]+(a[i-1]===b[j-1]?0:1));p[j-1]=q;q=t}p[b.length]=q}return p[b.length]}
