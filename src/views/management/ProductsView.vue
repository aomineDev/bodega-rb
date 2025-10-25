<script setup>
import ActionMenu from '@/components/ActionMenu.vue';

</script>
<template>
    <h1>Productos</h1>

    <v-card class="mx-auto" max-width="350" max-height="350">
        <v-img height="200px" src="https://cdn.vuetifyjs.com/images/cards/sunshine.jpg" cover></v-img>

        <v-card-title class="d-flex justify-space-between align-center">
            <span>Franco Mastantuono Villa</span>
            <ActionMenu></ActionMenu>
        </v-card-title>
        <v-card-subtitle class="mb-3">
            Cajero
        </v-card-subtitle>
    </v-card>
</template>
<style scoped></style>