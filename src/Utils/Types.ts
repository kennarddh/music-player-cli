export type ValueOrFactory<T> = T | ((prev: T) => T)

export type RecursivePartial<T> = {
    [P in keyof T]?: RecursivePartial<T[P]>;
};