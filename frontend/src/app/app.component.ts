import { ChangeDetectionStrategy, Component } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Item } from './item';
import { ItemService } from './item-service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AppComponent {
  isLoading$: Observable<boolean>;
  items$: Observable<Item[]>;

  hasItems$: Observable<boolean>;
  itemCount$: Observable<number>;

  constructor(private service: ItemService) {
    this.isLoading$ = service.isLoading$;
    this.items$ = service.items$;

    this.itemCount$ = service.items$.pipe(
      map(items => items.length)
    );

    this.hasItems$ = this.itemCount$.pipe(
      map(itemCount => itemCount > 0)
    );

    this.service.getAllItems();
  }

  onReloadClick() {
    this.service.getAllItems();
  }

  onItemClick(item: Item) {
    this.service.getAllItems();
  }
}
