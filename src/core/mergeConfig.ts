import { deepMerge, isPlainObject } from "../helpers/utils";
import { AxiosRequestConfig } from "../type";

interface MergeMap {
    [propName:string]:any
}

 // 策略模式
 const mergeMap:MergeMap = {
    'timeout':defaultStrat,
    'method':defaultStrat,
    'url':fromVal2Strat,
    'params':fromVal2Strat,
    'data':fromVal2Strat,
    'headers':deepMergeStrat,
    'transformRequest':defaultStrat,
    'transformResponse':defaultStrat
}

// 针对不同的配置属性有不同的合并策略，例如url、params、data这种属性，默认配置显然是没有意义的，它们是和每个请求强相关的，所以我们只从自定义配置中获取。而method,timeout这种，自定义有的话则取自定义的，否则去默认的值
function defaultStrat(val1:any,val2:any):any{
    return typeof val2 !== 'undefined' ? val2 : val1
}
function fromVal2Strat(val1:any,val2:any):any{
    if(typeof val2 !== 'undefined'){
        return val2
    }
}
function deepMergeStrat(val1:any,val2:any):any{
    if(isPlainObject(val2) && isPlainObject(val1)){
        return deepMerge(val1,val2)
    }else if(typeof val2 !== 'undefined'){
        return val2
    } else if(isPlainObject(val1)) {
        return deepMerge(val1,{})
    }else if(typeof val1 !== 'undefined'){
        return val1
    }
}
export default function mergeConfig(config1:AxiosRequestConfig,config2:AxiosRequestConfig){
    config2 = config2 || {}
    let config = Object.create(null)

    for(const key in config2){
        mergeField(key)
    }

    for(const key in config1){
        if(!config2[key]){
            mergeField(key)
        }
    }

    function mergeField(key:string){
        const strat = mergeMap[key]
        config[key] = strat(config1[key],config2[key])
    }

    return config
}

