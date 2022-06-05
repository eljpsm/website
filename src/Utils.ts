/**
 * A basic string key to string value type.
 */
export type StringKeyToString = {
    [key: string]: string
}

export const formatDate = (date: string | Date) => {
    if (typeof date === "string") date = new Date(date)
    return date.toDateString().toLowerCase()
}