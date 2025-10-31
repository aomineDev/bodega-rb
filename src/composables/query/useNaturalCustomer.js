import { naturalCustomerService } from '@/services/api/naturalCustomerService'
import { useMutation, useQuery, useQueryClient } from '@tanstack/vue-query'

export const useNaturalCustomer = () => {
  const queryClient = useQueryClient()

  const {
    isPending,
    isError,
    data: naturalCustomers,
    error,
  } = useQuery({
    queryKey: ['naturalCustomers'],
    queryFn: naturalCustomerService.getAll,
  })

  const getQuery = (id) =>
    useQuery({
      queryKey: ['naturalCustomer', id],
      queryFn: () => naturalCustomerService.getById(id.value),
      enabled: !!id.value,
    })

  const createMutation = useMutation({
    mutationFn: naturalCustomerService.create,
    onSuccess: () => queryClient.invalidateQueries(['naturalCustomers']),
    onError: (error) => console.log('Error: ' + error),
  })

  const updateMutation = useMutation({
    mutationFn: naturalCustomerService.update,
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries(['naturalCustomers'])
      queryClient.invalidateQueries(['naturalCustomer', variables.id])
    },
    onError: (error) => console.log('Error: ' + error),
  })

  const deleteMutation = useMutation({
    mutationFn: naturalCustomerService.delete,
    onSuccess: () => queryClient.invalidateQueries(['naturalCustomers']),
    onError: (error) => console.log('Error: ' + error),
  })

  return {
    naturalCustomers,
    isPending,
    isError,
    error,
    getQuery,

    createNaturalCustomer: createMutation.mutate,
    createNaturalCustomerAsync: createMutation.mutateAsync,
    isCreating: createMutation.isPending,
    createError: createMutation.error,

    updateNaturalCustomer: updateMutation.mutate,
    updateNaturalCustomerAsync: updateMutation.mutateAsync,
    isUpdating: updateMutation.isPending,
    updateError: updateMutation.error,

    deleteNaturalCustomer: deleteMutation.mutate,
    deleteNaturalCustomerAsync: deleteMutation.mutateAsync,
    isDeleting: deleteMutation.isPending,
    deleteError: deleteMutation.error,
  }
}
