import { NextApiRequest, NextApiResponse } from 'next'

import {
    subscriptionParams,
    addSubscripton,
    Subscription,
} from '../../utils/server'

export const createSubscriber = async (
    req: NextApiRequest,
    res: NextApiResponse
) => {
    try {
        const { p, e } = subscriptionParams(req)
        if (e?.errors) {
            return res.status(422).json(e)
        }
        const subscription = addSubscripton(p as Partial<Subscription>)
        return res.json(subscription)
    } catch (err) {
        return res.status(500).end(err?.message ?? 'Internal server error')
    }
}
