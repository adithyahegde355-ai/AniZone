import {HashRouter,NavLink,Route,Routes} from 'react-router-dom';
import {Provider,useWish} from './store';
import {Detail,Discover,Genres,Home,Wishlist} from './pages';
const nav=[['/','Home','⌂'],['/discover','Discover','✦'],['/genres','Genres','▦'],['/wishlist','Wishlist','♥'],['/search','Search','⌕']];
function Nav({mobile}:{mobile?:boolean}){const {list}=useWish();
  return <nav aria-label="Main" className={mobile?'fixed inset-x-0 bottom-0 z-40 flex border-t border-white/10 bg-[#080a1c]/95 pb-[env(safe-area-inset-bottom)] backdrop-blur md:hidden':'hidden md:flex md:flex-col md:gap-1'}>
    {nav.map(([to,l,i])=><NavLink key={to} to={to} end={to==='/'} className={({isActive})=>(mobile?'flex flex-1 flex-col items-center py-2 text-[11px] ':'rounded-lg px-4 py-2 ')+(isActive?'text-violet-400 '+(mobile?'':'bg-violet-600/20'):'text-slate-400 hover:text-white')}>{mobile&&<span className="text-lg">{i}</span>}{l}{l==='Wishlist'&&list.length>0&&<span className="ml-1 text-xs text-pink-400">({list.length})</span>}</NavLink>)}</nav>}
export default function App(){return <Provider><HashRouter>
  <div className="mx-auto flex max-w-[1400px]"><aside className="sticky top-0 hidden h-screen w-56 shrink-0 p-5 md:block"><div className="mb-6 bg-gradient-to-r from-violet-400 to-cyan-400 bg-clip-text text-2xl font-black text-transparent">Anizone</div><Nav/><p className="mt-6 text-xs text-slate-500">Discover Your Next Anime Obsession.</p></aside>
  <main className="min-w-0 flex-1 p-4 pb-24 md:p-6"><div className="mb-4 text-xl font-black text-violet-400 md:hidden">Anizone</div>
    <Routes><Route path="/" element={<Home/>}/><Route path="/discover" element={<Discover/>}/><Route path="/search" element={<Discover focus/>}/><Route path="/genres" element={<Genres/>}/><Route path="/wishlist" element={<Wishlist/>}/><Route path="/anime/:id" element={<Detail/>}/><Route path="*" element={<Home/>}/></Routes></main></div>
  <Nav mobile/></HashRouter></Provider>}
