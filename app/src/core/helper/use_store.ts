import { ClassConstructor } from "class-transformer";
import React from "react";

interface LifeCycleStore {
  init?: () => void;
  dispose?: () => void;
}

export const useStore = <S extends LifeCycleStore>(
  storeConstructor: ClassConstructor<S>
) => {
  const [store] = React.useState(() => new storeConstructor());
  React.useEffect(() => {
    store?.init?.();
    return () => {
      store?.dispose?.();
    };
  }, []);
  return store;
};
export const useStoreClass = <S extends LifeCycleStore>(storeClass: S) => {
  const [store] = React.useState(storeClass);
  React.useEffect(() => {
    store?.init?.();
    return () => {
      store?.dispose?.();
    };
  }, []);
  return store;
};
