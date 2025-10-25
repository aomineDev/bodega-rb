<script setup>
import ActionMenu from '@/components/ActionMenu.vue';
import { VDateInput } from 'vuetify/labs/VDateInput'
import { useSnackbar } from '@/stores/snackbar';
import { useValidation } from '@/composables/useFormValidation';
import { ref } from 'vue';

const { showSuccessSnackbar, showWarningSnackbar } = useSnackbar()
const { rules, resetForm } = useValidation()
const categorias = ref(['Enlatados', 'Conservas', 'Carnes'])
const productForm = ref(false)
const productFormModal = ref(false)
const productDetailModal = ref(false)
const product = ref({
    codigoBarra: '',
    nombre: '',
    descripcion: '',
    precioUnitario: '',
    precioPromocion: '',
    inicioPromocion: '',
    finPromocion: '',
    stockActual: '',
    unidadMedida: '',
    imagen: '',
    categoria: '',
    proveedor: ''
})

const producto = ref({
    codigoBarra: '1234567890123',
    nombre: 'Atún en lata',
    descripcion: 'Atún en trozo gloria 170g',
    precioUnitario: 8.50,
    precioPromocion: 6.50,
    inicioPromocion: '2025-10-20',
    finPromocion: '2025-10-31',
    stockActual: 85,
    unidadMedida: 'unidad',
    imagen: '/public/milk.png',
    categoria: 'Conservas',
    proveedor: 'Alicorp'
})
const save = async () => {
    const { valid } = await productForm.value.validate()
    if (!valid) {
        showWarningSnackbar("Datos incorrectos")
        return
    }
    productForm.value = false
    showSuccessSnackbar("Creado exitosamente")
}
const close = () => {
    resetForm(productForm, product)
    productFormModal.value = false
}

function handleAction(type, item) {
    console.log("click aqui")
    if (type == "view") {
        console.log("detail producto" + item.nombre)
        productDetailModal.value = true
    }
    if (type == "edit") {
        console.log("editar " + item.id)
    }
    if (type == "delete") {
        console.log("eliminar " + item.id)
        showSuccessSnackbar("Eliminado correctamente")
    }

}
const productos = [
    {
        nombre: "Atún en aceite",
        precio: 8.5,
        stock: 12,
        imagen: "/public/atun.jpg",
    },
    {
        nombre: "Leche fresca",
        precio: 5.9,
        stock: 0,
        imagen: "/public/milk.png",
    },
    {
        nombre: "Galletas integrales",
        precio: 3.5,
        stock: 5,
        imagen: "/public/galleta.png",
    }, {
        nombre: "Galletas integrales",
        precio: 3.5,
        stock: 5,
        imagen: "/public/galleta.png",
    }, {
        nombre: "Galletas integrales",
        precio: 3.5,
        stock: 5,
        imagen: "/public/galleta.png",
    }, {
        nombre: "Galletas integrales",
        precio: 3.5,
        stock: 5,
        imagen: "/public/galleta.png",
    }, {
        nombre: "Galletas integrales",
        precio: 3.5,
        stock: 5,
        imagen: "/public/galleta.png",
    },
];
</script>
<template>

    <h1>Productos</h1>

    <v-row class="mb-15">
        <v-col cols="12" md="6">
            <v-text-field label="Buscar producto...." prepend-icon="mdi-magnify" variant="underlined"
                hide-details></v-text-field>
        </v-col>
        <v-col cols="12" md="6" lg="4">
            <v-select label="Categoria" variant="underlined" :items="categorias" hide-details></v-select> </v-col>
        <v-col cols="12" md="2" class="d-flex justify-md-end align-center" hide-details>
            <v-btn prepend-icon="mdi-plus" color="primary" @click="productFormModal = true">Crear Producto</v-btn>
        </v-col>

    </v-row>

    <!-- cartas -->
    <v-row>
        <v-col cols="12" sm="6" md="4" lg="3" class="mb-4" v-for="(producto, index) in productos" :key="index">
            <v-card elevation="1" rounded="xl">
                <v-img height="220px" :src="producto.imagen" contain></v-img>
                <v-divider :thickness="3"></v-divider>

                <v-card-title class="d-flex justify-space-between align-center">
                    <span>{{ producto.nombre }}</span>
                    <ActionMenu @action="(type) => handleAction(type, producto)"></ActionMenu>
                </v-card-title>
                <div class="font-weight-bold mx-4">
                    Embasados
                </div>
                <v-card-text class="text-end">
                    <span :class="producto.stock > 0 ? 'text-primary' : 'text-error'" class="font-weight-bold">
                        {{ producto.stock > 0 ? producto.stock + ' Unidades' : 'Agotado' }}
                    </span>
                </v-card-text>
            </v-card>
        </v-col>


    </v-row>

    <!-- modal crear -->
    <v-dialog v-model="productFormModal" max-width="600">
        <v-card title="Crear Producto">

            <v-form ref="productForm" class="pa-3">
                <v-container fluid>
                    <v-row>
                        <!-- imagen -->
                        <v-col cols="12" md="6">
                            <v-file-input label="Imagen" variant="underlined" v-model="product.imagen"
                                :rules="[rules.required]"></v-file-input>
                        </v-col>
                        <!-- codigo de barra -->
                        <v-col cols="12" md="6">
                            <v-text-field label="Codigo de barra" variant="underlined" v-model="product.codigoBarra"
                                :rules="[rules.required]"></v-text-field>
                        </v-col>
                        <!-- nombre -->
                        <v-col cols="12" md="6">
                            <v-text-field label="Nombre" variant="underlined" v-model="product.nombre"
                                :rules="[rules.required]"></v-text-field>
                        </v-col>
                        <!-- categoria -->
                        <v-col cols="12" md="6">
                            <v-select label="Categoria" variant="underlined" :items="categorias"
                                v-model="product.categoria" :rules="[rules.required]"></v-select> </v-col>
                        <!-- descripcion -->
                        <v-col cols="12" md="12">
                            <v-textarea label="Descripcion" variant="underlined" rows="2" auto-grow
                                v-model="product.descripcion" :rules="[rules.required]"></v-textarea>
                        </v-col>
                        <!-- proveedor -->
                        <v-col cols="12" md="6">
                            <v-select label="Proveedor" variant="underlined" :items="categorias"
                                v-model="product.proveedor" :rules=[rules.required]></v-select> </v-col>
                        <!-- precio unitario -->
                        <v-col cols="12" md="6">
                            <v-text-field label="Precio unitario" type="number" variant="underlined"
                                v-model="product.precioUnitario" step="1" :rules="[rules.required]"></v-text-field>
                        </v-col>
                        <!-- precio promociom -->
                        <v-col cols="12" md="6">
                            <v-text-field label="Precio promocion" type="number" variant="underlined"
                                v-model="product.precioPromocion" step="0.01"></v-text-field>
                        </v-col>
                        <!-- stock -->
                        <v-col cols="12" md="6">
                            <v-text-field label="Stock" variant="underlined" v-model="product.stockActual"
                                :rules="[rules.required]"></v-text-field>
                        </v-col>
                        <!-- inicion promocio -->
                        <v-col cols="12" md="6">
                            <v-date-input v-model="product.inicioPromocion" label="Inicio de promocion"
                                variant="underlined"></v-date-input>
                        </v-col>
                        <!-- fin promocion -->
                        <v-col cols="12" md="6">
                            <v-date-input v-model="product.finPromocion" label="Fin de promocion"
                                :rules="[rules.required]" variant="underlined"></v-date-input>
                        </v-col>

                        <!-- unidad de medida -->
                        <v-col cols="12" md="6">
                            <v-select label="Unidad de medidad" variant="underlined" :items="categorias"
                                v-model="product.unidadMedida" :rules=[rules.required]></v-select> </v-col>
                    </v-row>
                </v-container>
            </v-form>

            <v-card-actions>
                <v-spacer />
                <v-btn class="ms-auto" text="Cerrar" @click="close()"></v-btn>
                <v-btn class="ms-auto" text="Crear" variant="tonal" color="primary" @click="save"></v-btn>

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
                            <v-img :src="producto.imagen" contain max-width="100%" height="400"
                                class="product-detail-img"></v-img>
                        </v-card>
                    </v-col>

                    <!-- Columna centro -->
                    <v-col cols="12" md="3">
                        <!-- contenido intacto -->
                        <v-card class=" d-flex flex-column justify-center columna-centra" elevation="0"
                            style="height: 100%">
                            <h2 class="text-h5 font-weight-bold mb-4 text-primary ">
                                {{ producto.nombre }}
                            </h2>

                            <div class="text-subtitle-3 font-weight-bold mb-4 ">
                                Descripción
                            </div>

                            <p class="text-body-2 mb-6 font-weight-bold ">
                                {{ producto.descripcion }}
                            </p>

                            <div class="mb-2 text-subtitle-3 font-weight-bold ">
                                Precio Regular
                            </div>

                            <div class="mb-3 ">
                                <span class="text-h4 font-weight-bold text-primary mr-3">
                                    S/ {{ producto.precioUnitario.toFixed(2) }}
                                </span>
                            </div>

                            <div class="mb-2 text-subtitle-3 font-weight-bold ">
                                Precio Promoción
                            </div>

                            <div class="">
                                <span class="text-h4 font-weight-bold text-success mr-3">
                                    S/ {{ producto.precioPromocion.toFixed(2) }}
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
                                        {{ producto.categoria }}
                                    </v-chip>
                                </v-col>

                                <v-col cols="12" sm="6">
                                    <div class="d-flex align-center mb-3">
                                        <v-icon color="primary" size="20" class="mr-2">mdi-ruler</v-icon>
                                        <span class="text-body-2 font-weight-bold">Unidad de medida</span>
                                    </div>
                                    <v-chip color="teal" variant="tonal" size="default">
                                        {{ producto.unidadMedida }}
                                    </v-chip>
                                </v-col>

                                <v-col cols="12" sm="6">
                                    <div class="d-flex aling-center mb-3">
                                        <v-icon size="20" color="primary" class="mr-2">mdi-package-variant</v-icon>
                                        <span class="text-body-2 font-weight-bold">Stock</span>
                                    </div>
                                    <div>
                                        <v-progress-linear :model-value="(producto.stockActual / 100) * 100"
                                            color="teal" height="30" rounded class="mb-2"></v-progress-linear>
                                        <div class="text-center text-body-2 text-grey-darken-1">
                                            Stock Actual {{ producto.stockActual }} unidades
                                        </div>
                                    </div>
                                </v-col>

                                <v-col cols="12" sm="6">
                                    <div class="d-flex align-center mb-3">
                                        <v-icon color="primary" size="20" class="mr-2">mdi-barcode</v-icon>
                                        <span class="text-body-2 font-weight-bold">Código de barra</span>
                                    </div>
                                    <v-chip color="teal" variant="tonal" size="default">
                                        {{ producto.codigoBarra }}
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
                                        {{ producto.inicioPromocion }}
                                    </div>
                                </v-col>

                                <v-col cols="12" sm="6">
                                    <div class="d-flex align-center mb-3">
                                        <v-icon color="primary" size="20" class="mr-2">mdi-calendar-end</v-icon>
                                        <span class="text-body-2 font-weight-bold">Fin Promoción</span>
                                    </div>
                                    <div class="text-body-3 font-weight-bold mb-3">
                                        {{ producto.finPromocion }}
                                    </div>
                                </v-col>

                                <v-col cols="12" sm="6" class="mt-2">
                                    <div class="d-flex align-center mb-3">
                                        <v-icon color="primary" size="20" class="mr-2">mdi-truck-outline</v-icon>
                                        <span class="text-body-2 font-weight-bold">Proveedor</span>
                                    </div>
                                    <v-chip color="teal" variant="tonal" size="default">
                                        {{ producto.proveedor }}
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


</template>
<style scoped>
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