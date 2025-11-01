<script setup>
import { RouterView } from 'vue-router'
import { useSnackbar } from './stores/snackbar'
import { storeToRefs } from 'pinia'

const snackbarRef = useSnackbar()

const { snackbar, snackbarMessage, snackbarColor } = storeToRefs(snackbarRef)

const { closeSnackbar } = snackbarRef
</script>

<template>
  <v-app>
    <router-view v-slot="{ Component }">
      <v-fade-transition>
        <component :is="Component" />
      </v-fade-transition>
    </router-view>
    <v-snackbar
      v-model="snackbar"
      timeout="2000"
      :color="snackbarColor"
      variant="flat"
      location="bottom right"
      :text="snackbarMessage"
    >
      <template v-slot:actions>
        <v-btn
          :color="snackbarColor"
          variant="text"
          @click="closeSnackbar"
          icon="mdi-close"
        ></v-btn>
      </template>
    </v-snackbar>
  </v-app>
</template>
