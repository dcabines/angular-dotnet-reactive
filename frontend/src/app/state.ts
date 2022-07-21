import { Observable, Subject } from "rxjs";
import { map, scan, startWith, shareReplay } from 'rxjs/operators';
import { Item } from "./item";

export interface AppState {
  isLoading: boolean;
  items: Item[];
}

const initialState: AppState = {
  isLoading: false,
  items: [],
};

export const stateUpdater$: Subject<Partial<AppState>> = new Subject();

export const state$: Observable<AppState> = stateUpdater$.pipe(
  startWith(initialState),
  scan((state, newState) => ({ ...state, ...newState })),
  map((state) => state as AppState)
);

export const items$: Observable<Item[]> = state$.pipe(
  map((state) => state.items),
  shareReplay(1)
);

export const isLoading$: Observable<boolean> = state$.pipe(
  map((state) => state.isLoading),
  shareReplay(1)
);
