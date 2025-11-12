<template>
  <h1 class="text-h5 mb-4 font-weight-medium">Toma de inventarios</h1>
  <div class="d-flex ga-2">
    <v-autocomplete
      v-model="selectedDetail"
      prepend-inner-icon="mdi-magnify"
      label="Productos"
      :items="inventory?.inventarioDetalles ?? []"
      item-value="id"
      item-title="producto.nombre"
      autocomplete="off"
      :loading="isPending"
      return-object
      clearable
      color="primary"
    >
    </v-autocomplete>

    <v-btn
      v-if="mdAndUp"
      icon="mdi-barcode-scan"
      color="primary"
      variant="text"
      @click="scannerDialog = true"
    ></v-btn>
  </div>

  <div v-if="!selectedDetail">
    <p class="text-body-1">Seleccione un producto</p>
  </div>

  <v-row v-else>
    <v-col cols="12" sm="6">
      <v-img :src="selectedDetail.producto.imagen" aspect-ratio="16/9" class="rounded-lg" cover>
      </v-img>
    </v-col>
    <v-col cols="12" sm="6">
      <v-card variant="text">
        <v-card-item>
          <v-card-title class="text-capitalize">
            {{ selectedDetail.producto.nombre }}
          </v-card-title>
          <v-card-subtitle>
            Proveedor: {{ selectedDetail.producto.proveedor.razonSocial }}
            <br />
            Codigo: {{ selectedDetail.producto.codigoBarra }}
            <br />
            Unidad de medida: {{ selectedDetail.producto.unidadMedida }}
          </v-card-subtitle>
        </v-card-item>
        <v-card-text>
          <div class="d-flex align-center justify-space-between">
            <p><strong>Stock:</strong> {{ selectedDetail.stockFisico }}</p>
            <v-btn icon="mdi-pen" variant="text" color="primary" @click="openStockDialog"></v-btn>
          </div>
          <v-form class="mt-5" ref="formRef">
            <v-number-input
              label="Agregar stock"
              autocomplete="off"
              color="primary"
              control-variant="stacked"
              inset
              :precision="3"
              :min="0.001"
              decimal-separator="."
              v-model="stock"
              :rules="[rules.required]"
            ></v-number-input>
          </v-form>
        </v-card-text>

        <v-card-actions>
          <v-btn
            type="submit"
            color="primary"
            prepend-icon="mdi-plus"
            block
            class="text-none"
            variant="flat"
            @click="handleSubmit"
            >Agregar</v-btn
          >
        </v-card-actions>
      </v-card>
    </v-col>
  </v-row>

  <v-dialog max-width="500" v-model="stockDialog">
    <v-card title="Editar Stock" prepend-icon="mdi-pen">
      <v-card-text>
        <v-form ref="updateFormRef">
          <v-number-input
            label="Stock"
            autocomplete="off"
            color="primary"
            control-variant="stacked"
            inset
            :precision="3"
            :min="0.001"
            decimal-separator="."
            v-model="selectedStock"
            :rules="[rules.required]"
          ></v-number-input>
        </v-form>
      </v-card-text>

      <v-card-actions>
        <v-btn text="Cerrar" @click="stockDialog = false"></v-btn>
        <v-btn text="Guardar" color="primary" @click="hadnleEditSubmit"></v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>

  <v-dialog max-width="500" v-model="scannerDialog">
    <v-card title="Scanner Code Bar" prepend-icon="mdi-barcode-scan">
      <v-card-text>
        <qrcode-scanner @result="onScan"></qrcode-scanner>
      </v-card-text>

      <v-card-actions>
        <v-btn text="Cerrar" @click="scannerDialog = false"></v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>

  <div class="position-fixed bottom-0 right-0 pa-4" v-if="!mdAndUp">
    <v-btn icon="mdi-barcode-scan" color="green" @click="scannerDialog = true"></v-btn>
  </div>
</template>

<script setup>
import { useInventory } from '@/composables/query/useInventory'
import { useInventoryDetails } from '@/composables/query/useInventoryDetails'
import { useForm } from '@/composables/useForm'
import { useSnackbar } from '@/stores/snackbar'
import { shallowRef, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import QrcodeScanner from '@/components/QrcodeScanner.vue'
import { useDisplay } from 'vuetify'

const route = useRoute()
const router = useRouter()

const { showSuccessSnackbar, showErrorSnackbar } = useSnackbar()
const { getInventoryById } = useInventory()
const { mdAndUp } = useDisplay()
const { addStockAsync, updateStockAsync } = useInventoryDetails(route.params.id)

const { stock, formRef, formData, handleSubmit, rules } = useForm(
  {
    stock: null,
  },
  addStock,
)

const {
  stock: selectedStock,
  formRef: updateFormRef,
  formData: updateFormData,
  handleSubmit: hadnleEditSubmit,
} = useForm(
  {
    stock: null,
  },
  updateStock,
)

const selectedDetail = shallowRef(null)
const stockDialog = shallowRef(false)
const scannerDialog = shallowRef(false)

const { data: inventory, isPending, isError } = getInventoryById(route.params.id)

watch(isError, (value) => {
  if (value) router.push('/inventario/abiertos')
})

watch(inventory, (newInventory) => {
  if (selectedDetail.value) {
    selectedDetail.value = newInventory.inventarioDetalles.find(
      (item) => item.id === selectedDetail.value.id,
    )
  }
})

function openStockDialog() {
  selectedStock.value = selectedDetail.value.stockFisico
  stockDialog.value = true
}

async function addStock() {
  try {
    await addStockAsync({
      id: selectedDetail.value.id,
      ...formData.value,
    })

    showSuccessSnackbar('Stock agregado')
  } catch (error) {
    console.log(error)
    showErrorSnackbar('Error al agregar stock')
  }
}

async function updateStock() {
  try {
    await updateStockAsync({
      id: selectedDetail.value.id,
      ...updateFormData.value,
    })

    showSuccessSnackbar('Stock actualizado')
    stockDialog.value = false
  } catch (error) {
    console.log(error)
    showErrorSnackbar('Error al actualizar stock')
  }
}

function onScan(decodedText) {
  selectedDetail.value = inventory.value.inventarioDetalles.find(
    ({ producto }) => producto.codigoBarra === decodedText,
  )

  if (selectedDetail.value) showSuccessSnackbar('Producto encontrado')
  else showErrorSnackbar('Producto no encontrado')

  scannerDialog.value = false
}
</script>
