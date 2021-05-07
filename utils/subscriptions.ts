import lowdb from 'lowdb'
const FileSync = require('lowdb/adapters/FileSync')

import { nanoid } from 'nanoid'
import { COLUMNS } from './constants'

import { Pagination, ContainFilterUser, Subscription } from './defs'

let instance

const subDB = './data/subscriptions.json'

export const connect = () => {
    if (!instance) {
        const adapter = new FileSync(subDB)
        instance = lowdb(adapter)
    }
    return instance
}

export const getSubscriptions = (
    { limit = 10, offset = 0 }: Pagination,
    f: ContainFilterUser
) => {
    connect()
    let subscriptions: Subscription[] = instance.get('data').value()
    const start = offset
    const end = offset + limit
    subscriptions = subscriptions.slice(start, end)
    if (f) {
        subscriptions = subscriptions.filter(({ username }) =>
            username.includes(f)
        )
    }
    return subscriptions
}

export const addSubscripton = (
    sub: Partial<Omit<Subscription, 'id'>>
): Partial<Subscription> => {
    connect()
    const subscription = { ...sub, id: nanoid(6) }
    instance.get('data').push(subscription).write()
    return subscription
}
export const removeSubscription = (sid: string): boolean => {
    connect()
    const subs: Subscription[] = instance.get('data').value()
    const subId = subs.findIndex(({ id }) => id === sid.toString())
    if (subId >= 0) {
        let newSubs = subs.filter(({ id }) => id !== sid.toString())
        instance.set('data', newSubs).write()
        return true
    }
    return false
}
export const updateSubscription = (
    sid: string,
    sub: Partial<Omit<Subscription, 'id'>>
): boolean => {
    connect()
    const subF = instance.get('data').findIndex({ id: sid }).value()
    if (subF >= 0) {
        instance
            .update(`data[${subF}]`, (s) => ({
                ...s,
                ...sub,
                [COLUMNS.SUBSCRIPTION_DATE]:
                    sub[COLUMNS.PLAN_TYPE] !== s[COLUMNS.PLAN_TYPE]
                        ? new Date().valueOf()
                        : s[COLUMNS.SUBSCRIPTION_DATE],
            }))
            .write()
        return true
    }
    return false
}
