import { categoryService } from "@/services/api/categoryService";
import { useMutation, useQuery, useQueryClient } from '@tanstack/vue-query'
export const useCategory = () => {


    const queryClient = useQueryClient()
    const {
        isPending,
        isError,
        data: category,
        error, } = useQuery({
            queryKey: ['category'],
            queryFn: categoryService.getAll
        })

    const getQuery = (id) =>
        useQuery({
            queryKey: ['category', id],
            queryFn: () => categoryService.getById(id.value),
            enabled: !!id.value
        })
    const createMutation = useMutation({
        mutationFn: categoryService.create,
        onSuccess: () => queryClient.invalidateQueries(['category']),
        onError: (error) => console.log('Error' + error)
    })

    const updateMutation = useMutation({
        mutationFn: categoryService.update,
        onSuccess: (data, variables) => {
            queryClient.invalidateQueries(['category'])
            queryClient.invalidateQueries(['category', variables.id])
        },
        onError: (error) => console.log('Erorr' + error)
    })
    const deleteMutation = useMutation({
        mutationFn: categoryService.delete,
        onSuccess: () => queryClient.invalidateQueries(['category']),
        onError: (error) => console.log('Eerror' + error)
    })
    return {
        category,
        isPending,
        isError,
        error,
        getQuery,

        createCategory: createMutation.mutate,
        createCategoryAsync: createMutation.mutateAsync,
        isCreating: createMutation.isPending,
        createError: createMutation.error,

        updateCategory: updateMutation.mutate,
        updateCategoryAsync: updateMutation.mutateAsync,
        isUpdating: updateMutation.isPending,
        updateError: updateMutation.error,

        deleteCategory: deleteMutation.mutate,
        deleteCategoryAsync: deleteMutation.mutateAsync,
        isDeleting: deleteMutation.isPending,
        deleteError: deleteMutation.error



    }
}