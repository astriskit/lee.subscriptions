import { Validate } from './constants'

export const validateString = (val: any): Validate<string> =>
    typeof val === 'string'
        ? { value: val.toString() }
        : { value: '', error: 'Invalid string' }

export const validateEmptyString = (val: any): Validate<string> => {
    if (!val) {
        return { value: '' }
    }
    return validateString(val)
}
