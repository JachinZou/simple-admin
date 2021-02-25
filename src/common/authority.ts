import store from '@/store/index'

export async function login (payload: { username: string; password: string }) {
  return await store.dispatch('Authentication/login', payload)
}

export function isLogin (): boolean {
  return store.getters['Authentication/isLogin']
}

type UserInfo = {
  name: string;
}
export function getUserInfo (): UserInfo {
  return {
    name: ''
  }
}
