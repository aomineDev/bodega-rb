<script setup>
import BaseFilter from '@/components/BaseFilter.vue';
import ActionMenu from '@/components/ActionMenu.vue';
import { computed, ref, watch } from 'vue';
import { reactive } from 'vue';
import { VDateInput } from 'vuetify/labs/VDateInput'

import { useForm } from '@/composables/useForm';
import FabMenu from '@/components/FabMenu.vue';
import { useDisplay } from 'vuetify/lib/composables/display';
import { useRole } from '@/composables/query/useRole';
import { useEmployee } from '@/composables/query/useEmployee';
import { storageService } from '@/services/storage/imageService';
import { useSnackbar } from '@/stores/snackbar';
const { mdAndUp, smAndDown } = useDisplay()
const { showSuccessSnackbar } = useSnackbar()
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

const {
    role
} = useRole()

const {
    employee, createEmployeeAsync, updateEmployeeAsync, deleteEmployeeAsync
} = useEmployee()

//modla eliminar
const employeeDeleteModal = ref(false)
//modal abrir modal del formumulario
const employeeFormModal = ref(false)
//modal del filtro que se habre en responsive
const filterDialog = ref(false)
//modal ver detalles
const employeeDetailModal = ref(false)
//campos reactvios para el modal creal y editar al mismo tiempo
const modalTitle = computed(() => (employeeEdit.value ? 'Editar Empleado' : 'Crear Empleado'))
const actionLabel = computed(() => (employeeEdit.value ? 'Actualizar' : 'Crear'))
const employeeEdit = ref(null)

const handleActionFabMenu = (type) => {

    if (type === 'add') {
        employeeEdit.value = false
        employeeFormModal.value = true
    }
    if (type === 'filter') {
        filterDialog.value = true
    }
}

const {
    formData, handleSubmit, formRef, asignForm,
    resetForm, nombre, apellidoMaterno, apellidoPaterno, email, dni,
    telefono, direccion, clave, imagen, fechaNacimiento, rolId, rules
} = useForm({
    nombre: '',
    apellidoMaterno: '',
    apellidoPaterno: '',
    email: '',
    dni: '',
    telefono: '',
    direccion: '',
    clave: '',
    imagen: '',
    fechaNacimiento: '',
    rolId: '',

})
const previewUrl = ref(null)

const onImageChange = (file) => {
    const selectedFile = Array.isArray(file) ? file[0] : file;

    if (selectedFile instanceof File) {
        previewUrl.value = URL.createObjectURL(selectedFile);
    } else {
        previewUrl.value = employeeEdit.value?.imagen || null;
    }

}

const getImageUrl = async () => {
    if (imagen.value instanceof File) {
        return await storageService.upload('employees', imagen.value);
    }
    return employeeEdit.value?.imagen || "/img/default.png";
}
//vistas boton crear y editar

const handleCreateEmployee = async () => {

    try {
        const imagenUrl = await getImageUrl();
        const employeeData = {
            ...formData.value,
            imagen: imagenUrl,
            rolId: rolId.value
        }
        if (employeeEdit.value) {
            await updateEmployeeAsync({ ...employeeData, id: employeeEdit.value.id })
            showSuccessSnackbar("Actualizado")
        } else {
            await createEmployeeAsync(employeeData)
            showSuccessSnackbar("Creado correctamente")
        }
        previewUrl.value = null
        employeeFormModal.value = false
    } catch (error) {
        console.log(error)
    }
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
    employeeEdit.value = item
    asignForm(employeeEdit.value)
    employeeFormModal.value = true
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

const deleteEmploye = ref(false)
const confirmDelete = async () => {
    try {
        deleteEmploye.value = employee.value[0]

        await deleteEmployeeAsync(deleteEmploye.value.id)
        showSuccessSnackbar("Eliminado correctamente")
        employeeDeleteModal.value = false
    } catch (error) {
        console.log("error" + error)
    }
}

</script>



<template>
    <h1>Empleados</h1>
    <!-- filtros -->
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
        <v-col cols="12" sm="6" md="4" lg="3" class="mb-4" v-for="(item, index) in employee" :key="index">
            <v-hover v-slot="{ isHovering, props }">
                <v-card v-bind="props" :elevation="isHovering ? 2 : 1" rounded="xl" class="card-hover">

                    <v-img height="220px" :src="item.imagen" contain>
                    </v-img>

                    <v-divider :thickness="3"></v-divider>

                    <v-card-title class="d-flex justify-space-between align-center">
                        <span>{{ item.nombre + " " + item.apellidoPaterno }}</span>
                        <ActionMenu @view="handleView(item)" @edit="handleEdit(item)" @delete="deleteModal(item)">
                        </ActionMenu>
                    </v-card-title>

                    <v-chip class="chip-categoria mb-3 mx-3" color="indigo" size="large">
                        {{ item.rolId?.nombre }}
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
                            <v-date-input label="Fecha de nacimiento" variant="underlined" v-model="fechaNacimiento"
                                :rules="[rules.required]"></v-date-input>
                        </v-col>

                        <!-- direccion -->
                        <v-col cols="12" md="6">
                            <v-text-field label="Direccion" variant="underlined" v-model="direccion"
                                :rules="[rules.required]"></v-text-field>
                        </v-col>
                        <!-- telefono -->

                        <v-col cols="12" md="6">
                            <v-mask-input label="Telefono" variant="underlined" v-model="telefono"
                                :rules="[rules.required, rules.phone, rules.distinct(employee, 'telefono', employeeEdit?.id)]"
                                mask="+51 ### ### ###">
                            </v-mask-input>
                        </v-col>

                        <!-- email -->
                        <v-col cols="12" md="6">
                            <v-text-field label="Email" variant="underlined" v-model="email"
                                :rules="[rules.required, rules.email, rules.distinct(employee, 'email', employeeEdit?.id)]"></v-text-field>
                        </v-col>
                        <!-- roles -->
                        <v-col cols="12" md="6">
                            <v-select label="Rol" variant="underlined" :items="role" v-model="rolId" item-title="nombre"
                                return-object :rules=[rules.rol]></v-select> </v-col>
                        <v-col cols="12" md="6">
                            <v-text-field label="Clave" variant="underlined" v-model="clave" type="password"
                                :rules="[rules.required]"></v-text-field>

                        </v-col>
                        <v-col cols="12" md="6">
                            <v-mask-input label="Dni" variant="underlined" v-model="dni"
                                :rules="[rules.required, rules.distinct(employee, 'dni', employeeEdit?.id)]"
                                mask="########">
                            </v-mask-input>
                        </v-col>
                        <v-col cols="12" md="6">
                            <v-file-input label="Imagen" variant="underlined" @update:model-value="onImageChange"
                                v-model="imagen"></v-file-input>
                        </v-col>
                        <v-col cols="12" md="6">
                            <img :src="previewUrl || employeeEdit?.imagen || '/img/image-preview.png'"
                                alt="Vista previa o imagen predeterminada"
                                style="max-width: 100%; border-radius: 8px;" />
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
                <v-btn text="Eliminar" color="error" @click="confirmDelete"></v-btn>
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
                                        {{ emp.rolId.nombre }}
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
                                <v-col cols="12" sm="6">
                                    <div class="d-flex align-center mb-2">
                                        <v-icon color="primary" size="22" class="mr-2">mdi-map-marker</v-icon>
                                        <span class="text-body-2 font-weight-bold">Dirección</span>
                                    </div>
                                    <div class="text-body-1 font-weight-medium ml-8">
                                        {{ emp.direccion }}
                                    </div>
                                </v-col>
                                <!-- dni -->
                                <v-col cols="12" sm="6">
                                    <div class="d-flex align-center mb-2">
                                        <v-icon color="primary" size="22" class="mr-2">mdi-card-account-details</v-icon>
                                        <span class="text-body-2 font-weight-bold">Dni</span>
                                    </div>
                                    <div class="text-body-1 font-weight-medium ml-8">
                                        {{ emp.dni }}
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