<script setup>
import ActionMenu from '@/components/ActionMenu.vue';

import { VDateInput } from 'vuetify/labs/VDateInput'
import { ref } from 'vue'
import { useSnackbar } from '@/stores/snackbar';
import { useForm } from '@/composables/useForm';

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

const supplierFormModal = ref(false)
const { showSuccessSnackbar } = useSnackbar()
const {
    formRef, resetForm, rules, handleSubmit, nombreComercial
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
const handleCreateSupplier = () => {
    showSuccessSnackbar('Creado exitosamente')
    supplierFormModal.value = false
}
const closeFormModal = () => {
    supplierFormModal.value = false
    resetForm()
}

function handleAction(type, item) {
    console.log("click aqui")
    if (type == "view") {
        console.log("ver detalle " + item.id)
    }
    if (type == "edit") {
        console.log("editar " + item.id)
    }
    if (type == "delete") {
        console.log("eliminar " + item.id)
        showSuccessSnackbar("Eliminado correctamente")
    }

}
</script>

<template>

    <h1 class="mb-5">Proveedores</h1>

    <!-- filter -->
    <v-row class="mb-5">
        <v-col cols="12" md="6">
            <v-text-field density="compact" label="Buscar proveedor.." prepend-icon="mdi-magnify" variant="underlined"
                hide-details></v-text-field>
        </v-col>

        <v-col cols="12" md="6" class="d-flex justify-md-end">
            <v-btn color="primary" prepend-icon="mdi-plus" @click="supplierFormModal = true">
                Crear Proveedor
            </v-btn>
        </v-col>
    </v-row>

    <!-- Tabla -->
    <v-data-table :headers="headers" :items="suppliers">
        <template #[`item.actions`]="{ item }">
            <action-menu @action="(type) => handleAction(type, item)" />
        </template>
    </v-data-table>

    <!-- modal añadir -->
    <v-dialog v-model="supplierFormModal" max-width="600">
        <v-card title="Agregar proveedor">

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
                <v-btn class="ms-auto" text="Crear" variant="tonal" color="primary"
                    @click="handleSubmit(handleCreateSupplier)"></v-btn>

            </v-card-actions>

        </v-card>
    </v-dialog>


</template>

<style scoped></style>
