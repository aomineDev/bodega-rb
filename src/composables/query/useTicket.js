import { ticketService } from '@/services/api/ticketService'
import { useMutation, useQuery, useQueryClient } from '@tanstack/vue-query'

export const useTicket = () => {
  const queryClient = useQueryClient()

  const {
    isPending,
    isError,
    data: tickets,
    error,
  } = useQuery({
    queryKey: ['tickets'],
    queryFn: ticketService.getAll,
  })

  const getQuery = (id) =>
    useQuery({
      queryKey: ['ticket', id],
      queryFn: () => ticketService.getById(id.value),
      enabled: !!id.value,
    })

  const createMutation = useMutation({
    mutationFn: ticketService.create,
    onSuccess: () => queryClient.invalidateQueries(['tickets']),
    onError: (error) => console.log('Error: ' + error),
  })

  const updateMutation = useMutation({
    mutationFn: ticketService.update,
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries(['tickets'])
      queryClient.invalidateQueries(['ticket', variables.id])
    },
    onError: (error) => console.log('Error: ' + error),
  })

  const deleteMutation = useMutation({
    mutationFn: ticketService.delete,
    onSuccess: () => queryClient.invalidateQueries(['tickets']),
    onError: (error) => console.log('Error: ' + error),
  })

  const generatePdfTicket = async (id) => {
    try {
      const response = await ticketService.getGeneratePdfById(id)
      const blob = new Blob([response], { type: 'application/pdf' })
      const url = URL.createObjectURL(blob)
      return url
    } catch (error) {
      console.error('Error al generar PDF:', error)
    }
  }

  return {
    tickets,
    isPending,
    isError,
    error,
    getQuery,

    createTicket: createMutation.mutate,
    createTicketAsync: createMutation.mutateAsync,
    isCreating: createMutation.isPending,
    createError: createMutation.error,

    updateTicket: updateMutation.mutate,
    updateTicketAsync: updateMutation.mutateAsync,
    isUpdating: updateMutation.isPending,
    updateError: updateMutation.error,

    deleteTicket: deleteMutation.mutate,
    deleteTicketAsync: deleteMutation.mutateAsync,
    isDeleting: deleteMutation.isPending,
    deleteError: deleteMutation.error,

    generatePdfTicket,
  }
}
