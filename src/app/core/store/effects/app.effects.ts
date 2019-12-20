import { Injectable } from '@angular/core';
import { MatDialog } from '@angular/material';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { catchError, mergeMap, take } from 'rxjs/operators';

import { LoginComponent } from '../../../shared/components/login/login.component';
import { AppService } from '../../services';
import * as AppActions from '../actions/app.actions';
import * as AuthActions from '../actions/auth.actions';
import { CoreState } from '../reducers';

@Injectable()
export class AppEffects {
  constructor(
    private actions$: Actions,
    private store: Store<CoreState>,
    private appService: AppService,
    private dialogService: MatDialog
  ) {}

  requestHello$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AppActions.requestHello),
      mergeMap(() =>
        this.appService.getHello().pipe(
          mergeMap((response: any) => [
            AppActions.receiveHello({
              text: response.text
            })
          ]),
          catchError(response => {
            console.error(response);
            return [];
          })
        )
      )
    )
  );

  login$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AppActions.login),
      mergeMap(() => {
        this.dialogService
          .open(LoginComponent)
          .afterClosed()
          .pipe(take(1))
          .subscribe({
            next: value => {
              if (!value) {
                return;
              }

              this.store.dispatch(
                AuthActions.requestToken({
                  userName: value.userName,
                  password: value.password
                })
              );
            }
          });
        return [];
      })
    )
  );

  requestTransactions$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AppActions.requestTransactions),
      mergeMap(() =>
        this.appService.getTransactions().pipe(
          mergeMap((response: any) => [
            AppActions.receiveTransactions({
              transactions: response
            })
          ]),
          catchError(response => {
            console.error(response);
            return [];
          })
        )
      )
    )
  );
}
