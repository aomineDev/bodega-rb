import { checkoutService } from '@/services/api/checkoutService'
import { useMutation, useQuery, useQueryClient } from '@tanstack/vue-query'
import { computed } from 'vue'

export const useCheckout = () => {
  const queryClient = useQueryClient()

  const {
    isPending,
    isError,
    data: checkouts,
    error,
  } = useQuery({
    queryKey: ['checkouts'],
    queryFn: checkoutService.getAll,
  })

  const getQuery = (id) =>
    useQuery({
      queryKey: ['checkout', id],
      queryFn: () => checkoutService.getById(id.value),
      enabled: computed(() => !!id.value),
    })

  const getResumenCajaQuery = (cajaId) =>
    useQuery({
      queryKey: ['resumenCaja', cajaId],
      queryFn: () => checkoutService.getResumenCaja(cajaId.value),
      enabled: computed(() => !!cajaId.value),
      staleTime: 1000 * 60, // 1 min, opcional
    })

  const createMutation = useMutation({
    mutationFn: checkoutService.create,
    onSuccess: () => queryClient.invalidateQueries(['checkouts']),
    onError: (error) => console.log('Error: ' + error),
  })

  const updateMutation = useMutation({
    mutationFn: checkoutService.update,
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries(['checkouts'])
      queryClient.invalidateQueries(['checkout', variables.id])
    },
    onError: (error) => console.log('Error: ' + error),
  })

  const deleteMutation = useMutation({
    mutationFn: checkoutService.delete,
    onSuccess: () => queryClient.invalidateQueries(['checkouts']),
    onError: (error) => console.log('Error: ' + error),
  })

  const cerrarCajaMutation = useMutation({
    mutationFn: checkoutService.cerrarCaja,
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries(['checkouts'])
      queryClient.invalidateQueries(['checkout', variables.id])
    },
    onError: (error) => console.error('Error al cerrar caja', error),
  })

  return {
    checkouts,
    isPending,
    isError,
    error,
    getQuery,
    getResumenCajaQuery,

    createCheckout: createMutation.mutate,
    createCheckoutAsync: createMutation.mutateAsync,
    isCreating: createMutation.isPending,
    createError: createMutation.error,

    updateCheckout: updateMutation.mutate,
    updateCheckoutAsync: updateMutation.mutateAsync,
    isUpdating: updateMutation.isPending,
    updateError: updateMutation.error,

    deleteCheckout: deleteMutation.mutate,
    deleteCheckoutAsync: deleteMutation.mutateAsync,
    isDeleting: deleteMutation.isPending,
    deleteError: deleteMutation.error,

    cerrarCaja: cerrarCajaMutation.mutate,
    cerrarCajaAsync: cerrarCajaMutation.mutateAsync,
    isClosing: cerrarCajaMutation.isPending,
    closeError: cerrarCajaMutation.error,
  }
}
