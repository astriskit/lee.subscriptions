/*
 * source: https://stackoverflow.com/a/23453651/7986074
 */
export const sanitizeString = (val: any): string => {
    const rStr = val.toString().replace(/[^a-z0-9áéíóúñü \.,_-]/gim, '')
    return rStr.trim()
}
