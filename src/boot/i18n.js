import {boot} from 'quasar/wrappers'
import {createI18n} from 'vue-i18n'
import messages from 'src/i18n'
import {LocalStorage} from "quasar";
import {useThemeStore} from "stores/theme-store";

let i18n = createI18n({})
export default boot(({app, store}) => {
  const initialLocale = LocalStorage.getItem('locale') || 'en'
  let initialDarkMode = LocalStorage.getItem('darkMode')
  if (initialDarkMode === null) { initialDarkMode = false }

  try {
    const themeStore = useThemeStore(store)
    themeStore.setLocale(initialLocale)
    themeStore.setDarkMode(initialDarkMode)
  } catch (e) {
    console.log("error in i18n.js", e);
  }
  i18n = createI18n({
    legacy: false,
    locale: initialLocale,
    globalInjection: true,
    fallbackLocale: 'en',
    messages
  })

  // Set i18n instance on app
  app.use(i18n)
});
export {i18n}
