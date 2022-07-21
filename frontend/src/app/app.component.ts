import { ChangeDetectionStrategy, Component } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { actions$ } from './actions';
import { Item } from './item';
import { isLoading$, items$ } from './state';
import * as actions from './actions';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AppComponent {
  isLoading$ = isLoading$;
  items$ = items$;

  itemCount$: Observable<number> = items$.pipe(
    map((items) => items.length)
  );

  hasItems$: Observable<boolean> = this.itemCount$.pipe(
    map((itemCount) => itemCount > 0)
  );

  constructor() {
    actions$.next(actions.getAllItems());
  }

  onReloadClick() {
    actions$.next(actions.getAllItems());
  }

  onAddClick() {
    actions$.next(actions.addItem({ id: 0, name: 'New Item' }));
  }

  onItemClick(item: Item) {
    actions$.next(actions.deleteItem(item));
  }

  onUpdateItem(item: Item, name: string) {
    actions$.next(actions.updateItem({ ...item, name }));
  }
}
