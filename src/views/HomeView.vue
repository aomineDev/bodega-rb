<template>
  <h1>Reporte</h1>
  <p v-if="isPending">Loading...</p>

  <p v-else-if="isError">Error: {{ error }}></p>

  <template v-else-if="metrics">
    <v-row class="mt-4">
      <v-col cols="12" md="4">
        <v-card>
          <v-card-title class="text-primary">Ventas del dia</v-card-title>
          <v-card-text>
            <h2 class="py-3">{{ metrics.dailySales }}</h2>
          </v-card-text>
        </v-card>
      </v-col>
      <v-col cols="12" md="4">
        <v-card>
          <v-card-title class="text-primary">Ingresos del dia</v-card-title>
          <v-card-text>
            <h2 class="py-3">S/. {{ metrics.dailyRevenue?.toFixed(2) }}</h2>
          </v-card-text>
        </v-card>
      </v-col>
      <v-col cols="12" md="4">
        <v-card>
          <v-card-title class="text-primary">Presupuesto del dia</v-card-title>
          <v-card-text>
            <h2 class="py-3">S/. 1000.00</h2>
          </v-card-text>
        </v-card>
      </v-col>
      <v-col cols="12">
        <v-card>
          <v-card-item>
            <v-card-title class="text-primary">Ingresos Diarios</v-card-title>
            <v-card-subtitle>de los ultimos 30 dias</v-card-subtitle>
          </v-card-item>
          <v-card-text>
            <div id="incomeChart">
              <apexchart
                type="area"
                height="350"
                :options="incomeOptions"
                :series="incomeSeries"
              ></apexchart>
            </div>
          </v-card-text>
        </v-card>
      </v-col>
      <v-col cols="12" md="6">
        <v-card>
          <v-card-item>
            <v-card-title class="text-primary">10 Productos mas vendidos</v-card-title>
            <v-card-subtitle>de los ultimos 30 dias</v-card-subtitle>
          </v-card-item>
          <v-card-text>
            <div id="bestSellingChart">
              <apexchart
                type="bar"
                height="350"
                :options="bestSellingOptions"
                :series="bestSellingSeries"
              ></apexchart>
            </div>
          </v-card-text>
        </v-card>
      </v-col>
      <v-col cols="12" md="6">
        <v-card>
          <v-card-item>
            <v-card-title class="text-primary">10 Categorias mas vendidas</v-card-title>
            <v-card-subtitle>de los ultimos 30 dias</v-card-subtitle>
          </v-card-item>
          <v-card-text>
            <div id="bestSellingCategoryChart">
              <apexchart
                type="pie"
                height="350"
                :options="bestSellCategoryOptions"
                :series="bestSellCategorySeries"
              ></apexchart>
            </div>
          </v-card-text>
        </v-card>
      </v-col>
      <v-col cols="12" md="6">
        <v-card>
          <v-card-item>
            <v-card-title class="text-primary">Productos con bajo stock</v-card-title>
            <v-card-subtitle>menos de 10 unidades/Kgs</v-card-subtitle>
          </v-card-item>
          <v-card-text>
            <div id="lowStockChart">
              <apexchart
                type="bar"
                height="350"
                :options="lowStockOptions"
                :series="lowStockSeries"
              ></apexchart>
            </div>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </template>
</template>

<script setup>
import { computed } from 'vue'
import { useTheme } from 'vuetify'
import { useDashboard } from '@/composables/query/useDashboard'

const theme = useTheme()
const { metrics, isError, isPending, error } = useDashboard()

const incomeSeries = computed(() => [
  {
    name: 'Venta Total',
    data: metrics?.value?.dailyRevenueAmount,
  },
])

const incomeOptions = computed(() => ({
  theme: {
    mode: theme.current.value.dark ? 'dark' : 'light',
  },
  chart: {
    type: 'area',
    height: 350,
    zoom: {
      enabled: false,
    },
    background: 'transparent',
  },
  dataLabels: {
    enabled: false,
  },
  stroke: {
    curve: 'smooth',
  },
  labels: metrics?.value?.dailyRevenueDate,
  xaxis: {
    type: 'datetime',
  },
  yaxis: {
    opposite: true,
  },
  legend: {
    horizontalAlign: 'left',
  },
}))

const bestSellingSeries = computed(() => [
  {
    name: 'Productos',
    data: metrics?.value?.bestSellingProductsAmount,
  },
])

const bestSellingOptions = computed(() => ({
  theme: {
    mode: theme.current.value.dark ? 'dark' : 'light',
  },
  chart: {
    type: 'bar',
    height: 350,
    background: 'transparent',
  },
  plotOptions: {
    bar: {
      borderRadius: 4,
      borderRadiusApplication: 'end',
      horizontal: true,
    },
  },
  dataLabels: {
    enabled: false,
  },
  xaxis: {
    categories: metrics?.value?.bestSellingProducts,
  },
  grid: {
    show: false,
  },
}))

const bestSellCategorySeries = computed(() => metrics?.value?.bestSellingCategoriesAmount)

const bestSellCategoryOptions = computed(() => ({
  theme: {
    mode: theme.current.value.dark ? 'dark' : 'light',
  },
  chart: {
    height: 350,
    type: 'pie',
    background: 'transparent',
  },
  labels: metrics?.value?.bestSellingCategories,
  responsive: [
    {
      breakpoint: 480,
      options: {
        legend: {
          position: 'bottom',
        },
      },
    },
  ],
}))

const lowStockSeries = computed(() => [
  {
    name: 'Bajo Stock',
    data: metrics?.value?.lowStockProductsAmount,
  },
])

const lowStockOptions = computed(() => ({
  theme: {
    mode: theme.current.value.dark ? 'dark' : 'light',
  },
  chart: {
    type: 'bar',
    height: 350,
    background: 'transparent',
  },
  plotOptions: {
    bar: {
      borderRadius: 4,
      borderRadiusApplication: 'end',
      horizontal: true,
    },
  },
  dataLabels: {
    enabled: false,
  },
  xaxis: {
    categories: metrics?.value?.lowStockProducts,
  },
  grid: {
    show: false,
  },
}))
</script>
