
import { Component, Vue } from 'vue-property-decorator'
import Axios, { AxiosInstance, AxiosResponse, AxiosError, AxiosAdapter, AxiosRequestConfig, AxiosPromise } from 'axios'
import config from '@/setting'
import { getUrl, ApiKeyType, ApiKeys } from './api'
import { isMatch, dispatchLocalRequest } from './local-request'

type RequestMembers = {
  [key in ApiKeyType]: (requestParams?: object, config?: {
    axiosConfig?: AxiosRequestConfig;
    urlPrams?: { [key: string]: string | number };
  }) => AxiosPromise;
}

type Request = {
  cancelAll(): Promise<void>;
} & AxiosInstance & RequestMembers

const CancelToken = Axios.CancelToken
let CancelTokenSource = CancelToken.source()

const DefaultAdapter = Axios.defaults.adapter as AxiosAdapter
const axios = Axios.create({
  baseURL: config.requestBaseUrl || '/',
  timeout: 10000,
  adapter: function (axiosConfig) {
    if (process.env.NODE_ENV !== 'development') {
      return DefaultAdapter(axiosConfig)
    } else if (isMatch(axiosConfig)) {
      return dispatchLocalRequest(axiosConfig)
    } else {
      return DefaultAdapter(axiosConfig)
    }
  }
})
const request: Request = Object.assign(axios, {
  cancelAll: function () {
    CancelTokenSource.cancel()
    CancelTokenSource = CancelToken.source()
    return Promise.resolve()
  },
  ...ApiKeys.reduce<RequestMembers>((members, key) => {
    enum methods {
      get = 'get',
      post = 'post',
      put = 'put',
      delete = 'delete',
      head = 'head',
      patch = 'patch'
    }
    const newMembers: RequestMembers = Object.assign(members, {
      [key]: function (/* this: AxiosInstance */requestParams: object = {}, {
        axiosConfig = {},
        urlPrams = {}
      }: {
        axiosConfig?: AxiosRequestConfig;
        urlPrams?: { [key: string]: string | number };
      } = {}): AxiosPromise {
        const url = getUrl(key, urlPrams)
        const requestMethod: methods = Object.values(methods).find(met => key.startsWith(met)) || methods.get
        if (requestMethod === 'post' || requestMethod === 'put' || requestMethod === 'patch') {
          return axios[requestMethod](url, requestParams, axiosConfig)
        } else {
          return axios[requestMethod](url, {
            ...axiosConfig,
            params: requestParams
          })
        }
      }
    })
    return newMembers
  }, {} as RequestMembers)
})

request.interceptors.request.use(function (axiosConfig) {
  const isGlobalRequest: boolean = config.globalRequests.some(item => {
    const regexp = new RegExp(item[1])
    return item[0] === axiosConfig.method && regexp.test(axiosConfig.url || '')
  })
  if (!isGlobalRequest) {
    axiosConfig.cancelToken = CancelTokenSource.token
  }
  if (config.accessMode === 'token') {
    // getToken
    axiosConfig.headers.Authorization = 'Bearer '/*  + getToken() */
  }
  return axiosConfig
})

function responseResolveHandler (result: AxiosResponse): AxiosResponse | Promise<AxiosResponse> {
  // const response = result
  // const status = response.status
  // const data = response.data || {}
  return result
}

const responseRejectHandler = function (err: AxiosError) {
  return err
}

request.interceptors.response.use(responseResolveHandler, responseRejectHandler)

export default request

@Component
class RequestMixin extends Vue {
  public request: Request = request
}
export { RequestMixin }
