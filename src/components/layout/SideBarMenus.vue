<script setup>
import {useLayout} from "src/composables/useLayout";
const {getMenus,currentRouteName,currentRouteMeta,expansionOnHandleShow,expansionRefs} = useLayout()
</script>

<template>
  <q-list separator>
    <div v-for="(menu,index) in getMenus" :key="index">
      <q-item
        v-if="menu.type === 'menu'"
        class="singleMenu text-subtitle1"
        active-class="active-menu" clickable v-ripple
        :active="currentRouteName === menu.routeName"
        :to="menu?.params ? {name:menu.routeName,params:menu.params} : {name:menu.routeName}"
        v-el-perms="menu.permission"
      >
        <q-item-section>{{ $t(`menus.${menu.title}`) }}</q-item-section>
        <q-item-section avatar style="min-width:0!important;">
          <q-icon :name="menu.icon" size="xs"/>
        </q-item-section>
      </q-item>

      <q-expansion-item
        v-if="menu.type === 'dropdown'"
        class="full-width menu text-subtitle1"
        dense
        :default-opened="currentRouteMeta === menu.name"
        expand-icon-class="text-white"
        @show="expansionOnHandleShow(menu.name)"
        :name="menu.name"
        :key="index"
        ref="expansionRefs"
      >
        <template v-slot:header>
           <q-item class=" q-pa-none q-ma-none full-width">
            <q-item-section class=" ">{{ $t(menu.title) }}</q-item-section>
          </q-item>
        </template>
        <q-card class="bg-transparent q-pa-none">
          <q-card-section class="q-pa-none">
            <q-list separator>
              <q-item
                v-for="(item,index) in menu.subMenus"
                :key="index"
                class="menu text-subtitle2"
                active-class="active-menu"
                clickable v-ripple
                :active="currentRouteName === item.routeName"
                :to="item?.params ? {name:item.routeName,params:item.params} : {name:item.routeName}"
                v-el-perms="item?.permission"
              >
                <q-badge style="margin-right: 10px" v-if="item?.badge" text-color="dark" color="lime" floating>
                  {{ $t(`base.${item.badge}`) }}
                </q-badge>
                <q-item-section avatar style="min-width:0!important;">
                  <q-icon :name="item.icon" size="7px" class="q-ml-md"/>
                </q-item-section>
                <q-item-section class=" ">{{ $t(`menus.${item.title}`) }}</q-item-section>
              </q-item>
            </q-list>
          </q-card-section>
        </q-card>
      </q-expansion-item>
    </div>
  </q-list>
</template>

<style scoped>

</style>
