<script setup>
import { useForm } from '@/composables/useForm'
import { ref } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()
const { isValid, formData, formRef, rules, dni, password } = useForm({
  dni: null,
  password: null,
})
const successLogin = ref(false)
const show = ref(false)

async function handleLogin() {
  const valid = await isValid()

  if (!valid) return

  successLogin.value = true
  console.log(formData.value)

  setTimeout(() => {
    router.push('/home')
  }, 1500)
}
</script>

<template>
  <div class="login d-flex justify-center align-center" :class="{ active: successLogin }">
    <v-card min-width="400" class="pa-8 form">
      <v-form ref="formRef">
        <h2 class="text-center text-h5 text-capitalize">embutidos RB</h2>
        <v-mask-input
          label="dni"
          v-model="dni"
          color="primary"
          prepend-inner-icon="mdi-account"
          clearable
          :rules="[rules.required, rules.dni]"
          mask="########"
          variant="underlined"
        ></v-mask-input>
        <v-text-field
          label="password"
          v-model="password"
          color="primary"
          :append-icon="show ? 'mdi-eye' : 'mdi-eye-off'"
          prepend-inner-icon="mdi-lock"
          @click:append="show = !show"
          :type="show ? 'text' : 'password'"
          clearable
          :rules="[rules.required]"
          class="mt-2"
        ></v-text-field>
        <v-btn color="primary" @click="handleLogin" block class="mt-4">ingresar</v-btn>
      </v-form>
    </v-card>

    <div class="wave-container">
      <div class="wave"></div>
      <div class="wave-base"></div>
    </div>
    <div class="sky"></div>
  </div>
</template>

<style scoped>
.login {
  --wave-cubic-bezier: ease-out;
  --wave-animation-time: 2s;
  position: fixed;
  top: 0;
  left: 0;
  height: 100vh;
  width: 100%;
  overflow: hidden;
  z-index: 9999999999;
}

.form {
  position: relative;
  border-radius: 16px;
  box-shadow: rgba(17, 12, 46, 0.15) 0px 48px 100px 0px;
  z-index: 1;
}

.sky {
  position: absolute;
  bottom: 0;
  right: 0;
  width: 100%;
  height: 100vh;
  background: linear-gradient(135deg, transparent 0%, transparent 50%, #212121 50%, #212121 100%);
  background-size: 200% 200%;
  background-position: 0 0;
  background-repeat: no-repeat;
  pointer-events: none;
  z-index: 2;
}

.login.active .sky {
  animation: paint-diagonal var(--wave-cubic-bezier) forwards;
  animation-duration: var(--wave-animation-time);
}

@keyframes paint-diagonal {
  to {
    background-position: 100% 100%;
  }
}

.wave-container {
  width: 5133px;
  position: absolute;
  right: -200px;
  bottom: -200px;
  transform: rotate(-45deg) translateX(50%);
  transform-origin: bottom right;
  z-index: 0;
}

.login.active .wave-container {
  animation: paint-wave var(--wave-cubic-bezier) forwards;
  animation-duration: var(--wave-animation-time);
  z-index: 2;
}

@keyframes paint-wave {
  to {
    bottom: 100%;
    right: 100%;
  }
}

.wave {
  height: 493px;
  background-image: url(../../assets/img/login/wave.svg);
  background-size: contain;
  background-position: left bottom;
  background-repeat: repeat-x;
  filter: drop-shadow(0 -20px 32px rgb(33, 33, 33, 0.2));
  animation: wave 3s linear infinite;
}

@keyframes wave {
  0% {
    background-position-x: 0;
  }
  50% {
    background-position-y: 50px;
  }
  100% {
    background-position-x: -1711px;
  }
}

.wave-base {
  width: 100%;
  position: absolute;
  height: 500px;
  transform: translateY(-10px);
  background-color: #212121;
}
</style>
