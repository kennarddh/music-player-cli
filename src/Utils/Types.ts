export type ValueOrFactory<T> = T | ((prev: T) => T)
