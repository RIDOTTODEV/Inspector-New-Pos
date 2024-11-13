import {defineStore} from 'pinia'
import {api, posPanelApi, assistApi} from "boot/axios";
import {fireNotify} from "src/utils/notifications";
import {i18n} from "boot/i18n";
import {LocalStorage} from "quasar";

export const useInspectorStore = defineStore('inspector', {
  state: () => ({
    tables: [],
    inspectors: [],
    selectedTable: null,
    selectedInspector: null,
    latestUsedTables: [],
    currentTablePlayers:[],
    selectedPlayer: null,
    posSettings: null,
    terminal: null,
    terminalMenu: [],
    portionSets: [],
    extraSets: [],
  }),

  getters: {
    getSelectedInspector: (state) => {
      return state.inspectors.find(inspector => inspector.staffId === state.selectedInspector);
    },
    getPortionSet: (state) => (id) => {
      return state.portionSets.find(portionSet => portionSet.id === id)
    },
    getExtraSet: (state) => (id) => {
      return state.extraSets.find(extraSet => extraSet.id === id)
    },
    showCancelOrderBtn: (state) => (orderTagId) => {
      return state.terminal.restore?.includes(orderTagId);
    }
  },

  actions: {
    async fetchPosSettings() {
      await posPanelApi.get('/api/PosSetting/GetAll').then(res => {
        this.posSettings = res.data.data[0];
        this.fetchTerminalByUid();
      }).catch(err => {
        fireNotify('error', i18n.t('fetch_error'), err.response.data.message);
      })
    },
    async fetchTerminalByUid() {
      await posPanelApi.get(`/api/Terminal/GetTerminalSettings?uid=${this.posSettings?.inspectorTerminalUid}`).then(res => {
        this.terminal = res.data;
        this.fetchTerminalMenus();
        this.fetchPortionSets();
      }).catch(err => {
        fireNotify('error', i18n.t('fetch_error'), err.response.data.message);
      })
    },
    async fetchTerminalMenus() {
      await posPanelApi.get(`/api/Terminal/GetTerminalMenu?uid=${this.terminal?.uid}`).then(res => {
        this.terminalMenu = res.data;
      }).catch(err => {
        fireNotify('error', i18n.global.t('fetch_error'), err.response.data.message);
      })
    },
    async fetchPortionSets() {
      await posPanelApi.get(`/api/PortionSet/GetAll`,{
        params:{
          Take:999
        }
      }).then(res => {
        this.portionSets = res.data.data;
      }).catch(err => {
        fireNotify('error', i18n.t('fetch_error'), err.response.data.message);
      })
    },
    async fetchInspectors() {
      await assistApi.get('/Staff/GetLgStaffList').then(res => {
        this.inspectors = res.data;
      }).catch(err => {
        fireNotify('error', i18n.t('fetch_error'), err.response.data.message);
      })
    },
    async fetchTables() {
      await assistApi.get('/Table/GetTables').then(res => {
        this.tables = res.data;
      }).catch(err => {
        fireNotify('error', i18n.t('fetch_error'), err.response.data.message);
      })
    },
    async fetchTablePlayers(tableId) {
      await assistApi.get(`/Table/GetTablePlayers?tableId=${tableId}`).then(res => {
         this.currentTablePlayers = res.data;
      }).catch(err => {
        fireNotify('error', i18n.t('fetch_error'), err.response.data.message);
      })
    },
    setLatestUsedTables(table) {
      const latestSavedLocalStorageTables = LocalStorage.getItem('latestUsedTables');
      if (latestSavedLocalStorageTables) {
        this.latestUsedTables = latestSavedLocalStorageTables
       }
      const checkTableAlreadyExist = this.latestUsedTables.find(t => t.tableId === table.tableId);
      if (!checkTableAlreadyExist) {
        // unshift to add to the beginning of the array
        this.latestUsedTables.unshift(table);
        LocalStorage.setItem('latestUsedTables', this.latestUsedTables);
      }
      if (this.selectedInspector !== null){
        LocalStorage.setItem('latestUsedInspector', this.selectedInspector);
      }
    },
    initLatestUsedTables() {
      const latestSavedLocalStorageTables = LocalStorage.getItem('latestUsedTables');
      if (latestSavedLocalStorageTables) {
        this.latestUsedTables = latestSavedLocalStorageTables
      }
      const latestSavedLocalStorageInspector = LocalStorage.getItem('latestUsedInspector');
      if (latestSavedLocalStorageInspector) {
        this.selectedInspector = latestSavedLocalStorageInspector
      }
    },
    setSelectedPlayer(player) {
      this.selectedPlayer = player;
    },
    async searchProducts(params) {
      return await posPanelApi.get('/api/Product/GetSearchProducts', {params})
    },
    async createOrder(order) {
      return await posPanelApi.post('/api/Order/Create', order).then(res => {
         fireNotify(i18n.global.t('base.orderCreated'),'created','bottom-right', 1500, 'positive')
        return true
      }).catch(err => {
        fireNotify(i18n.global.t('base.orderNotCreated'),'created','bottom-right', 1500, 'negative');
        return false
      })
    },
    async fetchPlayerOrders(params) {
      return await posPanelApi.get('/api/Order/GetAll', {params})
    },
    async cancelOrderDetail(params) {

      return await posPanelApi.post('/api/Order/UpdateOrderDetailStatus', params).then(res => {
        fireNotify(i18n.global.t('base.orderItemCancelled'),'cancelled','bottom-right', 1500, 'positive')
        return res

      })
    },
    setSelectedInspector(inspector) {
      this.selectedInspector = inspector;
      LocalStorage.setItem('latestUsedInspector', inspector);
    }
  }
})
