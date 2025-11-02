<script setup>
import ActionMenu from '@/components/ActionMenu.vue';
import BaseFilter from '@/components/BaseFilter.vue';
import FabMenu from '@/components/FabMenu.vue';
import { VDateInput } from 'vuetify/labs/VDateInput'
import { computed, reactive, ref, watch } from 'vue'
import { useSnackbar } from '@/stores/snackbar';
import { useForm } from '@/composables/useForm';
import { useDisplay } from 'vuetify';
import { useSupplier } from '@/composables/query/useSupplier';

const { showSuccessSnackbar } = useSnackbar()
const { mdAndUp, smAndDown } = useDisplay()

//filtros
const filtros = reactive({
    rangoFechas: [],
})
const selectFilter = computed(() => [
    {
        key: 'rangoFechas',
        label: 'Rango de fechas',
        type: 'range',
        model: filtros.rangoFechas
    }
])

//servicio
const {
    createSupplierAsync, supplier, deleteSupplierAsync, updateSupplierAsync
} = useSupplier()

//data header
const headers = [
    { title: 'Razón social', key: 'razonSocial' },
    { title: 'Tipo de contribuyente', key: 'tipoContribuyente' },
    { title: 'Actividad económica', key: 'actividadEconomica' },
    { title: 'Fecha de registro', key: 'fechaRegistro' },
    { title: 'RUC', key: 'ruc' },
    { title: 'Dirección', key: 'direccion' },
    { title: 'Teléfono', key: 'telefono' },
    { title: 'Email', key: 'email' },
    { title: 'Acción', key: 'actions', sortable: false }
]

//actualizar nombre y boton del modal al actualizar
const modalTitle = computed(() => (supplierItem.value ? 'Editar Proveedor' : 'Crear Proveedor'))
const actionLabel = computed(() => (supplierItem.value ? 'Actualizar' : 'Crear'))
const supplierItem = ref(null)
const editingSupplier = ref(null)

//modales
const supplierFormModal = ref(false)
const filterDialog = ref(false)
const supplierDeleteModal = ref(false)

const {
    formRef, formData, asignForm, resetForm, rules, handleSubmit
    , tipoContribuyente, actividadEconomica, razonSocial,
    fechaRegistro, ruc, direccion, telefono, email
} = useForm({
    tipoContribuyente: '',
    actividadEconomica: '',
    razonSocial: '',
    fechaRegistro: '',
    ruc: '',
    direccion: '',
    telefono: '',
    email: ''
})

//acciones del fab
const handleActionFabMenu = (type) => {

    if (type === 'add') {
        supplierItem.value = false
        supplierFormModal.value = true
    }
    if (type === 'filter') {
        filterDialog.value = true
    }
}
//abrir modal eliminar

const handleDelete = (item) => {

    supplierDeleteModal.value = true

    console.log("proveedor eliminado con id" + item.nombre)
}
const confirmDelete = async () => {
    try {
        editingSupplier.value = supplier.value[0]
        console.log("id " + editingSupplier.value.id)
        await deleteSupplierAsync(editingSupplier.value.id)
        showSuccessSnackbar('Eliminado correctamente')
        supplierDeleteModal.value = false
    } catch (error) {
        console.log(error)
    }
}
//creare proveedor
const handleCreateSupplier = async () => {
    try {
        if (supplierItem.value) {
            await updateSupplierAsync({ ...formData.value, id: supplierItem.value.id })
            showSuccessSnackbar('Proveedor actualizado')

        } else {
            await createSupplierAsync(formData.value)
            showSuccessSnackbar('Creado exitosamente')
        }
    } catch (error) {
        console.log(error)
    }
    supplierFormModal.value = false


}
//cerrar modal de crear
const closeFormModal = () => {
    supplierFormModal.value = false
    resetForm()
}
//cerar modal de eliminar
const close = () => {
    supplierDeleteModal.value = false
}
//abrir edicion
const handleEdit = (item) => {
    supplierItem.value = item
    asignForm(supplierItem.value)
    supplierFormModal.value = true

}
watch(supplierFormModal, (isOpen) => {
    if (!isOpen) resetForm()
    supplier.value = null
})

// filtros

const search = ref('')

const filtroProveedores = computed(() => {

    if (!Array.isArray(supplier.value)) return []

    const query = search.value.toLowerCase().trim()
    if (!query) return supplier.value

    return supplier.value.filter(s => {
        const razonSocial = s.razonSocial?.toLowerCase() || ''
        const telefono = s.telefono?.toString()

        return (
            razonSocial.includes(query) ||
            telefono.includes(query)
        )
    })
})

</script>

<template>

    <h1 class="mb-5">Proveedores</h1>

    <!-- filter -->
    <v-card v-if="mdAndUp" elevation="0" class="mb-10 pa-4">
        <v-row>
            <base-filter v-model:search="search" :filters="selectFilter" @update:filter="({ key, value }) =>
                filtros[key] = value" />
            <v-col cols="12" md="2" class="d-flex justify-md-end align-center" hide-details>
                <v-btn prepend-icon="mdi-plus" color="primary" @click="handleActionFabMenu('add')">Crear
                    Proveedor</v-btn>
            </v-col>
        </v-row>
    </v-card>


    <!-- Tabla -->
    <v-data-table :headers="headers" :items="filtroProveedores">
        <template #[`item.actions`]="{ item }">
            <action-menu @edit="handleEdit(item)" @delete="handleDelete(item)" />
        </template>
    </v-data-table>

    <!-- modal añadir -->
    <v-dialog v-model="supplierFormModal" max-width="600">
        <v-card :title="modalTitle">

            <v-form ref="formRef" class="pa-3">
                <v-container fluid>
                    <v-row>
                        <v-col cols="12" md="6">
                            <v-text-field label="Razon social" variant="underlined" v-model="razonSocial"
                                :rules="[rules.required]"></v-text-field>
                        </v-col>

                        <v-col cols="12" md="6">
                            <v-text-field label="Actividad economica" variant="underlined" v-model="actividadEconomica"
                                :rules="[rules.required]"></v-text-field>
                        </v-col>

                        <v-col cols="12" md="6">
                            <v-mask-input label="Ruc" variant="underlined" v-model="ruc"
                                :rules="[rules.required, rules.distinct(supplier, 'ruc', supplierItem?.id)]"
                                mask="###########"></v-mask-input>
                        </v-col>

                        <v-col cols="12" md="6">
                            <v-mask-input label="Telefono" variant="underlined" v-model="telefono"
                                :rules="[rules.required, rules.phone, rules.distinct(supplier, 'telefono', supplierItem?.id)]"
                                mask="+51 ### ### ###">
                            </v-mask-input>
                        </v-col>

                        <v-col cols="12" md="6">
                            <v-text-field label="Email" variant="underlined" v-model="email"
                                :rules="[rules.email, rules.required, rules.distinct(supplier, 'email', supplierItem?.id)]"></v-text-field>
                        </v-col>


                        <v-col cols="12" md="6">
                            <v-text-field label="Tipo contribuyente" variant="underlined" v-model="tipoContribuyente"
                                :rules="[rules.required]"></v-text-field>
                        </v-col>

                        <v-col cols="12" md="6">
                            <v-text-field label="Direccion" variant="underlined" v-model="direccion"
                                :rules="[rules.required]"></v-text-field>
                        </v-col>

                        <v-col cols="12" md="6">
                            <v-date-input v-model="fechaRegistro" label="Fecha de registro" :rules="[rules.fecha]"
                                variant="underlined"></v-date-input>
                        </v-col>
                    </v-row>
                </v-container>
            </v-form>

            <v-card-actions>
                <v-spacer />
                <v-btn class="ms-auto" text="Cerrar" @click="closeFormModal()"></v-btn>
                <v-btn class="ms-auto" :text="actionLabel" variant="tonal" color="primary"
                    @click="handleSubmit(handleCreateSupplier)"></v-btn>

            </v-card-actions>

        </v-card>
    </v-dialog>
    <!-- Filtro móvil -->
    <v-dialog v-model="filterDialog" max-width="500" v-if="smAndDown">
        <v-card title="Filtrar Proveedores">
            <v-card-text>
                <base-filter v-model:search="search" :filters="selectFilter"
                    @update:filter="({ key, value }) => tipoCliente = value" />
            </v-card-text>

            <v-card-actions>
                <v-spacer />
                <v-btn text="Cerrar" variant="plain" @click="filterDialog = false" />
                <v-btn color="primary" text="Aplicar" variant="tonal" @click="filterDialog = false" />
            </v-card-actions>
        </v-card>
    </v-dialog>

    <!-- modal eliminar -->
    <v-dialog v-model="supplierDeleteModal" max-width="500">
        <v-card>
            <!-- Título centrado, grande y negro -->
            <v-card-title class="text-h5 font-weight-bold  text-black mb-8">
                Eliminar Proveedor
            </v-card-title>

            <!-- Ícono centrado -->
            <div class="text-center mb-4">
                <v-icon size="100" color="error">mdi-alert-octagon-outline</v-icon>
            </div>

            <!-- Texto descriptivo -->
            <v-card-text class="text-center text-body-2">
                ¿Está seguro que desea eliminar este Proveedor? <br />
                <strong>Esta acción no se puede deshacer.</strong>
            </v-card-text>

            <!-- Botones alineados -->
            <v-card-actions class="justify-end">
                <v-btn text="Cerrar" @click="close"></v-btn>
                <v-btn text="Eliminar" color="error" @click="confirmDelete"></v-btn>
            </v-card-actions>
        </v-card>
    </v-dialog>
    <fab-menu v-model:FormModal="supplierFormModal" v-model:filterDialog="filterDialog" />

</template>

<style scoped></style>
