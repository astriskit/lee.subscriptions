import axios from 'axios'

import {
    Pagination,
    ContainFilterUser,
    Subscription,
    API_PREFIX,
} from '../utils'

export const getSubscriptions = (
    { offset = 0, limit }: Pagination,
    f?: ContainFilterUser
) => {
    const pSkip = `offset=${offset}`
    const pLimit = `limit=${limit}`
    const pagination = `${pSkip}&${pLimit}`
    const filter = f ? `&user=${f}` : ''
    return axios.get<Subscription[]>(
        `${API_PREFIX}/subscriptions?${pagination}${filter}`
    )
}

export const addSubscripton = (
    subscription: Partial<Omit<Subscription, 'id'>>
) => {
    return axios.post<Subscription>(`${API_PREFIX}/subscriptions`, subscription)
}

export const editSubscription = (
    id: string,
    subscription: Partial<Omit<Subscription, 'id'>>
) => {
    return axios.put<Subscription>(`${API_PREFIX}/subscriptions`, {
        id,
        ...subscription,
    })
}

export const removeSubscription = (id: string) => {
    return axios.delete(`${API_PREFIX}/subscriptions`, { data: { id } })
}
