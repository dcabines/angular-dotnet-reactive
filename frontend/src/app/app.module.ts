import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';

import { AppComponent } from './app.component';
import { reducers } from './reducers';
import { effects } from './effects';
import { actions$ } from './actions';
import { stateUpdater$ } from './state';

@NgModule({
  declarations: [AppComponent],
  imports: [BrowserModule, HttpClientModule],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {
  constructor() {
    reducers.forEach((reducer) =>
      reducer.subscribe((newState) => stateUpdater$.next(newState))
    );

    effects.forEach((effect) =>
      effect.subscribe((action) => actions$.next(action))
    );
  }
}
