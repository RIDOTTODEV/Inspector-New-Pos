<template>
  <q-dialog ref="dialogRef" @hide="onDialogHide" square backdrop-filter="blur(4px) saturate(150%)" transition-show="slide-up" transition-hide="slide-down">
    <q-card class="q-dialog-plugin" style="min-width: 700px">
      <q-form @submit="onSubmit">
        <q-card-section v-if="portions.length > 0">
          <div class="row">
            <div class="text-h6">{{ $t('base.portions') }} <span class="text-negative">*</span></div>
          </div>
          <div class="q-gutter-sm">
            <q-radio
              v-for="(portion,index) in portions"
              :key="index"
              v-model="formValues.portion"
              checked-icon="task_alt"
              unchecked-icon="panorama_fish_eye"
              :val="portion.name"
              :label="portion.name"
              class="text-capitalize"
              color="blue-grey-8"
              size="xl"
              :rules="[val => !val  || $t('base.requiredField',{fieldName: $t('base.portion')})]"
            />
          </div>
        </q-card-section>
        <q-card-section v-if="extras.length > 0">
          <div class="row">
            <div class="text-h6">{{ $t('base.extras') }} </div>
          </div>
          <div class="q-gutter-sm">
            <q-checkbox
              v-for="(extra,index) in extras"
              :key="index"
              v-model="formValues.extras"
              class="text-capitalize"
              color="blue-grey-8"
              size="lg"
              :val="extra.name"
              :label="extra.name"
            />
          </div>
        </q-card-section>
        <q-card-actions align="right">
          <q-btn no-caps color="secondary" style="width: 150px" icon="close" flat :label="$t('base.cancel')" @click="onDialogCancel"/>
          <q-btn no-caps color="blue-grey-8" style="width: 150px" icon="save" unelevated :label="$t('base.save')" type="submit"/>
        </q-card-actions>
      </q-form>
    </q-card>
  </q-dialog>
</template>

<script setup>
import {useDialogPluginComponent} from 'quasar'
import {ref} from "vue";
import {fireNotify} from "src/utils/notifications";
import {i18n} from "boot/i18n";

const props = defineProps({
  product: {
    type: Object,
    required: true
  },
  portions: {
    type: Array,
    required: true
  },
  extras: {
    type: Array,
    required: true
  }
})
const formValues = ref({
  ...props.product
})
defineEmits([
  ...useDialogPluginComponent.emits
])

const {dialogRef, onDialogHide, onDialogOK, onDialogCancel} = useDialogPluginComponent()

const onSubmit = async () => {

  if (formValues.value.portion) {
    onDialogOK({
      ...formValues.value,
      extras: formValues.value.extras ? formValues.value.extras.join(',') : ''
    })
  } else {
    fireNotify(
      i18n.global.t('base.requiredField', {fieldName: i18n.global.t('base.portion')}),
      'failed',
      'bottom-right',
      null,
      'negative',
    )
  }
  //onDialogOK()
}
</script>
