<script setup>
import { RouterView, RouterLink } from 'vue-router'
</script>

<template>
  <h1>Dashboard Layout</h1>
  <RouterLink to="/home">home</RouterLink>
  |
  <RouterLink to="/about">about</RouterLink>
  |

  <RouterLink to="/login">log out</RouterLink>

  <RouterView />
</template>
