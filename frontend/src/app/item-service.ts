import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Item } from './item';
import { Observable, Subject } from 'rxjs';
import { filter, map, scan, startWith, switchMap, shareReplay, withLatestFrom } from 'rxjs/operators';

interface Action {
  type: string;
  item?: Item;
  items?: Item[];
}

// Action Creators
const getAllItems = (): Action => ({ type: 'getAllItems' });
const getAllItemsSuccess = (items: Item[]): Action => ({ type: 'getAllItemsSuccess', items });
const deleteItem = (item: Item): Action => ({ type: 'deleteItem', item });
const deleteItemSuccess = (item: Item): Action => ({ type: 'deleteItemSuccess', item });

// State
export interface ItemServiceState {
  isLoading: boolean;
  items: Item[];
}

const initialState: ItemServiceState = {
  isLoading: false,
  items: []
};

const baseUrl = 'http://localhost:5011/items';

@Injectable({ providedIn: 'root' })
export class ItemService {
  // Infrastructure
  private actions$: Subject<Action> = new Subject();
  private stateUpdater$: Subject<Partial<ItemServiceState>> = new Subject();
  private effects$: Observable<Action>[];
  private reducers$: Observable<Partial<ItemServiceState>>[];

  // Selectors
  public state$: Observable<ItemServiceState> = this.stateUpdater$.pipe(
    startWith(initialState),
    scan((state, newState) => ({ ...state, ...newState })),
    map((state) => state as ItemServiceState)
  );

  public items$: Observable<Item[]>;
  public isLoading$: Observable<boolean>;

  // Effects
  private getAllItemsE$ = this.actions$.pipe(
    filter((action) => action.type === 'getAllItems'),
    switchMap(() =>
      this.http.get<Item[]>(baseUrl).pipe(
        map(items => getAllItemsSuccess(items))
      )
    )
  );

  private deleteItemE$ = this.actions$.pipe(
    filter((action) => action.type === 'deleteItem'),
    filter(({ item }) => Boolean(item)),
    map(({ item }) => item as Item),
    switchMap(item =>
      this.http.delete(`${baseUrl}/${item.id}`).pipe(
        map(() => deleteItemSuccess(item))
      )
    )
  );

  // Reducers
  private getAllItemsR$ = this.actions$.pipe(
    filter((action) => action.type === 'getAllItems'),
    map(() => ({ isLoading: true }))
  );

  private getAllItemsSuccessR$ = this.actions$.pipe(
    filter((action) => action.type === 'getAllItemsSuccess'),
    map(({ items }) => ({ isLoading: false, items }))
  );

  private deleteItemSuccessR$ = this.actions$.pipe(
    filter((action) => action.type === 'deleteItemSuccess'),
    withLatestFrom(
      this.state$.pipe(map(state => state.items)),
      ({ item }, items) => items.filter(x => x.id !== item?.id)
    ),
    map(items => ({ items }))
  );

  constructor(private http: HttpClient) {
    this.items$ = this.state$.pipe(map(state => state.items), shareReplay(1));
    this.isLoading$ = this.state$.pipe(map(state => state.isLoading), shareReplay(1));

    this.effects$ = [this.getAllItemsE$, this.deleteItemE$];
    this.reducers$ = [this.getAllItemsR$, this.getAllItemsSuccessR$, this.deleteItemSuccessR$];
  }

  init() {
    this.effects$.forEach(effect =>
      effect.subscribe(action => this.actions$.next(action))
    );

    this.reducers$.forEach(reducer =>
      reducer.subscribe(newState => this.stateUpdater$.next(newState))
    );
  }

  getAllItems() {
    this.actions$.next(getAllItems());
  }

  deleteItem(item: Item) {
    this.actions$.next(getAllItems());
  }
}
