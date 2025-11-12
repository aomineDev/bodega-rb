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
import { useDateInput } from '@/composables/useDateInput';
import { capitalize } from '@/utils/capitalize';
import { useIntegration } from '@/composables/query/useIntegration';
//-----------------------------------------------CONSTANTES---------------------------------------//

const { mdAndUp, smAndDown } = useDisplay()
const { showSuccessSnackbar, showErrorSnackbar, showWarningSnackbar } = useSnackbar()
const {
    employee, createEmployeeAsync, updateEmployeeAsync, deleteEmployeeAsync, isPending
} = useEmployee()
//modal eliminar
const employeeDeleteModal = ref(false)
//modal formulario
const employeeFormModal = ref(false)
//modal del filtro que se habre en responsive
const filterDialog = ref(false)
//modal detalles
const employeeDetailModal = ref(false)
//campos reactivos
const modalTitle = computed(() => (employeeEdit.value ? 'Editar Empleado' : 'Crear Empleado'))
const actionLabel = computed(() => (employeeEdit.value ? 'Actualizar' : 'Crear'))
const employeeEdit = ref(null)

//-----------------------------------------------DATA---------------------------------------//
const {
    formData, handleSubmit, formRef, asignForm,
    resetForm, nombre, apellidoMaterno, apellidoPaterno, email, dni,
    telefono, direccion, clave, imagen, fechaNacimiento, rol, rules
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
    fechaNacimiento: null,
    rol: '',

})
const { formatDate, inputDate, today } = useDateInput(fechaNacimiento)

//-----------------------------------------------SUBIDA DE IMAGEN---------------------------------------//
const previewUrl = ref(null)
//cambio de imagen
const onImageChange = (file) => {
    const selectedFile = Array.isArray(file) ? file[0] : file;

    if (selectedFile instanceof File) {
        previewUrl.value = URL.createObjectURL(selectedFile);
    } else {
        previewUrl.value = employeeEdit.value?.imagen || null;
    }

}
//creaccion de la imagen ala api
const getImageUrl = async () => {
    if (imagen.value instanceof File) {
        return await storageService.upload('employees', imagen.value);
    }
    return employeeEdit.value?.imagen || "/img/default.png";
}

//-----------------------------------------------ABRIR MODALES---------------------------------------//
const emp = ref(false)
const handleView = (item) => {
    emp.value = item
    employeeDetailModal.value = true
}

//abrir modal editar
const handleEdit = (item) => {
    employeeEdit.value = item
    asignForm({
        ...item,
        rol: item.rol ? {
            ...item.rol,
            nombre: formatRoleName(item.rol.nombre)
        } : null
    })
    employeeFormModal.value = true
}

//abrir modal eliminar
const confirmarEliminar = ref(null)
const deleteModal = (item) => {
    employeeDeleteModal.value = true
    confirmarEliminar.value = item.id
}

watch(employeeFormModal, (isOpen) => {
    if (!isOpen) {
        resetForm()
        employeeEdit.value = null
    }
})
//-----------------------------------------------FILTROS---------------------------------------//
const filtros = reactive({
    rol: null,
})
const {
    role
} = useRole()
const formatRoleName = (roleName) => {
    if (!roleName) return ''

    return roleName
        .replace('ROLE_', '')
        .split('_')
        .map(word => capitalize(word))
        .join(' ')
}
const rolesFormateados = computed(() => {
    if (!role.value) return []

    return role.value.map(r => ({
        ...r,
        nombre: formatRoleName(r.nombre)
    }))
})
const selectFilter = computed(() => [
    {
        key: 'rol',
        label: 'Rol',
        type: 'select',
        model: filtros.rol,
        items: rolesFormateados.value,
        itemTitle: 'nombre',
        itemValue: 'id',

    }
])
const search = ref('')

const filtroEmpleado = computed(() => {
    const empleados = employee.value
    if (!Array.isArray(empleados)) return []

    const query = search.value?.trim().toLowerCase()
    const rolSeleccionado = filtros.rol

    return empleados.filter(e => {
        const coincideBusqueda = query
            ? [e.nombre, e.apellidoPaterno, e.dni?.toString()]
                .some(campo => campo?.toLowerCase().includes(query))
            : true

        const coincideRol = rolSeleccionado
            ? e.rol?.id === rolSeleccionado
            : true
        return coincideBusqueda && coincideRol
    })
})
//-----------------------------------------------ACCIONES---------------------------------------//
//agregar y editar
const handleCreateEmployee = async () => {

    try {
        const imagenUrl = await getImageUrl();
        const employeeData = {
            ...formData.value,
            imagen: imagenUrl,
            rol: rol.value
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
//eliminar
const confirmDelete = async () => {
    try {

        await deleteEmployeeAsync(confirmarEliminar.value)
        showSuccessSnackbar("Eliminado correctamente")
        employeeDeleteModal.value = false
    } catch (error) {
        console.log("error" + error)
    }
}
//---------------busqueda------------------------//


const isBuscando = ref(false)
const { getCustomerByDni } = useIntegration()
const { refetch: refetchDni } = getCustomerByDni(dni)
const searchEmployee = async () => {

    if (!dni.value || dni.value.length < 8) {
        showWarningSnackbar('Ingrese un DNI válido')
        return
    }

    const found = employee.value?.find(s => s.dni === dni.value)
    if (found) {
        showWarningSnackbar('El empleado ya existe en la base de datos')
        return
    }

    try {
        isBuscando.value = true
        const result = await refetchDni()

        if (result?.data) {
            const data = result.data

            nombre.value = data.first_name || ''
            apellidoPaterno.value = data.first_last_name || ''
            apellidoMaterno.value = data.second_last_name || ''
            showSuccessSnackbar('Datos obtenidos correctamente')
        } else {
            showErrorSnackbar('No se encontraron datos para este empleado')
        }
    } catch (error) {
        console.error('Error al buscar DNI:', error)
        showErrorSnackbar('Error al consultar DNI')
    } finally {
        isBuscando.value = false
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
            <v-col cols="12" md="2" class="d-flex justify-end align-center" hide-details>
                <v-btn prepend-icon="mdi-plus" color="primary" @click="employeeFormModal = true">Crear
                    Empleado</v-btn>
            </v-col>
        </v-row>
    </v-card>
    <!-- cartas -->

    <v-row v-if="isPending">

        <v-col v-for="n in 6" :key="n" cols="12" sm="6" md="6" lg="4" loading-text="Cargando proveedores...">
            <v-skeleton-loader type="card" />
        </v-col>

    </v-row>

    <v-row v-else>
        <v-col cols="12" sm="6" md="4" lg="3" class="mb-4" v-for="(item, index) in filtroEmpleado" :key="index">
            <v-hover v-slot="{ isHovering, props }">
                <v-card v-bind="props" :elevation="isHovering ? 2 : 1" rounded="xl" class="card-hover"
                    no-data-text="No se encontraron empleados">

                    <v-img height="220px" :src="item.imagen" contain>
                    </v-img>

                    <v-divider :thickness="3"></v-divider>

                    <v-card-title class="d-flex justify-space-between align-center flex-wrap">
                        <span class="format">{{ item.nombre + " " + item.apellidoPaterno }}</span>
                        <ActionMenu @view="handleView(item)" @edit="handleEdit(item)" @delete="deleteModal(item)">
                        </ActionMenu>
                    </v-card-title>

                    <v-chip class="chip-categoria mb-3 mx-3" color="primary" size="large">
                        {{ formatRoleName(item.rol?.nombre ?? "Sin rol") }}
                    </v-chip>
                </v-card>
            </v-hover>
        </v-col>
    </v-row>
    <v-row v-if="!isPending && !filtroEmpleado.length">
        <v-col cols="12" class="text-center">
            <div class="text-center pa-6">
                <v-icon size="48" color="grey-lighten-1">mdi-account-group</v-icon>
                <div class="text-body-1 mt-2 font-weight-medium text-grey-darken-1">
                    No se encontraron empleados
                </div>
                <div class="text-caption text-grey">
                </div>
            </div>
        </v-col>
    </v-row>
    <!-- modal crear -->
    <v-dialog v-model="employeeFormModal" max-width="600">
        <v-card :title="modalTitle">

            <v-form ref="formRef" class="pa-3">
                <v-container fluid>
                    <v-row>
                        <v-col cols="12" md="6">
                            <v-mask-input label="Dni" variant="underlined" v-model="dni"
                                :rules="[rules.required, rules.dni, rules.distinct(employee, 'dni', employeeEdit?.id)]"
                                mask="########" :counter="8">
                                <template #append-inner>
                                    <v-btn icon="mdi-magnify" variant="text" density="compact" @click="searchEmployee()"
                                        :loading="isBuscando" />
                                </template>
                            </v-mask-input>
                        </v-col>
                        <!-- nombre -->
                        <v-col cols="12" md="6">
                            <v-text-field label="Nombre" variant="underlined" v-model="nombre"
                                :rules="[rules.required, rules.text]"></v-text-field>
                        </v-col>

                        <!-- apellido paterno -->
                        <v-col cols="12" md="6">
                            <v-text-field label="Apellido Paterno" variant="underlined" v-model="apellidoPaterno"
                                :rules="[rules.required, rules.text]"></v-text-field>
                        </v-col>
                        <!-- apellido marterno -->
                        <v-col cols="12" md="6">
                            <v-text-field label="Apellido Materno" variant="underlined" v-model="apellidoMaterno"
                                :rules="[rules.required, rules.text]"></v-text-field>
                        </v-col>
                        <!-- fecha nacimineto -->
                        <v-col cols="12" md="6">
                            <v-date-input label="Fecha de nacimiento" variant="underlined" v-model="inputDate"
                                :max="today" :display-format="formatDate" :rules="[rules.required]"></v-date-input>
                        </v-col>


                        <!-- telefono -->

                        <v-col cols="12" md="6">
                            <v-mask-input label="Telefono" variant="underlined" v-model="telefono"
                                :rules="[rules.required, rules.phone, rules.distinct(employee, 'telefono', employeeEdit?.id)]"
                                mask="+51 ### ### ###">
                            </v-mask-input>
                        </v-col>
                        <!-- roles -->
                        <v-col cols="12" md="6">
                            <v-select label="Rol" variant="underlined" :items="rolesFormateados" v-model="rol"
                                item-title="nombre" item-value="id" :rules=[rules.rol] return-object></v-select>
                        </v-col>
                        <v-col cols="12" md="6">
                            <v-text-field label="Clave" variant="underlined" v-model="clave" type="password"
                                :rules="[rules.required, rules.min6]"></v-text-field>

                        </v-col>
                        <v-col cols="12" md="6">
                            <v-text-field label="Direccion" variant="underlined" v-model="direccion"></v-text-field>
                        </v-col>
                        <!-- email -->
                        <v-col cols="12" md="6">
                            <v-text-field label="Email" variant="underlined" v-model="email"
                                :rules="[rules.email, rules.distinct(employee, 'email', employeeEdit?.id)]"></v-text-field>
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
                <v-btn class="ms-auto" text="Cerrar" @click="employeeFormModal = false"></v-btn>
                <v-btn class=" ms-auto" :text="actionLabel" variant="tonal" color="primary"
                    @click="handleSubmit(handleCreateEmployee)"></v-btn>

            </v-card-actions>

        </v-card>
    </v-dialog>
    <!-- modal eliminar -->
    <v-dialog v-model="employeeDeleteModal" max-width="500">
        <v-card>
            <!-- Título centrado, grande y negro -->
            <v-card-title class="text-h5 font-weight-bold  text-black mb-8">
                Eliminar empleado
            </v-card-title>

            <!-- Ícono centrado -->
            <div class="text-center mb-4">
                <v-icon size="100" color="error">mdi-alert-octagon-outline</v-icon>
            </div>

            <!-- Texto descriptivo -->
            <v-card-text class="text-center text-body-2">
                ¿Está seguro que desea eliminar este empleado? <br />
                <strong>Esta acción no se puede deshacer.</strong>
            </v-card-text>

            <!-- Botones alineados -->
            <v-card-actions class="justify-end">
                <v-btn text="Cerrar" @click="employeeDeleteModal = false"></v-btn>
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

                                <!-- Rol -->
                                <v-col cols="12" sm="6">
                                    <div class="d-flex align-center mb-2">
                                        <v-icon color="primary" size="22" class="mr-2">mdi-briefcase</v-icon>
                                        <span class="text-body-2 font-weight-bold">Rol / Cargo</span>
                                    </div>
                                    <v-chip color="indigo" variant="tonal" size="default" class="ml-8">
                                        {{ formatRoleName(emp.rol?.nombre ?? 'Sin rol') }}
                                    </v-chip>
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



                                <!-- Fecha de Nacimiento -->
                                <v-col cols="12" sm="6">
                                    <div class="d-flex align-center mb-2">
                                        <v-icon color="primary" size="22" class="mr-2">mdi-calendar-account</v-icon>
                                        <span class="text-body-2 font-weight-bold">Fecha de Nacimiento</span>
                                    </div>

                                    <div class="text-body-1 font-weight-medium ml-8">
                                        {{ formatDate(emp.fechaNacimiento) }}
                                    </div>
                                </v-col>
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

.format {
    max-width: 70%;
    /* ajusta según tu diseño */
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
}

@media (max-width:600px) {

    .informacion {
        text-align: center;
    }
}
</style>
