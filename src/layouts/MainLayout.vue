<template>
  <q-layout view="lHh Lpr lFf">
    <q-page-container class="app-content-bg">
      <router-view/>
    </q-page-container>
  </q-layout>
</template>
<script setup>
import {useInspectorStore} from "stores/inspector-store";

const inspectorStore = useInspectorStore();
inspectorStore.fetchPosSettings();
inspectorStore.fetchInspectors();
inspectorStore.fetchTables();
</script>
