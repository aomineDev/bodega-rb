<script setup>
import router from '@/router'

function handleLogin() {
  router.push('/home')
}
</script>

<template>
  <h1>Login</h1>
  <v-btn color="success" @click="handleLogin">login</v-btn>
</template>
