import { NextApiRequest, NextApiResponse } from 'next'

import { subscriptionId, removeSubscription } from '../../utils/server'

export const deleteSubscriber = (req: NextApiRequest, res: NextApiResponse) => {
    try {
        const { p, e } = subscriptionId(req)
        if (e?.errors) {
            return res.status(422).json(e)
        }
        const done = removeSubscription(p)
        if (done) {
            return res.status(200).end()
        }
        return res.status(404).end('Subscription not found')
    } catch (error) {
        return res.status(500).end(error?.message || 'Internal server error')
    }
}
