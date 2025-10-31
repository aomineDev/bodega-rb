<script setup>

import FabMenu from '@/components/FabMenu.vue';
import BaseFilter from '@/components/BaseFilter.vue';
import { computed, ref } from 'vue';
import { useSnackbar } from '@/stores/snackbar'
import { useRouter } from 'vue-router'
import { naturalCustomerService } from '@/services/api/naturalCustomerService';
import { juridicalCustomerService } from '@/services/api/juridicalCustomerService';
import { useProduct } from '@/composables/query/useProduct';
import { useNaturalCustomer } from '@/composables/query/useNaturalCustomer';
import { useJuridicalCustomer } from '@/composables/query/useJuridicalCustomer';
import { useBill } from '@/composables/query/useBill';
import { useTicket } from '@/composables/query/useTicket';
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
  product,
  isPending,
} = useProduct()

const {
  naturalCustomers,
} = useNaturalCustomer()

const {
  juridicalCustomers,
} = useJuridicalCustomer()

const {
  createBillAsync,
} = useBill()

const {
  createTicketAsync,
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
        ? await crearClienteNatural(value)
        : await crearClienteJuridico(value);
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

const crearClienteNatural = async (dni) => {

  const data = await naturalCustomerService.getCustomerByDni(dni);

  if (!data) {
    showErrorSnackbar('No existe ese número de documento');
    return null;
  }

  showSuccessSnackbar('Cliente natural creado exitosamente');
  return data;
};

const crearClienteJuridico = async (ruc) => {
  const data = await juridicalCustomerService.getCustomerByRuc(ruc);

  if (!data) {
    showErrorSnackbar('No existe ese RUC');
    return null;
  }

  showSuccessSnackbar('Cliente jurídico creado exitosamente');
  return data;
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
  console.log(item)
}

const cantidad = ref(1)
const litro = ref(1)
const peso = ref(1)

const unidades = { Litro: litro, Kilo: peso, Unidad: cantidad }

const inputValue = computed({
  get() {
    const product = selectedProduct.value
    if (!product) return 1
    return unidades[selectedProduct.value.unidadMedida]?.value ?? cantidad.value
  },
  set(val) {
    const product = selectedProduct.value
    if (!product) return
    const target = unidades[selectedProduct.value.unidadMedida] ?? cantidad
    target.value = parseFloat(val) || 0
  },
})

const previewTotalPrice = computed(() => {
  const product = selectedProduct.value
  if (!product) return '0.00'
  return ((parseFloat(inputValue.value) || 0) * (parseFloat(product.precioUnitario) || 0)).toFixed(2)
})

const closeProduct = () => {
  showProductDialog.value = false
  cantidad.value = 1
  litro.value = 1
  peso.value = 1
}

/* --------------------   Detalle venta  ------------------- */
const cartItems = ref([])

const addProduct = () => {
  const product = selectedProduct.value
  if (!product) return

  const cantidadSeleccionada = parseFloat(inputValue.value) || 1
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
const tipoPago = ref('Efectivo')
const montoEfectivo = ref(0)

const vuelto = computed(() => {
  if (tipoPago.value !== 'Efectivo') return 0

  const efectivo = parseFloat(montoEfectivo.value) || 0
  const total = parseFloat(totals.value.total) || 0

  return efectivo > total ? efectivo - total : 0
})

/* --------------------   Finalizar venta  ------------------- */
const createSale = async () => {
  if (!cartItems.value.length) {
    showWarningSnackbar('Agrega productos antes de finalizar la venta')
    return
  }

  if (!customer.value) {
    showWarningSnackbar('Debe seleccionar un cliente')
    return
  }

  try {
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

      await createTicketAsync(dataToSend)

    } else {
      dataToSend = {
        ...comprobante,
        clienteJuridico: { id: customer.value.id },
      }

      await createBillAsync(dataToSend)
    }

    showSuccessSnackbar('Venta registrada correctamente')

    router.push('/caja/comprobantes')
    cartItems.value = []
    montoEfectivo.value = 0
    customer.value = null
    showClientDialog.value = true

  } catch (error) {
    console.error('Error al registrar la venta:', error)
    showErrorSnackbar('Ocurrió un error al registrar la venta')
  }
}

</script>

<template>

  <h1>Ventas</h1>
  <div>{{ customerPrueba }}</div>

  <!-- Modal Asignacion -->
  <v-dialog v-model="showClientDialog" persistent max-width="480">
    <v-card elevation="0" rounded="lg">
      <v-card-title class="text-h6 d-flex align-center justify-space-between">
        <span>Asignar Cliente</span>
        <v-btn icon variant="text" @click="cancelSale">
          <v-icon>mdi-close</v-icon>
        </v-btn>
      </v-card-title>

      <v-divider></v-divider>

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

      <v-divider></v-divider>

      <v-card-actions class="justify-end pa-4">
        <v-btn variant="text" color="grey" @click="cancelSale">Cancelar</v-btn>
        <v-btn color="primary" variant="flat" @click="handleSubmit(searchCustomer)">Continuar</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>

  <v-container fluid class="pa-4">
    <v-row>
      <!-- COLUMNA IZQUIERDA: Productos -->
      <v-col cols="12" md="8">

        <!-- Filtros -->
        <v-card v-if="mdAndUp" elevation="0" class="mb-4 pa-4">
          <v-row>
            <base-filter v-model:search="search" />
          </v-row>
        </v-card>

        <v-row v-if="isPending">
          <v-col v-for="n in 6" :key="n" cols="12" sm="6" md="6" lg="4">
            <v-skeleton-loader type="card" />
          </v-col>
        </v-row>

        <v-row v-else>
          <v-col v-for="item in items" :key="item.id" cols="12" sm="6" md="6" lg="4">
            <v-hover v-slot="{ isHovering, props }">
              <v-card v-bind="props" :elevation="isHovering ? 4 : 1" class="transition-fast" rounded="xl">
                <v-img :src="item.imagen" height="220" cover>
                  <v-expand-transition>
                    <div v-if="isHovering" class="position-absolute" style="inset:0; background-color:rgba(0,0,0,0.2);">
                    </div>
                  </v-expand-transition>
                </v-img>

                <v-divider :thickness="2" />

                <v-card-title class="text-h6 font-weight-medium text-center transition-fast"
                  :class="{ 'text-primary': isHovering }">
                  {{ item.nombre }}
                </v-card-title>

                <v-card-actions class="justify-center pb-4">
                  <v-btn color="primary" variant="flat" prepend-icon="mdi-cart-plus" @click="viewProduct(item)"
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
            <v-select v-model="tipoPago" label="Tipo de pago" :items="['Efectivo', 'Tarjeta', 'Yape', 'Plin']"
              variant="underlined" density="comfortable" class="mb-3" />

            <template v-if="tipoPago === 'Efectivo'">
              <v-text-field v-model.number="montoEfectivo" label="Efectivo" prefix="S/" variant="underlined"
                density="comfortable" type="number" min="0" />

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

          </div>

          <!-- Botón Finalizar -->
          <v-btn block color="primary" size="large" class="mt-5" prepend-icon="mdi-check-circle-outline"
            :disabled="!cartItems.length || !customer" @click="createSale">
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

          <v-text-field v-model="inputValue" :label="selectedProduct.unidadMedida" variant="underlined" type="number"
            min="0.1" class="mb-2" />

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
