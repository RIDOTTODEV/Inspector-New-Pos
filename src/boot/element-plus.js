import { boot } from 'quasar/wrappers'
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
import 'element-plus/theme-chalk/dark/css-vars.css'
export default boot(async ({app}) => {
  app.use(ElementPlus, { size: 'small', zIndex: 3000 })
})
