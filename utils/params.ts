import { NextApiRequest } from 'next'

import { validateEmptyNumber } from './validateNumber'
import { validateDate } from './validateDate'
import { sanitizeString } from './sanitize'
import { COLUMNS, COLUMNS_ATTRIBS } from './constants'
import { Subscription, ValidationError } from './defs'

export const subscriptionParams = (
    req: NextApiRequest
): { p: Partial<Omit<Subscription, 'id'>>; e?: ValidationError } => {
    let username = sanitizeString(req.body[COLUMNS.USERNAME]) || ''
    let interests = sanitizeString(req.body[COLUMNS.INTERESTS]) || ''
    let planType = sanitizeString(req.body[COLUMNS.PLAN_TYPE]) || ''
    let admPnts: string | number =
        sanitizeString(req.body[COLUMNS.ADMIRATION_POINTS]) || ''
    let subDt: string | number =
        sanitizeString(req.body[COLUMNS.SUBSCRIPTION_DATE]) || ''
    let expDt: string | number =
        sanitizeString(req.body[COLUMNS.EXPIRY_DATE]) || ''
    let isAct: string | boolean =
        sanitizeString(req.body[COLUMNS.IS_ACTIVE]) || ''

    if (!username || !subDt || !expDt || !planType) {
        return {
            p: {},
            e: {
                errors: [
                    { key: COLUMNS.USERNAME, error: 'Username is empty' },
                    {
                        key: COLUMNS.SUBSCRIPTION_DATE,
                        error: 'Subscription date is empty',
                    },
                    { key: COLUMNS.EXPIRY_DATE, error: 'Expiry date is empty' },
                    { key: COLUMNS.PLAN_TYPE, error: 'Plan type is empty' },
                ],
            },
        }
    }

    if (admPnts) {
        const { error, value } = validateEmptyNumber(admPnts)
        if (error) {
            return {
                e: {
                    errors: [
                        {
                            key: COLUMNS.ADMIRATION_POINTS,
                            error: 'Invalid number',
                        },
                    ],
                },
                p: {},
            }
        }
        admPnts = value
    }
    if (!validateDate(subDt)) {
        return {
            e: {
                errors: [
                    { key: COLUMNS.SUBSCRIPTION_DATE, error: 'Invalid date' },
                ],
            },
            p: {},
        }
    }
    if (!validateDate(expDt)) {
        return {
            e: {
                errors: [{ key: COLUMNS.EXPIRY_DATE, error: 'Invalid date' }],
            },
            p: {},
        }
    }
    const { value: expVal, error: expErr } = COLUMNS_ATTRIBS[
        COLUMNS.EXPIRY_DATE
    ].valid(expDt, subDt)
    if (expErr) {
        return {
            e: { errors: [{ key: COLUMNS.EXPIRY_DATE, error: expErr }] },
            p: {},
        }
    }
    const { value: intVal, error: intErr } = COLUMNS_ATTRIBS[
        COLUMNS.INTERESTS
    ].valid(interests)
    if (intErr) {
        return {
            e: { errors: [{ key: COLUMNS.INTERESTS, error: intErr }] },
            p: {},
        }
    }
    isAct = isAct === 'true' ? true : false
    interests = intVal
    return {
        p: {
            [COLUMNS.USERNAME]: username,
            [COLUMNS.INTERESTS]: interests,
            [COLUMNS.ADMIRATION_POINTS]: admPnts as number,
            [COLUMNS.PLAN_TYPE]: planType,
            [COLUMNS.SUBSCRIPTION_DATE]: Number(subDt) as number,
            [COLUMNS.EXPIRY_DATE]: Number(expVal) as number,
            [COLUMNS.IS_ACTIVE]: isAct,
        },
    }
}

export const subscriptionId = (
    req: NextApiRequest
): { p: string; e?: ValidationError } => {
    let id = sanitizeString(req.body?.id) ?? ''
    if (!id) {
        return {
            e: { errors: [{ key: 'id', error: 'Invalid id' }] },
            p: '',
        }
    }
    return { p: id as string }
}
