<script setup>
import {useI18n} from "vue-i18n";
import {useLayout} from "src/composables/useLayout";

const {locales, themeStore} = useLayout()
const {locale} = useI18n({useScope: "global"});
</script>

<template>
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
</template>

<style scoped>

</style>
