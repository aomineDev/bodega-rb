import { inventoryService } from '@/services/api/inventoryService'
import { useMutation, useQuery, useQueryClient } from '@tanstack/vue-query'
import { computed } from 'vue'

export const useInventory = () => {
  const queryClient = useQueryClient()

  const {
    isPending,
    isError,
    data: inventoryList,
    error,
  } = useQuery({
    queryKey: ['inventories'],
    queryFn: inventoryService.getAll,
  })

  const getInventoryById = (id) =>
    useQuery({
      queryKey: ['inventory', id],
      queryFn: () => inventoryService.getById(id.value),
      enabled: computed(() => !!id.value),
    })

  const createMutation = useMutation({
    mutationFn: inventoryService.create,
    onSuccess: () => queryClient.invalidateQueries(['inventories']),
    onError: (error) => console.log('Error: ' + error),
  })

  const updateMutation = useMutation({
    mutationFn: inventoryService.update,
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries(['inventories'])
      queryClient.invalidateQueries(['inventory', variables.id])
    },
    onError: (error) => console.log('Error: ' + error),
  })

  const deleteMutation = useMutation({
    mutationFn: inventoryService.delete,
    onSuccess: () => queryClient.invalidateQueries(['inventories']),
    onError: (error) => console.log('Error: ' + error),
  })

  return {
    inventoryList,
    isPending,
    isError,
    error,
    getInventoryById,

    createInventory: createMutation.mutate,
    createInventoryAsync: createMutation.mutateAsync,
    isCreating: createMutation.isPending,
    createError: createMutation.error,

    updateInventory: updateMutation.mutate,
    updateInventoryAsync: updateMutation.mutateAsync,
    isUpdating: updateMutation.isPending,
    updateError: updateMutation.error,

    deleteInventory: deleteMutation.mutate,
    deleteInventoryAsync: deleteMutation.mutateAsync,
    isDeleting: deleteMutation.isPending,
    deleteError: deleteMutation.error,
  }
}
