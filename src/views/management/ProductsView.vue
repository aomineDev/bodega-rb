<script setup>
import ActionMenu from '@/components/ActionMenu.vue'
import BaseFilter from '@/components/BaseFilter.vue'
import FabMenu from '@/components/FabMenu.vue'
import { VDateInput } from 'vuetify/labs/VDateInput'
import { useSnackbar } from '@/stores/snackbar'
import { computed, reactive, ref, watch } from 'vue'
import { useDisplay } from 'vuetify'
import { useForm } from '@/composables/useForm'
import { useProduct } from '@/composables/query/useProduct'
import { useSupplier } from '@/composables/query/useSupplier'
import { useCategory } from '@/composables/query/useCategory'
import { storageService } from '@/services/storage/imageService'
import { useDateInput } from '@/composables/useDateInput'
//-----------------------------------------------CONSTANTES---------------------------------------//
const { showSuccessSnackbar } = useSnackbar()
const ud = ref(['Unidad', 'Kilogramo', 'Litro'])
const { category } = useCategory()
const { supplier } = useSupplier()

const productFormModal = ref(false)

const { createProductAsync, product, deleteProductAsync, updateProductAsync } = useProduct()

const productDetailModal = ref(false)
const productDeleteModal = ref(false)
const filterDialog = ref(false)
const { mdAndUp, smAndDown } = useDisplay()
const modalTitle = computed(() => (productItem.value ? 'Editar Producto' : 'Crear Producto'))
const actionLabel = computed(() => (productItem.value ? 'Actualizar' : 'Crear'))
const productItem = ref(false)
//-----------------------------------------------ACCIOENS DEL FAB---------------------------------------//
const filtros = reactive({
    categorias: null,
    proveedores: null,
})
//-----------------------------------------------DATA---------------------------------------//

const {
    formRef,
    formData,
    resetForm,
    asignForm,
    rules,
    handleSubmit,
    imagen,
    codigoBarra,
    categoria,
    nombre,
    descripcion,
    proveedor,
    precioUnitario,
    precioPromocion,
    unidadMedida,
    stock,
    inicioPromocion,
    finPromocion,
} = useForm({
    imagen: '',
    codigoBarra: '',
    nombre: '',
    descripcion: '',
    categoria: '',
    proveedor: '',
    precioUnitario: '',
    precioPromocion: '',
    stock: '',
    inicioPromocion: '',
    finPromocion: '',
    unidadMedida: '',
})
const {
    formatDate: formatInicioPromocion,
    inputDate: inputInicioPromocion,
    today
} = useDateInput(inicioPromocion)

const {
    formatDate: formatFinPromocion,
    inputDate: inputFinPromocion
    // No necesitas 'today' otra vez, ya lo tienes arriba
} = useDateInput(finPromocion)

//-----------------------------------------------SUBIDA DE IMAGEN---------------------------------------//

const previewUrl = ref(null)
const onImageChange = (file) => {
    const selectedFile = Array.isArray(file) ? file[0] : file

    if (selectedFile instanceof File) {
        previewUrl.value = URL.createObjectURL(selectedFile)
    } else {
        previewUrl.value = productItem.value?.imagen || null
    }
}

const getImageUrl = async () => {
    if (imagen.value instanceof File) {
        return await storageService.upload('products', imagen.value)
    }
    return productItem.value?.imagen || '/img/default.png'
}
//-----------------------------------------------ABRIR MODALES---------------------------------------//
// abrir modal detalles
const productDetail = ref(false)
//accion detalle
const handleView = (item) => {
    productDetail.value = item
    productDetailModal.value = true
}

//abrir modal editar
const handleEdit = (item) => {
    productItem.value = item
    asignForm(productItem.value)

    productFormModal.value = true
}
const handleOpen = () => {
    productFormModal.value = true
}
//abrir modal eliminar
const deleteModal = (item) => {
    productDeleteModal.value = true
    console.log('card eliminada' + item.id)
}

watch(productFormModal, (isOpen) => {
    if (!isOpen) {
        resetForm()
        productItem.value = null
    }
})
//-----------------------------------------------FILTROS---------------------------------------//
const selectFilter = computed(() => [
    {
        key: 'categorias',
        label: 'Categorias',
        type: 'select',
        model: filtros.categorias,
        items: category.value,
        itemTitle: 'nombre',
        itemValue: 'id',
    },
    {
        key: 'proveedores',
        label: 'Proveedores',
        type: 'select',
        model: filtros.proveedores,
        items: supplier.value,
        itemTitle: 'razonSocial',
        itemValue: 'id',
    },
])

const search = ref('')
const filtroProducto = computed(() => {
    const productos = product.value

    if (!Array.isArray(product.value)) return []

    const query = search.value.trim().toLowerCase()
    const categoriaSeleccionada = filtros.categorias
    const proveedorSeleccionado = filtros.proveedores

    return productos.filter(p => {
        const coincidenciaBusqueda = query ?
            [p.nombre].some(campo => campo?.toLowerCase().includes(query))
            : true

        const coincidenciaCategoria = categoriaSeleccionada ? p.categoria?.id === categoriaSeleccionada : true
        const coincidenciaProveedor = proveedorSeleccionado ? p.proveedor?.id === proveedorSeleccionado : true

        return coincidenciaCategoria && coincidenciaBusqueda && coincidenciaProveedor
    })
})
//-----------------------------------------------ACCIONES---------------------------------------//
//agregar y editar
const handleCreateProduct = async () => {
    try {
        const imagenUrl = await getImageUrl()
        const productData = {
            ...formData.value,
            imagen: imagenUrl,
            proveedor: proveedor.value,
            categoria: categoria.value,
        }

        if (productItem.value) {
            await updateProductAsync({ ...productData, id: productItem.value.id })
            showSuccessSnackbar('Producto editado exitosamente')
        } else {
            await createProductAsync(productData)
            showSuccessSnackbar('Creado exitosamente')
        }

        previewUrl.value = null
        productFormModal.value = false
    } catch (error) {
        console.error('Error:', error)
    }
}

//eliminar
const editingProduct = ref(false)
const confirmDelete = async () => {
    try {
        editingProduct.value = product.value[0]
        await deleteProductAsync(editingProduct.value.id)
        showSuccessSnackbar('Eliminado correctamente')
        productDeleteModal.value = false
    } catch (error) {
        console.log(error)
    }
}
</script>

<template>
    <h1 class="mb-10">Productos</h1>
    <v-card v-if="mdAndUp" elevation="0" class="mb-10 pa-4">
        <v-row>
            <base-filter v-model:search="search" :filters="selectFilter"
                @update:filter="({ key, value }) => (filtros[key] = value)" />

            <v-col cols="12" md="2" class="d-flex justify-md-end align-center" hide-details>
                <v-btn prepend-icon="mdi-plus" color="primary" @click="handleOpen">Crear
                    Producto</v-btn>
            </v-col>
        </v-row>
    </v-card>

    <!-- Si hay datos, muestra los cards -->
    <v-row v-if="filtroProducto.length > 0">
        <v-col v-for="item in filtroProducto" :key="item.id" cols="12" sm="6" md="4" lg="3">
            <v-card v-bind="props" :elevation="isHovering ? 2 : 1" rounded="xl" class="card-hover">
                <v-img height="220px" :src="item.imagen" contain></v-img>
                <v-divider :thickness="3"></v-divider>

                <v-card-title class="d-flex justify-space-between align-center">
                    <span>{{ item.nombre }}</span>
                    <ActionMenu @view="handleView(item)" @edit="handleEdit(item)" @delete="deleteModal(item)" />
                </v-card-title>

                <v-chip class="position-absolute chip-categoria" color="primary" size="default"
                    style="top: 12px; right: 12px; z-index: 1">
                    {{ item.categoria?.nombre }}
                </v-chip>

                <v-card-text class="text-end">
                    <span :class="item.stock > 0 ? 'text-primary' : 'text-error'" class="font-weight-bold">
                        {{ item.stock > 0 ? item.stock + ' Unidades' : 'Sin Stock' }}
                    </span>
                </v-card-text>
            </v-card>
        </v-col>
    </v-row>

    <!-- Si NO hay datos, muestra mensaje -->
    <v-row v-else>
        <v-col cols="12" class="text-center py-16">
            <v-icon size="64" color="grey-lighten-1">mdi-package-variant-closed</v-icon>
            <p class="text-h6 text-grey mt-4">No se encontraron productos</p>

        </v-col>
    </v-row>
    <!-- modal crear -->
    <v-dialog v-model="productFormModal" max-width="600">
        <v-card :title="modalTitle">
            <v-form ref="formRef" class="pa-3">
                <v-container fluid>
                    <v-row>
                        <!-- codigo de barra -->
                        <v-col cols="12" md="6">
                            <v-text-field label="Codigo de barra" variant="underlined" v-model="codigoBarra"
                                :rules="[rules.required]"></v-text-field>
                        </v-col>
                        <!-- nombre -->
                        <v-col cols="12" md="6">
                            <v-text-field label="Nombre" variant="underlined" v-model="nombre"
                                :rules="[rules.required]"></v-text-field>
                        </v-col>
                        <!-- categoria -->
                        <v-col cols="12" md="6">
                            <v-select label="Categoria" variant="underlined" :items="category" v-model="categoria"
                                item-title="nombre" :rules="[rules.required]" return-object item-value="id"></v-select>
                        </v-col>
                        <v-col cols="12" md="6">
                            <v-select label="Proveedor" variant="underlined" :items="supplier" v-model="proveedor"
                                item-title="razonSocial" return-object :rules="[rules.proveedor]"></v-select>
                        </v-col>
                        <!-- descripcion -->
                        <v-col cols="12" md="12">
                            <v-textarea label="Descripcion" variant="underlined" rows="2" auto-grow
                                v-model="descripcion"></v-textarea>
                        </v-col>
                        <!-- precio unitario -->
                        <v-col cols="12" md="6">
                            <v-text-field label="Precio unitario" v-model="precioUnitario" type="number"
                                variant="underlined" step="1" :rules="[rules.required, rules.precio]"
                                prefix="S/ "></v-text-field>
                        </v-col>
                        <!-- precio promociom -->
                        <v-col cols="12" md="6">
                            <v-text-field label="Precio promocion" v-model="precioPromocion" type="number"
                                variant="underlined" step="0.01" prefix="S/ ">
                            </v-text-field>
                        </v-col>
                        <!-- stock -->
                        <v-col cols="12" md="6">
                            <v-text-field label="Stock" variant="underlined" v-model="stock"
                                :rules="[rules.required, rules.stock]">
                            </v-text-field>
                        </v-col>
                        <!-- inicion promocio -->
                        <v-col cols="12" md="6">
                            <v-date-input label="Inicio de promocion" variant="underlined"
                                v-model="inputInicioPromocion" :min="today"
                                :display-format="formatInicioPromocion"></v-date-input>
                        </v-col>
                        <!-- fin promocion -->
                        <v-col cols="12" md="6">
                            <v-date-input v-model="inputFinPromocion" :min="today" label="Fin de promocion"
                                variant="underlined" :display-format="formatFinPromocion"></v-date-input>
                        </v-col>
                        <!-- unidad de medida -->
                        <v-col cols="12" md="6">
                            <v-select label="Unidad de medida" variant="underlined" :items="ud" v-model="unidadMedida"
                                :rules="[rules.unidadMedida]"></v-select></v-col>
                        <v-col cols="12" md="6">
                            <v-file-input label="Imagen" @update:model-value="onImageChange" variant="underlined"
                                v-model="imagen"></v-file-input>
                        </v-col>
                        <v-col cols="12" md="6">
                            <img :src="previewUrl || productItem?.imagen || '/img/image-preview.png'"
                                alt="Vista previa o imagen predeterminada"
                                style="max-width: 100%; border-radius: 8px" />
                        </v-col>
                    </v-row>
                </v-container>
            </v-form>
            <!-- acciones -->
            <v-card-actions>
                <v-spacer />
                <v-btn class="ms-auto" text="Cerrar" @click="productFormModal = false"></v-btn>
                <v-btn class="ms-auto" :text="actionLabel" variant="tonal" color="primary"
                    @click="handleSubmit(handleCreateProduct)"></v-btn>
            </v-card-actions>
        </v-card>
    </v-dialog>

    <!-- modal ver detalle -->
    <v-dialog v-model="productDetailModal" max-width="1100" scrollable>
        <v-card>
            <!-- titulo -->
            <v-card-title class="text-h5 font-weight-bold pa-6 bg-primary text-white title">
                Detalles del Producto
            </v-card-title>

            <v-card-text class="pa-6">
                <v-row class="flex-column flex-md-row">
                    <!-- columna imagen -->
                    <v-col cols="12" md="5" class="d-flex">
                        <v-card class="pa-1 d-flex align-center flex-grow-1" elevation="0">
                            <v-img :src="productDetail.imagen" contain max-width="100%" height="400"
                                class="product-detail-img"></v-img>
                        </v-card>
                    </v-col>

                    <!-- Columna centro -->
                    <v-col cols="12" md="3">
                        <v-card class="d-flex flex-column justify-center align-center pa-5 mt-10 rounded-xl"
                            elevation="3">
                            <h3 class="text-h6 font-weight-bold mb-4 text-primary text-center">
                                Información Producto
                            </h3>
                            <div class="text-subtitle-2 font-weight-bold mb-1 text-secondary">
                                Nombre producto
                            </div>
                            <!-- Nombre -->
                            <h2 class="text-h5 font-weight-bold mb-1 mt-3 text-primary text-center">
                                {{ productDetail.nombre }}
                            </h2>

                            <!-- Descripción -->
                            <div class="text-subtitle-2 font-weight-bold mb-1 text-secondary">Descripción</div>
                            <p class="text-body-2 text-center mb-3 mt-3">
                                {{ productDetail.descripcion }}
                            </p>

                            <!-- Precio Regular -->
                            <div class="text-subtitle-2 font-weight-bold mb-1 text-secondary">Precio Regular</div>
                            <div>
                                <span class="text-h5 font-weight-bold text-primary mb-1 mt-3">
                                    S/ {{ productDetail.precioUnitario }}
                                </span>
                            </div>

                            <!-- Precio Promoción -->
                            <div class="text-subtitle-2 font-weight-bold mb-1 text-secondary">
                                Precio Promocion
                            </div>
                            <div class="mb-4">
                                <div v-if="productDetail.precioPromocion">
                                    <span class="text-h5 font-weight-bold text-success mb-1 mt-3">
                                        S/ {{ productDetail.precioPromocion }}
                                    </span>
                                </div>
                                <div v-else>
                                    <span class="text-h7 font-weight-medium"> Sin Promocion </span>
                                </div>
                            </div>
                        </v-card>
                    </v-col>

                    <!-- columna derecha -->
                    <v-col cols="12" md="4">
                        <!-- Información General -->
                        <v-card class="mb-4 pa-5 columna-general" elevation="3" rounded="xl">
                            <h3 class="text-h6 font-weight-bold mb-4 text-primary">Información General</h3>
                            <v-row>
                                <v-col cols="12" sm="6">
                                    <div class="d-flex align-center mb-3">
                                        <v-icon color="primary" size="20" class="mr-2">mdi-shape-outline</v-icon>
                                        <span class="text-body-2 font-weight-bold">Categoría</span>
                                    </div>

                                    <div class="d-flex justify-center">
                                        <v-chip color="primary" variant="tonal" size="default">
                                            {{ productDetail.categoria.nombre }}
                                        </v-chip>
                                    </div>

                                </v-col>

                                <v-col cols="12" sm="6">
                                    <div class="d-flex align-center mb-3">
                                        <v-icon color="primary" size="20" class="mr-2">mdi-ruler</v-icon>
                                        <span class="text-body-2 font-weight-bold">Unidad de medida</span>
                                    </div>
                                    <div class="d-flex justify-center">
                                        <v-chip color="teal" variant="tonal" size="default">
                                            {{ productDetail.unidadMedida }}
                                        </v-chip>
                                    </div>
                                </v-col>

                                <v-col cols="12" sm="6">
                                    <div class="d-flex aling-center mb-3">
                                        <v-icon size="20" color="primary" class="mr-2">mdi-package-variant</v-icon>
                                        <span class="text-body-2 font-weight-bold">Stock</span>
                                    </div>
                                    <div>
                                        <v-progress-linear :model-value="(productDetail.stock / 100) * 100" color="teal"
                                            height="30" rounded class="mb-2"></v-progress-linear>
                                        <div class="text-center text-body-2 text-grey-darken-1">
                                            Stock Actual {{ productDetail.stock }} unidades
                                        </div>
                                    </div>
                                </v-col>

                                <v-col cols="12" sm="6">
                                    <div class="d-flex align-center mb-3">
                                        <v-icon color="primary" size="20" class="mr-2">mdi-barcode</v-icon>
                                        <span class="text-body-2 font-weight-bold">Código de barra</span>
                                    </div>
                                    <div class="d-flex justify-center">
                                        <v-chip color="teal" variant="tonal" size="default">
                                            {{ productDetail.codigoBarra }}
                                        </v-chip>
                                    </div>

                                </v-col>
                            </v-row>
                        </v-card>

                        <!-- Promoción y Logística -->
                        <v-card class="pa-5 columna-logistica" elevation="3" rounded="xl">
                            <h3 class="text-h6 font-weight-bold mb-4 text-primary">Promoción y Logística</h3>
                            <v-row dense class="mb-4">
                                <v-col cols="12" sm="6">
                                    <div class="d-flex align-center mb-3">
                                        <v-icon color="primary" size="20" class="mr-2">mdi-calendar-start</v-icon>
                                        <span class="text-body-2 font-weight-bold">Inicio Promoción</span>
                                    </div>
                                    <div v-if="productDetail.inicioPromocion"
                                        class="text-body-3 font-weight-bold mb-3 text-center">
                                        {{ formatInicioPromocion(productDetail.inicioPromocion) }}
                                    </div>
                                    <div v-else class="text-body-3 font-weight-medium mb-3 text-center">00-00-00</div>
                                </v-col>

                                <v-col cols="12" sm="6">
                                    <div class="d-flex align-center mb-3">
                                        <v-icon color="primary" size="20" class="mr-2">mdi-calendar-end</v-icon>
                                        <span class="text-body-2 font-weight-bold">Fin Promoción</span>
                                    </div>

                                    <div v-if="productDetail.finPromocion"
                                        class="text-body-3 font-weight-bold mb-3 text-center">
                                        {{ formatFinPromocion(productDetail.finPromocion) }}
                                    </div>

                                    <div v-else class="text-body-3 font-weight-medium mb-3 text-center">00-00-00</div>
                                </v-col>

                                <v-col cols="12" sm="6" class="mt-2">
                                    <div class="d-flex align-center mb-3">
                                        <v-icon color="primary" size="20" class="mr-2">mdi-truck-outline</v-icon>
                                        <span class="text-body-2 font-weight-bold">Proveedor</span>
                                    </div>
                                    <div class="d-flex justify-center">
                                        <v-chip color="teal" variant="tonal" size="default">
                                            {{ productDetail.proveedor.razonSocial }}
                                        </v-chip>
                                    </div>
                                </v-col>
                            </v-row>
                        </v-card>
                    </v-col>
                </v-row>
            </v-card-text>
            <v-divider :thickness="3"></v-divider>
            <v-card-actions class="pa-4 justify-end">
                <v-btn variant="elevated" color="grey-darken-2" @click="productDetailModal = false"
                    prepend-icon="mdi-close" size="large">
                    CERRAR
                </v-btn>
            </v-card-actions>
        </v-card>
    </v-dialog>

    <!-- modal eliminar -->
    <v-dialog v-model="productDeleteModal" max-width="500">
        <v-card>
            <!-- Título centrado, grande y negro -->
            <v-card-title class="text-h5 font-weight-bold text-black mb-8">
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
                <v-btn text="Cerrar" @click="productDeleteModal = false"></v-btn>
                <v-btn text="Eliminar" color="error" @click="confirmDelete"></v-btn>
            </v-card-actions>
        </v-card>
    </v-dialog>
    <!-- Filtro móvil -->
    <v-dialog v-model="filterDialog" max-width="500" v-if="smAndDown">
        <v-card title="Filtrar Productos">
            <v-card-text>
                <base-filter v-model:search="search" :filters="selectFilter"
                    @update:filter="({ key, value }) => (tipoCliente = value)" />
            </v-card-text>

            <v-card-actions>
                <v-spacer />
                <v-btn text="Cerrar" variant="plain" @click="filterDialog = false" />
                <v-btn color="primary" text="Aplicar" variant="tonal" @click="filterDialog = false" />
            </v-card-actions>
        </v-card>
    </v-dialog>

    <fab-menu v-model:FormModal="productFormModal" v-model:filterDialog="filterDialog" />
</template>
<style scoped>
.card-hover {
    transition: all 0.3s ease;
}

.card-hover:hover {
    transform: translateY(-5px);
}

.product-detail-img {
    width: 100%;
}

.title {
    height: 75px;
}

@media (max-width: 345px) {
    .title {
        font-size: 11px;
    }
}
</style>
