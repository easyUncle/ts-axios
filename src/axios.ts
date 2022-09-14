import { AxiosInstance } from './type'
import Axios from './core/Axios'
import { extend } from './helpers/utils'

//混合对象实现
function createInstance():AxiosInstance{
    const context = new Axios()
    let instance = Axios.prototype.request.bind(context)

    instance = extend(instance,context)

    return instance as AxiosInstance
}
const axios = createInstance()
export default axios