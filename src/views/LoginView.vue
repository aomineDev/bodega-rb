<script setup>
import router from '@/router'
import { ref } from 'vue'
import { useUserStore } from '../stores/user'
const username = ref('')

let { setUser } = useUserStore()
function handleLogin() {
  setUser(username.value)

  router.push('/home')
}
</script>

<template>
  <h1>Login</h1>
  <v-text-field label="Label" v-model="username"></v-text-field>
  <p>{{ username }}</p>
  <v-btn color="success" @click="handleLogin">login</v-btn>
</template>
