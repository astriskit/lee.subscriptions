import { JsonDB } from 'node-json-db'
import { Config } from 'node-json-db/dist/lib/JsonDBConfig'
import { Pagination, ContainFilterUser, Subscription } from './defs'
import { path } from './tmpPath'

let instance: JsonDB

const subDB = './data/subscriptions'

export const connect = (path: string = '') => {
    if (!instance) {
        instance = new JsonDB(new Config(path || subDB, false, true, '/'))
    }
    return instance
}

export const getSubscriptions = (
    { limit = 10, offset = 0 }: Pagination,
    f: ContainFilterUser
) => {
    connect(path)
    let subscriptions: Subscription[] = instance.getData('/data')
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

export const addSubscripton = () => {}
export const removeSubscription = () => {}
export const updateSubscription = () => {}
