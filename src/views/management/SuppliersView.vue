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
const {
    createSupplierAsync
} = useSupplier()
//data example
const suppliers = [
    {
        id: 1,
        nombreComercial: 'Comercial Andina S.A.C.',
        tipoContribuyente: 'Persona Jurídica',
        actividadEconomica: 'Venta de productos alimenticios',
        razonSocial: 'Comercial Andina Sociedad Anónima Cerrada',
        fechaRegistro: '2023-05-14',
        ruc: '20123456789',
        direccion: 'Av. Los Olivos 456, Lima',
        telefono: '987654321',
        email: 'contacto@andina.com'
    },
    {
        id: 2,
        nombreComercial: 'Servicios Globales EIRL',
        tipoContribuyente: 'Persona Natural con negocio',
        actividadEconomica: 'Servicios de mantenimiento industrial',
        razonSocial: 'Servicios Globales EIRL',
        fechaRegistro: '2022-08-22',
        ruc: '10456789012',
        direccion: 'Jr. Las Magnolias 120, Trujillo',
        telefono: '956321478',
        email: 'info@globales.com'
    },
    {
        id: 3,
        nombreComercial: 'Panadería El Trigo de Oro',
        tipoContribuyente: 'Persona Natural con negocio',
        actividadEconomica: 'Elaboración y venta de pan',
        razonSocial: 'Panadería El Trigo de Oro',
        fechaRegistro: '2024-01-09',
        ruc: '10234567891',
        direccion: 'Av. Grau 890, Arequipa',
        telefono: '954128963',
        email: 'panaderia@trigodeoro.pe'
    },
    {
        id: 4,
        nombreComercial: 'Importaciones Rivera',
        tipoContribuyente: 'Persona Jurídica',
        actividadEconomica: 'Importación y distribución de textiles',
        razonSocial: 'Importaciones Rivera S.A.C.',
        fechaRegistro: '2023-03-17',
        ruc: '20567891234',
        direccion: 'Calle Lima 321, Chiclayo',
        telefono: '912345678',
        email: 'ventas@rivera.com'
    },
    {
        id: 5,
        nombreComercial: 'TecnoPerú',
        tipoContribuyente: 'Persona Jurídica',
        actividadEconomica: 'Venta de equipos electrónicos',
        razonSocial: 'TecnoPerú S.A.C.',
        fechaRegistro: '2024-06-05',
        ruc: '20654321987',
        direccion: 'Av. Universitaria 900, Lima',
        telefono: '999888777',
        email: 'soporte@tecnoperu.pe'
    }
];
//data header
const headers = [
    { title: 'Nombre comercial', key: 'nombreComercial' },
    { title: 'Tipo de contribuyente', key: 'tipoContribuyente' },
    { title: 'Actividad económica', key: 'actividadEconomica' },
    { title: 'Razón social', key: 'razonSocial' },
    { title: 'Fecha de registro', key: 'fechaRegistro' },
    { title: 'RUC', key: 'ruc' },
    { title: 'Dirección', key: 'direccion' },
    { title: 'Teléfono', key: 'telefono' },
    { title: 'Email', key: 'email' },
    { title: 'Acción', key: 'actions', sortable: false }
]
//actualizar nombre y boton del modal al actualizar
const customerEdit = ref(false)
const modalTitle = computed(() => (customerEdit.value ? 'Editar Proveedor' : 'Crear Proveedor'))
const actionLabel = computed(() => (customerEdit.value ? 'Actualizar' : 'Crear'))


//modales
const supplierFormModal = ref(false)
const filterDialog = ref(false)
const supplierDeleteModal = ref(false)

const {
    formRef, formData, resetForm, rules, handleSubmit, nombreComercial
    , tipoContribuyente, actividadEconomica, razonSocial,
    fechaRegistro, ruc, direccion, telefono, email
} = useForm({
    nombreComercial: '',
    tipoContribuyente: '',
    actividadEconomica: '',
    razonSocial: '',
    fechaRegistro: '',
    ruc: '',
    direccion: '',
    telefono: '',
    email: ''
})
const { mdAndUp, smAndDown } = useDisplay()

const handleActionFabMenu = (type) => {

    if (type === 'add') {
        customerEdit.value = false
        supplierFormModal.value = true
    }
    if (type === 'filter') {
        filterDialog.value = true
    }
}
//eliminar modal
const handleDelete = (item) => {

    supplierDeleteModal.value = true
    console.log("proveedor eliminado con id" + item.nombre)
}
//creare proveedor
const handleCreateSupplier = async () => {
    await createSupplierAsync(formData.value)
    showSuccessSnackbar('Creado exitosamente')
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
    customerEdit.value = true
    supplierFormModal.value = true
    Object.assign(formData.value, item)
}
watch(supplierFormModal, (isOpen) => {
    if (!isOpen) resetForm()
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
    <v-data-table :headers="headers" :items="suppliers">
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
                            <v-text-field label="Ruc" variant="underlined" v-model="ruc"
                                :rules="[rules.ruc]"></v-text-field>
                        </v-col>

                        <v-col cols="12" md="6">
                            <v-text-field label="Telefono" variant="underlined" :counter="9" v-model="telefono"
                                :rules="[rules.phone]"></v-text-field>
                        </v-col>

                        <v-col cols="12" md="6">
                            <v-text-field label="Email" variant="underlined" v-model="email"
                                :rules="[rules.email]"></v-text-field>
                        </v-col>

                        <v-col cols="12" md="6">
                            <v-text-field label="Nombre comercial" variant="underlined" v-model="nombreComercial"
                                :rules="[rules.required]"></v-text-field>
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
                <v-btn text="Eliminar" color="error" @click="deleteModal"></v-btn>
            </v-card-actions>
        </v-card>
    </v-dialog>
    <fab-menu v-model:FormModal="supplierFormModal" v-model:filterDialog="filterDialog" />

</template>

<style scoped></style>
