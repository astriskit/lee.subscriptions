import { COLUMNS } from './constants'

export interface Pagination {
    offset?: number
    limit: number
}

export interface Subscription {
    id: string
    [COLUMNS.USERNAME]: string
    [COLUMNS.INTERESTS]: string
    [COLUMNS.PLAN_TYPE]: string
    [COLUMNS.ADMIRATION_POINTS]: number
    [COLUMNS.SUBSCRIPTION_DATE]: number
    [COLUMNS.EXPIRY_DATE]: number
    [COLUMNS.IS_ACTIVE]: boolean
}

export type COLUMN_NAME = keyof Subscription

export type ContainFilterUser = string

export interface ValidationError {
    errors: { key: string; error: string }[]
}
