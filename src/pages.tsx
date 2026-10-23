import {useEffect,useState} from 'react';
import {Link,useParams,useSearchParams} from 'react-router-dom';
import {Anime,GENRES,Page,uniq,img} from './api';
import {Card,Err,Heart,Row,Skel,useApi} from './ui';
import {useWish} from './store';

export function Home(){
  const {data}=useApi<Page>('/top/anime?filter=airing&limit=5');const h=data?.data?.[0];
  return <div>
    <div className="mb-8 overflow-hidden rounded-3xl bg-gradient-to-br from-violet-900/40 to-blue-900/30 ring-1 ring-white/10" style={h?{backgroundImage:`linear-gradient(90deg,#05060fee 40%,#05060f55),url(${img(h)})`,backgroundSize:'cover',backgroundPosition:'center 20%'}:{}}>
      <div className="min-h-[260px] p-6 md:max-w-xl md:p-12"><p className="text-xs uppercase tracking-widest text-violet-300">Featured</p>
        {h?<><h1 className="mt-2 text-3xl font-extrabold md:text-4xl">{h.title}</h1><p className="mt-3 line-clamp-3 text-sm text-slate-300">{h.synopsis||'Synopsis not available.'}</p>
        <div className="mt-5 flex items-center gap-3"><Link to={'/anime/'+h.mal_id} className="rounded-full bg-violet-600 px-5 py-2 font-medium hover:bg-violet-500">View Details</Link><Heart a={h}/></div></>:<div className="sk mt-4 h-24 rounded-xl"/>}</div></div>
    <Row title="Trending Now" path="/seasons/now?limit=15&sfw=true"/>
    <Row title="Popular" path="/top/anime?filter=bypopularity&limit=15&sfw=true"/>
    <Row title="Top Rated" path="/top/anime?limit=15&sfw=true"/>
    <Row title="Currently Airing" path="/top/anime?filter=airing&limit=15&sfw=true"/>
    <Row title="Upcoming Releases" path="/seasons/upcoming?limit=15&sfw=true"/>
    {GENRES.slice(0,3).map(([n,id])=><Row key={id} title={n+' Collection'} path={`/anime?genres=${id}&order_by=score&sort=desc&limit=15&sfw=true`}/>)}
  </div>}

const sel='rounded-lg bg-[#11142a] px-3 py-2 text-sm ring-1 ring-white/10';
export function Discover({focus}:{focus?:boolean}){
  const [sp,setSp]=useSearchParams();const [q,setQ]=useState(sp.get('q')||'');const [dq,setDq]=useState(q);
  const f={genre:sp.get('genre')||'',year:sp.get('year')||'',type:sp.get('type')||'',status:sp.get('status')||'',sort:sp.get('sort')||'popularity'};
  const [page,setPage]=useState(1);const [items,setItems]=useState<Anime[]>([]);
  useEffect(()=>{const t=setTimeout(()=>setDq(q.trim()),450);return()=>clearTimeout(t)},[q]);
  const key=JSON.stringify([dq,f]);useEffect(()=>{setPage(1);setItems([])},[key]);
  const p=new URLSearchParams({page:String(page),limit:'24',sfw:'true'});
  if(dq)p.set('q',dq);if(f.genre)p.set('genres',f.genre);if(f.type)p.set('type',f.type);if(f.status)p.set('status',f.status);
  if(f.year){p.set('start_date',f.year+'-01-01');p.set('end_date',f.year+'-12-31')}
  if(f.sort==='title'){p.set('order_by','title');p.set('sort','asc')}else if(f.sort==='rating'){p.set('order_by','score');p.set('sort','desc')}else{p.set('order_by','popularity');p.set('sort','asc')}
  const {data,loading,error,retry}=useApi<Page>('/anime?'+p);
  useEffect(()=>{if(data)setItems(prev=>uniq([...(page===1?[]:prev),...data.data]))},[data]);
  const set=(k:string,v:string)=>{const n=new URLSearchParams(sp);v?n.set(k,v):n.delete(k);setSp(n,{replace:true})};
  const cy=new Date().getFullYear();const years=Array.from({length:cy-1960+2},(_,i)=>String(cy+1-i));
  return <div><h1 className="mb-4 text-2xl font-bold">{focus?'Search':'Discover'}</h1>
    <div className="mb-6 flex flex-wrap gap-2">
      <input autoFocus={focus} value={q} onChange={e=>setQ(e.target.value)} placeholder="Search anime by title…" aria-label="Search anime" className={sel+' min-w-[200px] flex-1'}/>
      <select aria-label="Genre" className={sel} value={f.genre} onChange={e=>set('genre',e.target.value)}><option value="">All genres</option>{GENRES.map(([n,id])=><option key={id} value={id}>{n}</option>)}</select>
      <select aria-label="Year" className={sel} value={f.year} onChange={e=>set('year',e.target.value)}><option value="">Any year</option>{years.map(y=><option key={y}>{y}</option>)}</select>
      <select aria-label="Type" className={sel} value={f.type} onChange={e=>set('type',e.target.value)}><option value="">Any type</option>{['tv','movie','ova','ona','special'].map(t=><option key={t} value={t}>{t.toUpperCase()}</option>)}</select>
      <select aria-label="Status" className={sel} value={f.status} onChange={e=>set('status',e.target.value)}><option value="">Any status</option><option value="airing">Airing</option><option value="complete">Finished</option><option value="upcoming">Upcoming</option></select>
      <select aria-label="Sort" className={sel} value={f.sort} onChange={e=>set('sort',e.target.value)}><option value="popularity">Popularity</option><option value="rating">Rating</option><option value="title">Title</option></select>
      <button onClick={()=>{setQ('');setSp({},{replace:true})}} className="rounded-lg bg-violet-600/30 px-3 py-2 text-sm hover:bg-violet-600/50">Clear filters</button></div>
    {error&&<Err msg={error} retry={retry}/>}
    <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6">{items.map(a=><Card key={a.mal_id} a={a} wide/>)}{loading&&<Skel n={6}/>}</div>
    {!loading&&!error&&!items.length&&<p className="py-16 text-center text-slate-400">No anime found. Try different search terms or filters.</p>}
    {data?.pagination?.has_next_page&&!loading&&<div className="mt-8 text-center"><button onClick={()=>setPage(x=>x+1)} className="rounded-full bg-violet-600 px-8 py-2 hover:bg-violet-500">Load More</button></div>}
    <p className="mt-6 text-center text-xs text-slate-500">Results load live from the Jikan (MyAnimeList) database, page by page.</p></div>}

export function Genres(){return <div><h1 className="mb-4 text-2xl font-bold">Genres</h1>
  <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4">{GENRES.map(([n,id])=><Link key={id} to={'/discover?genre='+id} className="rounded-2xl bg-gradient-to-br from-violet-700/40 to-blue-700/30 p-6 text-center font-semibold ring-1 ring-white/10 hover:ring-violet-400">{n}</Link>)}</div></div>}

export function Wishlist(){const {list,toggle}=useWish();
  if(!list.length)return <div className="py-20 text-center"><div className="text-6xl">💜</div><h1 className="mt-4 text-xl font-bold">Your wishlist is empty</h1><p className="mt-2 text-slate-400">Tap the heart on any anime to save it here.</p><Link to="/discover" className="mt-5 inline-block rounded-full bg-violet-600 px-6 py-2">Discover anime</Link></div>;
  return <div><h1 className="mb-4 text-2xl font-bold">Wishlist ({list.length})</h1><div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6">{list.map(a=><div key={a.mal_id}><Card a={a} wide/><button onClick={()=>toggle(a)} className="mt-1 text-xs text-pink-400 underline">Remove</button></div>)}</div></div>}

export function Detail(){
  const {id}=useParams();const {data,loading,error,retry}=useApi<{data:Anime}>('/anime/'+id+'/full');
  const a=data?.data;const g=a?.genres?.[0];
  const sim=useApi<Page>(g?`/anime?genres=${g.mal_id}&order_by=score&sort=desc&limit=13&sfw=true`:null);
  const [tr,setTr]=useState(false);const [ready,setReady]=useState(false);const {toggle,has}=useWish();
  if(loading)return <div className="sk h-96 rounded-3xl"/>;if(error)return <Err msg={error} retry={retry}/>;if(!a)return null;
  const yt=a.trailer?.youtube_id;const na='Not available';
  const share=async()=>{const u=location.href;try{navigator.share?await navigator.share({title:a.title,url:u}):await navigator.clipboard.writeText(u)}catch{}};
  const row=(k:string,v?:string|number|null)=><div className="flex justify-between gap-4 border-b border-white/5 py-2 text-sm"><span className="text-slate-400">{k}</span><span className="text-right">{v||na}</span></div>;
  return <div><div className="grid gap-6 md:grid-cols-[260px_1fr]">
    <img src={img(a)} alt={a.title} className="mx-auto w-56 rounded-2xl ring-1 ring-white/10 md:w-full"/>
    <div><h1 className="text-3xl font-extrabold">{a.title}</h1>{a.title_japanese&&<p className="text-slate-400">{a.title_japanese}</p>}
      <div className="mt-3 flex flex-wrap gap-2">{a.genres.map(x=><Link key={x.mal_id} to={'/discover?genre='+x.mal_id} className="rounded-full bg-violet-600/20 px-3 py-1 text-xs text-violet-300">{x.name}</Link>)}</div>
      <div className="mt-4 flex flex-wrap gap-2">
        <button onClick={()=>toggle(a)} className="rounded-full bg-violet-600 px-5 py-2 hover:bg-violet-500">{has(a.mal_id)?'♥ In Wishlist':'♡ Add to Wishlist'}</button>
        {yt?<button onClick={()=>{setReady(false);setTr(true)}} className="rounded-full bg-blue-600 px-5 py-2 hover:bg-blue-500">▶ Watch Trailer</button>:<span className="rounded-full bg-white/5 px-4 py-2 text-sm text-slate-400">No trailer available</span>}
        <button onClick={share} className="rounded-full bg-white/10 px-5 py-2 hover:bg-white/20">Share</button></div>
      <h2 className="mt-6 font-bold">Synopsis</h2><p className="mt-1 whitespace-pre-line text-sm leading-relaxed text-slate-300">{a.synopsis||na}</p>
      <div className="mt-5">{row('Type',a.type)}{row('Episodes',a.episodes)}{row('Status',a.status)}{row('Released',[a.season,a.year].filter(Boolean).join(' '))}{row('Studio',a.studios?.map(s=>s.name).join(', '))}{row('Rating',a.score&&'★ '+a.score)}{row('Rank',a.rank&&'#'+a.rank)}{row('Popularity',a.popularity&&'#'+a.popularity)}</div></div></div>
    {sim.data&&<section className="mt-10"><h2 className="mb-1 text-xl font-bold">More {g?.name} anime</h2><p className="mb-3 text-xs text-slate-500">Matched by shared genre, not personalised.</p><div className="flex gap-4 overflow-x-auto pb-2">{uniq(sim.data.data).filter(x=>x.mal_id!==a.mal_id).map(x=><Card key={x.mal_id} a={x}/>)}</div></section>}
    {tr&&yt&&<div role="dialog" aria-modal="true" className="fixed inset-0 z-50 grid place-items-center bg-black/85 p-4" onClick={()=>setTr(false)}>
      <div className="w-full max-w-3xl" onClick={e=>e.stopPropagation()}><div className="relative aspect-video overflow-hidden rounded-xl bg-black">{!ready&&<div className="sk absolute inset-0 grid place-items-center text-sm">Loading trailer…</div>}
        <iframe title="Trailer" className="relative h-full w-full" src={`https://www.youtube-nocookie.com/embed/${yt}?autoplay=1`} allow="autoplay; encrypted-media; picture-in-picture" allowFullScreen onLoad={()=>setReady(true)}/></div>
        <p className="mt-3 text-center text-sm text-slate-300">Video not playing? <a className="text-violet-300 underline" href={'https://www.youtube.com/watch?v='+yt} target="_blank" rel="noreferrer">Open on YouTube</a> · <button className="underline" onClick={()=>setTr(false)}>Close</button></p></div></div>}</div>}
