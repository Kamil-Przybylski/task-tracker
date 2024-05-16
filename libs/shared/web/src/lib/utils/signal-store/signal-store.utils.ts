import { computed } from '@angular/core';
import {
  patchState,
  signalStoreFeature,
  withComputed,
  withMethods,
  withState,
} from '@ngrx/signals';

export type RequestStatus =
  | 'idle'
  | 'pending'
  | 'fulfilled'
  | { error: string };
export type RequestStatusState = { requestStatus: RequestStatus };

export function withRequestStatus() {
  return signalStoreFeature(
    withState<RequestStatusState>({ requestStatus: 'idle' }),
    withComputed(({ requestStatus }) => ({
      isPending: computed(() => requestStatus() === 'pending'),
      isFulfilled: computed(() => requestStatus() === 'fulfilled'),
      error: computed(() => {
        const status = requestStatus();
        return typeof status === 'object' ? status.error : null;
      }),
    })),
    withMethods((store) => ({
      setPending: () => patchState(store, { requestStatus: 'pending' }),
      setFulfilled: () => patchState(store, { requestStatus: 'fulfilled' }),
      setError: (error: string) =>
        patchState(store, { requestStatus: { error } }),
    })),
  );
}
