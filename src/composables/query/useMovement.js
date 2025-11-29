import { movementService } from '@/services/api/movementService'
import { useMutation, useQuery, useQueryClient } from '@tanstack/vue-query'
import { computed } from 'vue'

export const useMovement = () => {
  const queryClient = useQueryClient()

  const {
    isPending,
    isError,
    data: movements,
    error,
  } = useQuery({
    queryKey: ['movements'],
    queryFn: movementService.getAll,
  })

  const getQuery = (id) =>
    useQuery({
      queryKey: ['movement', id],
      queryFn: () => movementService.getById(id.value),
      enabled: computed(() => !!id.value),
    })

  const getByCajaQuery = (cajaId) =>
    useQuery({
      queryKey: ['movements', cajaId],
      queryFn: () => movementService.getByCaja(cajaId.value),
      enabled: computed(() => !!cajaId.value),
    })

  const createMutation = useMutation({
    mutationFn: movementService.create,
    onSuccess: () => queryClient.invalidateQueries(['movements']),
    onError: (error) => console.log('Error: ' + error),
  })

  const updateMutation = useMutation({
    mutationFn: movementService.update,
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries(['movements'])
      queryClient.invalidateQueries(['movement', variables.id])
    },
    onError: (error) => console.log('Error: ' + error),
  })

  const deleteMutation = useMutation({
    mutationFn: movementService.delete,
    onSuccess: () => queryClient.invalidateQueries(['movements']),
    onError: (error) => console.log('Error: ' + error),
  })

  return {
    movements,
    isPending,
    isError,
    error,
    getQuery,
    getByCajaQuery,

    createMovement: createMutation.mutate,
    createMovementAsync: createMutation.mutateAsync,
    isCreating: createMutation.isPending,
    createError: createMutation.error,

    updateMovement: updateMutation.mutate,
    updateMovementAsync: updateMutation.mutateAsync,
    isUpdating: updateMutation.isPending,
    updateError: updateMutation.error,

    deleteMovement: deleteMutation.mutate,
    deleteMovementAsync: deleteMutation.mutateAsync,
    isDeleting: deleteMutation.isPending,
    deleteError: deleteMutation.error,
  }
}
