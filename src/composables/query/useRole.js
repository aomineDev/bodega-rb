import { roleService } from "@/services/api/roleService";
import { useQuery } from '@tanstack/vue-query'
export const useRole = () => {
    const {
        isPending,
        isError,
        data: role,
        error, } = useQuery({
            queryKey: ['rol'],
            queryFn: roleService.getAll
        })

    return {
        role,
        isPending,
        isError,
        error,
    }
}