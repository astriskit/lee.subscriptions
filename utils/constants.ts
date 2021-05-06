import { differenceInDays } from 'date-fns'

export interface Validate<T = undefined> {
    error?: string
    value: T
}

export const COLUMNS = {
    USERNAME: 'username',
    INTERESTS: 'interests',
    PLAN_TYPE: 'plan-type',
    ADMIRATION_POINTS: 'admiration-types',
    SUBSCRIPTION_DATE: 'subscription-date',
    EXPIRY_DATE: 'expiry-date',
    IS_ACTIVE: 'is-active',
} as const

export const PLAN_TYPES = {
    FREE_TRIAL: 'free-trial',
    BRONZE: 'bronze',
    GOLD: 'gold',
    PLATINUM: 'platinum',
}

export const COLUMNS_ATTRIBS = {
    [COLUMNS.USERNAME]: {
        valid(value: any): Validate<boolean> {
            if (!value) {
                return { error: 'The value must be there', value: undefined }
            } else if (typeof value !== 'string') {
                return { error: 'The value must be string', value: undefined }
            } else {
                return { value: true }
            }
        },
    },
    [COLUMNS.INTERESTS]: {
        maxLength: 512,
        valid(value: any): Validate<boolean> {
            if (typeof value !== 'string') {
                return { error: 'The type must be string', value: false }
            }
            if (value.length <= 512) {
                return {
                    error:
                        'The length must be less than or equal to 512 characters',
                    value: false,
                }
            }
            return { value: true }
        },
    },
    [COLUMNS.PLAN_TYPE]: {
        enums: Object.getOwnPropertyNames(PLAN_TYPES).map(
            (key) => PLAN_TYPES[key]
        ) as string[],
        valid(value: string): Validate<boolean> {
            if (value.toLowerCase() in this.enums) {
                return {
                    value: this.enums.find(
                        (val) => val === value.toLowerCase()
                    ),
                }
            }
            return {
                value: false,
                error: 'It must be one of the valid values.',
            }
        },
    },
    [COLUMNS.ADMIRATION_POINTS]: {
        min: 0,
        max: 5,
        maxPrecision: 3,
        valid(value: any): Validate<string | number> {
            if (typeof value !== 'number') {
                return { error: 'The value must be a number', value: NaN }
            } else if (value < this.min) {
                return { error: 'The value must be more than zero', value: NaN }
            } else if (value > this.max) {
                return { error: 'The value must be less than 5', value: NaN }
            } else {
                return {
                    error: '',
                    value: Number(value).toPrecision(this.maxPrecision),
                }
            }
        },
    },
    [COLUMNS.SUBSCRIPTION_DATE]: {
        userEditable: false,
        description:
            'Auto filled while putting the entry or while changing the PLAN_TYPE',
        generate: () => new Date(),
    },
    [COLUMNS.EXPIRY_DATE]: {
        valid: (
            expiry: Date | number,
            subscription: Date | number
        ): Validate<boolean> => {
            if (differenceInDays(subscription, expiry) <= 30) {
                return {
                    error:
                        'The expiry must be atleast 30 days from the subscription date',
                    value: undefined,
                }
            } else {
                return { value: true }
            }
        },
    },
    [COLUMNS.IS_ACTIVE]: {
        valid: (value: any): Validate<boolean> =>
            typeof value !== 'boolean'
                ? { error: 'The value must be a true/false', value: false }
                : { error: '', value: true },
    },
}
