import { accountLoadRequest, transferFailed, transferRequest, transferSuccess } from '@actions'
import { transferKinesis } from '@services/transfer'
import { Epic } from '@store'
import { of } from 'rxjs'
import { fromPromise } from 'rxjs/observable/fromPromise'
import { catchError, filter, map, mergeMap, withLatestFrom } from 'rxjs/operators'
import { isActionOf } from 'typesafe-actions'

export const transferRequest$: Epic = (action$, state$) =>
  action$.pipe(
    filter(isActionOf(transferRequest)),
    map(({payload}) => payload),
    withLatestFrom(state$),
    mergeMap(
      ([request, state]) => {
        const sourceWallet = state.wallets.walletList[state.wallets.currentlySelected]
        const connection = state.connections.currentConnection
        return fromPromise(transferKinesis(sourceWallet, connection, request))
          .pipe(
            map(() => transferSuccess(sourceWallet.publicKey)),
            catchError((err) => of(transferFailed(err))),
          )
      },
    ),
  )

export const transferSuccess$: Epic = (action$) =>
  action$.pipe(
    filter(isActionOf(transferSuccess)),
    map(({payload}) => accountLoadRequest(payload)),
  )