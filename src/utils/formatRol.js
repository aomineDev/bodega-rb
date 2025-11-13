import { capitalize } from './capitalize'

export const formatRol = (role) => capitalize(role.substring(5).replaceAll('_', ' '))
