<script setup>
import ActionMenu from '@/components/ActionMenu.vue';
import BaseFilter from '@/components/BaseFilter.vue';
import FabMenu from '@/components/FabMenu.vue';
import { VDateInput } from 'vuetify/labs/VDateInput'
import { useSnackbar } from '@/stores/snackbar';
import { computed, reactive, ref, watch } from 'vue';
import { useDisplay } from 'vuetify'
import { useForm } from '@/composables/useForm';
import { useProduct } from '@/composables/query/useProduct';
import { useSupplier } from '@/composables/query/useSupplier';
import { useCategory } from '@/composables/query/useCategory';
import { storageService } from '@/services/storage/imageService';
const { showSuccessSnackbar } = useSnackbar()

const ud = ref([
    'Unidad',
    'Kilogramo',
    'Litro',
    'Caja'
])


const { category } = useCategory()

const productFormModal = ref(false)
const productDetailModal = ref(false)
const productDeleteModal = ref(false)
const filterDialog = ref(false)
const { mdAndUp, smAndDown } = useDisplay()
// const product = ref(false)
const customerEdit = ref(false)
const modalTitle = computed(() => (customerEdit.value ? 'Editar Producto' : 'Crear Producto'))
const actionLabel = computed(() => (customerEdit.value ? 'Actualizar' : 'Crear'))

const { formRef, formData, resetForm, rules, handleSubmit, imagen, codigoBarra, categoria, nombre, descripcion, proveedor, precioUnitario, precioPromocion, unidadMedida,
    stock, inicioPromocion, finPromocion
} = useForm({
    imagen: '', codigoBarra: '', nombre: '',
    descripcion: '', categoria: '', proveedor: '',
    precioUnitario: '', precioPromocion: '', stock: '',
    inicioPromocion: '', finPromocion: '', unidadMedida: ''
})

const handleActionFabMenu = (type) => {
    if (type === 'add') {
        customerEdit.value = false
        productFormModal.value = true

    }
    if (type === 'filter') filterDialog.value = true
}
const filtros = reactive({
    categorias: [],
    proveedores: []
})

const selectFilter = computed(() => [
    {
        key: 'categorias',
        label: 'Categoria',
        type: 'select',
        model: filtros.categorias
    }, {
        key: 'proveedores',
        label: "Proveedor",
        type: "select",
        model: filtros.proveedores
    }
])
// const producto = ref([
//     {
//         id: 1,
//         codigoBarra: '1234567890123',
//         nombre: 'Leche gloria',
//         descripcion: 'Leche de toro',
//         precioUnitario: 8.50,
//         precioPromocion: 6.50,
//         inicioPromocion: '2025-10-20',
//         finPromocion: '2025-10-31',
//         stockActual: 85,
//         unidadMedida: 'unidad',
//         imagen: '/public/milk.png',
//         categoria: 'Conservas',
//         proveedor: 'Alicorp'
//     },
//     {
//         id: 2,
//         codigoBarra: '9876543210987',
//         nombre: 'Atun',
//         descripcion: 'Atun en aceite',
//         precioUnitario: 7.50,
//         precioPromocion: 3.50,
//         inicioPromocion: '2025-10-20',
//         finPromocion: '2025-10-31',
//         stockActual: 20,
//         unidadMedida: 'unidad',
//         imagen: '/public/atun.jpg',
//         categoria: 'Conservas',
//         proveedor: 'Alicorp'
//     }, {
//         id: 3,
//         codigoBarra: '9876543210987',
//         nombre: 'Galletas integrales',
//         descripcion: 'Galletas integrales de trigo',
//         precioUnitario: 5.50,
//         precioPromocion: 3.50,
//         inicioPromocion: '2025-10-20',
//         finPromocion: '2025-10-31',
//         stockActual: 5,
//         unidadMedida: 'unidad',
//         imagen: '/public/galleta.png',
//         categoria: 'Conservas',
//         proveedor: 'Alicorp'
//     }
// ])
//servicios
const {

    createProductAsync, product, deleteProductAsync
} = useProduct()

const {
    supplier
} = useSupplier()
//cerrar modal
const closeFormModal = () => {
    productFormModal.value = false
    resetForm()
}
//accion eliminar
const deleteModal = (item) => {
    productDeleteModal.value = true
    console.log("card eliminada" + item.id)

}
const productDetail = ref(false)
//accion detalle
const handleView = (item) => {
    productDetail.value = item
    productDetailModal.value = true
}
//accion editar
const handleEdit = (item) => {
    customerEdit.value = true
    productFormModal.value = true
    console.log("edit product" + item.id)
    Object.assign(formData.value, item)

}
watch(productFormModal, (isOpen) => {
    if (!isOpen) resetForm()
})

//accion crear
const handleCreateProduct = async () => {


    const imagenUrl = await storageService.upload('products', imagen.value)
    const data = {
        ...formData.value, imagen: imagenUrl, proveedor: proveedor.value,
        categoria: categoria.value

    }
    await createProductAsync(data)
    showSuccessSnackbar("Creado exieto")

    //console.log(JSON.stringify(data))
    //showSuccessSnackbar('Creado exitosamente')

    productFormModal.value = false
}

//accion eliminar
const editingProduct = ref(false)
const confirmDelete = async () => {
    try {
        editingProduct.value = product.value[0]
        await deleteProductAsync(editingProduct.value.id)
        showSuccessSnackbar("Eliminado correctamente")
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
            <base-filter v-model:search="search" :filters="selectFilter" @update:filter="({ key, value }) =>
                filtros[key] = value" />

            <v-col cols="12" md="2" class="d-flex justify-md-end align-center" hide-details>
                <v-btn prepend-icon="mdi-plus" color="primary" @click="handleActionFabMenu('add')">Crear
                    Producto</v-btn>
            </v-col>

        </v-row>
    </v-card>


    <!-- cartas -->
    <v-row>
        <v-col cols="12" sm="6" md="4" lg="3" class="mb-4" v-for="(item, index) in product" :key="index">
            <v-hover v-slot="{ isHovering, props }">
                <v-card v-bind="props" :elevation="isHovering ? 8 : 1" rounded="xl" class="card-hover">
                    <v-img height="220px" :src="item.imagen" contain></v-img>
                    <v-divider :thickness="3"></v-divider>

                    <v-card-title class="d-flex justify-space-between align-center">
                        <span>{{ item.nombre }}</span>
                        <ActionMenu @view="handleView(item)" @edit="handleEdit(item)" @delete="deleteModal(item)">
                        </ActionMenu>
                    </v-card-title>

                    <v-chip class="position-absolute chip-categoria" color="primary" size="default"
                        style="top: 12px; right: 12px; z-index: 1">
                        {{ item.categoria?.nombre }}
                    </v-chip>
                    <v-card-text class="text-end">
                        <span :class="item.stock > 0 ? 'text-primary' : 'text-error'" class="font-weight-bold">
                            {{ item.stock > 0 ? item.stock + ' Unidades' : 'Agotado' }}
                        </span>
                    </v-card-text>
                </v-card>
            </v-hover>


        </v-col>


    </v-row>
    <!-- modal crear -->
    <v-dialog v-model="productFormModal" max-width="600">
        <v-card :title="modalTitle">

            <v-form ref="formRef" class="pa-3">
                <v-container fluid>
                    <v-row>
                        <!-- imagen -->
                        <v-col cols="12" md="6">
                            <v-file-input label="Imagen" variant="underlined" v-model="imagen"
                                :rules="[rules.required]"></v-file-input>
                        </v-col>
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
                                item-title="nombre" return-object item-value="id" :rules="[rules.categoria]"></v-select>
                        </v-col>
                        <!-- descripcion -->
                        <v-col cols="12" md="12">
                            <v-textarea label="Descripcion" variant="underlined" rows="2" auto-grow
                                v-model="descripcion" :rules="[rules.required]"></v-textarea>
                        </v-col>
                        <!-- proveedor -->
                        <v-col cols="12" md="6">
                            <v-select label="Proveedor" variant="underlined" :items="supplier" v-model="proveedor"
                                item-title="razonSocial" return-object :rules=[rules.proveedor]></v-select>
                        </v-col>
                        <!-- precio unitario -->
                        <v-col cols="12" md="6">
                            <v-text-field label="Precio unitario" type="number" variant="underlined"
                                v-model="precioUnitario" step="1" :rules="[rules.precio]"></v-text-field>
                        </v-col>
                        <!-- precio promociom -->
                        <v-col cols="12" md="6">
                            <v-text-field label="Precio promocion" type="number" variant="underlined"
                                v-model="precioPromocion" step="0.01"></v-text-field>
                        </v-col>
                        <!-- stock -->
                        <v-col cols="12" md="6">
                            <v-text-field label="Stock" variant="underlined" v-model="stock"
                                :rules="[rules.cantidad]"></v-text-field>
                        </v-col>
                        <!-- inicion promocio -->
                        <v-col cols="12" md="6">
                            <v-date-input v-model="inicioPromocion" label="Inicio de promocion"
                                variant="underlined"></v-date-input>
                        </v-col>
                        <!-- fin promocion -->
                        <v-col cols="12" md="6">
                            <v-date-input v-model="finPromocion" label="Fin de promocion"
                                variant="underlined"></v-date-input>
                        </v-col>

                        <!-- unidad de medida -->
                        <v-col cols="12" md="6">
                            <v-select label="Unidad de medidad" variant="underlined" :items="ud" v-model="unidadMedida"
                                :rules="[rules.unidadMedida]"></v-select> </v-col>
                    </v-row>
                </v-container>
            </v-form>

            <v-card-actions>
                <v-spacer />
                <v-btn class="ms-auto" text="Cerrar" @click="closeFormModal()"></v-btn>
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
                        <!-- contenido intacto -->
                        <v-card class=" d-flex flex-column justify-center columna-centra" elevation="0"
                            style="height: 100%">
                            <h2 class="text-h5 font-weight-bold mb-4 text-primary ">
                                {{ productDetail.nombre }}
                            </h2>

                            <div class="text-subtitle-3 font-weight-bold mb-4 ">
                                Descripción
                            </div>

                            <p class="text-body-2 mb-6 font-weight-bold ">
                                {{ productDetail.descripcion }}
                            </p>

                            <div class="mb-2 text-subtitle-3 font-weight-bold ">
                                Precio Regular
                            </div>

                            <div class="mb-3 ">
                                <span class="text-h4 font-weight-bold text-primary mr-3">
                                    S/ {{ productDetail.precioUnitario }}
                                </span>
                            </div>

                            <div class="mb-2 text-subtitle-3 font-weight-bold ">
                                Precio Promoción
                            </div>

                            <div class="">
                                <span class="text-h4 font-weight-bold text-success mr-3">
                                    S/ {{ productDetail.precioPromocion }}
                                </span>
                                <!-- <v-chip color="success" size="small" class="font-weight-bold">
                                    OFERTA
                                </v-chip> -->
                            </div>
                        </v-card>
                    </v-col>

                    <!-- columna derecha -->
                    <v-col cols="12" md="4">
                        <!-- Información General -->
                        <v-card class="mb-4 pa-5 columna-general" elevation="3" rounded="xl">
                            <h3 class="text-h6 font-weight-bold mb-4 text-primary">
                                Información General
                            </h3>
                            <v-row>
                                <v-col cols="12" sm="6">
                                    <div class="d-flex align-center mb-3">
                                        <v-icon color="primary" size="20" class="mr-2">mdi-shape-outline</v-icon>
                                        <span class="text-body-2 font-weight-bold">Categoría</span>
                                    </div>
                                    <v-chip color="primary" variant="tonal" size="default">
                                        {{ productDetail.categoria.nombre }}
                                    </v-chip>
                                </v-col>

                                <v-col cols="12" sm="6">
                                    <div class="d-flex align-center mb-3">
                                        <v-icon color="primary" size="20" class="mr-2">mdi-ruler</v-icon>
                                        <span class="text-body-2 font-weight-bold">Unidad de medida</span>
                                    </div>
                                    <v-chip color="teal" variant="tonal" size="default">
                                        {{ productDetail.unidadMedida }}
                                    </v-chip>
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
                                    <v-chip color="teal" variant="tonal" size="default">
                                        {{ productDetail.codigoBarra }}
                                    </v-chip>
                                </v-col>
                            </v-row>
                        </v-card>

                        <!-- Promoción y Logística -->
                        <v-card class="pa-5 columna-logistica" elevation="3" rounded="xl">
                            <h3 class="text-h6 font-weight-bold mb-4 text-primary">
                                Promoción y Logística
                            </h3>
                            <v-row dense class="mb-4">
                                <v-col cols="12" sm="6">
                                    <div class="d-flex align-center mb-3">
                                        <v-icon color="primary" size="20" class="mr-2">mdi-calendar-start</v-icon>
                                        <span class="text-body-2 font-weight-bold">Inicio Promoción</span>
                                    </div>
                                    <div class="text-body-3 font-weight-bold mb-3">
                                        {{ productDetail.inicioPromocion }}
                                    </div>
                                </v-col>

                                <v-col cols="12" sm="6">
                                    <div class="d-flex align-center mb-3">
                                        <v-icon color="primary" size="20" class="mr-2">mdi-calendar-end</v-icon>
                                        <span class="text-body-2 font-weight-bold">Fin Promoción</span>
                                    </div>
                                    <div class="text-body-3 font-weight-bold mb-3">
                                        {{ productDetail.finPromocion }}
                                    </div>
                                </v-col>

                                <v-col cols="12" sm="6" class="mt-2">
                                    <div class="d-flex align-center mb-3">
                                        <v-icon color="primary" size="20" class="mr-2">mdi-truck-outline</v-icon>
                                        <span class="text-body-2 font-weight-bold">Proveedor</span>
                                    </div>
                                    <v-chip color="teal" variant="tonal" size="default">
                                        {{ productDetail.proveedor.razonSocial }}
                                    </v-chip>
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
                <v-btn text="Cerrar" @click="close()"></v-btn>
                <v-btn text="Eliminar" color="error" @click="confirmDelete"></v-btn>
            </v-card-actions>
        </v-card>
    </v-dialog>
    <!-- Filtro móvil -->
    <v-dialog v-model="filterDialog" max-width="500" v-if="smAndDown">
        <v-card title="Filtrar Productos">
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

@media (max-width:345px) {
    .title {
        font-size: 11px;
    }
}

@media (max-width:600px) {

    .columna-general,
    .columna-logistica {
        text-align: center;
    }
}

@media (max-width:959px) {
    .columna-centra {

        text-align: center;
    }

}
</style>
