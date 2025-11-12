<template>
  <v-row>
    <v-col cols="12" md="6">
      <v-select
        v-model="category"
        :items="categoryList"
        :loading="isPending"
        item-title="nombre"
        item-value="id"
        color="primary"
        label="Categoria"
        prepend-icon="mdi-form-select"
        clearable
        autocomplete="off"
      >
      </v-select>
    </v-col>
    <v-col cols="12" md="6">
      <v-date-input
        v-model="dates"
        label="Fechas"
        color="primary"
        autocomplete="off"
        clearable
        multiple="range"
        :display-format="format"
      ></v-date-input>
    </v-col>
  </v-row>
</template>

<script setup>
import { useCategory } from '@/composables/query/useCategory'
import { useDate } from 'vuetify'

const { category: categoryList, isPending } = useCategory()

const category = defineModel('category')
const dates = defineModel('dates')

const adapter = useDate()

function format(date) {
  return adapter.format(date, 'fullDate')
}
</script>
