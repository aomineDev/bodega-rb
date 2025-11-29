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

  return {
    checkouts,
    isPending,
    isError,
    error,
    getQuery,

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
  }
}
