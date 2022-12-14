import { Transformer } from "../type";

export function transform(data:any,headers?:any,fns?:Transformer | Transformer[]):any{
    if(!fns){
        return data
    }

    if(!Array.isArray(fns)){
        fns = [fns]
    }

    fns.forEach(fn=>{
        data = fn(data,headers)
    })

    return data
}
