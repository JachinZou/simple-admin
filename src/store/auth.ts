import { VuexModule, Module, Mutation, Action } from 'vuex-module-decorators'
import request from '@/common/request'
import { AxiosResponse } from 'axios'

@Module({ namespaced: true, preserveState: true })
class Authentication extends VuexModule {
  public token: string = ''

  get isLogin () {
    return !!this.token
  }

  @Mutation
  public setToken (token: string): void {
    this.token = token
  }

  @Action
  public async login (payload: { username: string; password: string }) {
    const res: AxiosResponse = await request.postLogin(payload)
    this.context.commit('setToken', res.data.token)
    return res.data
  }
}

export default Authentication
