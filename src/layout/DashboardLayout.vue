<script setup>
import { RouterView, RouterLink } from 'vue-router'
import { useUserStore } from '@/stores/user'

const { user } = useUserStore()
</script>

<template>
  <v-card>
    <v-layout>
      <v-app-bar :elevation="2">
        <template v-slot:prepend>
          <v-app-bar-nav-icon></v-app-bar-nav-icon>
        </template>

        <v-app-bar-title>Application Bar</v-app-bar-title>

        <template v-slot:append>
          <RouterLink to="/home">Home</RouterLink> | <RouterLink to="/about">about</RouterLink> |
          {{ user }}
          <RouterLink to="/login">Log out</RouterLink>
        </template>
      </v-app-bar>
      <RouterView />
    </v-layout>
  </v-card>
</template>
