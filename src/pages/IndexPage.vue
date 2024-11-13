<template>
  <q-page class="">
    <q-card flat class="bg-transparent">
      <q-card-section class="q-pa-none ">
        <div class="row menuTopBorder menuBottomShadow headerMenuBar q-pa-sm">
          <div class="row col-12 q-pa-xs ">
            <div class="row col-12">
              <div class="col-md-3 col-sm-4 col-xs-6 row content-center">
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
                />
              </div>
              <div class="col-md-9 col-sm-8 col-xs-6">
                <div class="row flex justify-end content-center items-center">
                  <div class="col flex justify-end">
                    <q-btn
                      @click="() => {
                       sortByTable = 'byTableName';
                        isAscending = !isAscending;
                     }"
                      class="q-mr-md"
                      unelevated
                      :color="$q.dark.isActive ? 'grey-9' : 'grey-2'"
                      :text-color="$q.dark.isActive ? 'white' : 'dark'"
                      size="18px" no-caps>
                      <template v-slot:default>
                        <div class="text-h6 flex items-center content-center ">
                          <q-icon
                            v-if="sortByTable === 'byTableName'"
                            :name="isAscending ? 'fas fa-sort-amount-down' : 'fas fa-sort-amount-up'"
                            size="19px"
                            class="q-mr-sm"
                            style="margin-top: 4px"
                            :color="$q.dark.isActive ? 'warning' : 'negative'"
                          />
                          {{$t('base.tableName')}}
                        </div>
                      </template>
                    </q-btn>

                    <q-btn
                      @click="() => {
                       sortByTable = 'byCurrency';
                        isAscending = !isAscending;
                     }"
                      class="q-mr-md"
                      unelevated
                      :color="$q.dark.isActive ? 'grey-9' : 'grey-2'"
                      :text-color="$q.dark.isActive ? 'white' : 'dark'"
                      size="18px" no-caps
                    >
                      <template v-slot:default>
                        <div class="text-h6 flex items-center content-center ">
                          <q-icon
                            v-if="sortByTable === 'byCurrency'"
                            :name="isAscending ? 'fas fa-sort-amount-down' : 'fas fa-sort-amount-up'"
                            size="19px"
                            class="q-mr-sm"
                            style="margin-top: 4px"
                            :color="$q.dark.isActive ? 'warning' : 'negative'"
                          />
                          {{$t('base.currency')}}
                        </div>
                      </template>
                    </q-btn>
                    <q-btn
                      @click="() => {
                       sortByTable = 'byGameType';
                        isAscending = !isAscending;
                     }"
                      class="q-mr-md"
                      unelevated
                      :color="$q.dark.isActive ? 'grey-9' : 'grey-2'"
                      :text-color="$q.dark.isActive ? 'white' : 'dark'"
                      size="18px" no-caps
                    >
                      <template v-slot:default>
                        <div class="text-h6 flex items-center content-center ">
                          <q-icon
                            v-if="sortByTable === 'byGameType'"
                            :name="isAscending ? 'fas fa-sort-amount-down' : 'fas fa-sort-amount-up'"
                            size="19px"
                            class="q-mr-sm"
                            style="margin-top: 4px"
                            :color="$q.dark.isActive ? 'warning' : 'negative'"
                          />
                          {{$t('base.gameType')}}
                        </div>
                      </template>
                    </q-btn>
                    <q-btn @click="inspectorStore.fetchTables()" :label="$t('base.refresh')" class="q-mr-md" icon="loop"
                           unelevated
                           color="negative" size="18px" no-caps/>
                  </div>
                  <dark-mode/>
                  <languages/>
                </div>
              </div>
            </div>
          </div>
        </div>
      </q-card-section>
      <q-card-section>
        <q-scroll-area style="height: calc(100vh - 175px)">
        <q-avatar
          v-for="(table, index) in sortedTables"
          :key="index"
          :color="$q.dark.isActive ? 'grey-9' : 'grey-9'"
          text-color="white"
          round
          size="120px"
          class="q-ma-md cursor-pointer"
          v-ripple
          @click="onClickTable(table)"
        >
          <div class="text-h6 text-bold">
            {{ table.tableName }}
          </div>
        </q-avatar>
        </q-scroll-area>
      </q-card-section>
    </q-card>
  </q-page>
</template>
<script setup>
import {useInspector} from "src/composables/useInspector";


const {$q,inspectorStore, selectedInspector, inspectors, sortByTable, sortedTables, isAscending,showInspectorSelectError,onClickTable} = useInspector();
</script>
