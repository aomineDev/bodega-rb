<script setup>
import router from '@/router'
import { ref } from 'vue'
import { useUserStore } from '../stores/user'

const username = ref('')

const userStore = useUserStore()

const { setUser } = userStore

function handleLogin() {
  setUser(username.value)

  router.push('/home')
}
</script>

<template>
  <div>
    <h1>Login</h1>
    <v-text-field label="Label" v-model="username" variant="underlined"></v-text-field>
    <v-btn color="success" @click="handleLogin">login</v-btn>
  </div>
</template>
