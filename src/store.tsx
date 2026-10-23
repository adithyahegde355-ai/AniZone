import {createContext,useContext,useState,useEffect,useCallback,useMemo,ReactNode} from 'react';
import type {Anime} from './api';
interface Ctx{list:Anime[];has:(id:number)=>boolean;toggle:(a:Anime)=>void}
const C=createContext<Ctx>(null!);export const useWish=()=>useContext(C);
const K='anizone.wishlist';
export function Provider({children}:{children:ReactNode}){
  const [list,setList]=useState<Anime[]>(()=>{try{return JSON.parse(localStorage.getItem(K)||'[]')}catch{return[]}});
  const [toast,setToast]=useState('');
  useEffect(()=>{try{localStorage.setItem(K,JSON.stringify(list))}catch{}},[list]);
  useEffect(()=>{if(!toast)return;const t=setTimeout(()=>setToast(''),2000);return()=>clearTimeout(t)},[toast]);
  const has=useCallback((id:number)=>list.some(a=>a.mal_id===id),[list]);
  const toggle=useCallback((a:Anime)=>{const on=list.some(x=>x.mal_id===a.mal_id);setList(on?list.filter(x=>x.mal_id!==a.mal_id):[a,...list]);setToast(on?'Removed from wishlist':'Added to wishlist')},[list]);
  const v=useMemo(()=>({list,has,toggle}),[list,has,toggle]);
  return <C.Provider value={v}>{children}{toast&&<div role="status" className="fixed bottom-24 md:bottom-6 left-1/2 -translate-x-1/2 z-50 rounded-full bg-violet-600 px-5 py-2 text-sm shadow-lg">{toast}</div>}</C.Provider>}
