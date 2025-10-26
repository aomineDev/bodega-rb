import { pruebaService } from '@/services/api/pruebaService'
import { useMutation, useQuery, useQueryClient } from '@tanstack/vue-query'

export const usePruebas = () => {
  const queryClient = useQueryClient()

  const {
    isPending,
    isError,
    data: pruebas,
    error,
  } = useQuery({
    queryKey: ['pruebas'],
    queryFn: pruebaService.getAll,
  })

  const getQuery = (id) =>
    useQuery({
      queryKey: ['prueba', id],
      queryFn: () => pruebaService.getById(id.value),
      enabled: !!id.value,
    })

  const createMutation = useMutation({
    mutationFn: pruebaService.create,
    onSuccess: () => queryClient.invalidateQueries(['pruebas']),
    onError: (error) => console.log('Error: ' + error),
  })

  const updateMutation = useMutation({
    mutationFn: pruebaService.update,
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries(['pruebas'])
      queryClient.invalidateQueries(['prueba', variables.id])
    },
    onError: (error) => console.log('Error: ' + error),
  })

  const deleteMutation = useMutation({
    mutationFn: pruebaService.delete,
    onSuccess: () => queryClient.invalidateQueries(['pruebas']),
    onError: (error) => console.log('Error: ' + error),
  })

  return {
    pruebas,
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
