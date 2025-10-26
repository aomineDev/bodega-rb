<script setup>
import { computed, reactive, ref } from 'vue'
import ActionMenu from '@/components/ActionMenu.vue'
import { useValidation } from '@/composables/useFormValidation'
import { useSnackbar } from '@/stores/snackbar'
import FabMenu from '@/components/FabMenu.vue'
import { useDisplay } from 'vuetify'
import BaseFilter from '@/components/BaseFilter.vue'
import { VDateInput } from 'vuetify/labs/VDateInput'

const { smAndDown, mdAndUp } = useDisplay()

// Snackbar  falta warning
const { showSuccessSnackbar, showErrorSnackbar } = useSnackbar()

// Modales y formularioss
const productFormModal = ref(false)
const productForm = ref(null)
const productDeleteModal = ref(false)
const filterDialog = ref(false)

const search = ref('')


// const filtros = reactive({
//   fecha: null, // una sola fecha
// })


// const selectFilter = computed(() => [
//   {
//     key: 'fecha',
//     label: 'Fecha',
//     type: 'range',
//     model: filtros.fecha,
//   },
// ])
const filtros = reactive({
  rangoFechas: [],
})

const selectFilter = computed(() => [
  {
    key: 'rangoFechas',
    label: 'Rango de fechas',
    type: 'range',
    model: filtros.rangoFechas,
  },

])

// Acción de aplicar filtros
// const aplicarFiltros = () => {
//   console.log('Buscar:', search.value)
//   console.log('Fecha:', filtros.value.fecha)
//   filterDialog.value = false
// }


const categorias = ['Carnes', 'Lácteos', 'Bebidas', 'Embutidos', 'Conservas']

// Cabeceras de tablas
const headers = [
  { title: '# Ingreso', key: 'id' },
  { title: 'Proveedor', key: 'proveedor' },
  { title: 'Documento', key: 'documento' },
  { title: 'N° Documento', key: 'nDocumento' },
  { title: 'Fecha', key: 'fecha' },
  { title: 'Hora', key: 'hora' },
  { title: 'Total', key: 'total' },
  { title: 'Estado', key: 'estado' },
  { title: 'Acciones', key: 'actions', sortable: false },
]

const headersProductos = [
  { title: 'Producto', key: 'producto' },
  { title: 'Lote', key: 'lote' },
  { title: 'Fecha Prod.', key: 'fechaProduccion' },
  { title: 'Vencimiento', key: 'vencimiento' },
  { title: 'Cantidad', key: 'cantidad' },
  { title: 'Precio Compra', key: 'precioCompra' },
  { title: 'Subtotal', key: 'subtotal' },
  { title: 'Acciones', key: 'actions', sortable: false },
]


const items = [
  {
    id: 1,
    proveedor: 'Distribuidora Norte',
    documento: 'Factura',
    nDocumento: 'F001-12345',
    fecha: '2025-10-23',
    hora: '10:30',
    total: 'S/ 450.00',
    estado: 'Pendiente',
  },
  {
    id: 2,
    proveedor: 'Alimentos del Sur',
    documento: 'Boleta',
    nDocumento: 'B002-9876',
    fecha: '2025-10-22',
    hora: '09:45',
    total: 'S/ 780.00',
    estado: 'Aprobado',
  },
]

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
  },
]

// Reglas de validación y formulario
const { rules, resetForm } = useValidation()

const form = ref({
  proveedor: '',
  observaciones: '',
  producto: '',
  categoria: '',
  cantidad: '',
  precioCompra: '',
  fechaProduccion: '',
  fechaVencimiento: '',
  lote: '',
  unidadmedida: '',
})

//crud

const handleView = (item) => {
  console.log('Ver detalles de', item)
  showSuccessSnackbar(`Viendo detalles del ingreso #${item.id || item.producto}`)
}

const handleEdit = (item) => {
  console.log('Editar', item)
  productFormModal.value = true
  showSuccessSnackbar('Editando ingreso o producto seleccionado')
}

const handleDelete = (item) => {
  console.log('Eliminar', item)
  productDeleteModal.value = true
}

// Guardar producto dentro del modal
const save = async () => {
  const { valid } = await productForm.value.validate()
  if (!valid) return

  showSuccessSnackbar('Se agregó un nuevo producto')
  console.log('Formulario', form.value)
  resetForm(productForm, form)
}

// Cerrar formulario sin guardar
const close = () => {
  resetForm(productForm, form)
  productFormModal.value = false
}

// Finalizar registro de productos
const finishEntryProduct = () => {
  showSuccessSnackbar('Se registraron correctamente los productos')
  productFormModal.value = false
}

// Confirmar eliminación
const deleteIngreso = () => {
  showErrorSnackbar('Se eliminó correctamente el ingreso')
  productDeleteModal.value = false
}



// FUNCIONES PARA TABLA DE PRODUCTOS
const handleViewProduct = (item) => {
  console.log('Ver producto', item.producto)
  showSuccessSnackbar(`Viendo producto: ${item.producto}`)
}

const handleEditProduct = (item) => {
  console.log('Editar producto', item.producto)
  productFormModal.value = true
  form.value = { ...item }
  showSuccessSnackbar(`Editando producto: ${item.producto}`)
}

const handleDeleteProduct = (item) => {
  console.log('Eliminar producto', item.producto)
  productDeleteModal.value = true
}

</script>


<template>
  <h1>Ingreso de Productos</h1>

  <v-card v-if="mdAndUp" elevation="0" class="mb-4 pa-4">
    <v-row class="align-center">
      <v-col cols="12" md="9">
        <base-filter v-model:search="search" :filters="selectFilter"
            @update:filter="({ key, value }) => filtros[key] = value" />
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
    <action-menu
      @view="() => handleView(item)"
      @edit="() => handleEdit(item)"
      @delete="() => handleDelete(item)"
    />
  </template>
</v-data-table>

  <!-- Modal nuevo ingreso productos -->
    <v-dialog v-model="productFormModal" max-width="95%">

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
                      :rules="[rules.categoria, rules.required]"
                    />
                  </v-col>

                  <v-col cols="12" md="6">
                    <v-text-field
                      v-model="form.cantidad"
                      label="Cantidad"
                      type="number"
                      variant="underlined"
                      :rules="[rules.cantidad, rules.required]"
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
                      :rules="[rules.fecha, rules.required]"
                    />
                  </v-col>
                  <v-col cols="12" md="6">
                    <v-text-field
                      v-model="form.fechaVencimiento"
                      label="Fecha Vencimiento"
                      type="date"
                      variant="underlined"
                      :rules="[rules.fecha, rules.required]"
                    />
                  </v-col>

                  <v-col cols="12" md="6">
                    <v-text-field
                      v-model="form.lote"
                      label="Lote"
                      variant="underlined"
                      :rules="[rules.lote, rules.required]"
                    />
                  </v-col>
                  <v-col cols="12" md="6">
                    <v-select
                      v-model="form.unidadmedida"
                      :items="['kg', 'litro', 'unidad']"
                      label="Unidad Medida"
                      variant="underlined"
                      :rules="[rules.unidadMedida, rules.required]"
                    />
                  </v-col>

                  <v-col cols="12" class="d-flex justify-end mb-3 pa-3">
                    <v-btn color="blue" variant="outlined" @click="close()">
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
                    <action-menu
                      @view="() => handleViewProduct(item)"
                      @edit="() => handleEditProduct(item)"
                      @delete="() => handleDeleteProduct(item)"
                    />
                  </template>
                </v-data-table>
              </v-sheet>

              <v-row justify="end" class="mt-4">
                <v-col cols="auto">
                  <v-btn
                    color="primary"
                    variant="flat"
                    @click="finishEntryProduct"
                  >
                    Finalizar Registro
                  </v-btn>
                </v-col>
              </v-row>
            </v-col>


            </v-row>
          </v-card-text>
        </v-card>
    </v-dialog>

  <!-- Modal eliminar ingreso-->
    <v-dialog v-model="productDeleteModal" max-width="500">
        <v-card>
            <v-card-title class="text-h5 font-weight-bold  text-black mb-8">
                Eliminar ingreso
            </v-card-title>

            <div class="text-center mb-4">
                <v-icon size="100" color="error">mdi-alert-octagon-outline</v-icon>
            </div>

            <v-card-text class="text-center text-body-2">
                ¿Está seguro que desea eliminar el ingreso? <br />
                <strong>Esta acción no se puede deshacer.</strong>
            </v-card-text>

            <v-card-actions class="justify-end">
                <v-btn text="Cerrar" @click="productDeleteModal = false"></v-btn>
                <v-btn text="Eliminar" color="error" @click="deleteIngreso"></v-btn>
            </v-card-actions>
        </v-card>
    </v-dialog>

    <!-- modal filtro -->
    <fab-menu
      v-if="smAndDown"
      v-model:filterDialog="filterDialog"
      v-model:FormModal="productFormModal"
    />

    <!-- moviil Filtros -->
    <v-dialog v-model="filterDialog" width="400">
      <v-card>
        <v-card-title class="text-h6 font-weight-bold">
          Filtros
        </v-card-title>

        <v-card-text>
          <v-text-field
            v-model="search"
            label="Buscar ingreso xddddddd"
            prepend-inner-icon="mdi-magnify"
            variant="underlined"
            hide-details
            class="mb-3"
          />

          <v-date-input
            v-model="filtros.fecha"
            label="Fecha"
            variant="underlined"
            hide-details
            multiple="range"
          />

        </v-card-text>

        <v-card-actions class="justify-end">
          <v-btn text="Cerrar" @click="filterDialog = false" />
          <v-btn color="primary" text="Aplicar" @click="filterDialog = false" />
        </v-card-actions>
      </v-card>
    </v-dialog>


</template>

<style scoped></style>
