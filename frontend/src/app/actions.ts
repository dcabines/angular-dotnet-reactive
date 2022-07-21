import { Subject } from "rxjs";
import { Item } from "./item";

export interface Action {
  type: string;
  item?: Item;
  items?: Item[];
}

export const actions$: Subject<Action> = new Subject();

export const getAllItems = (): Action => ({ type: 'getAllItems' });
export const getAllItemsSuccess = (items: Item[]): Action => ({ type: 'getAllItemsSuccess', items });
export const addItem = (item: Item): Action => ({ type: 'addItem', item });
export const addItemSuccess = (item: Item): Action => ({ type: 'addItemSuccess', item });
export const deleteItem = (item: Item): Action => ({ type: 'deleteItem', item });
export const deleteItemSuccess = (item: Item): Action => ({ type: 'deleteItemSuccess', item });
export const updateItem = (item: Item): Action => ({ type: 'updateItem', item });
export const updateItemSuccess = (item: Item): Action => ({ type: 'updateItemSuccess', item });