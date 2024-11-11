// Permission.js
import {useAuthStore} from "stores/auth";
const authStore = useAuthStore()
export default {
  mounted(el, binding, vnode) {
    const permission = authStore.hasPermission(binding.value)
    if (!permission) {
      el.parentNode.removeChild(el);
    }
  },

  updated(el, binding) {
    // Do something

  },

  beforeUnmount(el, binding) {
    // Do something
  }
};
