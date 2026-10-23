import {memo,useEffect,useState} from 'react';
import {Link} from 'react-router-dom';
import {Anime,get,img,uniq} from './api';
import {useWish} from './store';
export function useApi<T=any>(path:string|null){
  const [s,set]=useState<{data?:T;error?:string;loading:boolean}>({loading:!!path});const [n,setN]=useState(0);
  useEffect(()=>{if(!path)return;let ok=true;set(x=>({...x,loading:true,error:undefined}));
    get<T>(path).then(d=>ok&&set({data:d,loading:false})).catch(e=>ok&&set({error:e.message,loading:false}));return()=>{ok=false}},[path,n]);
  return {...s,retry:()=>setN(x=>x+1)}}
export const Err=({msg,retry}:{msg:string;retry?:()=>void})=><div className="rounded-xl border border-red-500/30 bg-red-500/10 p-4 text-sm">{msg} {retry&&<button onClick={retry} className="ml-2 underline">Retry</button>}</div>;
export const Skel=({n=6}:{n?:number})=><>{Array.from({length:n},(_,i)=><div key={i} className="w-36 shrink-0 md:w-44"><div className="sk aspect-[2/3] rounded-2xl"/><div className="sk mt-2 h-4 rounded"/></div>)}</>;
export const Heart=memo(({a}:{a:Anime})=>{const {has,toggle}=useWish();const on=has(a.mal_id);
  return <button aria-label={on?'Remove from wishlist':'Add to wishlist'} aria-pressed={on} onClick={e=>{e.preventDefault();toggle(a)}} className={'grid h-9 w-9 place-items-center rounded-full backdrop-blur '+(on?'bg-pink-500 text-white':'bg-black/60 text-white hover:bg-violet-600')}>{on?'♥':'♡'}</button>});
export const Card=memo(({a,wide}:{a:Anime;wide?:boolean})=>
  <div className={'group relative '+(wide?'':'w-36 shrink-0 md:w-44')}>
    <Link to={'/anime/'+a.mal_id} className="block">
      <div className="aspect-[2/3] overflow-hidden rounded-2xl bg-[#11142a] ring-1 ring-white/10 transition group-hover:ring-violet-500 group-hover:shadow-[0_0_24px_#7c3aed66]">
        <img src={img(a)} alt={a.title} loading="lazy" onError={e=>{(e.target as HTMLImageElement).style.visibility='hidden'}} className="h-full w-full object-cover transition group-hover:scale-105"/></div>
      <h3 className="mt-2 line-clamp-2 text-sm font-medium">{a.title}</h3>
      <p className="text-xs text-slate-400">{a.score?'★ '+a.score:''}{a.score&&a.year?' · ':''}{a.year||''}</p>
      <span className="mt-1 inline-block rounded-full bg-violet-600/20 px-3 py-1 text-xs text-violet-300">View Details</span></Link>
    <div className="absolute right-2 top-2"><Heart a={a}/></div></div>);
export function Row({title,path}:{title:string;path:string}){
  const {data,loading,error,retry}=useApi<{data:Anime[]}>(path);
  return <section className="mb-8"><h2 className="mb-3 text-xl font-bold">{title}</h2>
    {error?<Err msg={error} retry={retry}/>:<div className="flex gap-4 overflow-x-auto pb-2">{loading?<Skel/>:data&&data.data.length?uniq(data.data).map(a=><Card key={a.mal_id} a={a}/>):<p className="text-slate-400">Nothing to show.</p>}</div>}</section>}
