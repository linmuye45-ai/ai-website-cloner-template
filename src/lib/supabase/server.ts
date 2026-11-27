import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import type { SupabaseClient } from "@supabase/supabase-js";
export function isSupabaseConfigured(){return Boolean(process.env.NEXT_PUBLIC_SUPABASE_URL&&process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY);}
export async function createSupabaseServerClient():Promise<SupabaseClient|null>{
 const url=process.env.NEXT_PUBLIC_SUPABASE_URL;const key=process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;if(!url||!key)return null;
 const store=await cookies();
 return createServerClient(url,key,{cookies:{getAll(){return store.getAll();},setAll(items){try{items.forEach(({name,value,options})=>store.set(name,value,options));}catch{/* proxy.ts refreshes sessions */}}}});
}