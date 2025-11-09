<script setup>
import ActionMenu from '@/components/ActionMenu.vue'
import FabMenu from '@/components/FabMenu.vue'
import BaseFilter from '@/components/BaseFilter.vue'
import { useCategory } from '@/composables/query/useCategory'
import { computed, ref, watch } from 'vue'
import { useDisplay } from 'vuetify/lib/composables/display'
import { useForm } from '@/composables/useForm'
import { useSnackbar } from '@/stores/snackbar'

const { showSuccessSnackbar, showErrorSnackbar } = useSnackbar()

const {
  category,
  isPending,
  isError,
  error,
  createCategoryAsync,
  deleteCategoryAsync,
  updateCategoryAsync,
} = useCategory()

/* --------------------------------------------*/
const {
  formData,
  formRef: categoryForm,
  handleSubmit,
  asignForm,
  resetForm,
  rules,
  nombre,
  descripcion,
} = useForm({
  nombre: '',
  descripcion: '',
})

const headers = [
  { title: 'ID', key: 'id' },
  { title: 'Nombre', key: 'nombre' },
  { title: 'Descripción', key: 'descripcion' },
  { title: 'Acciones', key: 'actions', sortable: false },
]

// filtros
const search = ref('')

// modales
const categoryFormModal = ref(false)
const categoryDeleteModal = ref(false)
const filterDialog = ref(false)
const selectedItem = ref(null)
const { mdAndUp, smAndDown } = useDisplay()

// títulos dinámicos
const modalTitle = computed(() =>
  selectedItem.value ? 'Editar Categoría' : 'Crear Categoría'
)
const actionLabel = computed(() =>
  selectedItem.value ? 'Actualizar' : 'Crear'
)

// acciones
const handleAdd = () => {
  categoryFormModal.value = true
}

const handleEdit = (item) => {
  selectedItem.value = item
  asignForm(selectedItem.value)
  categoryFormModal.value = true
}

const handleDelete = (item) => {
  selectedItem.value = item
  categoryDeleteModal.value = true
}

const confirmDelete = async () => {
  try {
    await deleteCategoryAsync(selectedItem.value.id)
    showSuccessSnackbar('Categoría eliminada correctamente')
  } catch (error) {
    showErrorSnackbar('Error al eliminar la categoría')
    console.error(error)
  } finally {
    categoryDeleteModal.value = false
    selectedItem.value = null
  }
}

// al cerrar modal
watch(categoryFormModal, (isOpen) => {
  if (!isOpen) {
    resetForm()
    selectedItem.value = null
  }
})

const closeModal = () => (categoryFormModal.value = false)

// función guardar
const save = async () => {
  try {
    if (selectedItem.value) {
      await updateCategoryAsync({ ...formData.value, id: selectedItem.value.id })
      showSuccessSnackbar('Categoria actualizada')
    } else {
      await createCategoryAsync(formData.value)
      showSuccessSnackbar('Categoria creada')
    }
  } catch (error) {
    showErrorSnackbar('Error al crear categoria juridico')
    console.log(error)
  }
  closeModal()
}
</script>

<template>
  <h1 class="mb-4">Categorías</h1>

  <!-- Filtros -->
  <v-card v-if="mdAndUp" elevation="0" class="mb-4 pa-4">
    <v-row>
      <base-filter v-model:search="search" />
      <v-col cols="12" md="2" class="d-flex justify-end align-center">
        <v-btn prepend-icon="mdi-plus" color="primary" elevation="1" @click="handleAdd">
          Crear
        </v-btn>
      </v-col>
    </v-row>
  </v-card>

  <!-- Tabla -->
  <v-data-table :headers="headers" :items="category" :search="search" :loading="isPending"
    loading-text="Cargando categorías..." no-data-text="No se encontraron categorías">
    <template #item.actions="{ item }">
      <action-menu @edit="handleEdit(item)" @delete="handleDelete(item)" />
    </template>
  </v-data-table>

  <v-alert v-if="isError" type="error" class="mt-2">
    Error al cargar categorías: {{ error?.message }}
  </v-alert>

  <!-- modal crear y actualizar -->
  <v-dialog v-model="categoryFormModal" max-width="600">
    <v-card :title="modalTitle">
      <v-card-text>
        <v-form ref="categoryForm">
          <v-row dense>
            <v-col cols="12" md="6">
              <v-text-field v-model="nombre" label="Nombre" :rules="[rules.required, rules.text]" />
            </v-col>

            <v-col cols="12" md="6">
              <v-text-field v-model="descripcion" label="Descripción" :rules="[rules.text]" />
            </v-col>
          </v-row>
        </v-form>
      </v-card-text>

      <v-card-actions>
        <v-spacer />
        <v-btn text="Cerrar" variant="plain" @click="closeModal" />
        <v-btn color="primary" :text="actionLabel" variant="tonal" @click="handleSubmit(save)" />
      </v-card-actions>
    </v-card>
  </v-dialog>

  <!-- modal eliminar -->
  <v-dialog v-model="categoryDeleteModal" max-width="500">
    <v-card>
      <!-- Título centrado, grande y negro -->
      <v-card-title class="text-h5 font-weight-bold text-black mb-8">
        Eliminar categoría
      </v-card-title>

      <!-- Ícono centrado -->
      <div class="text-center mb-4">
        <v-icon size="100" color="error">mdi-alert-octagon-outline</v-icon>
      </div>

      <!-- Texto descriptivo -->
      <v-card-text class="text-center text-body-2">
        ¿Está seguro que desea eliminar esta categoría? <br />
        <strong>Esta acción no se puede deshacer.</strong>
      </v-card-text>

      <!-- Botones alineados -->
      <v-card-actions class="justify-end">
        <v-btn text="Cerrar" @click="categoryDeleteModal = false"></v-btn>
        <v-btn text="Eliminar" color="error" @click="confirmDelete"></v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>

  <!-- Filtro móvil -->
  <v-dialog v-model="filterDialog" max-width="500" v-if="smAndDown">
    <v-card title="Filtrar Categorías">
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

  <fab-menu v-model:FormModal="categoryFormModal" v-model:filterDialog="filterDialog" />
</template>
