import userStore, { UserStore } from './userStore';

export interface RootStore {
  user: UserStore;
}

export default function createState(
  initialValue: Record<string, any>
): () => RootStore {
  return () => {
    return {
      user: { ...userStore(), ...initialValue?.user },
    };
  };
}
