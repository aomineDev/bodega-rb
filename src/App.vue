<script setup>
import { useSnackbar } from './stores/snackbar'
import { storeToRefs } from 'pinia'

const snackbarRef = useSnackbar()

const { snackbar, snackbarMessage, snackbarColor, snackBarLocaltion } = storeToRefs(snackbarRef)

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
      :location="snackBarLocaltion"
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

<style>
.v-navigation-drawer__content,
.custom-scroll {
  scrollbar-width: thin;
  scrollbar-color: transparent transparent;
  transition: scrollbar-color 0.2s ease;
}

.v-navigation-drawer__content:hover,
.custom-scroll:hover {
  scrollbar-color: rgba(0 0 0 / 0.2) transparent;
}
</style>
