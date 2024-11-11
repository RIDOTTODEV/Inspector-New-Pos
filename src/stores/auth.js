import { defineStore } from 'pinia';

export const useAuthStore = defineStore('auth', {
  state: () => ({
    userPermissions: [],
  }),
  getters: {
    hasPermission: (state) => (permission) => {
      // this for testing purposes
      return true
      return state.userPermissions.includes(permission)
    }
   },
  actions: {

  },
});
