export default {
  requestBaseUrl: '/',
  history: true,
  accessMode: 'token', // token、cookie
  globalRequests: [
    ['get', '/global'] // 支持正则
  ],
  localRequests: [
    ['post', '/login', 'login']
  ]
}
