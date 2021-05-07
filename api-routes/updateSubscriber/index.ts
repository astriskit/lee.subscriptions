import { NextApiRequest, NextApiResponse } from 'next'

import {
    subscriptionParams,
    updateSubscription,
    Subscription,
    subscriptionId,
} from '../../utils/server'

export const updateSubscriber = async (
    req: NextApiRequest,
    res: NextApiResponse
) => {
    try {
        const { p, e } = subscriptionParams(req)
        if (e?.errors) {
            return res.status(422).json(e)
        }
        const { p: pId, e: pE } = subscriptionId(req)
        if (pE?.errors) {
            return res.status(422).json(pE)
        }
        const done = updateSubscription(pId, p as Partial<Subscription>)
        if (done) {
            return res.send(p)
        }
        return res.status(404).end('Subscription not found')
    } catch (err) {
        return res.status(500).end(err?.message ?? 'Internal server error')
    }
}
