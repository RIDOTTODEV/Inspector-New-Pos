<template>
  <q-input
    ref="inputRef"
    v-model="formattedValue"
    outlined
    dense
    lazy-rules
    :rules="customRules"
    hide-bottom-space
    class="super-small"
    :input-class="props.inputClass"
    :readonly="props.disable"
  >
    <template v-slot:append>
      <div v-html="append"></div>
      <q-btn
        v-if="showAppendDisableBtn"
        :disable='appendDisableBtnParams.isClosed'
        @click='appendDisableBtnParams.disableFn()'
        icon='edit'
        color='grey'
        size='12px'
        style="margin-right: -10px;cursor: pointer!important;"
        flat/>
    </template>
    <template v-slot:prepend>
      <div v-html="prepend"></div>
    </template>
  </q-input>
</template>

<script setup>

import {useCurrencyInput} from "vue-currency-input";

import {watch, ref} from "vue";

const props = defineProps({
  modelValue: {
    type: Number,
    required: false,
  },
  currency: {
    type: String,
    required: true,
  },
  customRules: {
    type: Array,
    default: () => [],
  },
  append: {
    type: String,
    default: "",
    required: false,
  },
  prepend: {
    type: String,
    default: "",
    required: false,
  },
  disable: {
    type: Boolean,
    default: false,
  },
  showAppendDisableBtn: {
    type: Boolean,
    default: false,
  },
  appendDisableBtnParams: {
    type: Object,
    default: () => ({}),
  },
});


const {inputRef, formattedValue, numberValue, setValue, setOptions} = useCurrencyInput({
  currency: props.currency,
  hideCurrencySymbolOnFocus: true,
  currencyDisplay: "hidden",
  precision: {
    min: 0,
    max: props.precision
  },
  hideGroupingSeparatorOnFocus: true,
  hideNegligibleDecimalDigitsOnFocus: true,
  autoDecimalDigits: false,
  useGrouping: true,
  accountingSign: false,
  valueRange: {
    min: 0,
  },
});


watch(() => props.modelValue, (value) => {
  setValue(value);
});

watch(() => props.currency, (currency) => {
  setOptions({currency});
});
watch(() => formattedValue.value, () => {
  if (props.showOriginalValue === true) {
    if (Number.isInteger(numberValue.value) && Number(numberValue.value) === 1) {
      formattedValue.value = numberValue.value
    }
  }
});

</script>

<style lang="scss">
.q-field__bottom--stale {
  display: none;
}
</style>
