import { productService } from "@/services/api/productService"
import { useMutation, useQuery, useQueryClient } from '@tanstack/vue-query'
export const useProduct = () => {
    const queryClient = useQueryClient()
    const {
        isPending,
        isError,
        data: product,
        error, } = useQuery({
            queryKey: ['product'],
            queryFn: productService.getAll
        })

    const getQuery = (id) =>
        useQuery({
            queryKey: ['product', id],
            queryFn: () => productService.getById(id.value),
            enabled: !!id.value
        })
    const createMutation = useMutation({
        mutationFn: productService.create,
        onSuccess: () => queryClient.invalidateQueries(['product']),
        onError: (error) => console.log('Error' + error)
    })

    const updateMutation = useMutation({
        mutationFn: productService.update,
        onSuccess: (data, variables) => {
            queryClient.invalidateQueries(['product'])
            queryClient.invalidateQueries(['product', variables.id])
        },
        onError: (error) => console.log('Erorr' + error)
    })
    const deleteMutation = useMutation({
        mutationFn: productService.delete,
        onSuccess: () => queryClient.invalidateQueries(['product']),
        onError: (error) => console.log('Eerror' + error)
    })
    return {
        product,
        isPending,
        isError,
        error,
        getQuery,

        createProduct: createMutation.mutate,
        createProductAsync: createMutation.mutateAsync,
        isCreating: createMutation.isPending,
        createError: createMutation.error,

        updateProduct: updateMutation.mutate,
        updateProductAsync: updateMutation.mutateAsync,
        isUpdating: updateMutation.isPending,
        updateError: updateMutation.error,

        deleteProduct: deleteMutation.mutate,
        deleteProductAsync: deleteMutation.mutateAsync,
        isDeleting: deleteMutation.isPending,
        deleteError: deleteMutation.error




    }
}
