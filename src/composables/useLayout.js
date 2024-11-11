import {defineAsyncComponent, ref, watch} from 'vue'
import {useRoute,useRouter} from "vue-router";
import {date, LocalStorage, useQuasar} from "quasar";
import {storeToRefs} from "pinia";
import {useThemeStore} from "stores/theme-store";

const AppHeader = defineAsyncComponent(() => import('components/layout/Header.vue'));
const SidebarMenus = defineAsyncComponent(() => import('components/layout/SideBarMenus.vue'));

export function useLayout() {

  const $q = useQuasar()
  const leftDrawerOpen = ref(false);
  const themeStore = useThemeStore();
  const {getMenus,locales,currentGameDate} = storeToRefs(themeStore)


  /********** FOR SIDEBAR **********/
  const router = useRouter()
  const route = useRoute()
  const currentRouteName = ref(route.name)
  const currentRouteMeta = ref(route.meta.groupName)
  const expansionRefs = ref([])
  const expansionOnHandleShow = (name) => {
    expansionRefs.value.forEach((ref) => {
      if (ref.$attrs.name !== name) {
        ref.hide()
      }
    })
  }
  watch(() => route.name, (to) => {
    currentRouteName.value = to
    currentRouteMeta.value = route.meta.groupName
  })

  const createGamingDate = () => {
    const now = new Date()
    const timeFormatted = date.formatDate(now, 'DD.MM.YYYY')
    $q.dialog({
      component: defineAsyncComponent(() => import("components/common/GamingDateDialog.vue")),
      componentProps: {
        formValues: {
          date: timeFormatted,
        },
        actionFn: themeStore.createGamingDate,

      },
      persistent: true,
    })
  }

  const toggleDarkMode = () => {
    const isActiveDarkModel = LocalStorage.getItem('darkMode')
    if (isActiveDarkModel) {
      LocalStorage.set('darkMode', false)
      $q.dark.set(false)
    } else {
      LocalStorage.set('darkMode', true)
      $q.dark.set(true)
    }
  }
  /**********  / FOR SIDEBAR **********/
  return {
    leftDrawerOpen,
    AppHeader,
    getMenus,
    currentRouteName,
    currentRouteMeta,
    expansionOnHandleShow,
    SidebarMenus,
    router,
    expansionRefs,
    createGamingDate,
    locales,
    themeStore,
    currentGameDate,
    toggleDarkMode,
    $q
  }
}
