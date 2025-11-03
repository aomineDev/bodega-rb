import { integrationService } from '@/services/api/integrationService'
import { useQuery, useMutation, useQueryClient } from '@tanstack/vue-query'

export const useIntegration = () => {
  const queryClient = useQueryClient()

  const {
    data: integrations,
    isPending,
    isError,
    error,
  } = useQuery({
    queryKey: ['integrations'],
    queryFn: integrationService.getAll,
  })

  const getCustomerByDni = (dni) =>
    useQuery({
      queryKey: ['integration', 'dni', dni],
      queryFn: () => integrationService.getCustomerByDni(dni.value),
      enabled: false,
    })

  const getCustomerByRuc = (ruc) =>
    useQuery({
      queryKey: ['integration', 'ruc', ruc],
      queryFn: () => integrationService.getCustomerByRuc(ruc.value),
      enabled: false,
    })

  const createDniMutation = useMutation({
    mutationFn: (dni) => integrationService.createCustomerByDni(dni),
    onSuccess: () => {
      queryClient.invalidateQueries(['integrations'])
    },
    onError: (error) => console.error('Error al crear cliente por DNI:', error),
  })

  const createRucMutation = useMutation({
    mutationFn: (ruc) => integrationService.createCustomerByRuc(ruc),
    onSuccess: () => {
      queryClient.invalidateQueries(['integrations'])
    },
    onError: (error) => console.error('Error al crear cliente por RUC:', error),
  })

  return {
    integrations,
    isPending,
    isError,
    error,

    getCustomerByDni,
    getCustomerByRuc,

    createCustomerByDni: createDniMutation.mutate,
    createCustomerByDniAsync: createDniMutation.mutateAsync,
    isCreatingDni: createDniMutation.isPending,
    createDniError: createDniMutation.error,

    createCustomerByRuc: createRucMutation.mutate,
    createCustomerByRucAsync: createRucMutation.mutateAsync,
    isCreatingRuc: createRucMutation.isPending,
    createRucError: createRucMutation.error,
  }
}
