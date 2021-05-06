import { NextApiRequest, NextApiResponse } from 'next'

import { getSubscribers } from '../../api-routes'

export default (req: NextApiRequest, res: NextApiResponse) => {
    if (req.method === 'GET') {
        return getSubscribers(req, res)
    }
    return res.status(404).end()
}
