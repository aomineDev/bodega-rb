import { dashboardService } from '@/services/api'
import { useQuery } from '@tanstack/vue-query'

export const useDashboard = () => {
  const {
    isPending,
    isError,
    data: metrics,
    error,
  } = useQuery({
    queryKey: ['dashboard-metrics'],
    queryFn: dashboardService.get,
  })

  return {
    metrics,
    isPending,
    isError,
    error,
  }
}
