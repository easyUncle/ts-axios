import {  AxiosRequestConfig, AxiosStatic } from './type'
import Axios from './core/Axios'
import { extend } from './helpers/utils'
import defaults from './core/defaults'
import mergeConfig from './core/mergeConfig'
import CancelToken from './cancel/cancelToken'
import Cancel,{isCancel} from './cancel/cancel'

//混合对象实现
function createInstance(config:AxiosRequestConfig):AxiosStatic{
    const context = new Axios(config)
    const instance = Axios.prototype.request.bind(context)
    extend(instance,context)
    return instance as AxiosStatic
}
const axios = createInstance(defaults)
axios.create = function (config:AxiosRequestConfig){
    return createInstance(mergeConfig(defaults,config))
}
axios.CancelToken = CancelToken
axios.Cancel = Cancel
axios.isCancel = isCancel
export default axios