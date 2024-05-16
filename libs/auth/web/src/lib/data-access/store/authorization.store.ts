import { UserId } from '@libs/shared';
import { LocalStorage } from '@libs/shared-web';
import {
  patchState,
  signalStore,
  withHooks,
  withMethods,
  withState,
} from '@ngrx/signals';

interface IState {
  userId: UserId | null;
  isLogged: boolean | null;
  tokenExpiresAt: number | null;
}

const initialState = {
  userId: null,
  isLogged: null,
  tokenExpiresAt: null,
};

export const AuthorizationFacadeStore = signalStore(
  { providedIn: 'root' },
  withState<IState>(initialState),
  withMethods((store) => ({
    login(payload: number) {
      const exp = LocalStorage.setItem('tokenExpiresAt', `${payload}`);
      patchState(store, { isLogged: true });
    },
  })),
  withHooks({
    onInit(store) {
      const exp = LocalStorage.getItem('tokenExpiresAt');
      console.log(666, exp);

      if (exp) {
        patchState(store, { isLogged: true });
      } else {
        patchState(store, { isLogged: false });
      }
    },
  }),
);
