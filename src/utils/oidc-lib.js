import {createOidcAuth, SignInType, LogLevel} from "vue-oidc-client/vue3";
import {useAuthStore} from "stores/auth";
import {api} from "boot/axios";
const appRootUrl = process.env.BASE_URL
const oidcConf = {
  authority: process.env.OIDC_AUTH_URL,
  client_id: process.env.OIDC_CLIENT_ID,
  response_type: 'code',
  scope: 'openid roles posapi_scope permissions',
  prompt: 'login'
}
const mainOidc = createOidcAuth(
  'main',
  SignInType.Window,
  appRootUrl,
  oidcConf,
  LogLevel.None
);

// handle events
mainOidc.events.addAccessTokenExpiring(function () {
  // eslint-disable-next-line no-console
  console.log('access token expiring')
})

mainOidc.events.addAccessTokenExpired(function () {
  // eslint-disable-next-line no-console
  console.log('access token expired')
})

mainOidc.events.addSilentRenewError(function () {
  // eslint-disable-next-line no-console
  console.error('silent renew error', err)
})

mainOidc.events.addUserLoaded(function (user) {
  const authStore = useAuthStore()
  authStore.setOidcUserProfile(user)
  api.defaults.headers.common['Authorization'] = `${user.token_type} ${user.access_token}`
})

mainOidc.events.addUserUnloaded(function () {
  console.log(mainOidc.user)
  // eslint-disable-next-line no-console
  console.log('user unloaded')
})

mainOidc.events.addUserSignedOut(function () {
  // eslint-disable-next-line no-console
  console.log('user signed out')
})

mainOidc.events.addUserSessionChanged(function () {
  // eslint-disable-next-line no-console
  console.log('user session changed')
})

mainOidc.events.addUserSignedIn(function (user) {
  // eslint-disable-next-line no-console
  console.log('useruseruser', user)
})


export default mainOidc
