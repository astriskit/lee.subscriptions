import parseISO from 'date-fns/parseISO'
import isValid from 'date-fns/isValid'

export const validateDate = (val: any) => {
    let dtStr
    if (typeof val === 'string') {
        dtStr = Number(val)
    }
    if (isNaN(dtStr)) {
        return isValid(dtStr)
    }
    if (val instanceof Date) {
        return true
    } else if (typeof val === 'object') {
        return false
    }
    return !!parseISO(val)
}
