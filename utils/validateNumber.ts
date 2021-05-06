import { Validate } from './constants'

export const validateNumber = (val: any): Validate<number> => {
    const valNum = Number(val)
    if (val && !isNaN(valNum)) {
        return { value: valNum }
    }
    return { error: 'Invalid number', value: NaN }
}

export const validateEmptyNumber = (val: any): Validate<number> => {
    if (!val) {
        return { value: 0 }
    }
    return validateNumber(val)
}
