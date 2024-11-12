import { boot } from 'quasar/wrappers'
import AppTable from "components/common/AppTable.vue";
import DateTimePicker from "components/common/DateTimePicker.vue";
import QCurrencyInput from "components/common/QCurrencyInput.vue";
import DarkMode from "components/common/DarkMode.vue";
import Languages from "components/common/Languages.vue";
import KioskBoardInput from "components/common/KioskBoardInput.vue";
// "async" is optional;
// more info on params: https://v2.quasar.dev/quasar-cli/boot-files
export default boot(async ({app}) => {
  app.component('AppTable', AppTable)
  app.component('DateTimePicker', DateTimePicker)
  app.component('QCurrencyInput', QCurrencyInput)
  app.component('DarkMode', DarkMode)
  app.component('Languages', Languages)
  app.component('KioskBoardInput', KioskBoardInput)
})
