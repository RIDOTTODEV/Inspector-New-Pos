<script setup>
import KioskBoard from "kioskboard";
import {useQuasar, debounce} from "quasar";
import {computed, onMounted, ref} from "vue";

const props = defineProps({
  placeholder: {
    type: String,
    default: '...'
  },
  showPrepend: {
    type: Boolean,
    default: false
  },
  showAppend: {
    type: Boolean,
    default: false
  },
  showClear: {
    type: Boolean,
    default: true
  },
  prependIcon: {
    type: String,
    default: 'search'
  },
  label: {
    type: String,
    default: ''
  },
  rules: {
    type: Array,
    default: () => []
  },
  defaultValue: {
    type: String,
    default: ''
  },
  modelValue: {
    type: String,
    default: ''
  },
  debounce: {
    type: Number,
    default: 300
  },
  type: {
    type: String,
    default: 'text'
  },
  autofocus: {
    type: Boolean,
    default: false
  },
  styleClass: {
    type: String,
    default: () => 'full-width  bg-grey-1'
  },
})
const emits = defineEmits(['update:modelValue', 'closeModal','clearValue'])

const inputRef = ref(null)

const $q = useQuasar()
const initialTheme = computed(() => {
  return $q.dark.isActive ? 'dark' : 'flat'
})

const keysEnterEvent = () => {
  emits('closeModal')
}

const kioskBoardOption = {
  cssAnimationsStyle: 'fade',
  language: 'en',
  autoScroll: true,
  capsLockActive: true,
  // keysFontSize: '13px',
  // keysIconSize: '15px',
  keysAllowSpacebar: true,
  keysEnterCanClose: true,
  // allowRealKeyboard: true,
  // allowMobileKeyboard: true,
  theme: initialTheme.value,

  keysArrayOfObjects: [
    {
      "0": "Q",
      "1": "W",
      "2": "E",
      "3": "R",
      "4": "T",
      "5": "Y",
      "6": "U",
      "7": "I",
      "8": "O",
      "9": "P",
      "10": "Ğ",
      "11":"Ü"
    },
    {
      "0": "A",
      "1": "S",
      "2": "D",
      "3": "F",
      "4": "G",
      "5": "H",
      "6": "J",
      "7": "K",
      "8": "L",
      "9":"Ş",
      "10":"i"
    },
    {
      "0": "Z",
      "1": "X",
      "2": "C",
      "3": "V",
      "4": "B",
      "5": "N",
      "6": "M",
      "7":"Ö",
      "8":"Ç"
    },
  ],
  keysEnterCallback: keysEnterEvent
}

KioskBoard.init({...kioskBoardOption});

onMounted(() => {
  setTimeout(() =>{
    KioskBoard.run('.virtual-keyboard')
  },300)
  if (props.autofocus) {
    setTimeout(() => {
      inputRef.value.focus()
    }, 500)
  }
})

const handleInput = debounce(($event) => {
  emits('update:modelValue', $event.target.value)
}, props.debounce)


</script>

<template>
  <q-field outlined class="kioskInput" :type="type" color="secondary" dense :class="styleClass" v-if="type === 'text'">
    <template v-slot:control>
      <input
        :value="modelValue"
        @change="handleInput($event)"
        data-kioskboard-placement="bottom"
        type="text"
        class="full-width q-field__native virtual-keyboard    "
        :placeholder="placeholder"
        ref="inputRef"
      />
    </template>
    <template v-slot:prepend v-if="showPrepend">
      <q-icon :name="prependIcon" v-if="prependIcon" style="margin-top: 5px"/>
    </template>
    <template v-slot:append>
      <q-btn dense unelevated round  icon="o_cancel" style="margin-top: 5px" class="cursor-pointer"
             @click="emits('clearValue')"/>
    </template>
  </q-field>
  <q-field v-else bg-color="white"   type="textarea" dense class="full-width kioskInput" :placeholder="placeholder">
    <template v-slot:control>
      <textarea
        :value="modelValue"
        @change="handleInput($event)"
        data-kioskboard-placement="bottom"
        class="full-width q-field__native virtual-keyboard  q-pa-sm kioskInput"
        ref="inputRef"
        rows="7"
      />
    </template>
    <template v-slot:prepend v-if="showPrepend">
      <q-icon :name="prependIcon" v-if="prependIcon" style="margin-top: 5px"/>
    </template>
  </q-field>
</template>

<style scoped>
.kioskInput {
  padding: 5px;
  border: 1px solid #d5d5d5;
  border-radius: 4px;
}
#KioskBoard-VirtualKeyboard .kioskboard-wrapper .kioskboard-row-dynamic span {
  max-width: 5.0%!important;
  margin: 9px 8px 6px!important;
}

</style>
