import { billService } from '@/services/api/billService'
import { useMutation, useQuery, useQueryClient } from '@tanstack/vue-query'

export const useBills = () => {
  const queryClient = useQueryClient()

  const {
    isPending,
    isError,
    data: bills,
    error,
  } = useQuery({
    queryKey: ['bills'],
    queryFn: billService.getAll,
  })

  const getQuery = (id) =>
    useQuery({
      queryKey: ['bill', id],
      queryFn: () => billService.getById(id.value),
      enabled: !!id.value,
    })

  const createMutation = useMutation({
    mutationFn: billService.create,
    onSuccess: () => queryClient.invalidateQueries(['bills']),
    onError: (error) => console.log('Error: ' + error),
  })

  const updateMutation = useMutation({
    mutationFn: billService.update,
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries(['bills'])
      queryClient.invalidateQueries(['bill', variables.id])
    },
    onError: (error) => console.log('Error: ' + error),
  })

  const deleteMutation = useMutation({
    mutationFn: billService.delete,
    onSuccess: () => queryClient.invalidateQueries(['bills']),
    onError: (error) => console.log('Error: ' + error),
  })

  return {
    bills,
    isPending,
    isError,
    error,
    getQuery,

    createBill: createMutation.mutate,
    createBillAsync: createMutation.mutateAsync,
    isCreating: createMutation.isPending,
    createError: createMutation.error,

    updateBill: updateMutation.mutate,
    updateBillAsync: updateMutation.mutateAsync,
    isUpdating: updateMutation.isPending,
    updateError: updateMutation.error,

    deleteBill: deleteMutation.mutate,
    deleteBillAsync: deleteMutation.mutateAsync,
    isDeleting: deleteMutation.isPending,
    deleteError: deleteMutation.error,
  }
}
