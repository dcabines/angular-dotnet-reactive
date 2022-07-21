import { HttpClient, HttpXhrBackend } from '@angular/common/http';
import { filter, map, switchMap } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { Item } from './item';
import { Action, actions$ } from './actions';
import * as actions from './actions';

const baseUrl = 'http://localhost:5000/items';

const http = new HttpClient(
  new HttpXhrBackend({
    build: () => new XMLHttpRequest()
  })
);

const getAllItems$ = actions$.pipe(
  filter((action) => action.type === 'getAllItems'),
  switchMap(() =>
    http.get<Item[]>(baseUrl).pipe(
      map((items) => actions.getAllItemsSuccess(items))
    )
  )
);

const addItem$ = actions$.pipe(
  filter((action) => action.type === 'addItem'),
  filter(({ item }) => Boolean(item)),
  map(({ item }) => item as Item),
  switchMap((item) =>
    http.post<Item>(baseUrl, item).pipe(
      map((newItem) => actions.addItemSuccess(newItem))
    )
  )
);

const deleteItem$ = actions$.pipe(
  filter((action) => action.type === 'deleteItem'),
  filter(({ item }) => Boolean(item)),
  map(({ item }) => item as Item),
  switchMap((item) =>
    http.delete(`${baseUrl}/${item.id}`).pipe(
      map(() => actions.deleteItemSuccess(item))
    )
  )
);

const updateItem$ = actions$.pipe(
  filter((action) => action.type === 'updateItem'),
  filter(({ item }) => Boolean(item)),
  map(({ item }) => item as Item),
  switchMap((item) =>
    http.put<Item>(`${baseUrl}/${item.id}`, item).pipe(
      map((updatedItem) => actions.updateItemSuccess(updatedItem))
    )
  )
);

export const effects: Observable<Action>[] = [
  getAllItems$,
  addItem$,
  deleteItem$,
  updateItem$
];