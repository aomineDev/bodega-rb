import { inventoryService } from '@/services/api/inventoryService'
import { useMutation, useQuery, useQueryClient } from '@tanstack/vue-query'

export const useInventory = () => {
  const queryClient = useQueryClient()

  const getInventoryList = () =>
    useQuery({
      queryKey: ['inventoryList'],
      queryFn: inventoryService.getAll,
    })

  const getInventoryById = (id) =>
    useQuery({
      queryKey: ['inventory', id],
      queryFn: () => inventoryService.getById(id),
      retry: false,
    })

  const getOpenInventoryList = () =>
    useQuery({
      queryKey: ['openInventoryList'],
      queryFn: () => inventoryService.getAllByState(true),
    })

  const getCloseInventoryList = () =>
    useQuery({
      queryKey: ['closeInventoryList'],
      queryFn: () => inventoryService.getAllByState(false),
    })

  const createMutation = useMutation({
    mutationFn: inventoryService.create,
    onSuccess: () =>
      queryClient.invalidateQueries(['inventoryList', 'openInventoryList', 'closeInventoryList']),
    onError: (error) => console.log('Error: ' + error),
  })

  const updateMutation = useMutation({
    mutationFn: inventoryService.updateById,
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries(['inventoryList', 'openInventoryList', 'closeInventoryList'])
      queryClient.invalidateQueries(['inventory', variables.id])
    },
    onError: (error) => console.log('Error: ' + error),
  })

  const addAssistantMutation = useMutation({
    mutationFn: inventoryService.addAssistantById,
    onSuccess: () =>
      queryClient.invalidateQueries(['inventoryList', 'openInventoryList', 'closeInventoryList']),
    onError: (error) => console.log('Error: ' + error),
  })

  const closeInventoryMutation = useMutation({
    mutationFn: inventoryService.closeInventoryById,
    onSuccess: () =>
      queryClient.invalidateQueries(['inventoryList', 'openInventoryList', 'closeInventoryList']),
    onError: (error) => console.log('Error: ' + error),
  })

  const deleteMutation = useMutation({
    mutationFn: inventoryService.deleteById,
    onSuccess: () =>
      queryClient.invalidateQueries(['inventoryList', 'openInventoryList', 'closeInventoryList']),
    onError: (error) => console.log('Error: ' + error),
  })

  return {
    getInventoryList,
    getInventoryById,
    getOpenInventoryList,
    getCloseInventoryList,
    createInventory: createMutation.mutate,
    createInventoryAsync: createMutation.mutateAsync,
    isCreating: createMutation.isPending,
    createError: createMutation.error,

    updateInventory: updateMutation.mutate,
    updateInventoryAsync: updateMutation.mutateAsync,
    isUpdating: updateMutation.isPending,
    updateError: updateMutation.error,

    addAssistant: addAssistantMutation.mutate,
    addAssistantAsync: addAssistantMutation.mutateAsync,

    closeInventory: closeInventoryMutation.mutate,
    closeInventoryAsync: closeInventoryMutation.mutateAsync,

    deleteInventory: deleteMutation.mutate,
    deleteInventoryAsync: deleteMutation.mutateAsync,
    isDeleting: deleteMutation.isPending,
    deleteError: deleteMutation.error,
  }
}
