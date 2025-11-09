<script setup>

import FabMenu from '@/components/FabMenu.vue';
import BaseFilter from '@/components/BaseFilter.vue';
import { computed, ref } from 'vue';
import { useSnackbar } from '@/stores/snackbar'
import { useRouter } from 'vue-router'
import { useProduct } from '@/composables/query/useProduct';
import { useNaturalCustomer } from '@/composables/query/useNaturalCustomer';
import { useJuridicalCustomer } from '@/composables/query/useJuridicalCustomer';
import { useBill } from '@/composables/query/useBill';
import { useTicket } from '@/composables/query/useTicket';
import { useIntegration } from '@/composables/query/useIntegration';
import { useDisplay } from 'vuetify'
import { useForm } from '@/composables/useForm';

const { showSuccessSnackbar, showErrorSnackbar, showWarningSnackbar } = useSnackbar()

const {
  formRef: asignacionForm,
  handleSubmit,
  dni,
  ruc,
} = useForm({
  dni: '',
  ruc: ''
})

const {
  formRef: tipoPagoForm,
  handleSubmit: handleSubmitTipoPago,
  rules,
} = useForm({
})

const {
  product,
} = useProduct()

const {
  naturalCustomers,
} = useNaturalCustomer()

const {
  createCustomerByDniAsync,
  createCustomerByRucAsync,
} = useIntegration()

const {
  juridicalCustomers,
} = useJuridicalCustomer()

const {
  createBillAsync,
  generatePdfBill,
} = useBill()

const {
  createTicketAsync,
  generatePdfTicket,
} = useTicket()

/* --------------------   Filtros   ------------------- */
const filterDialog = ref(false)
const search = ref('') //busqueda

const { mdAndUp, smAndDown } = useDisplay()

const items = computed(() => product.value || [])

const router = useRouter()
const showClientDialog = ref(true)
const showProductDialog = ref(false)
const customerType = ref('natural')
const customer = ref(null)
const selectedProduct = ref(null)

const searchCustomer = async () => {

  const isNatural = customerType.value === 'natural';
  const value = isNatural ? dni.value : ruc.value;

  const validations = {
    natural: { length: 8, message: 'Ingrese un DNI válido' },
    juridical: { length: 11, message: 'Ingrese un RUC válido' },
  };

  const rule = validations[customerType.value];
  if (!value || value.length < rule.length) {
    showWarningSnackbar(rule.message);
    return;
  }

  try {
    let foundCustomer = (isNatural ? naturalCustomers.value : juridicalCustomers.value)
      .find(c => (isNatural ? c.dni : c.ruc) === value);

    if (!foundCustomer) {
      foundCustomer = isNatural
        ? await createCustomerByDniAsync(value)
        : await createCustomerByRucAsync(value)
    }

    if (foundCustomer) {
      customer.value = foundCustomer;
      showSuccessSnackbar('Cliente encontrado exitosamente');
      showClientDialog.value = false;
    }

  } catch (error) {
    console.error(error);
    showErrorSnackbar('Ocurrió un error al buscar el cliente');
  }
};

const cambiarCliente = () => {
  customer.value = null
  dni.value = ''
  ruc.value = ''

  showClientDialog.value = true
}

const customerName = computed(() => {
  if (!customer.value) return 'No hay cliente asignado'
  return customerType.value === 'natural'
    ? `${customer.value.nombre} ${customer.value.apellidoPaterno}`
    : customer.value.razonSocial
})

const customerIdValue = computed(() => {
  if (!customer.value) return '—'
  return customerType.value === 'natural'
    ? customer.value.dni
    : customer.value.ruc
})

const cancelSale = () => {
  showClientDialog.value = false
  router.push('/home')
}

/* --------------------   Modal Producto   ------------------- */
const viewProduct = (item) => {
  selectedProduct.value = item
  showProductDialog.value = true
}

const cantidad = ref('1')
const litro = ref('0.1')
const peso = ref('0.1')

const previewTotalPrice = computed(() => {
  const product = selectedProduct.value
  if (!product) return '0.00'

  const precio = parseFloat(product.precioUnitario) || 0

  switch (product.unidadMedida) {
    case 'Unidad':
      return (cantidad.value * precio).toFixed(2)
    case 'Kilogramo':
      return (peso.value * precio).toFixed(2)
    case 'Litro':
      return (litro.value * precio).toFixed(2)
    default:
      return '0.00'
  }
})

const closeProduct = () => {
  showProductDialog.value = false
  cantidad.value = '1'
  peso.value = '0.1'
  litro.value = '0.1'
}

/* --------------------   Detalle venta  ------------------- */
const cartItems = ref([])

const addProduct = () => {
  const product = selectedProduct.value
  if (!product) return

  let cantidadSeleccionada = 0
  switch (product.unidadMedida) {
    case 'Unidad':
      cantidadSeleccionada = cantidad.value
      break
    case 'Kilogramo':
      cantidadSeleccionada = peso.value
      break
    case 'Litro':
      cantidadSeleccionada = litro.value
      break
  }

  const precioUnitario = parseFloat(product.precioUnitario) || 0
  const subTotal = cantidadSeleccionada * precioUnitario

  const existing = cartItems.value.find(i => i.producto.id === product.id)

  if (existing) {
    existing.cantidad += cantidadSeleccionada
    existing.subTotal = existing.cantidad * existing.precioUnitario
  } else {
    cartItems.value.push({
      producto: product,
      nombre: product.nombre,
      unidadMedida: product.unidadMedida,
      cantidad: cantidadSeleccionada,
      precioUnitario,
      subTotal,
    })
  }

  closeProduct()
}

// Calcular totales
const totals = computed(() => {
  const total = cartItems.value.reduce((sum, item) => sum + item.subTotal, 0)
  const gravado = total / (1 + 0.18)
  const igv = total - gravado
  return {
    gravado: gravado.toFixed(2),
    igv: igv.toFixed(2),
    total: total.toFixed(2)
  }
})

// Eliminar del carrito
const removeProduct = (id) => {
  cartItems.value = cartItems.value.filter(p => p.producto.id !== id)
}

/* --------------------   Tipo de Pago  ------------------- */
const montoEfectivo = ref(1)
const tipoPago = ref('Efectivo')

const vuelto = computed(() => {
  if (tipoPago.value !== 'Efectivo') return 0

  const efectivo = parseFloat(montoEfectivo.value) || 0
  const total = parseFloat(totals.value.total) || 0

  return efectivo > total ? efectivo - total : 0
})

/* --------------------   Finalizar venta  ------------------- */
const confirmSaleModal = ref(false)
const ventaCompletadaModal = ref(false)
const ventaProcesando = ref(false)
const lastComprobante = ref(null)

const validForm = () => {
  confirmSaleModal.value = true
}

const finalizarCompra = async () => {
  ventaProcesando.value = true
  try {
    await createSale()

    confirmSaleModal.value = false
    ventaCompletadaModal.value = true
  } catch (err) {
    showErrorSnackbar('Ocurrió un error al registrar la venta')
    console.error(err)
  } finally {
    ventaProcesando.value = false
  }
}

const createSale = async () => {
  const detalleVentas = cartItems.value.map(item => ({
    cantidad: item.cantidad,
    precioUnitario: item.precioUnitario,
    subTotal: item.subTotal,
    producto: { id: item.producto.id }
  }))

  const now = new Date()

  const comprobante = {
    fecha: now.toISOString().split('T')[0],
    hora: now.toTimeString().split(' ')[0],
    grabado: parseFloat(totals.value.gravado),
    igv: parseFloat(totals.value.igv),
    precioTotal: parseFloat(totals.value.total),
    estado: true,
    vuelto: parseFloat(vuelto.value),
    detalleVentas,
  }

  let dataToSend = null

  if (customerType.value === 'natural') {
    dataToSend = {
      ...comprobante,
      clienteNatural: { id: customer.value.id },
    }

    lastComprobante.value = await createTicketAsync(dataToSend)

  } else {
    dataToSend = {
      ...comprobante,
      clienteJuridico: { id: customer.value.id },
    }

    lastComprobante.value = await createBillAsync(dataToSend)
  }

  cartItems.value = []
  montoEfectivo.value = 1
  tipoPago.value = 'Efectivo'
  customer.value = null
}

const imprimirComprobante = async () => {
  if (!lastComprobante.value) {
    showWarningSnackbar('No hay comprobante generado aún')
    return
  }

  let pdfUrl = null
  const id = lastComprobante.value.id

  if (customerType.value === 'natural') {
    pdfUrl = await generatePdfTicket(id)
  } else {
    pdfUrl = await generatePdfBill(id)
  }

  if (pdfUrl) {
    window.open(pdfUrl, '_blank')
  } else {
    showErrorSnackbar('No se pudo generar el comprobante')
  }
}

</script>

<template>

  <h1>Ventas</h1>

  <!-- Modal Asignacion -->
  <v-dialog v-model="showClientDialog" persistent max-width="480">
    <v-card elevation="0" rounded="lg">
      <v-card-title class="text-h6 d-flex align-center justify-space-between">
        <span>Asignar Cliente</span>
        <v-btn icon variant="text" @click="cancelSale">
          <v-icon>mdi-close</v-icon>
        </v-btn>
      </v-card-title>

      <v-card-text class="mt-4">
        <v-form ref="asignacionForm">
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
        </v-form>

      </v-card-text>

      <v-card-actions class="justify-end pa-4">
        <v-btn variant="text" color="grey" @click="cancelSale">Cancelar</v-btn>
        <v-btn color="primary" variant="flat" @click="handleSubmit(searchCustomer)">Continuar</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>

  <v-container fluid class="pa-0" style="overflow: visible;">
    <v-row>
      <!-- COLUMNA IZQUIERDA: Productos -->
      <v-col cols="12" md="8" class="pa-4">
        <v-card v-if="mdAndUp" elevation="0" class="mb-4 pa-4">
          <v-row>
            <base-filter v-model:search="search" />
          </v-row>
        </v-card>

        <v-data-iterator :items="items" :items-per-page="6" :search="search">
          <template #default="{ items }">
            <v-row dense>
              <v-col v-for="item in items" :key="item.raw.id" cols="12" sm="6" md="6" lg="4">
                <v-card class="pb-3" rounded="xl" width="100%">
                  <v-img :src="item.raw.imagen" height="180" cover></v-img>
                  <v-card-text class="py-3">
                    <!-- Nombre del producto -->
                    <div class="text-subtitle-1 text-center font-weight-medium">
                      {{ item.raw.nombre }}
                    </div>

                    <!-- Código de barra -->
                    <div class="text-caption text-center text-grey-darken-1 mt-1">
                      Código: {{ item.raw.codigoBarra }}
                    </div>

                    <!-- Categoría -->
                    <div class="text-caption text-center text-grey mt-1">
                      {{ item.raw.categoria.nombre }}
                    </div>
                  </v-card-text>
                  <v-card-actions class="justify-center pt-3">
                    <v-btn color="primary" variant="flat" prepend-icon="mdi-cart-plus" @click="viewProduct(item.raw)">
                      Agregar
                    </v-btn>
                  </v-card-actions>
                </v-card>
              </v-col>
            </v-row>
          </template>

          <template #footer="{ page, pageCount, prevPage, nextPage }">
            <div class="d-flex align-center justify-center pa-4" style="min-height: 60px;">
              <v-btn :disabled="page === 1" density="comfortable" icon="mdi-arrow-left" variant="tonal" rounded
                @click="prevPage" />
              <div class="mx-2 text-caption">
                Página {{ page }} de {{ pageCount }}
              </div>
              <v-btn :disabled="page >= pageCount" density="comfortable" icon="mdi-arrow-right" variant="tonal" rounded
                @click="nextPage" />
            </div>
          </template>
        </v-data-iterator>
      </v-col>

      <!-- COLUMNA DERECHA: Resumen de Venta -->
      <v-col cols="12" md="4" class="bg-grey-lighten-5 pa-4">
        <v-card elevation="1" rounded="lg" class="pa-4 position-sticky" style="top: 80px;">
          <!-- Cliente -->
          <div class="d-flex justify-space-between align-center mb-3">
            <v-btn elevation="0" color="primary" prepend-icon="mdi-account-plus-outline" @click="cambiarCliente">
              Cambiar cliente
            </v-btn>
          </div>

          <v-text-field label="N° Identificación" density="comfortable" variant="underlined" readonly hide-details
            :model-value="customerIdValue" class="mt-2 my-4" />

          <v-text-field label="Cliente" density="comfortable" variant="underlined" readonly hide-details
            :model-value="customerName" class="mt-2 my-4" />

          <v-divider class="my-4 mt-7" />

          <!-- Resumen de Venta -->
          <div>
            <div class="text-subtitle-1 font-weight-medium mb-2">Resumen de venta</div>

            <v-list v-if="cartItems.length" density="compact" class="rounded-lg bg-grey-lighten-4">
              <v-list-item v-for="item in cartItems" :key="item.id" :title="item.nombre"
                :subtitle="`Cant. ${item.cantidad}`">
                <template #append>
                  <div class="d-flex align-center">
                    <span class="mr-2">S/ {{ item.subTotal.toFixed(2) }}</span>
                    <v-btn icon="mdi-delete-outline" size="small" variant="text" color="red"
                      @click="removeProduct(item.producto.id)" />
                  </div>
                </template>
              </v-list-item>
            </v-list>

            <div v-else class="text-center text-grey mt-3">
              <v-icon size="30" color="grey">mdi-cart-outline</v-icon>
              <p class="text-body-2 mt-1">No hay productos seleccionados</p>
            </div>

            <v-divider class="my-4" />

            <!-- Totales -->
            <v-row>
              <v-col cols="6" class="text-left">GRAVADO</v-col>
              <v-col cols="6" class="text-right">S/ {{ totals.gravado }}</v-col>

              <v-col cols="6" class="text-left">IGV</v-col>
              <v-col cols="6" class="text-right">S/ {{ totals.igv }}</v-col>

              <v-col cols="6" class="text-subtitle-1 font-weight-bold">TOTAL</v-col>
              <v-col cols="6" class="text-right text-subtitle-1 font-weight-bold">
                S/ {{ totals.total }}
              </v-col>
            </v-row>

            <v-divider class="my-4" />

            <!-- Tipo de pago -->
            <v-form ref="tipoPagoForm">

              <v-select v-model="tipoPago" label="Tipo de pago" :items="['Efectivo', 'Tarjeta', 'Yape', 'Plin']"
                variant="underlined" density="comfortable" class="mb-3" />

              <template v-if="tipoPago === 'Efectivo'">
                <v-text-field v-model.number="montoEfectivo" label="Efectivo" prefix="S/" variant="underlined"
                  type="number" min="0" :rules="[rules.precio, rules.montoSuficiente(totals.total)]" />

                <div class="d-flex justify-space-between mt-2 text-subtitle-2">
                  <span>Vuelto</span>
                  <span class="font-weight-medium">
                    S/ {{ vuelto.toFixed(2) }}
                  </span>
                </div>
              </template>
              <template v-else>
                <div class="d-flex justify-space-between mt-2 text-subtitle-2">
                  <span>Vuelto</span>
                  <span class="font-weight-medium">S/ 0.00</span>
                </div>
              </template>
            </v-form>
          </div>

          <!-- Botón Finalizar -->
          <v-btn block color="primary" size="large" class="mt-5" prepend-icon="mdi-check-circle-outline"
            :disabled="!cartItems.length || !customer" @click="handleSubmitTipoPago(validForm)">
            Finalizar Venta
          </v-btn>
        </v-card>
      </v-col>
    </v-row>
  </v-container>

  <!-- Modal Detalle -->
  <v-dialog v-model="showProductDialog" max-width="800">
    <v-card>
      <v-row no-gutters>
        <v-col cols="12" md="6" class="d-flex align-center justify-center pa-0">
          <v-img :src="selectedProduct.imagen" alt="Producto" cover class="w-100 h-100 rounded-l-lg" />
        </v-col>

        <v-col cols="12" md="6" class="pa-6">
          <div class="d-flex justify-space-between align-center mb-2">
            <span class="text-body-2 font-weight-medium mb-4">
              Código: {{ selectedProduct.codigoBarra }}
            </span>
            <span class="text-body-2 font-weight-bold mb-4">
              S/ {{ selectedProduct.precioUnitario.toFixed(2) }}
            </span>
          </div>

          <h3 class="text-h6 font-weight-bold mb-1">
            {{ selectedProduct.nombre }}
          </h3>
          <p class="text-body-2 text-grey-darken-1 mt-4 mb-4">
            {{ selectedProduct.descripcion }}
          </p>

          <template v-if="selectedProduct.unidadMedida === 'Unidad'">
            <v-mask-input label="Cantidad (unidades)" v-model="cantidad" mask="########" variant="underlined">
            </v-mask-input>
          </template>

          <template v-else-if="selectedProduct.unidadMedida === 'Kilogramo'">
            <v-text-field v-model.number="peso" label="Peso (kg)" variant="underlined" type="number" min="0.1"
              step="0.1" class="mb-2" />
          </template>

          <template v-else-if="selectedProduct.unidadMedida === 'Litro'">
            <v-text-field v-model.number="litro" label="Volumen (litros)" variant="underlined" type="number" min="0.1"
              step="0.1" class="mb-2" />
          </template>

          <div class="d-flex justify-end text-body-2 font-weight-medium mb-4">
            Total: S/ {{ previewTotalPrice }}
          </div>

          <div class="d-flex justify-end">
            <v-btn variant="text" @click="closeProduct">Cerrar</v-btn>
            <v-btn color="primary" variant="text" @click="addProduct()">Agregar</v-btn>
          </div>
        </v-col>
      </v-row>
    </v-card>
  </v-dialog>

  <!-- Modal Confirmar venta -->
  <v-dialog v-model="confirmSaleModal" max-width="420">
    <v-card>
      <v-card-title class="text-h6 font-weight-bold">
        Confirmar venta
      </v-card-title>

      <v-card-text>
        <div class="d-flex justify-space-between my-1">
          <span>Total:</span>
          <span class="font-weight-medium">S/ {{ totals.total }}</span>
        </div>
        <div class="d-flex justify-space-between my-1">
          <span>Tipo de pago:</span>
          <span>{{ tipoPago }}</span>
        </div>
        <div v-if="tipoPago === 'Efectivo'" class="d-flex justify-space-between my-1">
          <span>Vuelto:</span>
          <span>S/ {{ vuelto.toFixed(2) }}</span>
        </div>
      </v-card-text>

      <v-card-actions class="justify-end">
        <v-btn text @click="confirmSaleModal = false">Cancelar</v-btn>
        <v-btn color="primary" :loading="ventaProcesando" @click="finalizarCompra">
          Confirmar
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>

  <!-- Modal Venta completada -->
  <v-dialog v-model="ventaCompletadaModal" persistent max-width="380">
    <v-card class="pa-4 d-flex flex-column align-center text-center">
      <v-icon color="success" size="48">mdi-check-circle</v-icon>
      <h3 class="mt-3">¡Venta completada!</h3>
      <p class="text-subtitle-2 mt-1">La operación se realizó correctamente.</p>

      <v-card-actions class="justify-center mt-4">
        <v-btn color="primary" @click="showClientDialog = true, ventaCompletadaModal = false">
          Nueva venta
        </v-btn>
        <v-btn @click="imprimirComprobante">Imprimir comprobante</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>

  <!-- Filtro móvil -->
  <v-dialog v-model="filterDialog" max-width="500" v-if="smAndDown">
    <v-card title="Filtrar Productos">
      <v-card-text>
        <base-filter v-model:search="search" />
      </v-card-text>

      <v-card-actions>
        <v-spacer />
        <v-btn text="Cerrar" variant="plain" @click="filterDialog = false" />
        <v-btn color="primary" text="Aplicar" variant="tonal" @click="filterDialog = false" />
      </v-card-actions>
    </v-card>
  </v-dialog>

  <fab-menu v-model:filterDialog="filterDialog" />

</template>

<style scoped></style>
