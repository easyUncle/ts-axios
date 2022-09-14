import { AxiosRequestConfig, AxiosPromise , Methods} from "../type";
import { dispatchRequest } from "./dispatchRequest";
export default class Axios {
    constructor(){

    }
    request(url:any,config:AxiosRequestConfig):AxiosPromise{
        if(typeof url === 'string'){
            config = config || {}
            config.url = url
        }else {
            config = url
        }
        return dispatchRequest(config)
    }
    
    get(url:string,config?:AxiosRequestConfig):AxiosPromise{
        return this. _axiosRequestWithoutData('get',url,config)
    }

    delete(url:string,config?:AxiosRequestConfig):AxiosPromise{
        return this. _axiosRequestWithoutData('delete',url,config,)
    }

    head(url:string,config?:AxiosRequestConfig):AxiosPromise{
        return this. _axiosRequestWithoutData('head',url,config,)
    }

    options(url:string,config?:AxiosRequestConfig):AxiosPromise{
        return this. _axiosRequestWithoutData('options',url,config)
    }

    post(url:string,data?:any,config?:AxiosRequestConfig):AxiosPromise{
        return this._axiosRequestWithData('post',url,data,config)
    }

    put(url:string,data?:any,config?:AxiosRequestConfig):AxiosPromise{
        return this._axiosRequestWithData('put',url,data,config)
    }

    patch(url:string,data?:any,config?:AxiosRequestConfig):AxiosPromise{
        return this._axiosRequestWithData('patch',url,data,config)
    }

    _axiosRequestWithoutData(method:Methods,url:string,config?:AxiosRequestConfig):AxiosPromise {
        return dispatchRequest(Object.assign(config || {} , {
            url,
            method
        }))
    }

    _axiosRequestWithData(method:Methods,url:string,data?:any,config?:AxiosRequestConfig):AxiosPromise {
        return dispatchRequest(Object.assign(config || {} , {
            url,
            method,
            data
        }))
    }
}