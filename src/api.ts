export interface Anime{mal_id:number;title:string;title_japanese?:string;images:{jpg:{large_image_url?:string;image_url?:string}};synopsis?:string;score?:number;year?:number;season?:string;episodes?:number;status?:string;type?:string;rank?:number;popularity?:number;genres:{mal_id:number;name:string}[];studios:{name:string}[];trailer?:{youtube_id?:string;url?:string};url:string}
export interface Page{data:Anime[];pagination?:{has_next_page:boolean}}
const cache=new Map<string,any>();let last=0,chain:Promise<unknown>=Promise.resolve();
const sleep=(ms:number)=>new Promise(r=>setTimeout(r,ms));
export function get<T=any>(path:string):Promise<T>{
  if(cache.has(path))return Promise.resolve(cache.get(path));
  const run=async():Promise<T>=>{
    for(let i=0;i<4;i++){
      const w=last+400-Date.now();if(w>0)await sleep(w);last=Date.now();
      let r:Response;try{r=await fetch('https://api.jikan.moe/v4'+path)}catch{throw new Error('Network error. Check your connection.')}
      if(r.status===429){await sleep(1500);continue}
      if(!r.ok)throw new Error('Anime service error ('+r.status+'). Please try again.');
      const j=await r.json();cache.set(path,j);return j}
    throw new Error('Rate limited. Please wait a moment and retry.')};
  const p=chain.then(run);chain=p.catch(()=>{});return p}
export const GENRES=[['Action',1],['Adventure',2],['Comedy',4],['Drama',8],['Fantasy',10],['Romance',22],['Horror',14],['Mystery',7],['Sci-Fi',24],['Sports',30],['Slice of Life',36],['Isekai',62],['Supernatural',37],['Thriller',41]] as const;
export const uniq=(a:Anime[])=>[...new Map(a.map(x=>[x.mal_id,x])).values()];
export const img=(a:Anime)=>a.images?.jpg?.large_image_url||a.images?.jpg?.image_url||'';
