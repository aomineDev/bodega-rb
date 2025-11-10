import { capitalize } from './capitalize'

export const roleFormat = (role) => capitalize(role.substring(5).replaceAll('_', ' '))
