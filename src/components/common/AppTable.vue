<script setup>
import {getTableColumns} from 'src/utils/tableColumns'
import {reOrder} from "src/utils/helpers";
import {computed, ref, inject} from "vue";
import DateTimePicker from "components/common/DateTimePicker.vue";

const bus = inject('bus')
const props = defineProps({
  tableColumnName: {
    type: String,
    required: true,
    default: () => null
  },
  filterFn: {
    type: Function,
    required: true,
    default: () => null
  },
  filterFields: {
    type: Object,
    required: true,
    default: () => {
      return {
        Take: 20,
        Skip: 0,
        Sort: '',
      }
    }
  },
  eventBusKey: {
    type: String,
    required: true,
    default: () => null
  },
  title: {
    type: String,
    required: false,
    default: () => null
  },
  headerClass: {
    type: Object,
    required: false,
    default() {
      return {
        headerLeftCol: 'col-2',
        headerRightCol: 'col-10'
      }
    }
  },
  hiddenFields: {
    type: Object,
    required: false,
    default() {
      return {
        showFilterInput: true,
        showDatePickerFilter: true,
        showVisibleColumns: true,
        showFilterButton: true,
        showReloadButton: true,
        showScreenModeButton: true
      }
    }
  },
  createButton: {
    type: Object,
    required: false,
    default() {
      return {
        fn: null,
        title: true,
      }
    }
  },
  data: {
    type: Array,
    required: false,
    default: () => []
  },
  totalCount: {
    type: Number,
    required: false,
    default: () => 0
  },
  actions: {
    type: Array,
    required: false,
    default: () => []
  },
  orderStatusBadgeColorFn: {
    type: Function,
    required: false,
    default: () => null
  },
  useDateTimeFilter: {
    type: Boolean,
    required: false,
    default: () => false
  },
  customFilterFields: {
    type: Array,
    required: false,
    default: () => []
  },
  dynamicFilter: {
    type: Boolean,
    required: false,
    default: () => false
  },
  tableSelection: {
    type: Boolean,
    required: false,
    default: () => false
  },
  excelExportFn: {
    type: Function,
    required: false,
    default: () => null
  },
  showExcelExport: {
    type: Boolean,
    required: false,
    default: () => false
  },
})
const emits = defineEmits(['update:tableSelection', 'dateTimeFields'])
//************* CONSTANTS ***************//
const selected = ref([])
const filterValues = ref(props.filterFields)
const tableLoading = ref(false)
const filterInput = ref('')
const columns = computed(() => [...getTableColumns(props.tableColumnName)])
const rows = computed(() => props.data || [])
const totalCount = computed(() => props.totalCount || 0)
const totalPages = computed(() => Math.ceil(totalCount.value / pagination.value.rowsPerPage))
const dateFilterValues = ref({})

const pagination = ref({
  sortBy: props.filterFields.Sort,
  descending: false,
  page: 1,
  rowsPerPage: 20,
});
const tableHeight = ref('calc(100vh - 100px)')
const refTable = ref(null)


//************* METHODS ***************//

const toggleFullscreen = (isInFullScreen) => {
  if (isInFullScreen) {
    tableHeight.value = 'calc(100vh - 100px)';
  } else {
    tableHeight.value = '100%!important';
  }
  refTable.value.toggleFullscreen()
}

const setFilterFormFields = () => {
  filterValues.value.Take = pagination.value.rowsPerPage
  filterValues.value.Skip = pagination.value.page > 1 ? (pagination.value.page - 1) * pagination.value.rowsPerPage : pagination.value.page - 1
  filterValues.value.Sort = pagination.value.sortBy
}

const filter = async () => {
  if (!props.filterFn) return
  tableLoading.value = true
  setFilterFormFields()

  let filterFields = {...filterValues.value}
  if (props.useDateTimeFilter) {
    filterFields = {...filterFields, ...dateFilterValues.value}
  }
  await props.filterFn(
    filterFields
  ).then(() => {
    tableLoading.value = false

    if (props.getFilterFields) {
      let params = {...filterValues.value, ...dateFilterValues.value}
      emits('returnFilterFields', params)
    }
  })
}

if (props.filterFn && !props.useDateTimeFilter) {
  filter()
}

const onChangeRowsPerPage = () => {
  pagination.value.page = 1
  refTable.value.setPagination({...pagination.value})
  filter()
}

const onHandleSelectCustomFilterFields = () => {
  if (props.dynamicFilter === true) filter()
}

bus.on(props.eventBusKey, (params) => {
  if (params) {
    filterValues.value = {...filterValues.value, ...params}
  }
  filter()
})

const customSort = async (sortBy, col) => {
  const tableThClass = col.__thClass
  if (tableThClass === 'text-center sortable') {
    pagination.value.sortBy = sortBy + ' asc'
    pagination.value.descending = false
  }
  if (tableThClass === 'text-center sortable sorted ') {
    pagination.value.sortBy = sortBy + ' desc'
    pagination.value.descending = true
  }
  if (tableThClass === 'text-center sortable sorted sort-desc') {
    pagination.value.sortBy = ''
    pagination.value.descending = false
  }
  await filter()
  // if (tableThClass === 'text-center sortable'){
  //   let desc = pagination.value.descending ? 'desc' : 'asc'
  //   pagination.value.sortBy = sortBy + ' ' + desc
  //   pagination.value.descending = !pagination.value.descending
  // } else {
  //   pagination.value.sortBy = ''
  //   pagination.value.descending = false
  // }
  //  await filter()
  // if (pagination.value.descending) {
  //    refTable.value.sort(sortBy, )
  // } else {
  //     refTable.value.sort()
  // }

}

const isTableSelectionMode = ref(props.tableSelection)
</script>

<template>
  <q-table
    ref="refTable"
    :columns="columns"
    :rows="rows"
    row-key="id"
    class="no-box-shadow q-pl-none  q-pl-sm q-pr-sm  col-12"
    dense
    :loading="tableLoading"
    :filter="filterInput"
    bordered
    :rows-per-page-options="[0]"
    :style="{height: tableHeight}"
    virtual-scroll
    :pagination="pagination"
    separator="cell"
    :selection="props.tableSelection ? 'multiple' : 'none'"
    v-model:selected="selected"
    table-header-class="text-center bg-grey-2"
    table-header-style="height: 33px"
    @update:selected="emits('update:tableSelection', selected)"

    column-sort-order="ad"
  >

    <template v-slot:header="props">
      <q-tr :props="props">
        <q-th class="text-center app-table-bg" v-if="isTableSelectionMode" key="selected">
          <q-checkbox v-model="props.selected" size="md" dense color="grey-8"/>
        </q-th>
        <q-th
          v-for="col in props.cols"
          :key="col.name"
          :props="props"
          class="text-center app-table-bg"
          @click="col.sortable ? customSort(col.field,col) : () => null"
        >
          {{ col.label }}
        </q-th>
      </q-tr>
    </template>
    <template v-slot:top="props">
      <div class="header-toolbar full-width row items-center   row">
        <div :class="headerClass.headerLeftCol">
          <div class="row " style="margin-left: -24px!important;">
            <div class="doc-card-title flex no-wrap q-my-xs q-mr-sm cursor-pointer ">{{ title }}</div>
          </div>
        </div>
        <div :class="headerClass.headerRightCol">
          <div class="doc-example__actions full-width  ">
            <div class="row no-wrap   justify-end content-center items-center">
              <q-select
                v-for="(filterField,index) in customFilterFields.filter(f => f.type === 'selectBox')"
                :key="index"
                v-model="filterFields[filterField.vModel]"
                outlined
                dense
                options-dense
                emit-value
                map-options
                :options="filterField.options"
                :option-value="filterField.optionValueKey"
                :option-label="filterField.optionLabelKey"
                :label="filterField.label"
                @filter="filterField.filter"
                class="q-ml-sm  super-small col "
                @update:model-value="onHandleSelectCustomFilterFields"
                clearable
                behavior="menu"
                use-input
                popup-content-class="height-400"
                :style="filterField.style"
              />
              <q-input
                v-for="(filterField,index) in customFilterFields.filter(f => f.type === 'inputBox')"
                :key="index"
                v-model="filterFields[filterField.vModel]"
                outlined
                dense
                class="super-small q-ml-sm col"
                :label="filterField.label"
                debounce="1000"
                @keyup.enter="onHandleSelectCustomFilterFields"

              />
              <div v-for="(filterField,index) in customFilterFields.filter(f => f.type === 'toogle')">
                <q-toggle
                  :key="index"
                  v-model="filterFields[filterField.vModel]"
                  :label="filterField.label"
                  class="super-small q-ml-sm q-mr-sm "
                  @update:model-value="onHandleSelectCustomFilterFields"
                />
                <q-btn
                  :key="index"
                  rounded
                  round
                  color="negative"
                  size="10px"
                  flat outline
                  @click="()=>  {  filterField.fn()
                  onHandleSelectCustomFilterFields()
                      }"
                  icon="clear"
                  class="  q-mr-sm"/>
              </div>
              <q-input
                type="text"
                dense
                filled
                v-model="filterInput"
                :placeholder="$t('base.search')+'...'"
                autofocus
                clearable
                class="super-small q-pa-xs"
                style="min-width: 350px!important;"
              >
                <template v-slot:append>
                  <q-icon name="search"/>
                </template>
                <template v-slot:after>
                  <q-btn v-if="createButton.fn !==null" :label="createButton.title" unelevated color="blue-grey-8"
                         @click="createButton.fn" no-caps
                         icon="add" class=" q-pr-sm" dense/>
                </template>
              </q-input>
              <date-time-picker v-if="useDateTimeFilter" @selected-date="val => {
                  dateFilterValues = val;
                  filter();
                  emits('dateTimeFields', {...val})
              }"/>
              <q-btn
                color="blue-grey-8"
                unelevated
                dense
                icon="cached"
                @click="filter"
                class="q-ma-xs"
                size="14px"
              />
              <q-btn
                color="blue-grey-8"
                unelevated
                dense
                :icon="props.inFullscreen ? 'fullscreen_exit' : 'fullscreen'"
                @click="toggleFullscreen(props.inFullscreen)"
                class="q-ma-xs  "
                size="14px"
              />

              <q-btn
                color="green-10"
                unelevated
                dense
                v-if="showExcelExport"
                icon="file_download"
                @click="excelExportFn({...filterFields})"
                class="q-ma-xs  "
                size="14px"
              >
                <q-tooltip class="bg-blue-grey-8 text-white text-subtitle1">
                  Excel Export
                </q-tooltip>
              </q-btn>
            </div>
          </div>
        </div>
      </div>
    </template>
    <template v-slot:body-cell-action="props">
      <q-td :props="props">
        <span v-for="(action,index) in actions" :key="index">
          <q-btn
            v-if="action.type !== 'dropdown'"

            :disabled="action.disabled ? props.row[action.disabled] : false"
            :key="index"
            :icon="action.icon"
            :color="action.color"
            @click="action.fn(props.row)"
            :text-color="action.textColor ? action.textColor : 'white'"
            dense
            unelevated
            size="10px"
            class="q-mr-sm"
          >

          <q-tooltip class="bg-blue-grey-8 text-white text-caption" v-if="action.tooltip">
            {{ $t(action.tooltip) }}
          </q-tooltip>
        </q-btn>

        <q-btn-dropdown
          dense
          unelevated
          size="10px"
          class="q-mr-sm"
          :color="action.color"
          :text-color="action.textColor ? action.textColor : 'white'"
          v-if="action.type === 'dropdown'"

          :dropdown-icon="action.icon"
        >
      <q-list>
        <q-item
          v-for="(item,index) in action.items"
          :key="index"
          clickable
          v-close-popup
          dense
          @click="item.fn(props.row)">
          <q-item-section>
            <q-item-label>{{ item.label }}</q-item-label>
          </q-item-section>
        </q-item>



      </q-list>
    </q-btn-dropdown>
        </span>


      </q-td>
    </template>
    <template v-slot:body-cell-orderTableName="props">
      <q-td :props="props" key="productPlayer">
        <div class="text-subtitle2" v-if="props.row.tableName">
          {{ props.row.tableName }}
        </div>
        <div class="text-weight-thin col-12" v-if="props.row.playerName">
          {{ props.row?.playerName }}
        </div>
        <div class="text-weight-thin col-12" v-if="props.row.externalId">
          AssistId: {{ props.row?.externalId }}
        </div>
        <div class="text-weight-thin col-12" v-if="props.row.playerId">
          PlayerId: {{ props.row?.playerId }}
        </div>

      </q-td>
    </template>
    <template v-slot:body-cell-waiterName="props">
      <q-td :props="props" key="productPlayer">
        <div class="text-subtitle2" v-if="props.row.waiterName">
          {{ props.row.waiterName }}
        </div>
      </q-td>
    </template>
    <template v-slot:body-cell-playerNameCigarette="props">
      <q-td :props="props" key="playerNameCigarette">
        <div class="text-subtitle2">
          {{ props.row.playerName }}
        </div>
        <div class="text-caption" v-if="props.row.externalId">
          {{ $t('base.externalId') }}: {{ props.row.externalId }}
        </div>
        <div class="text-caption" v-if="props.row.playerId">
          {{ $t('base.playerId') }}: {{ props.row.playerId }}
        </div>
      </q-td>
    </template>
    <template v-slot:body-cell-portionsPortionList="props">
      <q-td :props="props" key="portionsPortionList">
        <div class="row">
          <q-chip
            v-for="(portion,index) in reOrder([...props.value],props.row.defaultPortionName)"
            :key="index"
            dense
            square
            :label="portion.name"
            :color="portion.name === props.row.defaultPortionName ? 'deep-purple' : ' grey-4'"
            :icon="portion.name === props.row.defaultPortionName ? 'check' : ''"
            :text-color="portion.name === props.row.defaultPortionName ? 'white' : ''"
            :style="portion.name === props.row.defaultPortionName ?{
              cursor: 'pointer',
            } : {}"
          >
            <q-tooltip class="bg-blue-grey-8 text-white text-subtitle2"
                       v-if="portion.name === props.row.defaultPortionName">
              <div class="text-caption">Default Portion</div>
            </q-tooltip>
          </q-chip>
        </div>
      </q-td>
    </template>
    <template v-slot:body-cell-products="props">
      <q-td :props="props" key="products">
        <div class="row">
          <div class="col-12 flex  justify-between content-center items-center" v-for="(product,index) in props.value"
               :key="index" :style="index+1 !== props.value.length ? 'border-bottom: 1px solid #dddddd' : ''">
            <div class="text-subtitle2   text-left  ">
              <b>{{ product.quantity }} X</b> {{ product.productName }}
              <div class="col-12 text-left">
                <q-chip v-if="product.portion" dense square size="xs" :label="product.portion"/>
                <q-chip v-if="product.note" dense square size="xs" :label="product.note"/>
                <q-chip v-if="product.orderTag" dense square size="xs" :label="product.orderTag"/>
                <q-chip v-if="product.extras" dense square size="xs" :label="product.extras"/>
              </div>
            </div>
            <q-chip size="10px" square text-color="white" :color="orderStatusBadgeColorFn(product.status)"
                    :label="product.status"/>
          </div>
        </div>
      </q-td>
    </template>
    <template v-slot:bottom>
      <div class="full-width q-mt-xs q-mb-xs row col-12 flex content-center items-center justify-end">
        <div class="text-subtitle2 q-mr-md">
          Total: <strong class="q-ml-xs q-mr-xs">{{ totalCount }}</strong> Records
        </div>
        <q-select
          v-model="pagination.rowsPerPage"
          options-dense :options="[10, 20, 50, 100,500]" borderless dense
          class="super-small"
          filled
          @update:model-value="onChangeRowsPerPage"
          behavior="menu"
        />
        <div class="text-subtitle2 q-ml-sm">Rows Per Page</div>

        <q-pagination
          v-if="totalCount >= pagination.rowsPerPage"
          v-model="pagination.page"
          color="grey-8"
          :max="totalPages"
          max-pages="6"
          size="12px"
          active-color="blue-grey-8"
          @update:model-value="filter()"
          boundary-links
          boundary-numbers
          direction-links
          class="q-pr-md"

          flat
        />
      </div>
    </template>
  </q-table>
</template>

<style lang="scss">
.q-table__middle {
  margin-top: 0 !important
}

/* bg color is important for th; just specify one */

.doc-card-title::after {
  content: "";
  position: absolute;
  top: 100%;
  left: 0;
  width: 0;
  height: 0;
  border: 0 solid transparent;
  border-top-width: 0px;
  border-top-color: transparent;
  border-right-width: 0px;
  border-bottom-width: 0px;
  border-left-width: 0px;
  border-width: 9px 0 0 11px;
  border-top-color: #3e4f72;
}

.doc-card-title {
  margin-left: -12px;
  padding: 4px 8px 4px 28px;
  position: relative;
  border-radius: 3px 5px 5px 0;
  background: #3e4f72;
  color: white;
  font-size: 14px;
  letter-spacing: .7px;
}

.doc-technical {
  font-family: Roboto, -apple-system, Avenir, BlinkMacSystemFont, Segoe UI, Helvetica, Arial, sans-serif;
  font-weight: 400;
  font-size: 16px;
  color: #474747;
  text-rendering: optimizeLegibility;
}

.doc-example__actions {
  padding: 3px 0 3px 7px
}

.doc-example__content {
  position: relative;
  font-weight: 400;
  font-family: Roboto, -apple-system, Avenir, BlinkMacSystemFont, Segoe UI, Helvetica, Arial, sans-serif
}

.doc-example__content--scrollable {
  height: 500px
}


//:deep(.input-box .q-field__control),
//:deep(.input-box .q-field__marginal) {
//  height: 32px;
//  font-size: 16px;
//}
:deep(.q-virtual-scroll__padding) {
  display: none !important;
}

tr:has(.bg-to-passive) {
  opacity: 0.5;
  cursor: context-menu;
}
</style>
