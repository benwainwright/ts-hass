import { Calendar, Climate } from "@entities";

export type Entity =
  | typeof Calendar<`calendar.${string}`>
  | typeof Climate<`climate.${string}`>;

type GetIdTypes<T extends abstract new (...args: any[]) => any> = T extends any
  ? ConstructorParameters<T>[0]
  : never;

export type IdType = GetIdTypes<Entity>;

type MatchesId<
  T extends IdType,
  Y extends abstract new (...args: any[]) => any
> = T extends ConstructorParameters<Y>[0] ? Y : never;

type EntityWithMatchingId<
  T extends IdType,
  Y extends abstract new (...args: any[]) => any
> = Y extends MatchesId<T, Y> ? InstanceType<Y> : never;

export type EntityType<T extends IdType> = EntityWithMatchingId<T, Entity>;

export declare type Entities<T extends Record<string, IdType>> = {
  [K in keyof T]: EntityType<T[K]>;
};
