import { NextApiRequest, NextApiResponse } from 'next'
import {
    ContainFilterUser,
    Pagination,
    Subscription,
    COLUMNS_ATTRIBS,
    COLUMNS,
    validateEmptyNumber,
    validateEmptyString,
    sanitizeString,
    ValidationError,
    getSubscriptions,
} from '../../utils'

type Params = { p?: Pagination; f?: ContainFilterUser; e?: ValidationError }

const params = (req: NextApiRequest): Params => {
    const { limit = 10, offset = 0, user = '' } = req.query
    const vLimit = validateEmptyNumber(sanitizeString(limit))
    const vOffset = validateEmptyNumber(sanitizeString(offset))
    const vUser = validateEmptyString(sanitizeString(user))
    if (vLimit.error || vOffset.error || vUser.error) {
        return {
            e: {
                errors: [
                    { key: 'total', error: vLimit.error },
                    { key: 'skip', error: vOffset.error },
                    { key: 'skip', error: vOffset.error },
                    { key: 'user', error: vUser.error },
                ],
            },
        }
    }
    return {
        p: { limit: vLimit.value, offset: vOffset.value },
        f: vUser.value,
    }
}

export const getSubscribers = (req: NextApiRequest, res: NextApiResponse) => {
    const p: Params = params(req)
    if (p.e) {
        return res.status(422).json(p.e.errors)
    }
    const subscriptions = getSubscriptions(p.p, p.f)
    return res.json(subscriptions)
}
