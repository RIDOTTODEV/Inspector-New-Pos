import {boot} from 'quasar/wrappers'
import mainOidc from "src/utils/oidc-lib";
import {api} from "boot/axios";
import {useAuthStore} from "stores/auth";

export default boot(async ({store, router}) => {
  const authStore = useAuthStore(store)
  const startupMainOidc = await mainOidc.startup()
  if (!startupMainOidc) {
    throw new Error('Failed to startup oidc')
  } else {
    mainOidc.useRouter(router)
    const isAuthenticated = mainOidc.isAuthenticated
    if (isAuthenticated) {
      const user = mainOidc.user
      authStore.setOidcUserProfile(user)
      api.defaults.headers.common['Authorization'] = `${user.token_type} ${user.access_token}`
    }
  }

  // router beforeEach and check permission
  router.beforeEach((to, from, next) => {
    if (to.matched.some(record => record.meta.requiresAuth)) {
      const permission = to.meta.requiredPermission
      if (authStore.hasPermissionOidc(permission)) {
        next()
      } else {
        //next({name: 'forbidden'}) // for redirect to unauthorized page
        next()  // for remove element
      }
    } else {
      next()
    }
  })
})
