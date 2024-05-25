declare const type: unique symbol;

export type Flavor<T, FlavorT> = T & { [type]: FlavorT };
export type MapKey<
  Interface extends object,
  Key extends keyof Interface,
  TypeOfKey extends Interface[Key],
> = {
  [K in keyof Interface]: K extends Key ? TypeOfKey : Interface[K];
};
