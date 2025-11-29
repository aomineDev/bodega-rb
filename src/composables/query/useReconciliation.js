import { reconciliationService } from '@/services/api/reconciliationService'
import { useMutation, useQuery, useQueryClient } from '@tanstack/vue-query'
import { computed } from 'vue'

export const useReconciliation = () => {
  const queryClient = useQueryClient()

  const {
    isPending,
    isError,
    data: reconciliations,
    error,
  } = useQuery({
    queryKey: ['reconciliations'],
    queryFn: reconciliationService.getAll,
  })

  const getQuery = (id) =>
    useQuery({
      queryKey: ['reconciliation', id],
      queryFn: () => reconciliationService.getById(id.value),
      enabled: computed(() => !!id.value),
    })

  const createMutation = useMutation({
    mutationFn: reconciliationService.create,
    onSuccess: () => queryClient.invalidateQueries(['reconciliations']),
    onError: (error) => console.log('Error: ' + error),
  })

  const updateMutation = useMutation({
    mutationFn: reconciliationService.update,
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries(['reconciliations'])
      queryClient.invalidateQueries(['reconciliation', variables.id])
    },
    onError: (error) => console.log('Error: ' + error),
  })

  const deleteMutation = useMutation({
    mutationFn: reconciliationService.delete,
    onSuccess: () => queryClient.invalidateQueries(['reconciliations']),
    onError: (error) => console.log('Error: ' + error),
  })

  return {
    reconciliations,
    isPending,
    isError,
    error,
    getQuery,

    createPrueba: createMutation.mutate,
    createPruebaAsync: createMutation.mutateAsync,
    isCreating: createMutation.isPending,
    createError: createMutation.error,

    updatePrueba: updateMutation.mutate,
    updatePruebaAsync: updateMutation.mutateAsync,
    isUpdating: updateMutation.isPending,
    updateError: updateMutation.error,

    deletePrueba: deleteMutation.mutate,
    deletePruebaAsync: deleteMutation.mutateAsync,
    isDeleting: deleteMutation.isPending,
    deleteError: deleteMutation.error,
  }
}
