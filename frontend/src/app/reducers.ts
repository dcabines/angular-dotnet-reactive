import { actions$ } from './actions';
import { filter, map, withLatestFrom } from 'rxjs/operators';
import { Item } from './item';
import { AppState, state$ } from './state';
import { Observable } from 'rxjs';

const getAllItems$ = actions$.pipe(
  filter((action) => action.type === 'getAllItems'),
  map(() => ({ isLoading: true }))
);

const getAllItemsSuccess$ = actions$.pipe(
  filter((action) => action.type === 'getAllItemsSuccess'),
  map(({ items }) => ({ isLoading: false, items }))
);

const addItemSuccess$ = actions$.pipe(
  filter((action) => action.type === 'addItemSuccess'),
  filter(({ item }) => Boolean(item)),
  map(({ item }) => item as Item),
  withLatestFrom(
    state$.pipe(map((state) => state.items)),
    (item, items) => [item, ...items]
  ),
  map((items) => ({ items }))
);

const deleteItemSuccess$ = actions$.pipe(
  filter((action) => action.type === 'deleteItemSuccess'),
  filter(({ item }) => Boolean(item)),
  map(({ item }) => item as Item),
  withLatestFrom(
    state$.pipe(map((state) => state.items)),
    (item, items) => items.filter((x) => x.id !== item.id)
  ),
  map((items) => ({ items }))
);

const updateItemSuccess$ = actions$.pipe(
  filter((action) => action.type === 'updateItemSuccess'),
  filter(({ item }) => Boolean(item)),
  map(({ item }) => item as Item),
  withLatestFrom(
    state$.pipe(map((state) => state.items)),
    (item, items) =>
      items.map((existingItem) =>
        existingItem.id === item.id
          ? item
          : existingItem
      )
  ),
  map((items) => ({ items }))
);

export const reducers: Observable<Partial<AppState>>[] = [
  getAllItems$,
  getAllItemsSuccess$,
  addItemSuccess$,
  deleteItemSuccess$,
  updateItemSuccess$
];
