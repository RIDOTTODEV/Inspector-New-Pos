<template>
  <q-dialog ref="dialogRef" @hide="onDialogHide">
    <q-card class=" " style="width: 500px!important;">
      <q-card-section class="text-center">
        <q-icon name="o_info" size="100px" color="warning"/>
        <div class="text-h5">
          {{ $t('base.datetimeWarningText') }} <b>{{ values.date }}</b>
        </div>
        <div class="text-subtitle1">
          {{ $t('base.datetimeWarningSubText') }}
        </div>
      </q-card-section>
      <q-card-section class="flex justify-center ">
        <q-btn color="primary" no-caps :label="$t('base.createGameDate')" @click="onSubmitForm" />
        <q-btn class="q-ml-md" color="negative" no-caps :label="$t('base.cancel')" @click="onDialogCancel" />
      </q-card-section>
      <q-inner-loading
        :showing="visible"
        label="Please wait..."
        label-class="text-teal"
        label-style="font-size: 1.1em"
      />
    </q-card>
  </q-dialog>
</template>

<script setup>
import {useDialogPluginComponent} from 'quasar'
import {ref} from "vue";

const visible = ref(false)
const props = defineProps({
  formValues: {
    type: Object,
    required: true,
    default: () => ({})
  },

  actionFn: {
    type: Function,
    required: true
  }
})
const values = ref(props.formValues)
defineEmits([...useDialogPluginComponent.emits])

const {dialogRef, onDialogHide, onDialogOK, onDialogCancel} = useDialogPluginComponent()

const onSubmitForm = async () => {
  visible.value = true
  await props.actionFn({
    ...values.value
  }).then(res => {
    setTimeout(() => {
      visible.value = false
      if (res) {
        onDialogOK()
      }
    }, 1000)
  });
}
</script>
