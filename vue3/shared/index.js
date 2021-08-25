

export const isObject = (val) => val !== null && typeof val === 'object'

export const toRawType = (val) => Object.prototype.toString.call(val).slice(8, -1)

export const hasOwn = (val, key) => Object.prototype.hasOwnProperty.call(val, key)

export const hasChanged = (value, oldValue) => !Object.is(value, oldValue)

export const isMap = (val) => Object.prototype.toString.call(val) === '[object Map]'

export const isSet = (val) => Object.prototype.toString.call(val) === '[object Set]'

export const isArray = Array.isArray