<script setup>
import { computed, nextTick, reactive, ref, watch } from 'vue'
import ActionMenu from '@/components/ActionMenu.vue'
import { useSnackbar } from '@/stores/snackbar'
import FabMenu from '@/components/FabMenu.vue'
import { useDisplay } from 'vuetify'
import BaseFilter from '@/components/BaseFilter.vue'
import { VDateInput } from 'vuetify/labs/VDateInput'
import { useForm } from '@/composables/useForm'
import { useProductEntry } from '@/composables/query/useProductEntry'
// import { useCategory } from '@/composables/query/useCategory'
import { useSupplier } from '@/composables/query/useSupplier'
import { useProduct } from '@/composables/query/useProduct'


const { smAndDown, mdAndUp } = useDisplay()
const { showSuccessSnackbar, showErrorSnackbar, showWarningSnackbar } = useSnackbar()


defineOptions({
  components: {
    VDateInput,
  },
})

// Modales
const productFormModal = ref(false)
const productDeleteModal = ref(false)
const filterDialog = ref(false)

// Item seleccionado para editar/eliminar
const selectedEntry = ref(null)
const selectedProductToDelete = ref(null)

// Props y emisores
const detallesModal = ref(false)
const selectedIngreso = ref(null)
const observacionesJefe = ref('')

// Busqueda y filtros
const search = ref('')
const filtros = reactive({
  // fechaInicio: null,
  // fechaFin: null,

  rangoFechas: [],
  estado: null
})

const selectFilter = computed(() => [
  {
    key: 'rangoFechas',
    label: 'Rango de fechas',
    type: 'range',
    model: filtros.rangoFechas
  },
  // {
  //   key: 'fechaInicio',
  //   label: 'Fecha inicio',
  //   type: 'date',
  //   model: filtros.fechaInicio,
  // },
  // {
  //   key: 'fechaFin',
  //   label: 'Fecha fin',
  //   type: 'date',
  //   model: filtros.fechaFin,
  // },
  {
    key: 'estado',
    label: 'Estado',
    type: 'select',
    items: ['Pendiente', 'Aprobado', 'Rechazado'],
    model: filtros.estado,
  },
])

// Servicios
const { productEntries, createProductEntryAsync, updateProductEntryAsync, deleteProductEntryAsync } = useProductEntry()
// const { category } = useCategory()
const { supplier } = useSupplier()
const { product } = useProduct()

// Datos para selects
// const categorias = computed(() => category.value || [])
const proveedores = computed(() => supplier.value || [])
const productos = computed(() => product.value || [])

// Headers de tablas
const headers = [
  { title: '#id', key: 'id' },
  { title: 'Proveedor', key: 'proveedor' },
  { title: 'Asistente', key: 'asistente' },
  // { title: 'Observación', key: 'observacion' },
  { title: 'Fecha', key: 'fecha' },
  { title: 'Hora', key: 'hora' },
  { title: 'Total', key: 'total' },
  { title: 'Estado', key: 'estado' },
  { title: 'Acciones', key: 'actions', sortable: false },
]

const headersProductos = [
  { title: 'Producto', key: 'producto' },
  { title: 'Cantidad', key: 'cantidad' },
  { title: 'Precio Compra', key: 'precioCompra' },
  { title: 'Subtotal', key: 'subtotal' },
  { title: 'Lote', key: 'lote' },
  { title: 'F. prod.', key: 'fechaProduccion' },
  { title: 'F. venc.', key: 'fechaVencimiento' },
  { title: 'Acciones', key: 'actions', sortable: false },
]

// Headers de la tabla de productos en el modal
const headersDetalles = [
  { title: 'Producto', key: 'producto' },
  { title: 'Cantidad', key: 'cantidad' },
  { title: 'Precio Compra', key: 'precioCompra' },
  { title: 'Subtotal', key: 'subtotal' },
  { title: 'Lote', key: 'lote' },
  { title: 'F. Producción', key: 'fechaProduccion' },
  { title: 'F. Vencimiento', key: 'fechaVencimiento' },
]


// Formulario
const {
  formRef: productForm,
  resetForm,
  rules,
} = useForm({
  proveedorId: '',
  observaciones: '',
  productoId: '',
  cantidad: '',
  precioCompra: '',
  fechaProduccion: '',
  fechaVencimiento: '',
  lote: '',
})

// Variables del formulario
const proveedorId = ref('')
const observaciones = ref('')
const productoId = ref('')
const cantidad = ref('')
const precioCompra = ref('')
const fechaProduccion = ref('')
const fechaVencimiento = ref('')
const lote = ref('')

// Lista temporal de productos en el formulario
const itemsProductos = ref([])

// titulos dinamicos para modal
const modalTitle = computed(() => (selectedEntry.value ? 'Editar Ingreso' : 'Crear Ingreso'))
const actionLabel = computed(() => (selectedEntry.value ? 'Actualizar' : 'Crear'))

// Calcular total de un ingreso
function calcularTotal(detalles = []) {
  return detalles.reduce((acc, d) => acc + (d.cantidad ?? 0) * (d.precioCompra ?? 0), 0)
}

const aplicarFiltros = () => {
  console.log('Aplicando filtros:', { ...filtros, search: search.value })
  showSuccessSnackbar('Filtros aplicados correctamente')
  filterDialog.value = false
}

const limpiarFiltros = () => {
  // filtros.fechaInicio = null
  // filtros.fechaFin = null
  filtros.rangoFechas = ''
  filtros.estado = null
  search.value = ''
  showWarningSnackbar('Filtros restablecidos')
}

// Formatear items de la tabla principal
const items = computed(() => {
  let entries = productEntries?.value ?? []

  // Filtrar por estado si esta seleccionado
  if (filtros.estado) {
    entries = entries.filter(entry => entry.estado === filtros.estado)
  }
  // Filtrar rango fechas
  if (Array.isArray(filtros.rangoFechas) && filtros.rangoFechas.length > 1) {
    const fechaInicio = filtros.rangoFechas[0]
    const fechaFin = filtros.rangoFechas[filtros.rangoFechas.length - 1]
    console.log('filtros rango fechas', fechaInicio, fechaFin)
    entries = entries.filter(entry => {
      const fecha = new Date(entry.fechaIngreso)
      return fecha >= fechaInicio && fecha <= fechaFin
    })
  }

  // Filtrar por busqueda
  if (search.value) {
    const searchLower = search.value.toLowerCase()
    entries = entries.filter(entry => {
      const proveedor = entry.proveedor?.razonSocial?.toLowerCase() || ''
      const asistente = `${entry.asistenteAlmacen?.nombre || ''} ${entry.asistenteAlmacen?.apellidoPaterno || ''}`.toLowerCase()
      const id = entry.id?.toString() || ''
      return proveedor.includes(searchLower) || asistente.includes(searchLower) || id.includes(searchLower)
    })
  }

  return entries.map(entry => ({
    id: entry.id ?? '-',
    proveedor: entry.proveedor?.razonSocial ?? '-',
    asistente: entry.asistenteAlmacen
      ? `${entry.asistenteAlmacen.nombre ?? ''} ${entry.asistenteAlmacen.apellidoPaterno ?? ''}`
      : '-',
    // observacion: entry.observaciones ?? '-',
    fecha: entry.fechaIngreso ?? '-',
    hora: entry.horaIngreso ?? '-',
    total: `S/ ${calcularTotal(entry.detalleIngresos ?? []).toFixed(2)}`,
    estado: entry.estado ?? '-',
    rawData: entry
  }))
})



// CRUD - Ver detalles
// const handleView = (item) => {
//   console.log('Ver detalles de', item)
//   showSuccessSnackbar(`Viendo detalles del ingreso #${item.id}`)
// }

// crud - editar
const handleEdit = (item) => {
  selectedEntry.value = item.rawData

  proveedorId.value = item.rawData.proveedor?.id || ''
  // observaciones.value = item.rawData.observaciones || ''

  if (!item.rawData.detalleIngresos || item.rawData.detalleIngresos.length === 0) {
    itemsProductos.value = []
  } else {
    itemsProductos.value = item.rawData.detalleIngresos.map((d) => ({
      id: d.id,
      productoId: d.producto?.id,
      producto: d.producto?.nombre ?? '—',
      cantidad: d.cantidad ?? 0,
      precioCompra: d.precioCompra ?? 0,
      subtotal: (d.cantidad ?? 0) * (d.precioCompra ?? 0),
      lote: d.lote ?? '',
      fechaProduccion: d.fechaProduccion ?? '',
      fechaVencimiento: d.fechaVencimiento ?? '',
    }))
  }

  productFormModal.value = true
}

// crud - elimnar
const handleDelete = (item) => {
  selectedEntry.value = item.rawData
  productDeleteModal.value = true
}

// Confirmar eliminacion de ingreso
const confirmDelete = async () => {
  try {
    await deleteProductEntryAsync(selectedEntry.value.id)
    showSuccessSnackbar('Ingreso eliminado correctamente')
    productDeleteModal.value = false
    selectedEntry.value = null
  } catch (error) {
    console.log('Error al eliminar ingreso:', error)
    showErrorSnackbar('Error al eliminar el ingreso')
  }
}

// Agregar producto a la lista temporal
const agregarProducto = async () => {
  if (!productoId.value || !cantidad.value || !precioCompra.value || !lote.value || !fechaProduccion.value || !fechaVencimiento.value) {
    showWarningSnackbar('Completa todos los campos del producto')
    return
  }

  const productoSeleccionado = productos.value.find(p => p.id === productoId.value)

  if (!productoSeleccionado) {
    showWarningSnackbar('Producto no encontrado')
    return
  }

  const nuevoProducto = {
    productoId: productoId.value,
    producto: productoSeleccionado.nombre,
    cantidad: parseFloat(cantidad.value),
    precioCompra: parseFloat(precioCompra.value),
    subtotal: parseFloat(cantidad.value) * parseFloat(precioCompra.value),
    lote: lote.value,
    fechaProduccion: fechaProduccion.value,
    fechaVencimiento: fechaVencimiento.value,
  }

  itemsProductos.value.push(nuevoProducto)

  resetProductFields()

  showSuccessSnackbar('Producto agregado a la lista')
}

const resetProductFields = () => {
  productoId.value = ''
  cantidad.value = ''
  precioCompra.value = ''
  lote.value = ''
  fechaProduccion.value = ''
  fechaVencimiento.value = ''

  nextTick(() => {
    if (productForm.value) {
      productForm.value.resetValidation()
    }
  })
}

// Eliminar producto de la lista temporal
const handleDeleteProduct = (item) => {
  selectedProductToDelete.value = item
  const index = itemsProductos.value.findIndex(p =>
    p.productoId === item.productoId &&
    p.lote === item.lote
  )

  if (index !== -1) {
    itemsProductos.value.splice(index, 1)
    showSuccessSnackbar('Producto eliminado de la lista')
  }
}

// Editar producto de la lista temporal
const handleEditProduct = (item) => {
  productoId.value = item.productoId
  cantidad.value = item.cantidad
  precioCompra.value = item.precioCompra
  lote.value = item.lote
  fechaProduccion.value = item.fechaProduccion
  fechaVencimiento.value = item.fechaVencimiento

  // Eliminar de la lista para que pueda ser re-agregado
  handleDeleteProduct(item)
}
// Finalizar y guardar el ingreso
const finishEntryProduct = async () => {
  if (!proveedorId.value) {
    showWarningSnackbar('Selecciona un proveedor')
    return
  }

  if (itemsProductos.value.length === 0) {
    showWarningSnackbar('Agrega al menos un producto')
    return
  }

  const now = new Date()

  const ingresoData = {
    proveedor: { id: proveedorId.value },
    fechaIngreso: now.toISOString().split('T')[0],
    horaIngreso: now.toTimeString().split(' ')[0],
    estado: 'Pendiente',
    asistenteAlmacen: { id: 1 },
    jefeAlmacen: { id: 1 },
    detalleIngresos: itemsProductos.value.map(item => ({
      producto: { id: item.productoId },
      cantidad: item.cantidad,
      precioCompra: item.precioCompra,
      lote: item.lote,
      fechaProduccion: item.fechaProduccion,
      fechaVencimiento: item.fechaVencimiento
    }))
  }

  try {
    if (selectedEntry.value) {
      await updateProductEntryAsync({ ...ingresoData, id: selectedEntry.value.id })
      showSuccessSnackbar('Ingreso actualizado correctamente')
    } else {
      await createProductEntryAsync(ingresoData)
      showSuccessSnackbar('Ingreso registrado correctamente')
    }

    closeFormModal()
  } catch (error) {
    console.error('Error al guardar ingreso:', error)
    showErrorSnackbar('Error al guardar el ingreso')
  }
}


// Cerrar modal y limpiar
const closeFormModal = () => {
  productFormModal.value = false
  resetForm()
  proveedorId.value = ''
  observaciones.value = ''
  productoId.value = ''
  cantidad.value = ''
  precioCompra.value = ''
  fechaProduccion.value = ''
  fechaVencimiento.value = ''
  lote.value = ''
  itemsProductos.value = []
  selectedEntry.value = null
}

// Acciones del FAB
const handleActionFabMenu = (type) => {
  if (type === 'add') {
    selectedEntry.value = null
    productFormModal.value = true
  }
  if (type === 'filter') {
    filterDialog.value = true
  }
}


// Computed para formatear los productos del ingreso seleccionado
const productosDetalle = computed(() => {
  console.log('selectedIngreso.value:', selectedIngreso.value)

  if (!selectedIngreso.value?.detalleIngresos) {
    console.log('No hay detalleIngresos')
    return []
  }

  console.log('detalleIngresos:', selectedIngreso.value.detalleIngresos)

  return selectedIngreso.value.detalleIngresos.map(detalle => ({
    producto: detalle.producto?.nombre ?? '-',
    cantidad: detalle.cantidad ?? 0,
    precioCompra: `S/ ${(detalle.precioCompra ?? 0).toFixed(2)}`,
    subtotal: `S/ ${((detalle.cantidad ?? 0) * (detalle.precioCompra ?? 0)).toFixed(2)}`,
    lote: detalle.lote ?? '-',
    fechaProduccion: detalle.fechaProduccion ?? '-',
    fechaVencimiento: detalle.fechaVencimiento ?? '-',
  }))
})

// Computed para calcular el total del ingreso
const totalIngreso = computed(() => {
  if (!selectedIngreso.value?.detalleIngresos) return '0.00'

  const total = selectedIngreso.value.detalleIngresos.reduce(
    (acc, d) => acc + ((d.cantidad ?? 0) * (d.precioCompra ?? 0)),
    0
  )

  return total.toFixed(2)
})

// Función para abrir el modal (llamar desde el componente padre)
const abrirDetalles = (ingreso) => {
  console.log('Abriendo detalles con ingreso:', ingreso)
  selectedIngreso.value = ingreso.rawData || ingreso
  observacionesJefe.value = ingreso.observacionesJefe || ''
  detallesModal.value = true
}

// Funcion para cerrar el modal
const cerrarModal = () => {
  detallesModal.value = false
  selectedIngreso.value = null
  observacionesJefe.value = ''
}

// Actualizar estado de ingreso Aprobar/Rechazar
const actualizarIngreso = async (nuevoEstado) => {
  if (!selectedIngreso.value) return

  if (nuevoEstado === 'Rechazado' && !observacionesJefe.value.trim()) {
    showErrorSnackbar('Debes agregar observaciones para rechazar el ingreso')
    return
  }

  const now = new Date()

  try {
    await updateProductEntryAsync({
      id: selectedIngreso.value.id,
      proveedor: { id: selectedIngreso.value.proveedor?.id },
      observaciones: observacionesJefe.value,
      fechaIngreso: selectedIngreso.value.fechaIngreso,
      horaIngreso: selectedIngreso.value.horaIngreso,
      estado: nuevoEstado,
      fechaAprobacion: now.toISOString().split('T')[0],
      asistenteAlmacen: { id: selectedIngreso.value.asistenteAlmacen?.id },
      jefeAlmacen: { id: selectedIngreso.value.jefeAlmacen?.id },
      detalleIngresos: selectedIngreso.value.detalleIngresos.map(item => ({
        id: item.id,
        producto: { id: item.producto?.id },
        cantidad: item.cantidad,
        precioCompra: item.precioCompra,
        lote: item.lote,
        fechaProduccion: item.fechaProduccion,
        fechaVencimiento: item.fechaVencimiento
      }))
    })

    const mensaje =
      nuevoEstado === 'Aprobado'
        ? 'Ingreso aprobado correctamente'
        : 'Ingreso rechazado'

    showSuccessSnackbar(mensaje)
    cerrarModal()
  } catch (error) {
    console.error(`Error al ${nuevoEstado.toLowerCase()} ingreso:`, error)
    showErrorSnackbar(`Error al ${nuevoEstado.toLowerCase()} el ingreso`)
  }
}

const aprobarIngreso = () => actualizarIngreso('Aprobado')
const rechazarIngreso = () => actualizarIngreso('Rechazado')

/////////
// watch(selectedIngreso, async (nuevo) => {
//   if (nuevo) {
//     await nextTick()
//   }
// })
/////////


// Watch para limpiar al cerrar modal
watch(productFormModal, (isOpen) => {
  if (!isOpen) {
    closeFormModal()
  }
})

watch([fechaProduccion, fechaVencimiento], ([prod, venc], [oldProd, oldVenc]) => {
  if (prod && venc) {
    const prodDate = new Date(prod)
    const vencDate = new Date(venc)

    if (vencDate < prodDate) {
      if (oldProd === prod && oldVenc !== venc) {
        fechaVencimiento.value = null
        showWarningSnackbar('La fecha de vencimiento debe ser mayor o igual a la de produccion')
      }

      else if (oldProd !== prod && oldVenc === venc) {
        fechaProduccion.value = null
        showWarningSnackbar('La fecha de produccion no puede ser mayor que la de vencimiento')
      }
    }
  }
})


watch(selectedIngreso, (nuevo) => {
  if (nuevo) {
    switch (nuevo.estado) {
      case "Rechazado":
        return observacionesJefe.value = nuevo.observacion || nuevo.observaciones || ''
      case "Pendiente":
        return observacionesJefe.value = ''
      case "Aprobado":
        return observacionesJefe.value = nuevo.observacion || nuevo.observaciones || ''
    }
  }
})

// asignacion destaco en estado
const estadoColor = (estado) => {
  switch (estado?.toLowerCase()) {
    case 'pendiente':
      return 'warning'
    case 'aprobado':
      return 'success'
    case 'rechazado':
      return 'error'
    default:
      return 'secondary'
  }
}
</script>


<template>
  <h1>Ingreso de Productos</h1>

  <!-- Filtros desktop -->
  <v-card v-if="mdAndUp" elevation="0" class="mb-10 pa-4">
    <v-row class="align-center">
      <base-filter v-model:search="search" :filters="selectFilter"
        @update:filter="({ key, value }) => filtros[key] = value" />

      <v-col cols="12" md="3" class="d-flex justify-md-end align-center">
        <v-btn block prepend-icon="mdi-plus" color="primary" @click="handleActionFabMenu('add')">
          Nuevo Ingreso
        </v-btn>
      </v-col>
    </v-row>
  </v-card>

  <!-- Tabla principal -->
  <v-data-table :headers="headers" :items="items" :items-per-page="7" hover>
    <!-- Slot para columna Estado aprobado, rechazao, pendiente -->
    <template #[`item.estado`]="{ item }">
      <v-chip :color="estadoColor(item.estado)" variant="outlined" rounded>
        {{ item.estado }}
      </v-chip>
    </template>

    <template #[`item.actions`]="{ item }">
      <action-menu @view="() => abrirDetalles(item)" @edit="() => handleEdit(item)"
        @delete="() => handleDelete(item)" />
    </template>
  </v-data-table>

  <!-- Modal crear/editar ingreso -->
  <v-dialog v-model="productFormModal" max-width="95%" persistent>
    <v-card :title="modalTitle" elevation="2">
      <v-card-text>
        <v-row>
          <!-- Formulario de ingreso (izquierda) -->
          <v-col cols="12" md="3">
            <v-form ref="productForm">
              <v-row dense>
                <v-col cols="12">
                  <v-select v-model="proveedorId" :items="proveedores" item-title="razonSocial" item-value="id"
                    label="Proveedor" variant="underlined" :rules="[rules.required]" />
                </v-col>

                <!-- <v-col cols="12">
                  <v-textarea
                    v-model="observaciones"
                    label="Observaciones"
                    variant="underlined"
                    rows="2"
                  />
                </v-col> -->

                <v-divider class="my-3" />

                <!-- Form Agregar productos -->
                <v-col cols="12" class="text-subtitle-2 font-weight-bold">
                  Agregar Producto
                </v-col>

                <v-col cols="12">
                  <v-select v-model="productoId" :items="productos" item-title="nombre" item-value="id" label="Producto"
                    variant="underlined" :rules="[rules.required]" />
                </v-col>

                <v-col cols="12" md="4">
                  <v-text-field v-model="cantidad" label="Cantidad" type="number" variant="underlined"
                    :rules="[rules.required, rules.cantidad]" />
                </v-col>

                <v-col cols="12" md="4">
                  <v-text-field v-model="precioCompra" label="Precio Compra" type="number" prefix="S/"
                    variant="underlined" :rules="[rules.required, rules.precio]" />
                </v-col>

                <v-col cols="12" md="4">
                  <v-text-field v-model="lote" label="Lote" variant="underlined" :rules="[rules.required]" />
                </v-col>

                <v-col cols="12">
                  <v-date-input v-model="fechaProduccion" label="Fecha Producción" color="primary" clearable
                    variant="underlined" :rules="[rules.required, rules.fecha]" />
                </v-col>

                <v-col cols="12">
                  <v-date-input v-model="fechaVencimiento" label="Fecha Vencimiento" color="primary" clearable
                    variant="underlined" :rules="[rules.required, rules.fecha]" />
                </v-col>


                <v-col cols="12" class="d-flex justify-end gap-2">
                  <v-btn color="primary" variant="flat" @click="agregarProducto" prepend-icon="mdi-plus" class="w-100">
                    Agregar
                  </v-btn>
                </v-col>
              </v-row>
            </v-form>
          </v-col>

          <!-- Tabla de productos agregados -->
          <v-col cols="12" md="9">
            <v-sheet max-height="500" class="overflow-y-auto">
              <v-data-table :headers="headersProductos" :items="itemsProductos" class="elevation-1" density="compact"
                :items-per-page="10">
                <template #[`item.precioCompra`]="{ item }">
                  S/ {{ item.precioCompra.toFixed(2) }}
                </template>
                <template #[`item.subtotal`]="{ item }">
                  S/ {{ item.subtotal.toFixed(2) }}
                </template>
                <template #[`item.actions`]="{ item }">
                  <action-menu @edit="() => handleEditProduct(item)" @delete="() => handleDeleteProduct(item)" />
                </template>
              </v-data-table>
            </v-sheet>

            <!-- Total y botones -->
            <v-row class="mt-4">
              <v-col cols="12" class="text-right">
                <!-- <div class="text-h6 font-weight-bold">
                  Total: S/ {{ itemsProductos.reduce((sum, p) => sum + p.subtotal, 0).toFixed(2) }}
                </div> -->
              </v-col>
            </v-row>
          </v-col>
        </v-row>
      </v-card-text>

      <v-card-actions>
        <v-spacer />
        <v-btn text="Cancelar" @click="closeFormModal" />
        <v-btn color="primary" variant="flat" @click="finishEntryProduct" :text="actionLabel" />
      </v-card-actions>
    </v-card>
  </v-dialog>

  <!-- Modal eliminar ingreso -->
  <v-dialog v-model="productDeleteModal" max-width="500">
    <v-card>
      <v-card-title class="text-h5 font-weight-bold text-black mb-8">
        Eliminar Ingreso
      </v-card-title>

      <div class="text-center mb-4">
        <v-icon size="100" color="error">mdi-alert-octagon-outline</v-icon>
      </div>

      <v-card-text class="text-center text-body-2">
        ¿Está seguro que desea eliminar este ingreso? <br />
        <strong>Esta acción no se puede deshacer.</strong>
      </v-card-text>

      <v-card-actions class="justify-end">
        <v-btn text="Cerrar" @click="productDeleteModal = false" />
        <v-btn text="Eliminar" color="error" @click="confirmDelete" />
      </v-card-actions>
    </v-card>
  </v-dialog>

  <!-- Filtro movil -->
  <v-dialog v-model="filterDialog" max-width="500" v-if="smAndDown">
    <v-card title="Filtrar Ingresos">
      <v-card-text>
        <base-filter v-model:search="search" :filters="selectFilter"
          @update:filter="({ key, value }) => filtros[key] = value" />
      </v-card-text>

      <v-card-actions>
        <v-spacer />
        <v-btn text="Resetear" variant="plain" @click="limpiarFiltros" />
        <v-btn color="primary" text="Aplicar" variant="tonal" @click="aplicarFiltros" />
      </v-card-actions>
    </v-card>
  </v-dialog>

  <!-- FAB Menu movil -->
  <fab-menu v-if="smAndDown" v-model:FormModal="productFormModal" v-model:filterDialog="filterDialog" />

  <!-- Modal de detalles del ingreso -->
  <v-dialog v-model="detallesModal" max-width="900" persistent>
    <v-card v-if="selectedIngreso">
      <v-card-title class="d-flex justify-space-between align-center bg-primary text-white pa-4">
        <div class="d-flex align-center">
          <v-icon class="mr-2">mdi-file-document-outline</v-icon>
          <span class="text-h5">Detalles del Ingreso #{{ String(selectedIngreso.id).padStart(3, '0') }}</span>
        </div>
        <v-btn icon variant="text" @click="cerrarModal">
          <v-icon color="white">mdi-close</v-icon>
        </v-btn>
      </v-card-title>

      <v-card-text class="pa-6">
        <v-row class="mb-4">
          <v-col cols="12" md="6">
            <div class="mb-3">
              <span class="font-weight-bold">Proveedor:</span>
              <span class="ml-2">{{ selectedIngreso.proveedor?.razonSocial || '-' }}</span>
            </div>
            <div class="mb-3">
              <span class="font-weight-bold">Asistente:</span>
              <span class="ml-2">
                {{ selectedIngreso.asistenteAlmacen
                  ? `${selectedIngreso.asistenteAlmacen.nombre || ''} ${selectedIngreso.asistenteAlmacen.apellidoPaterno
                    ||
                    ''}`.trim()
                : '-'
                }}
              </span>
            </div>
          </v-col>

          <v-col cols="12" md="6">
            <div class="mb-3">
              <span class="font-weight-bold">Fecha / Hora:</span>
              <span class="ml-2">{{ selectedIngreso.fechaIngreso || '-' }} / {{ selectedIngreso.horaIngreso || '-'
                }}</span>
            </div>
            <div class="mb-3">
              <span class="font-weight-bold">Estado:</span>
              <v-chip
                :color="selectedIngreso.estado === 'Aprobado' ? 'success' : selectedIngreso.estado === 'Rechazado' ? 'error' : 'warning'"
                size="small" class="ml-2">
                {{ selectedIngreso.estado || 'Pendiente' }}
              </v-chip>
            </div>
          </v-col>

          <v-col cols="12">
            <div class="mb-3">
              <span class="font-weight-bold">Total:</span>
              <span class="ml-2 text-h6 text-primary">
                S/ {{ totalIngreso }}
              </span>
            </div>
          </v-col>

          <!-- <v-col cols="12" v-if="selectedIngreso.observaciones">
            <div class="mb-3">
              <span class="font-weight-bold">Observaciones del asistente:</span>
              <p class="ml-2 mt-1">{{ selectedIngreso.observaciones }}</p>
            </div>
          </v-col> -->
        </v-row>

        <v-divider class="my-4" />

        <!-- Tabla de productos -->
        <div class="mb-4">
          <h3 class="text-h6 mb-3">Detalle de Productos</h3>
          <v-sheet max-height="300" class="overflow-y-auto">
            <v-data-table :headers="headersDetalles" :items="productosDetalle" density="compact" class="elevation-1"
              :items-per-page="-1" hide-default-footer>
            </v-data-table>
          </v-sheet>
        </div>

        <v-divider class="my-4" />

        <div class="mb-4">
          <h3 class="text-h6 mb-3">Observaciones del Jefe de Almacén</h3>
          <v-textarea v-model="observacionesJefe" label="Escribe las observaciones aqui" variant="outlined" rows="2"
            :readonly="selectedIngreso.estado !== 'Pendiente'" :placeholder="selectedIngreso.estado !== 'Pendiente'
              ? 'Este ingreso ya fue procesado'
              : 'Agrega observaciones si es necesario (requerido para rechazar)'" />

        </div>
      </v-card-text>

      <!-- Acciones -->
      <v-card-actions class="pa-4 bg-grey-lighten-4">
        <v-spacer />
        <v-btn v-if="selectedIngreso.estado === 'Pendiente'" text="Rechazar" color="error" variant="outlined"
          @click="rechazarIngreso" />
        <v-btn v-if="selectedIngreso.estado === 'Pendiente'" text="Aprobar" color="success" variant="flat"
          @click="aprobarIngreso" />
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<style scoped>
.gap-2 {
  gap: 0.5rem;
}
</style>
