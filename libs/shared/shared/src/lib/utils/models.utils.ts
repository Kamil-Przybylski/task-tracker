declare const type: unique symbol;

export type Flavor<T, FlavorT> = T & { [type]: FlavorT };
