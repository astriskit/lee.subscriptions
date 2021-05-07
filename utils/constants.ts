import { differenceInDays, format } from 'date-fns'

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
        valid(value: any): Validate<any> {
            if (!value) {
                return { error: 'The value must be there', value }
            } else {
                return { value }
            }
        },
    },
    [COLUMNS.INTERESTS]: {
        maxLength: 512,
        valid(value: any): Validate<any> {
            if (value.toString().length >= 512) {
                return {
                    error:
                        'The length must be less than or equal to 512 characters',
                    value,
                }
            }
            return { value }
        },
    },
    [COLUMNS.PLAN_TYPE]: {
        enums: Object.getOwnPropertyNames(PLAN_TYPES).map(
            (key) => PLAN_TYPES[key]
        ) as string[],
        valid(value: string): Validate<any> {
            if (this.enums.find((val) => value.toLowerCase() === val)) {
                return {
                    value: this.enums.find(
                        (val) => val === value.toLowerCase()
                    ),
                }
            }
            return {
                value,
                error: 'It must be one of the valid values.',
            }
        },
    },
    [COLUMNS.ADMIRATION_POINTS]: {
        min: 0,
        max: 5,
        maxPrecision: 3,
        valid(value: any): Validate<string | number> {
            if (isNaN(value)) {
                return { error: 'The value must be a number', value }
            } else if (value < this.min) {
                return { error: 'The value must be more than zero', value }
            } else if (value > this.max) {
                return { error: 'The value must be less than 5', value }
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
        format: (value: any) => format(new Date(value), 'yyyy-MM-dd'),
    },
    [COLUMNS.EXPIRY_DATE]: {
        format: (value: any) => format(new Date(value), 'yyyy-MM-dd'),
        valid: (
            expiry: Date | number | string,
            subscription: Date | number | string
        ): Validate<Date | number | string> => {
            const sub = new Date(subscription)
            const exp = new Date(expiry)
            const valid = differenceInDays(exp, sub) <= 30
            if (valid) {
                return {
                    error:
                        'The expiry must be atleast 30 days from the subscription date',
                    value: expiry,
                }
            } else {
                return { value: expiry }
            }
        },
    },
    [COLUMNS.IS_ACTIVE]: {
        valid: (value: any): Validate<boolean> =>
            typeof value !== 'boolean'
                ? { error: 'The value must be a true/false', value }
                : { error: '', value },
    },
}
