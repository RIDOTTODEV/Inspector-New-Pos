<script setup>
import {useLayout} from "src/composables/useLayout";
const {toggleDarkMode,$q} = useLayout()
</script>

<template>
  <q-btn
    flat
    :icon="$q.dark.isActive ? 'far fa-moon' : 'far fa-moon'"
    unelevated
    @click="toggleDarkMode"
    :color="$q.dark.isActive ? 'warning' : ''"
  />

</template>

<style scoped>

</style>
