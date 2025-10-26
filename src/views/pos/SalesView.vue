<script setup>

// import ActionMenu from '@/components/ActionMenu.vue';
import { ref } from 'vue';

// const showClientDialog = ref(true)
// const customerType = ref('natural')
// const dni = ref('')
// const ruc = ref('')

// const buscarCliente = () => {
//   const value = customerType.value === 'natural' ? dni.value : ruc.value
//   if (!value || (customerType.value === 'natural' && value.length < 8)) {
//     alert('Ingrese un DNI válido')
//     return
//   }
//   if (customerType.value === 'juridical' && value.length < 11) {
//     alert('Ingrese un RUC válido')
//     return
//   }

//   console.log('Buscando cliente:', { tipo: customerType.value, value })
//   showClientDialog.value = false
// }

// const cancelarVenta = () => {
//   // Redirigir o limpiar si es necesario
//   showClientDialog.value = false
// }

const producto = ref([
  {
    id: 1,
    codigoBarra: '1234567890123',
    nombre: 'Leche gloria',
    descripcion: 'Leche de toro',
    precioUnitario: 8.50,
    precioPromocion: 6.50,
    inicioPromocion: '2025-10-20',
    finPromocion: '2025-10-31',
    stockActual: 85,
    unidadMedida: 'unidad',
    imagen: '/img/default.png',
    categoria: 'Conservas',
    proveedor: 'Alicorp'
  },
])
</script>

<template>

  <h1>Ventas</h1>

  <!-- <v-dialog v-model="showClientDialog" persistent max-width="480">
    <v-card elevation="0" rounded="lg">
      <v-card-title class="text-h6 d-flex align-center justify-space-between">
        <span>Asignar Cliente</span>
        <v-btn icon variant="text" @click="cancelarVenta">
          <v-icon>mdi-close</v-icon>
        </v-btn>
      </v-card-title>

      <v-divider></v-divider>

      <v-card-text class="mt-4">
        <v-row>
          <v-col cols="12" class="text-center">
            <v-icon size="48" color="primary">mdi-account-search-outline</v-icon>
            <div class="text-body-1 font-weight-medium mt-2">
              Seleccione el tipo de cliente
            </div>
          </v-col>

          <v-col cols="12" class="mt-2">
            <v-radio-group v-model="customerType" row class="justify-center">
              <v-radio label="Natural (DNI)" value="natural" />
              <v-radio label="Jurídico (RUC)" value="juridical" />
            </v-radio-group>
          </v-col>

          <v-divider class="my-2"></v-divider>

          <v-col cols="12" class="text-center">
            <v-label class="text-subtitle-1 font-weight-medium">
              {{ customerType === 'natural' ? 'Ingrese DNI' : 'Ingrese RUC' }}
            </v-label>

            <v-otp-input v-if="customerType === 'natural'" v-model="dni" :length="8" type="number" variant="underlined"
              class="mt-3" autofocus />

            <v-otp-input v-else v-model="ruc" :length="11" type="number" variant="underlined" class="mt-3" autofocus />
          </v-col>
        </v-row>
      </v-card-text>

      <v-divider></v-divider>

      <v-card-actions class="justify-end pa-4">
        <v-btn variant="text" color="grey" @click="cancelarVenta">Cancelar</v-btn>
        <v-btn color="primary" variant="flat" @click="buscarCliente">Continuar</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog> -->

  <v-container fluid class="pa-4">
    <v-row>
      <!-- COLUMNA IZQUIERDA: Productos -->
      <v-col cols="12" md="8">
        <v-row>
          <v-col v-for="(item, index) in producto" :key="index" cols="12" sm="6" md="6" lg="4">
            <v-hover v-slot="{ isHovering, props }">
              <v-card v-bind="props" :elevation="isHovering ? 4 : 1" class="transition-fast" rounded="xl">
                <!-- Imagen -->
                <v-img :src="item.imagen" height="220" cover>
                  <v-expand-transition>
                    <div v-if="isHovering" class="position-absolute" style="inset:0; background-color:rgba(0,0,0,0.2);">
                    </div>
                  </v-expand-transition>
                </v-img>

                <v-divider :thickness="2" />

                <!-- Título -->
                <v-card-title class="text-h6 font-weight-medium text-center transition-fast"
                  :class="{ 'text-primary': isHovering }">
                  {{ item.nombre }}
                </v-card-title>

                <!-- Botón -->
                <v-card-actions class="justify-center pb-4">
                  <v-btn color="primary" variant="flat" prepend-icon="mdi-cart-plus" @click="agregar(item)"
                    :elevation="isHovering ? 4 : 1" class="transition-fast">
                    Agregar
                  </v-btn>
                </v-card-actions>
              </v-card>
            </v-hover>
          </v-col>
        </v-row>
      </v-col>

      <!-- COLUMNA DERECHA: Resumen de Venta -->
      <v-col cols="12" md="4">
        <v-card elevation="1" rounded="lg" class="pa-4 position-sticky" style="top: 80px; z-index: 2;">
          <!-- Cliente -->
          <div class="d-flex justify-space-between align-center mb-3">
            <v-btn color="primary" prepend-icon="mdi-account-plus-outline">
              Asignar cliente
            </v-btn>
          </div>

          <v-text-field label="N° Identificación" density="comfortable" variant="underlined" disabled readonly
            hide-details value="12345678" />

          <v-text-field label="Cliente" density="comfortable" variant="underlined" disabled readonly hide-details
            value="Juan Pérez" class="mt-2" />

          <v-divider class="my-4" />

          <!-- Resumen de Venta -->
          <div>
            <div class="text-subtitle-1 font-weight-medium mb-2">Resumen de venta</div>

            <v-list density="compact" class="rounded-lg bg-grey-lighten-4">
              <v-list-item title="Leche Gloria" subtitle="Cant. 1">
                <template #append>
                  <span>S/ 8.50</span>
                </template>
              </v-list-item>

              <v-list-item title="Atún" subtitle="Cant. 2">
                <template #append>
                  <span>S/ 15.00</span>
                </template>
              </v-list-item>
            </v-list>

            <v-divider class="my-4" />

            <!-- Totales -->
            <v-row>
              <v-col cols="6" class="text-left">GRAVADO</v-col>
              <v-col cols="6" class="text-right">S/ 19.92</v-col>

              <v-col cols="6" class="text-left">IGV</v-col>
              <v-col cols="6" class="text-right">S/ 3.58</v-col>

              <v-col cols="6" class="text-subtitle-1 font-weight-bold">TOTAL</v-col>
              <v-col cols="6" class="text-right text-subtitle-1 font-weight-bold">
                S/ 23.50
              </v-col>
            </v-row>

            <v-divider class="my-4" />

            <!-- Tipo de pago -->
            <v-select label="Tipo de pago" :items="['Efectivo', 'Tarjeta', 'Yape', 'Plin']" variant="underlined"
              density="comfortable" class="mb-3" />

            <v-text-field label="Efectivo" prefix="S/" variant="underlined" density="comfortable" type="number"
              value="25.00" />

            <div class="d-flex justify-space-between mt-2 text-subtitle-2">
              <span>Vuelto</span>
              <span class="font-weight-medium">S/ 1.50</span>
            </div>
          </div>

          <!-- Botón Finalizar -->
          <v-btn block color="primary" size="large" class="mt-5" prepend-icon="mdi-check-circle-outline">
            Finalizar Venta
          </v-btn>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<style scoped></style>
