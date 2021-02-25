
const apis = {
  postLogin: '/login', // 登陆接口
  logout: '/logout' // 退出接口
}

type Params = {
  [key: string]: string | number;
}

export type ApiKeyType = keyof typeof apis

export const ApiKeys: { [key: number]: ApiKeyType } & Array<ApiKeyType> = Object.keys(apis) as { [key: number]: ApiKeyType } & Array<ApiKeyType>

export function getUrl <T extends Params> (key: ApiKeyType, params?: T): string {
  const url: string = apis[key]

  return url.replace(/\{(\S+?)}/g, function (matched: string, substr: keyof T/* , position, original */): string {
    const value = params ? params[substr] : matched
    return value.toString()
  })
}
