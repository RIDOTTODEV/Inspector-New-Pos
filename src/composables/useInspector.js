import {useInspectorStore} from "stores/inspector-store";
import {storeToRefs} from "pinia";
import {computed, ref} from "vue";
import {useQuasar} from "quasar";
import {useRouter} from "vue-router";
import {fireNotify} from "src/utils/notifications";
import {i18n} from "boot/i18n";

export const useInspector = () => {
  const $q = useQuasar();
  const inspectorStore = useInspectorStore();
  const {tables, inspectors, selectedTable, selectedInspector} = storeToRefs(inspectorStore);
  const sortByTable = ref(''); // byTableName,byCurrency,byGameType
  const isAscending = ref(true);
  const router = useRouter();
  const sortedTables = computed(() => {
    switch (sortByTable.value) {
      case 'byTableName':
        return tables.value.sort((a, b) => isAscending.value ? a.tableName.localeCompare(b.tableName) : b.tableName.localeCompare(a.tableName));
      case 'byCurrency':
        return tables.value.sort((a, b) => isAscending.value ? a.currency.localeCompare(b.currency) : b.currency.localeCompare(a.currency));
      case 'byGameType':
        return tables.value.sort((a, b) => isAscending.value ? a.gameTypeName.localeCompare(b.gameTypeName) : b.gameTypeName.localeCompare(a.gameTypeName));
      default:
        return tables.value;
    }
  })
  const showInspectorSelectError = ref(false);
  const onClickTable = async (table) => {
    if (selectedInspector.value === null) {
      showInspectorSelectError.value = true;
      fireNotify( i18n.global.t('base.pleaseSelectInspector'), 'error','bottom-right', 5000, 'negative');
    } else {
      selectedTable.value = {...table};
      inspectorStore.setLatestUsedTables(table);
      await inspectorStore.fetchTablePlayers(table.tableId);
      await router.push({name: 'table', params: {tableId: table.tableId}});
    }
  }

  return {
    inspectorStore,
    tables,
    inspectors,
    selectedTable,
    selectedInspector,
    sortByTable,
    sortedTables,
    isAscending,
    showInspectorSelectError,
    $q,
    onClickTable
  }
}
