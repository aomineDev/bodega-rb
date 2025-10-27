import { supplierService } from "@/services/api/supplierService";
import { useMutation, useQuery, useQueryClient } from '@tanstack/vue-query'
export const useSupplier = () => {

    const queryClient = useQueryClient()
    const {
        isPending, isError, data: supplier, error
    } = useQuery({
        queryKey: ['supplier'],
        queryFn: supplierService.getAll
    })
    const getQuery = (id) =>
        useQuery({
            queryKey: ['supplier', id],
            queryFn: () => supplierService.getById(id.value),
            enabled: !!id.value
        })
    const createMutation = useMutation({
        mutationFn: supplierService.create,
        onSuccess: () => queryClient.invalidateQueries(['supplier']),
        onError: (error) => console.log('Error' + error)
    })

    const updateMutation = useMutation({
        mutationFn: supplierService.update,
        onSuccess: (data, variables) => {
            queryClient.invalidateQueries(['supplier'])
            queryClient.invalidateQueries(['supplier', variables.id])
        },
        onError: (error) => console.log('Erorr' + error)
    })
    const deleteMutation = useMutation({
        mutationFn: supplierService.delete,
        onSuccess: () => queryClient.invalidateQueries(['supplier']),
        onError: (error) => console.log('Eerror' + error)
    })
    return {
        supplier,
        isPending,
        isError,
        error,
        getQuery,

        createSupplier: createMutation.mutate,
        createSupplierAsync: createMutation.mutateAsync,
        isCreating: createMutation.isPending,
        createError: createMutation.error,

        updateSupplier: updateMutation.mutate,
        updateSupplierAsync: updateMutation.mutateAsync,
        isUpdating: updateMutation.isPending,
        updateError: updateMutation.error,

        deleteSupplier: deleteMutation.mutate,
        deleteSupplierAsync: deleteMutation.mutateAsync,
        isDeleting: deleteMutation.isPending,
        deleteError: deleteMutation.error


    }
}