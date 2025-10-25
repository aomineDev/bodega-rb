<script setup>

import ActionMenu from '@/components/ActionMenu.vue';
// import { VDateInput } from 'vuetify/labs/VDateInput'
import { ref } from 'vue';
import { useValidation } from '@/composables/formValidation';

const productFormModal = ref(false)
const productForm = ref(null)
const search = ref('')

const categorias = ['Carnes', 'Lácteos', 'Bebidas']

const headers = [
  { title: "# Ingreso", key: "id" },
  { title: "Proveedor", key: "proveedor" },
  { title: "Documento", key: "documento" },
  { title: "N° Documento", key: "nDocumento" },
  { title: "Fecha", key: "fecha" },
  { title: "Hora", key: "hora" },
  { title: "Total", key: "total" },
  { title: "Estado", key: "estado" },
  { title: "Acciones", key: "actions", sortable: false },
];

const headersProductos = [
  { title: "Producto", key: "producto" },
  { title: "Lote", key: "lote" },
  { title: "Fecha Prod.", key: "fechaProduccion" },
  { title: "Vencimiento", key: "vencimiento" },
  { title: "Cantidad", key: "cantidad" },
  { title: "Precio Compra", key: "precioCompra" },
  { title: "Subtotal", key: "subtotal" },
  { title: "Acciones", key: "actions", sortable: false },
];

const itemsProductos = [
  {
    producto: 'Filete de pescado',
    lote: 'L001',
    fechaProduccion: '2025-10-15',
    vencimiento: '2025-12-30',
    cantidad: 25,
    precioCompra: 12.5,
    subtotal: (25 * 12.5).toFixed(2),
  },
  {
    producto: 'Aceite vegetal',
    lote: 'A052',
    fechaProduccion: '2025-09-01',
    vencimiento: '2026-03-01',
    cantidad: 10,
    precioCompra: 8.9,
    subtotal: (10 * 8.9).toFixed(2),
  },
  {
    producto: 'Harina de trigo',
    lote: 'H123',
    fechaProduccion: '2025-10-05',
    vencimiento: '2026-01-10',
    cantidad: 15,
    precioCompra: 6.75,
    subtotal: (15 * 6.75).toFixed(2),
  },
  {
    producto: 'Sal marina',
    lote: 'S088',
    fechaProduccion: '2025-08-20',
    vencimiento: '2026-02-20',
    cantidad: 20,
    precioCompra: 3.5,
    subtotal: (20 * 3.5).toFixed(2),
  },{
    producto: 'Sal marina',
    lote: 'S088',
    fechaProduccion: '2025-08-20',
    vencimiento: '2026-02-20',
    cantidad: 20,
    precioCompra: 3.5,
    subtotal: (20 * 3.5).toFixed(2),
  },
]

const items = [
  {
    id: 1,
    proveedor: "Distribuidora Norte",
    documento: "Factura",
    nDocumento: "F001-12345",
    fecha: "2025-10-23",
    hora: "10:30",
    total: "S/ 450.00",
    estado: "Pendiente",
  },
  {
    id: 2,
    proveedor: "Alimentos del Sur",
    documento: "Boleta",
    nDocumento: "B002-9876",
    fecha: "2025-10-22",
    hora: "09:45",
    total: "S/ 780.00",
    estado: "Aprobado",
  },
]

const handleAction = (type, item) => {
  if (type === 'view') {
    console.log('Ver detalles de', item.name)
  } else if (type === 'edit') {
    console.log('Editar', item.name)
  } else if (type === 'delete') {
    console.log('Eliminar', item.name)
  }
}

const form = ref({
  producto: '',
  categoria: '',
  cantidad: '',
  precioCompra: '',
  fechaProduccion: '',
  fechaVencimiento: '',
  lote: '',
})

const { rules } = useValidation()

const save = async () => {
  const { valid } = await productForm.value.validate()
  if (!valid) return

  console.log('Formulario validar', form.value)
  productFormModal.value = false
}
</script>

<template>
  <h1>Ingreso de Productos</h1>
  <v-card elevation="0" class="mb-4 pt-5">
    <v-row class="d-flex justify-space-between">
      <v-col cols="12" md="4">
        <v-text-field
          v-model="search"
          label="Buscar ingreso"
          prepend-inner-icon="mdi-magnify"
          variant="underlined"
          hide-details
        />
      </v-col>

      <v-col cols="12" md="3" class="d-flex justify-end">
        <v-btn
          prepend-icon="mdi-plus"
          color="primary"
          elevation="1"
          @click="productFormModal = true"
        >
          NUEVO INGRESO
        </v-btn>
      </v-col>
    </v-row>
  </v-card>


  <v-data-table :headers="headers" :items="items">
    <template #[`item.actions`]="{ item }">
      <action-menu @action="(type) => handleAction(type, item)" />
    </template>
  </v-data-table>

  <!-- Modal -->
  <template>
    <v-dialog v-model="productFormModal" max-width="95%">
      <template #activator="{ props }">
        <v-btn v-bind="props" prepend-icon="mdi-account" variant="tonal">
          Crear Cliente
        </v-btn>
      </template>

      <v-card elevation="2" class="pa-0">
        <v-card-title class="text-h6 font-weight-bold">
          Nuevo Ingreso
        </v-card-title>

        <v-card-text>
          <v-row align="start" justify="space-between">
            <v-col cols="12" md="3">
              <v-form ref="productForm">
                <v-row dense>
                  <v-col cols="12">
                    <v-text-field
                      v-model="form.proveedor"
                      label="Proveedor"
                      variant="underlined"
                    />
                  </v-col>

                  <v-col cols="12">
                    <v-textarea
                      v-model="form.observaciones"
                      label="Observaciones"
                      variant="underlined"
                      rows="2"
                    />
                  </v-col>
                  <v-divider horizontal class="my-1"></v-divider>
                  <v-col cols="12" md="6">
                    <v-text-field
                      v-model="form.producto"
                      label="Producto"
                      variant="underlined"
                      :rules="[rules.required]"
                    />
                  </v-col>
                  <v-col cols="12" md="6">
                    <v-select
                      v-model="form.categoria"
                      :items="categorias"
                      label="Categoría"
                      variant="underlined"
                      :rules="[rules.categoria]"
                    />
                  </v-col>

                  <v-col cols="12" md="6">
                    <v-text-field
                      v-model="form.cantidad"
                      label="Cantidad"
                      type="number"
                      variant="underlined"
                      :rules="[rules.cantidad]"
                    />
                  </v-col>
                  <v-col cols="12" md="6">
                    <v-text-field
                      v-model="form.precioCompra"
                      label="Precio Compra"
                      type="number"
                      prefix="S/"
                      variant="underlined"
                      :rules="[rules.required, rules.precio]"
                    />
                  </v-col>

                  <v-col cols="12" md="6">
                    <v-text-field
                      v-model="form.fechaProduccion"
                      label="Fecha Producción"
                      type="date"
                      variant="underlined"
                      :rules="[rules.fecha]"
                    />
                  </v-col>
                  <v-col cols="12" md="6">
                    <v-text-field
                      v-model="form.fechaVencimiento"
                      label="Fecha Vencimiento"
                      type="date"
                      variant="underlined"
                      :rules="[rules.fecha]"
                    />
                  </v-col>

                  <v-col cols="12" md="6">
                    <v-text-field
                      v-model="form.lote"
                      label="Lote"
                      variant="underlined"
                      :rules="[rules.lote]"
                    />
                  </v-col>

                  <v-col cols="12" class="d-flex justify-end mb-3">
                    <v-btn color="blue" variant="outlined">
                      Cancelar
                    </v-btn>
                    <v-btn color="primary" variant="flat" @click="save">
                      Agregar Producto
                    </v-btn>
                  </v-col>
                </v-row>
              </v-form>
            </v-col>

            <v-col cols="12" md="9">
              <v-sheet
                max-height="450"
                class="overflow-y-auto"
              >
              <v-data-table
                :headers="headersProductos"
                :items="itemsProductos"
                class="elevation-1"
                density="compact"
              >
                <template #[`item.actions`]="{ item }">
                  <action-menu @action="(type) => handleAction(type, item)" />
                </template>
              </v-data-table>
            </v-sheet>

              <v-row justify="end" class="mt-4">
                <v-col cols="auto">
                  <v-btn color="primary" variant="flat">
                    Finalizar Registro
                  </v-btn>
                </v-col>
              </v-row>
            </v-col>
            </v-row>
          </v-card-text>
        </v-card>



    </v-dialog>
  </template>

</template>

<style scoped></style>
