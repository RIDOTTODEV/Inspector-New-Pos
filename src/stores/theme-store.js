import {defineStore} from 'pinia'
import {LocalStorage, Dark} from "quasar";
import {api} from "boot/axios";
import {fireNotify} from "src/utils/notifications";
import {i18n} from "boot/i18n";

export const useThemeStore = defineStore('theme', {

  state: () => ({
    menus: [
      {
        title: 'dashboard',
        icon: 'far fa-dot-circle',
        routeName: 'dashboard',
        type: 'menu',
        permission: 'Pos.Orders.ShowList',
      },

    ],
    locales: [
      {
        title: 'English',
        iconPath: '/assets/english-flag.png',
        routeName: 'english',
        lang: 'en'
      },
      {
        title: 'Turkish',
        iconPath: '/assets/turkish-flag.png',
        routeName: 'turkish',
        lang: 'tr'
      },
    ],
    selectedLocale: null,
    darkMode: false,
    fullScreen: false,
    currentGameDate:{}
  }),

  getters: {
    getMenus: (state) => state.menus,
  },

  actions: {
    setLocale(lang) {
      LocalStorage.set('locale', lang)
      this.selectedLocale = this.locales.find(x => x.lang === lang)
    },
    setDarkMode(mode) {
      LocalStorage.set('darkMode', mode)
      this.darkMode = mode
      Dark.set(mode)
    },
    async createGamingDate(params) {
    return  await api.post('/GamingDate/CreateGamingDate').then(() => {
        fireNotify(i18n.global.t('base.createdSuccessfully', {name: i18n.global.t('base.gamingDate')}))
      return true
      }).catch(er => {
        fireNotify(i18n.global.t('base.failed', {name: 'Cannot be more than 2 gaming date for the same date'}), 'failed', null, 5000, 'negative')
      })
    },
    getCurrentGameDate() {
      return api.get('/GamingDate/GetCurrentGamingDate').then((res) => {
        this.currentGameDate = res.data
      })
    }
  }
})
