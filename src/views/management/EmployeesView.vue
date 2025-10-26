<script setup>
import BaseFilter from '@/components/BaseFilter.vue';
import ActionMenu from '@/components/ActionMenu.vue';
import { computed, ref, watch } from 'vue';
import { reactive } from 'vue';
import { useForm } from '@/composables/useForm';
import FabMenu from '@/components/FabMenu.vue';
import { useDisplay } from 'vuetify/lib/composables/display';


const { mdAndUp, smAndDown } = useDisplay()

const filtros = reactive({
    rol: [],
})
const selectFilter = computed(() => [
    {
        key: 'roles',
        label: 'Roles',
        type: 'select',
        model: filtros.rol
    }
])


const customerEdit = ref(false)
//modla eliminar
const employeeDeleteModal = ref(false)
//modal abrir modal del formumulario
const employeeFormModal = ref(false)
//modal del filtro que se habre en responsive
const filterDialog = ref(false)
//modal ver detalles
const employeeDetailModal = ref(false)
//campos reactvios para el modal creal y editar al mismo tiempo
const modalTitle = computed(() => (customerEdit.value ? 'Editar Empleado' : 'Crear Empleado'))
const actionLabel = computed(() => (customerEdit.value ? 'Actualizar' : 'Crear'))


const roles = ref([
    { id: 1, nombre: 'Encargado de almacen' },
    { id: 2, nombre: 'Cajero' },
    { id: 3, nombre: 'Admininistrador' }
])
const empleado = ref([
    {
        imagen: '/public/emp4.jpg',
        nombre: 'Leonardo',
        apellidoMaterno: 'Alejandro',
        apellidoPaterno: 'Murillo',
        email: 'leoo@gmail.com',
        telefono: '987678654',
        direccion: 'Ate',
        clave: '124',
        fechaNacimiento: '2006-06-19',
        rol: 'Administrador',

    }
])


const handleActionFabMenu = (type) => {

    if (type === 'add') {
        customerEdit.value = false
        employeeFormModal.value = true
    }
    if (type === 'filter') {
        filterDialog.value = true
    }
}

const {
    formData, handleSubmit, formRef,
    resetForm, nombre, apellidoMaterno, apellidoPaterno, email,
    telefono, direccion, clave, imagen, fechaNacimiento, rol, rules
} = useForm({
    nombre: '',
    apellidoMaterno: '',
    apellidoPaterno: '',
    email: '',
    telefono: '',
    direccion: '',
    clave: '',
    imagen: '',
    fechaNacimiento: '',
    rol: '',

})

//vistas boton crear
const handleCreateEmployee = () => {
    employeeFormModal.value = false
    console.log(formData)
    resetForm();
}
//vistas darle al ver detalles
const emp = ref(false)
const handleView = (item) => {
    emp.value = item
    employeeDetailModal.value = true
}
watch(employeeFormModal, (isOpen) => {
    if (!isOpen) resetForm()
})
//vista darle al editar
const handleEdit = (item) => {
    customerEdit.value = true
    employeeFormModal.value = true
    Object.assign(formData.value, item)
    console.log("empleado" + item.nombre)
}
//vista darle al eliminar
const deleteModal = (item) => {
    employeeDeleteModal.value = true
    console.log(item)

}
//vista cerrar modal del formulario 
const closeFormModal = () => {
    employeeFormModal.value = false
    resetForm()
}
//vista cerrar modal eliminar
const close = () => {
    employeeDeleteModal.value = false
}
</script>



<template>
    <h1>Empleados</h1>


    <v-card v-if="mdAndUp" elevation="0" class="mb-10 pa-4">
        <v-row>
            <base-filter v-model:search="search" :filters="selectFilter" @update:filter="({ key, value }) =>
                filtros[key] = value" />
            <v-col cols="12" md="2" class="d-flex justify-md-end align-center" hide-details>
                <v-btn prepend-icon="mdi-plus" color="primary" @click="handleActionFabMenu('add')">Crear
                    Empleado</v-btn>
            </v-col>
        </v-row>
    </v-card>

    <!-- cartas -->
    <v-row>
        <v-col cols="12" sm="6" md="4" lg="3" class="mb-4" v-for="(item, index) in empleado" :key="index">
            <v-hover v-slot="{ isHovering, props }">
                <v-card v-bind="props" :elevation="isHovering ? 5 : 1" rounded="xl" class="card-hover">

                    <v-img height="220px" :src="item.imagen" contain>
                    </v-img>

                    <v-divider :thickness="3"></v-divider>

                    <v-card-title class="d-flex justify-space-between align-center">
                        <span>{{ item.nombre + " " + item.apellidoPaterno }}</span>
                        <ActionMenu @view="handleView(item)" @edit="handleEdit(item)" @delete="deleteModal(item)">
                        </ActionMenu>
                    </v-card-title>

                    <v-chip class="chip-categoria mb-3 mx-3" color="indigo" size="large">
                        {{ item.rol }}
                    </v-chip>
                </v-card>
            </v-hover>
        </v-col>
    </v-row>


    <!-- modal crear -->
    <v-dialog v-model="employeeFormModal" max-width="600">
        <v-card :title="modalTitle">

            <v-form ref="formRef" class="pa-3">
                <v-container fluid>
                    <v-row>
                        <!-- imagen -->
                        <v-col cols="12" md="6">
                            <v-file-input label="Imagen" variant="underlined" v-model="imagen"
                                :rules="[rules.required]"></v-file-input>
                        </v-col>
                        <!-- nombre -->
                        <v-col cols="12" md="6">
                            <v-text-field label="Nombre" variant="underlined" v-model="nombre"
                                :rules="[rules.required]"></v-text-field>
                        </v-col>

                        <!-- apellido paterno -->
                        <v-col cols="12" md="6">
                            <v-text-field label="Apellido Paterno" variant="underlined" v-model="apellidoPaterno"
                                :rules="[rules.required]"></v-text-field>
                        </v-col>
                        <!-- apellido marterno -->
                        <v-col cols="12" md="6">
                            <v-text-field label="Apellido Materno" variant="underlined" v-model="apellidoMaterno"
                                :rules="[rules.required]"></v-text-field>
                        </v-col>
                        <!-- fecha nacimineto -->
                        <v-col cols="12" md="6">
                            <v-date-input v-model="fechaNacimiento" label="Fecha de nacimiento"
                                variant="underlined"></v-date-input>
                        </v-col>

                        <!-- direccion -->
                        <v-col cols="12" md="6">
                            <v-text-field label="Direccion" variant="underlined" v-model="direccion"
                                :rules="[rules.required]"></v-text-field>
                        </v-col>
                        <!-- telefono -->
                        <v-col cols="12" md="6">
                            <v-text-field label="Telefono" variant="underlined" :counter="9" v-model="telefono"
                                :rules="[rules.phone]"></v-text-field>
                        </v-col>
                        <!-- email -->

                        <v-col cols="12" md="6">
                            <v-text-field label="Email" variant="underlined" v-model="email"
                                :rules="[rules.email]"></v-text-field>
                        </v-col>
                        <!-- roles -->
                        <v-col cols="12" md="6">
                            <v-select label="Rol" variant="underlined" :items="roles" v-model="rol" item-title="nombre"
                                item-value="id" :rules=[rules.proveedor]></v-select> </v-col>
                        <v-col cols="12" md="6">
                            <v-text-field label="Clave" variant="underlined" v-model="clave"
                                :rules="[rules.required]"></v-text-field>

                        </v-col>


                    </v-row>
                </v-container>
            </v-form>

            <v-card-actions>
                <v-spacer />
                <v-btn class="ms-auto" text="Cerrar" @click="closeFormModal()"></v-btn>
                <v-btn class="ms-auto" :text="actionLabel" variant="tonal" color="primary"
                    @click="handleSubmit(handleCreateEmployee)"></v-btn>

            </v-card-actions>

        </v-card>
    </v-dialog>
    <!-- modal eliminar -->
    <v-dialog v-model="employeeDeleteModal" max-width="500">
        <v-card>
            <!-- Título centrado, grande y negro -->
            <v-card-title class="text-h5 font-weight-bold  text-black mb-8">
                Eliminar producto
            </v-card-title>

            <!-- Ícono centrado -->
            <div class="text-center mb-4">
                <v-icon size="100" color="error">mdi-alert-octagon-outline</v-icon>
            </div>

            <!-- Texto descriptivo -->
            <v-card-text class="text-center text-body-2">
                ¿Está seguro que desea eliminar este producto? <br />
                <strong>Esta acción no se puede deshacer.</strong>
            </v-card-text>

            <!-- Botones alineados -->
            <v-card-actions class="justify-end">
                <v-btn text="Cerrar" @click="close"></v-btn>
                <v-btn text="Eliminar" color="error" @click="deleteModal"></v-btn>
            </v-card-actions>
        </v-card>
    </v-dialog>
    <!-- Filtro móvil -->
    <v-dialog v-model="filterDialog" max-width="500" v-if="smAndDown">
        <v-card title="Filtrar Empleados">
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


    <!-- modal ver detalle -->
    <v-dialog v-model="employeeDetailModal" max-width="1000" scrollable>
        <v-card>
            <!-- Título -->
            <v-card-title class="text-h5 font-weight-bold pa-6 bg-primary text-white">
                <v-icon class="mr-2" color="white">mdi-account-details</v-icon>
                Detalles del Empleado
            </v-card-title>

            <v-card-text class="pa-6">
                <v-row>
                    <!-- columna imagen -->
                    <v-col cols="12" md="4">
                        <v-card elevation="0" rounded="lg" class="pa-3">
                            <v-img :src="emp.imagen" contain max-width="100%" height="350" class="rounded-lg">
                            </v-img>
                        </v-card>
                    </v-col>

                    <!-- columna informacionn -->
                    <v-col cols="12" md="8">
                        <v-card elevation="3" rounded="xl" class="pa-6">
                            <!-- Nombre Completo -->
                            <div class="mb-6">
                                <div class="d-flex align-center mb-2">
                                    <v-icon color="primary" size="24" class="mr-2">mdi-account-circle</v-icon>
                                    <span class="text-subtitle-1 font-weight-bold text-grey-darken-1">Nombre
                                        Completo</span>
                                </div>
                                <h2 class="text-h5 font-weight-bold text-primary ml-8">
                                    {{ emp.nombre + " " + emp.apellidoPaterno + " " + emp.apellidoMaterno }}
                                </h2>
                            </div>

                            <v-divider class="mb-6"></v-divider>

                            <!-- Grid de Información -->
                            <v-row class="informacion">
                                <!-- Email -->
                                <v-col cols="12" sm="6">
                                    <div class="d-flex align-center mb-2">
                                        <v-icon color="primary" size="22" class="mr-2">mdi-email</v-icon>
                                        <span class="text-body-2 font-weight-bold">Correo Electrónico</span>
                                    </div>
                                    <v-chip color="primary" variant="tonal" size="default" class="ml-8">
                                        {{ emp.email }}
                                    </v-chip>
                                </v-col>

                                <!-- Teléfono -->
                                <v-col cols="12" sm="6">
                                    <div class="d-flex align-center mb-2">
                                        <v-icon color="primary" size="22" class="mr-2">mdi-phone</v-icon>
                                        <span class="text-body-2 font-weight-bold">Teléfono</span>
                                    </div>
                                    <v-chip color="teal" variant="tonal" size="default" class="ml-8">
                                        {{ emp.telefono }}
                                    </v-chip>
                                </v-col>

                                <!-- Rol -->
                                <v-col cols="12" sm="6">
                                    <div class="d-flex align-center mb-2">
                                        <v-icon color="primary" size="22" class="mr-2">mdi-briefcase</v-icon>
                                        <span class="text-body-2 font-weight-bold">Rol / Cargo</span>
                                    </div>
                                    <v-chip color="indigo" variant="tonal" size="default" class="ml-8">
                                        {{ emp.rol }}
                                    </v-chip>
                                </v-col>

                                <!-- Fecha de Nacimiento -->
                                <v-col cols="12" sm="6">
                                    <div class="d-flex align-center mb-2">
                                        <v-icon color="primary" size="22" class="mr-2">mdi-calendar-account</v-icon>
                                        <span class="text-body-2 font-weight-bold">Fecha de Nacimiento</span>
                                    </div>
                                    <div class="text-body-1 font-weight-medium ml-8">
                                        {{ emp.fechaNacimiento }}
                                    </div>
                                </v-col>

                                <!-- Dirección -->
                                <v-col cols="12">
                                    <div class="d-flex align-center mb-2">
                                        <v-icon color="primary" size="22" class="mr-2">mdi-map-marker</v-icon>
                                        <span class="text-body-2 font-weight-bold">Dirección</span>
                                    </div>
                                    <div class="text-body-1 font-weight-medium ml-8">
                                        {{ emp.direccion }}
                                    </div>
                                </v-col>
                            </v-row>
                        </v-card>
                    </v-col>
                </v-row>
            </v-card-text>

            <v-divider :thickness="3"></v-divider>

            <v-card-actions class="pa-4 justify-end">
                <v-btn variant="elevated" color="grey-darken-2" @click="employeeDetailModal = false"
                    prepend-icon="mdi-close" size="large">
                    CERRAR
                </v-btn>
            </v-card-actions>
        </v-card>
    </v-dialog>

    <fab-menu v-model:FormModal="employeeFormModal" v-model:filterDialog="filterDialog" />


</template>

<style scoped>
.card-hover {
    transition: all 0.3s ease;
}

.card-hover:hover {
    transform: translateY(-5px);
}



@media (max-width:600px) {

    .informacion {
        text-align: center;
    }
}
</style>