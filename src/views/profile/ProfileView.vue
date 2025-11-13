<script setup>
import { computed, ref, watchEffect } from 'vue'
import { useAuthStore } from '@/stores/auth'
import { useSnackbar } from '@/stores/snackbar'
import { useEmployee } from '@/composables/query/useEmployee'
import { storageService } from '@/services/storage/imageService'
import { useForm } from '@/composables/useForm'
import { formatRol } from '@/utils/formatRol'

const { showSuccessSnackbar, showErrorSnackbar } = useSnackbar()

const auth = useAuthStore()
const { getQuery, updateEmployeeAsync, changePasswordAsync } = useEmployee()

const { data: employee, refetch } = getQuery(computed(() => auth.user?.id))

const rol = computed(() => {
  const nombreRol = auth.user?.rol?.nombre
  return nombreRol ? formatRol(nombreRol) : ''
})

// Formulario de información personal
const {
  formData: empleadoData,
  formRef: empleadoForm,
  handleSubmit: handleEmpleadoSubmit,
  asignForm,
  rules,
  nombre,
  apellidoPaterno,
  apellidoMaterno,
  direccion,
  telefono,
  email,
  fechaNacimiento,
  imagen,
} = useForm({
  nombre: '',
  apellidoPaterno: '',
  apellidoMaterno: '',
  direccion: '',
  telefono: '',
  email: '',
  fechaNacimiento: '',
  imagen: '',
},
  undefined,
  { resetForm: false })

// Formulario de contraseña
const {
  formRef: passwordForm,
  handleSubmit: handlePasswordSubmit,
  rules: passwordRules,
  resetForm,
  currentPassword,
  newPassword,
} = useForm({
  currentPassword: '',
  newPassword: '',
})

// ---- Otros estados ----
const editMode = ref(false)
const previewUrl = ref('/img/default-avatar.png')
const activeSection = ref('info')

// Cuando cambia el empleado, se actualiza el form
watchEffect(() => {
  if (employee.value) {
    asignForm(employee.value)
    previewUrl.value = employee.value.imagen || '/img/default-avatar.png'
  }
})

// ---- Cambio de imagen ----
const onImageChange = (file) => {
  const selected = Array.isArray(file) ? file[0] : file
  if (selected instanceof File) {
    imagen.value = selected
    previewUrl.value = URL.createObjectURL(selected)
  }
}

const getImageUrl = async () => {
  if (imagen.value instanceof File) {
    return await storageService.upload('employees', imagen.value)
  }
  return employee.value?.imagen || '/img/default-avatar.png'
}

// ---- Actualizar empleado ----
const handleUpdateEmployee = async () => {
  try {
    const imagenUrl = await getImageUrl()
    const payload = { ...empleadoData.value, imagen: imagenUrl }
    delete payload.clave

    const updated = await updateEmployeeAsync({ ...payload, id: parseInt(employee.value.id) })
    await refetch()

    asignForm(updated)

    // Actualiza el auth.store
    auth.user = { ...auth.user, nombre: updated.nombre, imagen: updated.imagen }

    showSuccessSnackbar('Perfil actualizado correctamente')
    editMode.value = false
  } catch (e) {
    console.error(e)
    showErrorSnackbar('Error al actualizar perfil')
  }
}

const toggleEdit = () => {
  if (!editMode.value && employee.value) asignForm(employee.value)
  editMode.value = !editMode.value
}

const discardChanges = () => {
  if (employee.value) asignForm(employee.value)
  editMode.value = false
}

// ---- Formulario de contraseña ----
const handleChangePassword = async () => {
  try {
    await changePasswordAsync({
      id: employee.value.id,
      currentPassword: currentPassword.value,
      newPassword: newPassword.value,
    })
    showSuccessSnackbar("Contraseña actualizada correctamente")
    currentPassword.value = ''
    newPassword.value = ''
  } catch (e) {
    console.log(e)
    showErrorSnackbar("Contraseña actual incorrecta")
  }
  resetForm()
}
</script>

<template>
  <v-container fluid class="px-8 py-12">
    <v-row align="stretch" class="g-6">
      <!-- Panel Izquierdo -->
      <v-col cols="12" md="4" lg="3" class="d-flex">
        <v-card rounded="xl" class="pa-8 text-center flex-grow-1 d-flex flex-column justify-space-between">
          <div>
            <div class="position-relative d-inline-block">
              <v-avatar size="120">
                <v-img :src="previewUrl" alt="Perfil" cover />
              </v-avatar>

              <v-btn v-if="editMode" icon="mdi-pencil" size="small" color="primary"
                class="position-absolute bottom-0 end-0" style="transform: translate(25%, 25%)"
                @click="$refs.fileInput.click()" />
              <v-file-input ref="fileInput" accept="image/*" class="d-none" @update:modelValue="onImageChange" />
            </div>

            <h3 class="mt-5 mb-1">{{ employee?.nombre }} {{ employee?.apellidoPaterno }}</h3>
            <p class="text-medium-emphasis mb-6">{{ rol }}</p>

            <v-divider class="my-5" />

            <v-list density="comfortable" nav>
              <v-list-item prepend-icon="mdi-account" title="Información Personal" :active="activeSection === 'info'"
                @click="activeSection = 'info'" />
              <v-list-item prepend-icon="mdi-lock" title="Login & Password" :active="activeSection === 'password'"
                @click="activeSection = 'password'" />
              <v-list-item prepend-icon="mdi-logout" title="Cerrar Sesión" @click="auth.logout()" />
            </v-list>
          </div>
        </v-card>
      </v-col>

      <!-- Formulario -->
      <v-col cols="12" md="8" lg="9" class="d-flex ps-md-6">
        <v-card rounded="xl" class="pa-10 flex-grow-1 d-flex flex-column justify-space-between">

          <!-- FORMULARIO INFO PERSONAL-->
          <div v-if="activeSection === 'info'">
            <h2 class="text-h5 mb-8">Información Personal</h2>

            <v-form ref="empleadoForm">
              <v-row>
                <v-col cols="12" md="6" class="pb-4">
                  <v-text-field v-model="nombre" label="Nombre" :rules="[rules.required, rules.text]"
                    :disabled="!editMode" clearable />
                </v-col>

                <v-col cols="12" md="6" class="pb-4">
                  <v-text-field v-model="apellidoPaterno" label="Apellido Paterno" :rules="[rules.required, rules.text]"
                    :disabled="!editMode" clearable />
                </v-col>

                <v-col cols="12" md="6" class="pb-4">
                  <v-text-field v-model="apellidoMaterno" label="Apellido Materno" :rules="[rules.required, rules.text]"
                    :disabled="!editMode" clearable />
                </v-col>

                <v-col cols="12" md="6" class="pb-4">
                  <v-mask-input label="Teléfono" v-model="telefono" :counter="9" mask="#########" :disabled="!editMode"
                    clearable variant="underlined" :rules="[rules.phone, rules.required]">
                  </v-mask-input>
                </v-col>

                <v-col cols="12" class="pb-4">
                  <v-text-field v-model="email" label="Correo electrónico" :disabled="!editMode" :rules="[rules.email]"
                    clearable />
                </v-col>

                <v-col cols="12" md="6" class="pb-4">
                  <v-text-field v-model="direccion" label="Dirección" :disabled="!editMode" clearable />
                </v-col>

                <v-col cols="12" md="6" class="pb-4">
                  <v-date-input v-model="fechaNacimiento" label="Fecha de Nacimiento" :disabled="!editMode"
                    clearable></v-date-input>
                </v-col>
              </v-row>
            </v-form>

            <!-- Botones centrados -->
            <v-row class="mt-10 justify-center" dense>
              <v-col cols="12" md="5" class="text-center">
                <v-btn v-if="editMode" variant="outlined" color="secondary" class="w-100 py-3" text="Descartar cambios"
                  @click="discardChanges" />
              </v-col>

              <v-col cols="12" md="5" class="text-center">
                <v-btn color="primary" class="w-100 py-3" :text="editMode ? 'Guardar cambios' : 'Editar'"
                  @click="editMode ? handleEmpleadoSubmit(handleUpdateEmployee) : toggleEdit()" />
              </v-col>
            </v-row>
          </div>

          <!-- FORMULARIO LOGIN & PASSWORD -->
          <div v-else-if="activeSection === 'password'">
            <h2 class="text-h5 mb-8">Login & Password</h2>

            <v-form ref="passwordForm">
              <v-row>
                <v-col cols="12" class="pb-4">
                  <v-text-field v-model="currentPassword" label="Contraseña actual" type="password"
                    :rules="[passwordRules.required]" clearable />
                </v-col>

                <v-col cols="12" class="pb-4">
                  <v-text-field v-model="newPassword" label="Nueva contraseña" type="password"
                    :rules="[passwordRules.required, passwordRules.min6]" clearable />
                </v-col>

              </v-row>

              <v-row class="justify-center mt-6">
                <v-col cols="12" md="5" class="text-center">
                  <v-btn color="primary" class="w-100 py-3" text="Actualizar contraseña"
                    @click="handlePasswordSubmit(handleChangePassword)" />
                </v-col>
              </v-row>
            </v-form>
          </div>

        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<style scoped>
.position-relative {
  position: relative;
}

.bottom-0 {
  bottom: 0;
}

.end-0 {
  right: 0;
}

.v-card {
  min-height: 100%;
}
</style>
