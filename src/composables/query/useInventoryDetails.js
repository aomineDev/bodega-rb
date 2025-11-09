import { inventoryDetailsService } from '@/services/api/inventoryDetailsService'
import { useMutation, useQueryClient } from '@tanstack/vue-query'

export const useInventoryDetails = (inventoryId) => {
  const queryClient = useQueryClient()

  const addStockMutation = useMutation({
    mutationFn: inventoryDetailsService.addStockById,
    onSuccess: () => queryClient.invalidateQueries(['inventory', inventoryId]),
    onError: (error) => console.log('Error: ' + error),
  })

  const updateStockMutation = useMutation({
    mutationFn: inventoryDetailsService.updateStockById,
    onSuccess: () => queryClient.invalidateQueries(['inventory', inventoryId]),
    onError: (error) => console.log('Error: ' + error),
  })

  const updateObservationsMutation = useMutation({
    mutationFn: inventoryDetailsService.updateObservationsById,
    onSuccess: () => {
      queryClient.invalidateQueries(['openInventoryList'])
    },
    onError: (error) => console.log('Error: ' + error),
  })

  return {
    addStock: addStockMutation.mutate,
    addStockAsync: addStockMutation.mutateAsync,

    updateStock: updateStockMutation.mutate,
    updateStockAsync: updateStockMutation.mutateAsync,

    updateObservations: updateObservationsMutation.mutate,
    updateObservationsAsync: updateObservationsMutation.mutateAsync,
  }
}
