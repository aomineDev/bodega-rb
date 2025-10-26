import { juridicalCustomerService } from '@/services/api/juridicalCustomerService'
import { useMutation, useQuery, useQueryClient } from '@tanstack/vue-query'

export const useJuridicalCustomer = () => {
  const queryClient = useQueryClient()

  const {
    isPending,
    isError,
    data: juridicalCustomers,
    error,
  } = useQuery({
    queryKey: ['juridicalCustomers'],
    queryFn: juridicalCustomerService.getAll,
  })

  const getQuery = (id) =>
    useQuery({
      queryKey: ['juridicalCustomer', id],
      queryFn: () => juridicalCustomerService.getById(id.value),
      enabled: !!id.value,
    })

  const createMutation = useMutation({
    mutationFn: juridicalCustomerService.create,
    onSuccess: () => queryClient.invalidateQueries(['juridicalCustomers']),
    onError: (error) => console.log('Error: ' + error),
  })

  const updateMutation = useMutation({
    mutationFn: juridicalCustomerService.update,
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries(['juridicalCustomers'])
      queryClient.invalidateQueries(['juridicalCustomer', variables.id])
    },
    onError: (error) => console.log('Error: ' + error),
  })

  const deleteMutation = useMutation({
    mutationFn: juridicalCustomerService.delete,
    onSuccess: () => queryClient.invalidateQueries(['juridicalCustomers']),
    onError: (error) => console.log('Error: ' + error),
  })

  return {
    juridicalCustomers,
    isPending,
    isError,
    error,
    getQuery,

    createJuridicalCustomer: createMutation.mutate,
    createJuridicalCustomerAsync: createMutation.mutateAsync,
    isCreating: createMutation.isPending,
    createError: createMutation.error,

    updateJuridicalCustomer: updateMutation.mutate,
    updateJuridicalCustomerAsync: updateMutation.mutateAsync,
    isUpdating: updateMutation.isPending,
    updateError: updateMutation.error,

    deleteJuridicalCustomer: deleteMutation.mutate,
    deleteJuridicalCustomerAsync: deleteMutation.mutateAsync,
    isDeleting: deleteMutation.isPending,
    deleteError: deleteMutation.error,
  }
}
