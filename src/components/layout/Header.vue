<script setup>
import {useI18n} from "vue-i18n";
defineProps({
  drawer: {
    type: Boolean,
    required: true
  }
})
const emits = defineEmits(['triggerDraw'])
import {useLayout} from "src/composables/useLayout";

const {locales, themeStore,toggleDarkMode,$q} = useLayout()
const {locale} = useI18n({useScope: "global"});
</script>

<template>
  <div class="row menuTopBorder menuBottomShadow headerMenuBar q-pa-sm">
    <div class="row col-12 q-pa-xs ">
      <div class="row col-12">
        <div class="col-md-3 col-sm-12 col-xs-12 row content-center">
          <q-select
            :options="[{value:'1',label:'Vepa Mirzayev'}]"
            emit-value
            map-options
            option-value="value"
            option-label="label"
            filled
            dense
            class="full-width"
            use-input
            :placeholder="$t('base.selectInspector')"
          >
            <template v-slot:append>
              <q-icon name="o_elevator" />
            </template>
          </q-select>
        </div>
        <div class="col-md-9 col-sm-12 col-xs-12">
          <div class="row flex justify-end content-center items-center">
           <div class="col flex justify-end">
             <q-btn label="Table Name" class="q-mr-md" icon="filter_list" unelevated color="grey-2"  text-color="dark" size="18px" no-caps  />
             <q-btn label="Currency" class="q-mr-md" icon="payments" unelevated color="grey-2"  text-color="dark" size="18px" no-caps  />
             <q-btn label="Game Type" class="q-mr-md" icon="games" unelevated color="grey-2"  text-color="dark" size="18px" no-caps  />
             <q-btn label="Refresh" class="q-mr-md" icon="loop" unelevated color="grey-2"  text-color="dark" size="18px" no-caps  />
           </div>
            <q-btn
              flat
              :icon="$q.dark.isActive ? 'far fa-moon' : 'far fa-moon'"
              unelevated
              @click="toggleDarkMode"
              :color="$q.dark.isActive ? 'warning' : ''"
            />
            <q-select
              v-model="themeStore.selectedLocale"
              :options="locales"
              @update:model-value="() => {
             locale = themeStore.selectedLocale.lang
             themeStore.setLocale(themeStore.selectedLocale.lang)
             }"
              dense
              borderless
              class="q-ml-md"
            >
              <template v-slot:option="scope">
                <q-item v-bind="scope.itemProps">
                  <q-item-section>
                    <q-item-label>
                      <q-img
                        :src="scope.opt.iconPath"
                        fit="contain"
                        width="20px"
                        height="20px"
                        class="q-mr-sm"
                      />
                      {{ scope.opt.title }}
                    </q-item-label>
                  </q-item-section>
                </q-item>
              </template>
              <template v-slot:selected-item="scope">
                <div class="text-subtitle2  ">
                  <q-img
                    :src="scope.opt.iconPath"
                    fit="contain"
                    width="20px"
                    height="20px"
                    class="q-mr-sm"
                  />
                  {{ scope.opt.title }}
                </div>
              </template>
            </q-select>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>

</style>
