<script setup>
import {ref, watchEffect} from "vue";

const getMonday = (d) => {
  d = new Date(d);
  let day = d.getDay(),
    diff = d.getDate() - day + (day === 0 ? -6 : 1);
  return new Date(d.setDate(diff));
}
const getThisMonth = () => {
  let today = new Date();
  let currentMonth = today.getMonth();
  let currentYear = today.getFullYear();
  let firstDayOfMonth = new Date(currentYear, currentMonth, 1);
  return firstDayOfMonth;
}
import {i18n} from "boot/i18n";
import {date, useQuasar} from "quasar";

const dropDownMenu = ref(false)
const emits = defineEmits(['selectedDate','onChange'])
const props = defineProps({
  setDateByLabel: {
    type: String,
    required: false,
    default: () => null
  }
})
const selectedDate = ref({
  StartDate: '',
  EndDate: '',
  QueryType: '',
  label: ''
})
const filterFields = ref({
  dates: [
    {
      label: i18n.global.t('base.today'),
      StartDate: date.formatDate(new Date(), 'YYYY-MM-DDT00:00:00+0000'),
      EndDate: date.formatDate(new Date(), 'YYYY-MM-DDT23:59:59+0000'),
      QueryType: 'byGamingDate'
    },
    {
      label: i18n.global.t('base.yesterday'),
      StartDate: date.formatDate(date.subtractFromDate(new Date(), {days: 1}), 'YYYY-MM-DDT00:00:00+0000'),
      EndDate: date.formatDate(date.subtractFromDate(new Date(), {days: 1}), 'YYYY-MM-DDT23:59:59+0000'),
      QueryType: 'byGamingDate'
    },
    {
      label: i18n.global.t('base.thisWeek'),
      StartDate: date.formatDate(getMonday(new Date()), 'YYYY-MM-DDT00:00:00+0000'),
      EndDate: date.formatDate(new Date(), 'YYYY-MM-DDT23:59:59+0000'),
      QueryType: 'byGamingDate'
    },
    {
      label: i18n.global.t('base.thisMonth'),
      StartDate: date.formatDate(getThisMonth(), 'YYYY-MM-DDT00:00:00+0000'),
      EndDate: date.formatDate(new Date(), 'YYYY-MM-DDT23:59:59+0000'),
      QueryType: 'byGamingDate'
    },
    {
      label: i18n.global.t('base.thisYear'),
      StartDate: date.formatDate(new Date().getFullYear() + '-01-01', 'YYYY-MM-DDT00:00:00+0000'),
      EndDate: date.formatDate(new Date().getFullYear() + '-12-31', 'YYYY-MM-DDT23:59:59+0000'),
      QueryType: 'byGamingDate'
    }
  ],
  times: [
    {
      label: i18n.global.t('base.last15Minutes'),
      StartDate: date.formatDate(date.subtractFromDate(new Date(), {minutes: 15}), 'YYYY-MM-DD HH:mm:ss'),
      EndDate: date.formatDate(new Date(), 'YYYY-MM-DD HH:mm:ss'),
      QueryType: 'byTime'
    },
    {
      label: i18n.global.t('base.last30Minutes'),
      StartDate: date.formatDate(date.subtractFromDate(new Date(), {minutes: 30}), 'YYYY-MM-DD HH:mm:ss'),
      EndDate: date.formatDate(new Date(), 'YYYY-MM-DD HH:mm:ss'),
      QueryType: 'byTime'
    },
    {
      label: i18n.global.t('base.last1Hour'),
      StartDate: date.formatDate(date.subtractFromDate(new Date(), {hours: 1}), 'YYYY-MM-DD HH:mm:ss'),
      EndDate: date.formatDate(new Date(), 'YYYY-MM-DD HH:mm:ss'),
      QueryType: 'byTime'
    },
    {
      label: i18n.global.t('base.last24Hours'),
      StartDate: date.formatDate(date.subtractFromDate(new Date(), {hours: 24}), 'YYYY-MM-DD HH:mm:ss'),
      EndDate: date.formatDate(new Date(), 'YYYY-MM-DD HH:mm:ss'),
      QueryType: 'byTime'
    },
    {
      label: i18n.global.t('base.last7Days'),
      StartDate: date.formatDate(date.subtractFromDate(new Date(), {days: 6}), 'YYYY-MM-DDT00:00:00+0000'),
      EndDate: date.formatDate(new Date(), 'YYYY-MM-DDT23:59:59+0000'),
      QueryType: 'byGamingDate'
    }
  ],
  months: [
    {
      label: i18n.global.t('base.lastOneMonth'),
      StartDate: date.formatDate(date.subtractFromDate(new Date(), {months: 1}), 'YYYY-MM-DDT00:00:00+0000'),
      EndDate: date.formatDate(new Date(), 'YYYY-MM-DDT23:59:59+0000'),
      QueryType: 'byGamingDate'
    },
    {
      label: i18n.global.t('base.last2Months'),
      StartDate: date.formatDate(date.subtractFromDate(new Date(), {months: 2}), 'YYYY-MM-DDT00:00:00+0000'),
      EndDate: date.formatDate(new Date(), 'YYYY-MM-DDT23:59:59+0000'),
      QueryType: 'byGamingDate'
    },
    {
      label: i18n.global.t('base.last3Months'),
      StartDate: date.formatDate(date.subtractFromDate(new Date(), {months: 3}), 'YYYY-MM-DDT00:00:00+0000'),
      EndDate: date.formatDate(new Date(), 'YYYY-MM-DDT23:59:59+0000'),
      QueryType: 'byGamingDate'
    },
    {
      label: i18n.global.t('base.last6Months'),
      StartDate: date.formatDate(date.subtractFromDate(new Date(), {months: 6}), 'YYYY-MM-DDT00:00:00+0000'),
      EndDate: date.formatDate(new Date(), 'YYYY-MM-DDT23:59:59+0000'),
      QueryType: 'byGamingDate'
    },
    {
      label: i18n.global.t('base.last1Year'),
      StartDate: date.formatDate(date.subtractFromDate(new Date(), {years: 1}), 'YYYY-MM-DDT00:00:00+0000'),
      EndDate: date.formatDate(new Date(), 'YYYY-MM-DDT23:59:59+0000'),
      QueryType: 'byGamingDate'
    }
  ],
  custom: {
    customDateTime: {
      label: i18n.global.t('base.customDateTime'),
      value: '',
      QueryType: 'byGamingDate'
    },
    customGamingDateTime: {
      label: i18n.global.t('base.customGamingDate'),
      value: '',
      QueryType: 'byTime'
    }
  }
})
const showInput = ref('')
const $q = useQuasar();
const onClickShowInput = (inputName) => {
  showInput.value = inputName;
}
const onSelectDate = (param) => {

  let selectedDateParams = {...param}
  selectedDate.value = selectedDateParams
  // delete selectedDateParams.label
  emits('selectedDate', selectedDateParams)
  emits('onChange', true)
  dropDownMenu.value = false
}
const onSelectCustomDate = (dateParam, queryType, label, dateFormat) => {
  let param = JSON.parse(JSON.stringify(dateParam))
  if (param !== null) {
    selectedDate.value.StartDate = param[0] ? date.formatDate(param[0], dateFormat) : date.formatDate(new Date(), dateFormat)
    selectedDate.value.EndDate = param[1] ? date.formatDate(param[1], dateFormat) : date.formatDate(new Date(), dateFormat)
    selectedDate.value.QueryType = queryType
    selectedDate.value.label = date.formatDate(selectedDate.value.StartDate, 'DD.MM.YYYY HH:mm') + ' - ' + date.formatDate(selectedDate.value.EndDate, 'DD.MM.YYYY HH:mm')
  } else {
    selectedDate.value.StartDate = date.formatDate(new Date(), dateFormat)
    selectedDate.value.EndDate = date.formatDate(new Date(), dateFormat)
    selectedDate.value.QueryType = queryType
    selectedDate.value.label = i18n.global.t('base.today')
    showInput.value = ''
    // set to null of custom date time field
    filterFields.value.custom.customGamingDateTime.value = ''
    filterFields.value.custom.customDateTime.value = ''
  }

  let selectedDateParams = {...selectedDate.value}
  // delete selectedDateParams.label
  emits('selectedDate', selectedDateParams)
  emits('onChange', true)
  dropDownMenu.value = false
}


// initialize
selectedDate.value = {
  ...filterFields.value.dates[0]
}
let selectedDateParams = {...selectedDate.value}
// delete selectedDateParams.label
emits('selectedDate', selectedDateParams)

watchEffect(() => {
  if (props.setDateByLabel !== null) {
    let selectedDate = filterFields.value.dates.find(date => date.label === props.setDateByLabel)
    if (selectedDate) {
      const dateFormat = selectedDate.QueryType === 'byGamingDate' ? 'YYYY-MM-DDT00:00:00+0000' : 'YYYY-MM-DD HH:mm:ss'
      onSelectDate(selectedDate, dateFormat)
    }
  }
})

</script>
<template>
  <div class="flex flex-wrap items-center">
    <q-btn
      size="13px"
      unelevated
      :color="$q.dark.isActive ?'blue-grey-8' :'grey-4'"
      :text-color="$q.dark.isActive ?'white' :'dark'"
      no-caps
      :label="selectedDate.label ? selectedDate.label : $t('base.today')"
      icon-right="arrow_drop_down"
      no-wrap
    >
      <q-menu
        persistent
        :offset="[0,3]"
        :auto-close="false"
        class="no-box-shadow
        q-card--bordered"
        style="width: 500px"
        square
        v-model="dropDownMenu"

      >
        <q-card class="no-box-shadow" square>
          <q-card-section class="row q-pb-none">
            <div class="col-4 text-left">
              <q-list dense>
                <q-item
                  clickable
                  v-ripple
                  v-for="(date,index) in filterFields.dates"
                  :key="index"
                  @click="onSelectDate(date)"
                  :active="selectedDate.label === date.label"
                >
                  <q-item-section class="datatableDateFilter">
                    {{ date.label }}
                  </q-item-section>
                </q-item>
              </q-list>
            </div>
            <div class="col-4">
              <q-list dense>
                <q-item
                  clickable
                  v-ripple
                  v-for="(date,index) in filterFields.times"
                  :key="index"
                  @click="onSelectDate(date)"
                  :active="selectedDate.label === date.label"
                >
                  <q-item-section class="datatableDateFilter">
                    {{ date.label }}
                  </q-item-section>
                </q-item>
              </q-list>
            </div>
            <div class="col-4">
              <q-list dense>
                <q-item
                  clickable
                  v-ripple
                  v-for="(date,index) in filterFields.months"
                  :key="index"
                  @click="onSelectDate(date)"
                  :active="selectedDate.label === date.label"
                >
                  <q-item-section class="datatableDateFilter">
                    {{ date.label }}
                  </q-item-section>
                </q-item>
              </q-list>
            </div>
          </q-card-section>
          <q-card-section class="row q-pt-none q-pb-sm">
            <div class="col-6 q-pa-xs text-center">
              <div
                :class="showInput === 'customGamingDateTime' ? 'text-subtitle1 cursor-pointer text-primary' : 'text-subtitle1 cursor-pointer'"
                @click="onClickShowInput('customGamingDateTime')">
                {{ $t('base.customGamingDate') }}
              </div>
            </div>
            <div class="col-6 q-pa-xs">
              <div
                :class="showInput === 'customDateTime' ? 'text-subtitle1 text-center cursor-pointer text-primary' : 'text-subtitle1 text-center cursor-pointer'"
                @click="onClickShowInput('customDateTime')">
                {{ $t('base.customDateTime') }}
              </div>
            </div>
          </q-card-section>
          <q-card-section class="row   q-pt-none" v-if="showInput === 'customGamingDateTime'">
            <el-date-picker
              clearable
              popper-class="datatable-datepicker"
              size="default"
              v-model="filterFields.custom.customGamingDateTime.value"
              type="daterange"
              range-separator="To"
              start-placeholder="Başlama Tarihi"
              end-placeholder="Bitiş Tarihi"
              @change="onSelectCustomDate($event,'byGamingDate',filterFields.custom.customGamingDateTime.label,'YYYY-MM-DDT00:00:00+0000')"
            />
            <q-btn icon="close" flat dense class="q-ml-sm "
                   @click="onSelectCustomDate(null,'byGamingDate',filterFields.custom.customGamingDateTime.label,'YYYY-MM-DDT00:00:00+0000')"/>
          </q-card-section>
          <q-card-section class="row q-pt-none" v-if="showInput === 'customDateTime'">
            <el-date-picker
              popper-class="datatable-datepicker"
              size="default"
              v-model="filterFields.custom.customDateTime.value"
              type="datetimerange"
              range-separator="To"
              start-placeholder="Başlama Tarihi"
              end-placeholder="Bitiş Tarihi"
              @change="onSelectCustomDate($event,'byTime',filterFields.custom.customGamingDateTime.label,'YYYY-MM-DD HH:mm:ss')"

            />
            <q-btn icon="close" flat dense class="q-ml-sm"
                   @click="onSelectCustomDate(null,'byTime',filterFields.custom.customGamingDateTime.label,'YYYY-MM-DD')"/>

          </q-card-section>
        </q-card>

      </q-menu>
    </q-btn>
  </div>
</template>


<style>
.example-showcase .el-dropdown + .el-dropdown {
  margin-left: 15px;
}

.example-showcase .el-dropdown-link {
  cursor: pointer;
  color: var(--el-color-primary);
  display: flex;
  align-items: center;
}

.datatable-datepicker {
  z-index: 6001 !important;
}
</style>
