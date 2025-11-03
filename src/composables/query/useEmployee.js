import { employeeService } from '@/services/api/employeeSevice'

import { useMutation, useQuery, useQueryClient } from '@tanstack/vue-query'
export const useEmployee = () => {
  const queryClient = useQueryClient()
  const {
    isPending,
    isError,
    data: employee,
    error,
  } = useQuery({
    queryKey: ['employee'],
    queryFn: employeeService.getAll,
  })

  const getQuery = (id) =>
    useQuery({
      queryKey: ['employee', id],
      queryFn: () => employeeService.getById(id.value),
      enabled: !!id.value,
    })
  const createMutation = useMutation({
    mutationFn: employeeService.create,
    onSuccess: () => queryClient.invalidateQueries(['employee']),
    onError: (error) => console.log('Error' + error),
  })

  const updateMutation = useMutation({
    mutationFn: employeeService.update,
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries(['employee'])
      queryClient.invalidateQueries(['employee', variables.id])
    },
    onError: (error) => console.log('Erorr' + error),
  })
  const deleteMutation = useMutation({
    mutationFn: employeeService.delete,
    onSuccess: () => queryClient.invalidateQueries(['employee']),
    onError: (error) => console.log('Eerror' + error),
  })
  return {
    employee,
    isPending,
    isError,
    error,
    getQuery,

    createEmployee: createMutation.mutate,
    createEmployeeAsync: createMutation.mutateAsync,
    isCreating: createMutation.isPending,
    createError: createMutation.error,

    updateEmployee: updateMutation.mutate,
    updateEmployeeAsync: updateMutation.mutateAsync,
    isUpdating: updateMutation.isPending,
    updateError: updateMutation.error,

    deleteEmployee: deleteMutation.mutate,
    deleteEmployeeAsync: deleteMutation.mutateAsync,
    isDeleting: deleteMutation.isPending,
    deleteError: deleteMutation.error,
  }
}
