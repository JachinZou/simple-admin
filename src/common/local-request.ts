import { AxiosRequestConfig, AxiosPromise, AxiosResponse } from 'axios'
import config from '@/setting'

class Resopnse implements AxiosResponse {
  data: unknown
  config: AxiosRequestConfig
  status = 200
  statusText = 'OK'
  request = 'local'
  headers = {}

  constructor (data: unknown, requestConfig: AxiosRequestConfig, status: number = 200) {
    this.config = requestConfig
    this.data = data
    this.status = status
    if (this.status === 200) {
      this.statusText = 'Local-OK'
    } else {
      this.statusText = 'Local-Fail'
    }
  }
}

const dataStore = {
  login: {
    token: 'ASDafasdfASDFASDFdafasd=='
  }
}

function getData (key: keyof typeof dataStore): object {
  return dataStore[key]
}

export function isMatch (axiosConfig: AxiosRequestConfig): boolean {
  return config.localRequests.some(item => {
    const methodMatched: boolean = item[0].toUpperCase() === axiosConfig.method?.toUpperCase()
    const pathMatched: boolean = new RegExp(item[1]).test(axiosConfig.url || '')
    return methodMatched && pathMatched
  })
}

export function dispatchLocalRequest (axiosConfig: AxiosRequestConfig): AxiosPromise {
  const matchedItem = config.localRequests.find(item => {
    const methodMatched: boolean = item[0].toUpperCase() === axiosConfig.method?.toUpperCase()
    const pathMatched: boolean = new RegExp(item[1]).test(axiosConfig.url || '')
    return methodMatched && pathMatched
  })
  if (matchedItem) {
    const data: object = getData(matchedItem[2] as keyof typeof dataStore)
    return Promise.resolve(new Resopnse(data, axiosConfig))
  }
  return Promise.resolve(new Resopnse({}, axiosConfig, 888))
}
