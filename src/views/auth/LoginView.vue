<script setup>
import router from '@/router'
import { ref } from 'vue'
import { useUserStore } from '../../stores/user'

const username = ref('')

const userStore = useUserStore()

const { setUser } = userStore

function handleLogin() {
  setUser(username.value)

  router.push('/home')
}
</script>

<template>
  <div class="login d-flex justify-center align-center">
    <v-card min-width="400" class="pa-8" rounded elevation="5">
      <h1>Login</h1>
      <v-text-field label="Label" v-model="username"></v-text-field>
      <v-btn color="success" @click="handleLogin">login</v-btn>
    </v-card>

    <div class="wave-container">
      <div class="wave"></div>
      <div class="wave-base"></div>
    </div>
  </div>
</template>

<style scoped>
.login {
  position: relative;
  height: 100%;
  overflow: hidden;
}
.wave-container {
  width: 2880px;
  position: absolute;
  right: 100px;
  bottom: 0;
  transform: translate(55%, 50%) rotate(-45deg) scale(0.3);
}
.wave {
  height: 461px;
  background-image: url(../../assets/img/login/wave.png);
  background-size: contain;
  background-position: left bottom;
  background-repeat: repeat-x;
  /* animation: wave 8s infinite cubic-bezier(0.11, 0.37, 0.91, 0.63); */
  animation: wave 1000s infinite cubic-bezier(0.5, -100, 0.5, 100);
  /* animation: wave 5s infinite cubic-bezier(0.47, 1.64, 0.41, 0.8); */
}
@keyframes wave {
  0% {
    background-position-x: 0;
  }
  100% {
    background-position-x: -2880px;
  }
}
.wave-base {
  background-color: #363636;
  height: 2000px;
  transform: translateY(-10px);
}
</style>
