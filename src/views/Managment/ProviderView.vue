<script setup>
import ActionMenu from '@/components/ActionMenu.vue';

const proveedores = [
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

import { ref } from 'vue'

const dialog = ref(false)
</script>

<template>
    <v-container>
        <h1 class="mb-5">Proveedores</h1>
        <v-row class="align-center">
            <v-col cols="12" md="6">
                <v-text-field density="compact" label="Buscar proveedor.." prepend-icon="mdi-magnify" variant="outlined"
                    hide-details></v-text-field>
            </v-col>

            <v-col cols="12" md="6" class="d-flex justify-md-end">
                <v-btn color="primary" prepend-icon="mdi-plus" @click="dialog = true">
                    Agregar
                </v-btn>
            </v-col>
        </v-row>
        <v-card-text>
            <v-data-table :items="proveedores">
                <template #headers>
                    <tr>
                        <th>Nombre comercial</th>
                        <th>Tipo de contribuyente</th>
                        <th>Actividad economica</th>
                        <th>Razon social</th>
                        <th>Fecha de registro</th>
                        <th>Ruc</th>
                        <th>Direccion</th>
                        <th>telefono</th>
                        <th>Email</th>
                        <th>Accion</th>
                    </tr>
                </template>
                <template #item="{ item }">
                    <tr>
                        <td>{{ item.nombreComercial }}</td>
                        <td>{{ item.tipoContribuyente }}</td>
                        <td>{{ item.actividadEconomica }}</td>
                        <td>{{ item.razonSocial }}</td>
                        <td>{{ item.fechaRegistro }}</td>
                        <td>{{ item.ruc }}</td>
                        <td>{{ item.direccion }}</td>
                        <td>{{ item.telefono }}</td>
                        <td>{{ item.email }}</td>
                        <td>
                            <ActionMenu @action="(type) => handleAction(type, item.id)"></ActionMenu>
                        </td>
                    </tr>
                </template>
            </v-data-table>
        </v-card-text>

        <div class="text-center pa-4">
            <v-dialog v-model="dialog" max-width="500">
                <v-card title="Agregar proveedor">
                    <v-divider></v-divider>

                    <v-form v-model="valid" class="pa-3">
                        <v-container fluid>
                            <v-row>
                                <v-col cols="12" md="6">
                                    <v-text-field label="Razon social" variant="underlined"></v-text-field>
                                </v-col>

                                <v-col cols="12" md="6">
                                    <v-text-field label="Actividad economica" variant="underlined"></v-text-field>
                                </v-col>

                                <v-col cols="12" md="6">
                                    <v-text-field label="Ruc" variant="underlined"></v-text-field>
                                </v-col>

                                <v-col cols="12" md="6">
                                    <v-text-field label="Telefono" variant="underlined"></v-text-field>
                                </v-col>

                                <v-col cols="12" md="6">
                                    <v-text-field label="Email" variant="underlined"></v-text-field>
                                </v-col>

                                <v-col cols="12" md="6">
                                    <v-text-field label="Nombre comercial" variant="underlined"></v-text-field>
                                </v-col>

                                <v-col cols="12" md="6">
                                    <v-text-field label="Tipo contribuyente" variant="underlined"></v-text-field>
                                </v-col>

                                <v-col cols="12" md="6">
                                    <v-text-field label="Direccion" variant="underlined"></v-text-field>
                                </v-col>

                                <v-col cols="12" md="6">
                                    <v-text-field prepend-icon="mdi-calendar-month" label="Fecha de registro"
                                        variant="underlined"></v-text-field>
                                </v-col>
                            </v-row>
                        </v-container>
                    </v-form>

                    <v-divider></v-divider>

                    <template v-slot:actions>
                        <div class="d-flex ga-5">
                            <v-btn class="ms-auto" text="Cerrar" @click="dialog = false"></v-btn>
                            <v-btn class="ms-auto" text="Agregar" color="primary"></v-btn>

                        </div>
                    </template>
                </v-card>
            </v-dialog>
        </div>
    </v-container>

</template>

<style scoped></style>
