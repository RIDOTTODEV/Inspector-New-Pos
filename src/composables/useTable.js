import {useInspectorStore} from "stores/inspector-store";
import {storeToRefs} from "pinia";
import {computed, defineAsyncComponent, onMounted, ref, watch} from "vue";
import {useQuasar, date, LocalStorage} from "quasar";
import {useRoute, useRouter} from "vue-router";
import {i18n} from "boot/i18n";

export const useTable = () => {
  const router = useRouter();
  const route = useRoute();
  const $q = useQuasar();
  const inspectorStore = useInspectorStore();
  const {
    tables,
    selectedTable,
    selectedInspector,
    getSelectedInspector,
    latestUsedTables,
    currentTablePlayers,
    selectedPlayer,
    terminalMenu,
    terminal,
    posSettings,
    inspectors,
    showCancelOrderBtn,
    getPosTableIdByName
  } = storeToRefs(inspectorStore);

  const playerOrderTab = ref('newOrder')
  const order = ref({
    products: [],
    tableId: getPosTableIdByName.value(selectedTable.value?.tableName),
    tableName: selectedTable.value?.tableName,
    terminalId: terminal.value?.id,
    isGift: false,
    isLovePoint: false,
    tenantId: 1,
    playerName: selectedPlayer.value?.adSoyad,
    externalId: selectedPlayer.value?.uyeNo,
    externalUserId: selectedPlayer.value?.uyeNo,
    orderedByFullName: getSelectedInspector.value?.name || '',
    orderSource: 2,
    TerminalName: terminal.value?.name,
  })
  const playerOrders = ref([])
  const showInspectorSelectError = ref(false)
  const selectedOrderItem = ref({
    index: -1,
    product: null,
  })
  const categories = ref([])
  const categoryHistory = ref([])
  const products = ref([])
  const fetchFavoriteProduct = ref(false)


  const onClickClearTable = async () => {
    inspectorStore.selectedTable = null;
    inspectorStore.latestUsedTables = [];
    LocalStorage.removeItem('latestUsedTables')
    await router.push({name: 'dashboard'});
  }
  const initializeMenu = () => {
    if (terminalMenu.value.length === 1) {
      categoryHistory.value.push(terminalMenu.value[0])
      if (terminalMenu.value[0].categories.length === 1) {
        categoryHistory.value.push(terminalMenu.value[0].categories[0])
        categories.value = terminalMenu.value[0].categories[0].subCategories || []
        products.value = terminalMenu.value[0].categories[0].products || []
      } else {
        categories.value = terminalMenu.value[0].categories || []
      }

    } else {
      categories.value = terminalMenu.value
    }
  }
  const onClickCategory = (category) => {
    categoryHistory.value.push(category)
    categories.value = category.categories || category.subCategories || []
    products.value = category.products || []
    fetchFavoriteProduct.value = false
  }
  const onClickBack = () => {
    if (categoryHistory.value.length > 0) {
      categoryHistory.value.pop()
      const category = categoryHistory.value[categoryHistory.value.length - 1]
      categories.value = category ? category.categories || category.subCategories || [] : terminalMenu.value
      products.value = category ? category.products || [] : []
    }
  }
  const onClickFavorite = async () => {
    fetchFavoriteProduct.value = !fetchFavoriteProduct.value
    if (fetchFavoriteProduct.value) {
      await filterProducts()
    } else {
      products.value = categoryHistory.value.length > 0 ? categoryHistory.value[categoryHistory.value.length - 1]?.products : []
    }
  }
  const onClickProduct = (product) => {
    if (!productPortionAndExtra(product, 'add')) {
      order.value.products.push({
        ...product,
        quantity: 1,
        orderTag: product.tag,
        orderTagId: product.tagId,
        status: 'New',
        menuId: categoryHistory.value[0]?.menuId || null,
        ...getDefaultPortionAndExtras(product)
      })
    }
    playerOrderTab.value = 'newOrder'
  }
  const filterProducts = async () => {
    const menuId = categoryHistory.value[0]?.menuId || null // [0] is the root category
    const categoryId = categoryHistory.value[categoryHistory.value.length - 1]?.categoryId || null // [length - 1] is the current category
    const payload = {
      menuId: menuId,
      categoryId: categoryId,
      favorite: fetchFavoriteProduct.value,
    }
    if (menuId) {
      await inspectorStore.searchProducts(payload).then(res => {
        products.value = res.data || []
      })
    } else {
      products.value = categoryHistory.value.length > 0 ? categoryHistory.value[categoryHistory.value.length - 1]?.products : []
    }
  }
  const getDefaultPortionAndExtras = (product) => {
    const portionSet = inspectorStore.getPortionSet(product.portionSetId)
    const extraSet = inspectorStore.getExtraSet(product.extraSetId)

    const portionSetDefault = portionSet?.portions.find(portion => portion.id === portionSet.defaultPortionId)
    const extraSetDefault = extraSet?.extras.filter(extra => extra.defaultExtra).map(extra => extra.id)
    return {
      portion: portionSetDefault?.name || null,
      extras: extraSetDefault?.name || null
    }

  }
  const addProductToOrder = (product) => {
    const existingProduct = checkProductExist(product)
    if (existingProduct) {
      existingProduct.quantity++
    } else {
      order.value.products.push({
        ...product,
        quantity: 1,
        orderTag: product.tag,
        orderTagId: product.tagId,
        status: 'New',
        menuId: categoryHistory.value[0]?.menuId || null
      })
    }

  }
  const checkProductExist = (product) => {
    return order.value.products.find(
      p => p.id === product.id
        && p.productName === product.productName
        && p.portionSetId === product.portionSetId
        && p.extraSetId === product.extraSetId
        && p?.portion === product?.portion
        && p?.extra === product?.extra
        && p?.note === product?.note
    ) || null
  }
  const increaseProduct = (productIndex) => {
    order.value.products[productIndex].quantity++
  }
  const decreaseProduct = (productIndex) => {
    if (order.value.products[productIndex].quantity > 1) {
      order.value.products[productIndex].quantity--
    } else {
      order.value.products.splice(productIndex, 1)
      if (selectedOrderItem.value.index === productIndex) {
        selectedOrderItem.value = {
          index: -1,
          product: null,
        }
      }

    }
  }
  const productPortionAndExtra = (product, action = 'add', showExist = false) => {
    const portionSet = inspectorStore.getPortionSet(product?.portionSetId)
    const extraSet = inspectorStore.getExtraSet(product?.extraSetId)

    if (showExist) {
      $q.dialog({
        component: defineAsyncComponent(() => import("/src/pages/components/ExtraPortionDialog.vue")),
        componentProps: {
          portions: portionSet?.portions || [],
          product: {
            ...product,
            extras: product?.extras ? product.extras.split(',') : [],
          },
          extras: extraSet ? extraSet.extras : [],
        }
      }).onOk((payload) => {
        if (action === 'add') {
          addProductToOrder(payload)
        } else if (action === 'update') {
          order.value.products[selectedOrderItem.value.index] = payload
          if (selectedOrderItem.value.index !== -1) {
            selectedOrderItem.value.product = payload
          }
        }
      })
      return
    }
    if (portionSet && !portionSet.defaultPortionId) {
      $q.dialog({
        component: defineAsyncComponent(() => import("/src/pages/components/ExtraPortionDialog.vue")),
        componentProps: {
          portions: portionSet.portions || [],
          product: {
            ...product,
            extras: product.extras ? product.extras.split(',') : [],
          },
          extras: extraSet ? extraSet.extras : [],
        }
      }).onOk((payload) => {
        if (action === 'add') {
          addProductToOrder(payload)
        } else if (action === 'update') {
          order.value.products[selectedOrderItem.value.index] = payload
          if (selectedOrderItem.value.index !== -1) {
            selectedOrderItem.value.product = payload
          }
        }
      })
    }

    return portionSet && !portionSet.defaultPortionId
  }
  const onSelectOrderItem = (product, index) => {
    selectedOrderItem.value = {
      index: index,
      product: {...product},
    }

  }
  const completeOrder = async () => {
    $q.loading.show({
      message: i18n.global.t('base.loading'),
    })
    await inspectorStore.createOrder({...order.value}).finally(() => $q.loading.hide())
    order.value.products = []
    await getPlayerOrders({...selectedPlayer.value})
    playerOrderTab.value = 'oldOrders'
  }

  const onSelectedPlayer = async (player) => {
    inspectorStore.setSelectedPlayer(player)
    order.value.playerName = player.adSoyad
    order.value.externalId = player.uyeNo
    order.value.externalUserId = player.uyeNo
    order.value.products = []
    await getPlayerOrders(player)

  }
  const getPlayerOrders = async (player) => {
    const startDateTime = date.formatDate(date.subtractFromDate(new Date(), {days: 2}), 'YYYY-MM-DDTHH:mm:ss')
    let params = {
      externalId: player.uyeNo,
      orderTag: 'SIGARA',
      startDate: startDateTime,
      endDate: null,
      queryType: 'ByTime',
      take: 5,
      skip: 0,
    }
    await inspectorStore.fetchPlayerOrders(params).then(res => {
      playerOrders.value = res.data.data
    })
  }
  const onClickCancelOrder = async (orderItem) => {
    if (terminal.value.askPasswordRestoring.includes(orderItem?.orderTagId)) {
      if (posSettings.value?.inspectorOrderDeletePassword && posSettings.value?.inspectorOrderDeletePassword.toString().length > 0) {
        $q.dialog({
          component: defineAsyncComponent(() => import("/src/pages/components/PasswordDialog.vue")),
          componentProps: {
            password: posSettings.value.inspectorOrderDeletePassword,
          },
          persistent: true,
          position: 'top',
        }).onOk(async (values) => {
          if (values.password === posSettings.value.inspectorOrderDeletePassword) {
            await inspectorStore.cancelOrderDetail({
              orderDetailId: orderItem.id,
              status: 'Cancelled'
            })
            await getPlayerOrders(selectedPlayer.value)
          } else {
            $q.notify({
              type: 'negative',
              message: i18n.global.t('base.wrongPassword'),
              position: 'top-right',
              timeout: 2000,
            })
          }
        })
      }
    } else {
      await inspectorStore.cancelOrderDetail({
        orderDetailId: orderItem.id,
        status: 'Cancelled'
      })
      await getPlayerOrders(selectedPlayer.value)
    }
  }
  const initializeSetup = async () => {
    if (tables.value.length === 0 || inspectors.value.length === 0 || terminalMenu.value.length === 0) {
      await inspectorStore.fetchPosSettings();
      await inspectorStore.fetchInspectors();
      await inspectorStore.fetchTables();
    }

  }
  onMounted(async () => {
    await initializeSetup()
    initializeMenu()
    inspectorStore.initLatestUsedTables()
    if (route.query.tableId) {
      const table = tables.value.find(t => +t.tableId === +route.query.tableId)
      if (table) {
        selectedTable.value = table
        await inspectorStore.fetchTablePlayers(table.tableId)
        order.value.tableId = getPosTableIdByName.value(table?.tableName)
        order.value.tableName = table?.tableName
      }
    }
    if (route.query.inspectorName || route.query.inspectorId) {
      const inspector = inspectors.value.find(inspector => inspector.id === +route.query.inspectorId || inspector.name === route.query.inspectorName)
      if (inspector) {
        inspectorStore.setSelectedInspector(inspector)
      }
    }
    if (route.query.playerId || route.query.playerName) {
      const player = currentTablePlayers.value.find(player => +player.uyeNo === +route.query.playerId)
      if (player) {
        selectedPlayer.value = player
        await onSelectedPlayer(player)
      }
    }
  })
  watch(() => terminalMenu.value, () => {
    initializeMenu()
  })
  watch(() => terminal.value, () => {
    order.value.terminalId = terminal.value?.id
    order.value.TerminalName = terminal.value?.name
  })

  watch(() => getSelectedInspector.value, () => {
    order.value.orderedByFullName = getSelectedInspector.value?.name || ''
  })

  const orderByAlphabeticProducts = computed(() => {
    return products.value.sort((a, b) => a.productName.localeCompare(b.productName))
  })
  return {
    $q,
    inspectorStore,
    selectedTable,
    selectedInspector,
    getSelectedInspector,
    latestUsedTables,
    currentTablePlayers,
    router,
    onClickClearTable,
    date,
    selectedPlayer,

    categories,
    categoryHistory,
    products,
    fetchFavoriteProduct,
    order,
    selectedOrderItem,
    playerOrders,
    playerOrderTab,
    inspectors,
    showInspectorSelectError,
    showCancelOrderBtn,
    orderByAlphabeticProducts,
    onClickCategory,
    onClickBack,
    onClickFavorite,
    onClickProduct,
    increaseProduct,
    decreaseProduct,
    onSelectOrderItem,
    productPortionAndExtra,
    onSelectedPlayer,
    completeOrder,
    onClickCancelOrder
  }
}
