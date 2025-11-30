<template>
  <h1>Reporte</h1>
  <v-row class="mt-4">
    <v-col cols="12" md="4">
      <v-card>
        <v-card-title class="text-primary">Ventas del dia</v-card-title>
        <v-card-text>
          <h2 class="py-3">1000</h2>
        </v-card-text>
      </v-card>
    </v-col>

    <v-col cols="12" md="4">
      <v-card>
        <v-card-title class="text-primary">Ingresos del dia</v-card-title>
        <v-card-text>
          <h2 class="py-3">S/. 1000.00</h2>
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
  </v-row>

  <v-row class="mt-4">
    <v-col cols="12">
      <v-card>
        <v-card-items>
          <v-card-title class="text-primary">Ingresos Diarios</v-card-title>
          <v-card-subtitle>de los ultimos 30 dias</v-card-subtitle>
        </v-card-items>

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
  </v-row>

  <v-row class="mt-4">
    <v-col cols="12" md="6">
      <v-card>
        <v-card-items>
          <v-card-title class="text-primary">10 Productos mas vendidos</v-card-title>
          <v-card-subtitle>de los ultimos 30 dias</v-card-subtitle>
        </v-card-items>

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
        <v-card-items>
          <v-card-title class="text-primary">10 Categorias mas vendidas</v-card-title>
          <v-card-subtitle>de los ultimos 30 dias</v-card-subtitle>
        </v-card-items>

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
  </v-row>
</template>

<script setup>
import { computed } from 'vue'
import { useTheme } from 'vuetify'

const theme = useTheme()

const incomeSeries = [
  {
    name: 'Venta Total',
    data: [30, 40, 45, 50, 49, 60, 70, 91],
  },
]
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
    curve: 'straight',
  },
  labels: [
    '01/01/2003',
    '02/01/2003',
    '03/01/2003',
    '04/01/2003',
    '05/01/2003',
    '06/01/2003',
    '07/01/2003',
    '08/01/2003',
  ],
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

const bestSellingSeries = [
  {
    data: [400, 430, 448, 470, 540, 580, 690, 1100, 1200, 1380],
  },
]
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
    categories: [
      'South Korea',
      'Canada',
      'United Kingdom',
      'Netherlands',
      'Italy',
      'France',
      'Japan',
      'United States',
      'China',
      'Germany',
    ],
  },
  grid: {
    show: false,
  },
}))

const bestSellCategorySeries = [44, 55, 13, 43, 22]

const bestSellCategoryOptions = computed(() => ({
  theme: {
    mode: theme.current.value.dark ? 'dark' : 'light',
  },
  chart: {
    height: 350,
    type: 'pie',
    background: 'transparent',
  },
  labels: ['Team A', 'Team B', 'Team C', 'Team D', 'Team E'],
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
</script>
