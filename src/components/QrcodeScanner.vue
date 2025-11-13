<template>
  <div :id></div>
</template>

<script setup>
import { Html5QrcodeScanner } from 'html5-qrcode'
import { onMounted, onUnmounted } from 'vue'

const { qrbox, fps } = defineProps({
  qrbox: {  
    type: Number,
    default: 250,
  },
  fps: {
    type: Number,
    default: 10,
  },
})

const emits = defineEmits(['result'])

const id = 'qr-code-full-region'

const config = {
  qrbox,
  fps,
}

let html5QrcodeSCanner

onMounted(() => {
  html5QrcodeSCanner = new Html5QrcodeScanner(id, config)
  html5QrcodeSCanner.render(onScanSuccess)
})

onUnmounted(() => {
  html5QrcodeSCanner.clear()
})

function onScanSuccess(decodedText, decodedResult) {
  emits('result', decodedText, decodedResult)
}
</script>
