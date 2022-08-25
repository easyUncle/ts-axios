import { AxiosRequestConfig } from './type'
import xhr from './core/xhr'
function axios(config: AxiosRequestConfig): void {
  //todo
  xhr(config)
}

export default axios
