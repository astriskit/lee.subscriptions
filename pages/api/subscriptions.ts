import { NextApiRequest, NextApiResponse } from 'next'

import {
    getSubscribers,
    createSubscriber,
    updateSubscriber,
    deleteSubscriber,
} from '../../api-routes'

export default (req: NextApiRequest, res: NextApiResponse) => {
    if (req.method === 'GET') {
        return getSubscribers(req, res)
    } else if (req.method === 'POST') {
        return createSubscriber(req, res)
    } else if (req.method === 'PUT') {
        return updateSubscriber(req, res)
    } else if (req.method === 'DELETE') {
        return deleteSubscriber(req, res)
    }
    return res.status(404).end()
}
