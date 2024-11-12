<script setup>
import PlayersCard from "components/common/PlayersCard.vue";
import {useTable} from "src/composables/useTable";

const {
  showCancelOrderBtn,
  selectedTable,
  getSelectedInspector,
  latestUsedTables,
  currentTablePlayers,
  selectedPlayer,
  categories,
  categoryHistory,
  products,
  fetchFavoriteProduct,
  order,
  selectedOrderItem,
  playerOrders,
  date,
  playerOrderTab,
  $q,
  inspectors,
  showInspectorSelectError,
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
  onClickClearTable,
  onClickCancelOrder,
  selectedInspector
} = useTable();
import {useInspector} from "src/composables/useInspector";
import {getNameOfObject, textCapitalize} from "../utils/helpers";


const {onClickTable} = useInspector();


</script>

<template>
  <q-page>
    <q-card flat class="bg-transparent">
      <q-card-section class="q-pa-none menuTopBorder menuBottomShadow headerMenuBar">
        <div class="row">
          <div class=" col-3 no-wrap   items-center content-center">
            <div class="row  no-wrap flex items-center content-center">
              <q-btn
                flat
                padding="10px"
                class="q-mr-xs q-ml-xs"
                to="/"
              >
                <template v-slot:default>
                  <svg style="width: 55px" v-ripple aria-hidden="true" focusable="false" data-prefix="fas"
                       data-icon="reply-all" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 576 512"
                       class="svg-inline--fa fa-reply-all fa-w-18 fa-3x    ">
                    <path fill="currentColor"
                          d="M136.309 189.836L312.313 37.851C327.72 24.546 352 35.348 352 56.015v82.763c129.182 10.231 224 52.212 224 183.548 0 61.441-39.582 122.309-83.333 154.132-13.653 9.931-33.111-2.533-28.077-18.631 38.512-123.162-3.922-169.482-112.59-182.015v84.175c0 20.701-24.3 31.453-39.687 18.164L136.309 226.164c-11.071-9.561-11.086-26.753 0-36.328zm-128 36.328L184.313 378.15C199.7 391.439 224 380.687 224 359.986v-15.818l-108.606-93.785A55.96 55.96 0 0 1 96 207.998a55.953 55.953 0 0 1 19.393-42.38L224 71.832V56.015c0-20.667-24.28-31.469-39.687-18.164L8.309 189.836c-11.086 9.575-11.071 26.767 0 36.328z"
                          class=""></path>
                  </svg>
                </template>
              </q-btn>
              <q-select
                :options="inspectors"
                emit-value
                map-options
                option-value="staffId"
                option-label="name"
                filled
                dense
                class="full-width"

                v-model="selectedInspector"
                clearable
                :placeholder="selectedInspector === null ? $t('base.selectInspector') :''"
                :error="selectedInspector === null && showInspectorSelectError"
                :error-message="$t('base.selectInspector')"
                hide-bottom-space
                color="dark"
                input-class="no-wrap"
              />
            </div>
          </div>
          <div class="col row flex content-center justify-between">
            <div class="col flex content-center">
              <q-virtual-scroll
                :items="latestUsedTables"
                virtual-scroll-horizontal
                v-slot="{ item, index }"
              >
                <q-avatar
                  v-if="index === 0"
                  color="grey-2"
                  round
                  size="60px"
                  class="q-ma-sm cursor-pointer"
                  v-ripple
                  @click="onClickClearTable"
                >
                  <q-icon name="o_delete_forever" color="negative" />
                </q-avatar>
                <q-avatar
                  :key="index"
                  :color="selectedTable?.tableId === item.tableId ? 'dark' : 'grey-2'"
                  :text-color="selectedTable?.tableId === item.tableId ? 'white':'dark'"
                  round
                  size="60px"
                  class="q-ma-sm cursor-pointer"
                  v-ripple
                  @click="onClickTable(item)"
                >
                  <div class="text-subtitle1 text-center text-bold">
                    {{ item.tableName }}
                  </div>
                </q-avatar>
              </q-virtual-scroll>
            </div>
            <div class="col-2 flex content-center">
              <dark-mode/>
              <languages/>
            </div>
          </div>
        </div>
      </q-card-section>
      <q-card-section class="q-mt-xs  q-pa-xs  menuBottomShadow headerMenuBar" v-if="currentTablePlayers?.length >0">
        <players-card :selected-player="selectedPlayer" :players="currentTablePlayers"
                      @select-player="player => onSelectedPlayer(player)"/>

      </q-card-section>
      <q-card-section v-if="currentTablePlayers?.length === 0">
        <div class="row flex flex-center  " style="height: 300px">
          <div class="text-subtitle1 flex items-center">
            <q-icon name="o_info" size="2rem" class="q-mr-sm"/>
            {{$t('base.noTablePlayers')}}...
          </div>
        </div>
      </q-card-section>
      <q-card-section class="q-pa-none  " v-if="selectedPlayer">
        <div class="row">
          <div class="col-4 q-pa-sm">
            <q-card flat>
              <q-tabs
                v-model="playerOrderTab"
                align="left"
                :active-color="$q.dark.isActive ? 'grey-1' : 'grey-10'"
                :active-bg-color="$q.dark.isActive ? 'grey-8' : 'grey-5'"
                inline-label
                outside-arrows
                no-caps
                narrow-indicator
              >
                <q-tab no-caps name="newOrder" icon="o_loyalty" :label="$t('base.newOrder')"/>
                <q-tab no-caps name="oldOrders" icon="history" :label="$t('base.oldOrders')"/>
              </q-tabs>
              <q-separator/>
              <q-tab-panels v-model="playerOrderTab" animated class="panelContent">
                <q-tab-panel name="newOrder">
                  <q-card flat square>
                    <q-card-section class="q-pa-none">
                      <q-item clickable v-ripple class="col-12 q-mt-xs q-pt-none q-pb-none q-pr-sm q-pl-sm bg-red-1">
                        <q-item-section>
                          <q-item-label class="text-dark text-subtitle1 text-bold">
                            {{ $t('base.newOrderList') }}
                          </q-item-label>
                        </q-item-section>
                        <q-item-section side>
                          <div class="row flex text-subtitle2 text-dark">
                            <q-icon name="o_loyalty" size="20px" class="q-mr-sm"/>
                            <span class="q-mr-xs">{{ $t('base.orderList') }}</span> (<span
                            class="text-bold">{{ order.products.length }}</span>)
                          </div>
                        </q-item-section>
                      </q-item>
                    </q-card-section>
                    <q-card-section class="q-pa-none">
                      <q-scroll-area style="height: calc(100vh - 410px)">
                        <q-list separator>
                          <q-item v-for="(item,index) in order.products" dense :key="index" clickable
                                  :active="selectedOrderItem.index === index" active-class="selectedProduct"
                                  class="q-pl-none q-pr-none">
                            <q-item-section avatar>
                              <div class="flex q-ml-xs">
                                <q-btn
                                  unelevated
                                  :color="selectedOrderItem?.index === index ? 'white' : 'secondary'"
                                  outline
                                  style="width: 40px"
                                  label="-"
                                  class="text-bold"
                                  @click="decreaseProduct(index)"
                                  :text-color="selectedOrderItem?.index === index ? 'white' : 'grey-9'"
                                />

                                <q-btn
                                  unelevated
                                  outline
                                  style="width: 40px"
                                  :label="item.quantity"
                                  class="q-mx-sm text-bold"
                                  :color="selectedOrderItem?.index === index ? 'white' : 'secondary'"
                                  :text-color="selectedOrderItem?.index === index ? 'white' : 'grey-9'"
                                />
                                <q-btn
                                  unelevated
                                  :color="selectedOrderItem?.index === index ? 'white' : 'secondary'"
                                  outline
                                  style="width: 40px"
                                  label="+"
                                  class="text-bold"
                                  @click="increaseProduct(index)"
                                  :text-color="selectedOrderItem?.index === index ? 'white' : 'grey-9'"
                                />
                              </div>
                            </q-item-section>
                            <q-item-section @click="onSelectOrderItem(item,index)">
                              <div class="text-h6">
                                {{ item.productName }}
                              </div>
                              <div class="row flex justify-start" style="margin-top: -5px">
                                <div class="text-subtitle2  q-pr-md" v-if="item.portionSetId && item.portion">
                                  {{ textCapitalize(item.portion) }}
                                </div>
                                <div class="text-subtitle2  q-pr-md" v-if="item.extraSetId && item.extras">
                                  {{ textCapitalize(item.extras) }},
                                </div>
                                <div class="text-subtitle2  q-pr-md" v-if="item.note">
                                  <b>{{ $t('base.note') }}:</b> {{ textCapitalize(item?.note) }}
                                </div>
                              </div>
                            </q-item-section>
                            <q-item-section side>
                              <q-icon class="q-mr-sm"
                                      @click="productPortionAndExtra(selectedOrderItem.product,'update',true)"
                                      size="2rem" name="o_info"
                                      :color="selectedOrderItem?.index === index ? 'white' : 'grey-6'"/>
                            </q-item-section>
                          </q-item>
                        </q-list>
                      </q-scroll-area>
                      <q-btn
                        :disabled="order.products.length === 0"
                        @click="completeOrder"
                        no-caps square color="dark" icon="save" :label="$t('base.completeOrder')" unelevated
                        class="full-width  absolute-bottom"
                        size="20px" style="border-bottom: 13px solid #e6e6e6 "/>
                    </q-card-section>
                  </q-card>
                </q-tab-panel>

                <q-tab-panel name="oldOrders">
                  <q-card flat square>
                    <q-card-section class="q-pa-none">
                      <q-scroll-area style="height: calc(100vh - 350px)" class="q-pl-sm q-pr-sm">
                        <div :class="$q.dark.isActive ? 'q-ma-sm bg-grey-10 full-width row' : 'q-ma-sm bg-grey-1 full-width row'" v-for="(o,i) in playerOrders" :key="i">
                          <div class="col-12 row" v-for="(p,k) in o.products" :key="k">
                            <div class="col-10">
                              <div class="row">
                                <div class="text-subtitle2 text-grey-8">
                                  {{ date.formatDate(p.createdAt, 'DD.MM.YYYY HH:mm') }}
                                </div>
                              </div>
                              <div class="row ">
                                <div class="text-subtitle2 ">{{ p.productName }}</div>
                                <span class="q-ml-sm" v-if="p.portion"> {{ p.portion }}</span>
                                <span class="q-ml-sm" v-if="p.extra"> {{ p.extra }}</span>
                                <q-badge v-if="p?.status === 'New'" color="warning" text-color="dark" class="q-ml-sm">{{ p.status }}</q-badge>
                              </div>


                            </div>
                            <div class="col-1 flex content-center justify-center">
                              <div class="text-subtitle1 text-bold">X{{ p.quantity }}</div>
                            </div>
                            <div class="col-1 flex content-center justify-end">
                              <q-btn v-if="showCancelOrderBtn(p?.orderTagId)" icon="o_delete_forever" flat :disabled="p.status !== 'New'" name="" @click="onClickCancelOrder(p)" color="negative"
                                       class="q-ml-sm cursor-pointer"/>
                            </div>
                          </div>
                        </div>
                      </q-scroll-area  >

                    </q-card-section>
                  </q-card>
                </q-tab-panel>

              </q-tab-panels>
            </q-card>
          </div>
          <div class="col-3 q-pa-sm">
            <q-card flat square>
              <q-card-section class="q-pa-none" style="height: calc(100vh - 313px)">
                <div class="post-category">
                  <div class="pos__categories__inner">
                    <div class="pos__category col-12 cursor-pointer  is-back" style="min-width: 100% !important;"
                         v-if="categoryHistory.length > 0" @click="onClickBack">
                      <q-icon name="arrow_back" size="2rem" class="q-mr-sm"/>
                      {{ $t('base.back') }}
                    </div>
                    <div class="pos__category col-12 cursor-pointer  "
                         :style="fetchFavoriteProduct ? {minWidth: '100% !important', backgroundColor:'#ff3568!important',color:'white'} : {minWidth: '100% !important'}"
                         v-if="categoryHistory.length > 0" @click="onClickFavorite">
                      <q-icon :name="fetchFavoriteProduct ? 'favorite' :'favorite_border'" size="2rem" class="q-mr-sm"/>
                      {{ $t('base.favorites') }}
                    </div>
                    <div class="pos__category cursor-pointer" v-for="(item,index) in categories" :key="index"
                         @click="onClickCategory(item)">
                      <div class="">
                        {{ textCapitalize(getNameOfObject(item)) }}
                      </div>
                    </div>
                  </div>
                </div>
              </q-card-section>
            </q-card>
          </div>
          <div class="col-5 q-pa-sm">
            <q-card flat square class="bg-transparent">
              <q-card-section class="row q-pt-none">
                <q-scroll-area style="height: 500px; width: 100%!important;">
                  <div class="row">
                    <div class="col-4" v-for="(product,index) in products" :key="index"
                         @click="onClickProduct(product)">
                      <div v-ripple
                           class="relative-position text-capitalize container flex justify-center text-center content-center text-bold cursor-pointer q-ma-sm  productBtn"
                           style="height: 60px">
                        {{ textCapitalize(product.productName) }}
                      </div>
                    </div>
                  </div>
                </q-scroll-area>
              </q-card-section>
            </q-card>
          </div>
        </div>
      </q-card-section>
    </q-card>
  </q-page>
</template>
<style scoped class="scss">
.post-category {
  flex: 4;
  overflow: hidden;
  width: 100%;
  position: relative;
  height: 100%;
}

.pos__categories__inner {
  display: flex;
  flex-direction: row;
  white-space: nowrap;
  flex-wrap: wrap;
  /* height: calc(100vh - 310px); */
  height: 100%;
  overflow: auto;
}

.pos__category {
  flex: 1 0 calc(50% - 0.9rem);
  border: 0.05rem #ccc solid;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 1rem 0.25rem;
  font-size: 125%;
  font-weight: 600;
  transition: background-color 200ms ease, color 200ms ease;
  white-space: normal;
  text-align: center;

}

.selectedProduct {
  background-color: #ff3568 !important;
  color: white !important;
}

.hB {
  min-height: 68px !important;
}

.hB:hover {
  background-color: #ff3568 !important;
  color: white !important;
}

.is-back {
  background-color: #e0e0e0 !important;
  color: black !important;

}

.panelContent .q-tab-panel {
  padding: 0px !important;
}
</style>
