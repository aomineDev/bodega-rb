import { productEntryService } from '@/services/api/productEntryService'
import { useMutation, useQuery, useQueryClient } from '@tanstack/vue-query'

//crud tanstack
export const useProductEntry = () => {
  const queryClient = useQueryClient()

  const {
    isPending,
    isError,
    data: productEntries,
    error,
  } = useQuery({
    queryKey: ['productEntries'],
    queryFn: productEntryService.getAll,
  })

  const getQuery = (id) =>
    useQuery({
      queryKey: ['productEntry', id],
      queryFn: () => productEntryService.getById(id.value),
      enabled: !!id.value,
    })

  const createMutation = useMutation({
    mutationFn: productEntryService.create,
    onSuccess: () => queryClient.invalidateQueries(['productEntries']),
    onError: (error) => console.log('Error: ' + error),
  })

  const updateMutation = useMutation({
    mutationFn: productEntryService.update,
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries(['productEntries'])
      queryClient.invalidateQueries(['productEntry', variables.id])
    },
    onError: (error) => console.log('Error: ' + error),
  })

  const deleteMutation = useMutation({
    mutationFn: productEntryService.delete,
    onSuccess: () => queryClient.invalidateQueries(['productEntries']),
    onError: (error) => console.log('Error: ' + error),
  })

  return {
    productEntries,
    isPending,
    isError,
    error,
    getQuery,

    createProductEntry: createMutation.mutate,
    createProductEntryAsync: createMutation.mutateAsync,
    isCreating: createMutation.isPending,
    createError: createMutation.error,

    updateProductEntry: updateMutation.mutate,
    updateProductEntryAsync: updateMutation.mutateAsync,
    isUpdating: updateMutation.isPending,
    updateError: updateMutation.error,

    deleteProductEntry: deleteMutation.mutate,
    deleteProductEntryAsync: deleteMutation.mutateAsync,
    isDeleting: deleteMutation.isPending,
    deleteError: deleteMutation.error,
  }
}
