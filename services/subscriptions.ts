import axios from 'axios'

import {
    Pagination,
    ContainFilterUser,
    Subscription,
    API_PREFIX,
} from '../utils'

export const getSubscriptions = async (
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
