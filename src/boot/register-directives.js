import { boot } from 'quasar/wrappers'
import Permission from "src/directive/Permission";
export default boot(({ app,store }) => {
  app.directive('el-perms', Permission )
})

