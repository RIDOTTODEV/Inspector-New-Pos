import {i18n} from "boot/i18n";
import {date, format} from "quasar";
import {camelCaseToSentence} from "src/utils/helpers";

const tableColumns = [
  {
    name: 'goodsCategories',
    columns: [
      {
        name: 'id',
        align: 'center',
        label: 'ID',
        locale: 'base.id',
        field: 'id',
        required: true,
        sortable: true,
      },
      {
        name: 'name',
        align: 'center',
        sortable: true,
        locale: 'goods.goodsCategoryName',
        field: 'name',
      },
      {
        name: 'createdBy',
        align: 'center',
        sortable: true,
        locale: 'base.createdBy',
        field: 'createdBy',
      },
      {
        name: 'createdAt',
        align: 'center',
        sortable: true,
        locale: 'base.createdAt',
        field: 'createdAt',
        format: (val) => date.formatDate(val, 'DD.MM.YYYY HH:mm:ss')
      },
      {
        name: 'action',
        align: 'center',
        locale: 'base.action',
        field: 'id',
      },

    ]
  },

]
export const getTableColumns = (name) => {
  const columns = tableColumns.find(item => item.name === name).columns
  columns.map(item => {
    item.label = i18n.global.t(item.locale)
  });
  return columns
}
export const makeVirtualColumns = (columns) => {
  return columns.map((column) => {
    return {
      name: column,
      required: false,
      locale: column,
      label: camelCaseToSentence(column),
      align: 'center',
      field: column,
      sortable: false,
      visible: true
    }
  })
}
