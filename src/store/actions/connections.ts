import { Connection, ConnectionStage, Currency, FormUpdate } from '@types'
import { buildAction } from 'typesafe-actions'

export const loadConnections = buildAction('LOAD_CONNECTIONS').empty()
export const loadConnectionsSuccess = buildAction('LOAD_CONNECTIONS_SUCCESS').payload<
  Connection[]
>()
export const loadConnectionsFailure = buildAction('LOAD_CONNECTIONS_FAILURE').payload<Error>()

export const addConnection = buildAction('ADD_CONNECTION').payload<Connection>()
export const selectConnection = buildAction('SELECT_CONNECTION').payload<Connection>()

export const handleConnectionFormChange = buildAction('UPDATE_CONNECTION_FORM').payload<
  FormUpdate<Connection> & { currentStage: ConnectionStage; currentCurrency: Currency }
>()

export const selectForEditConnection = buildAction('SELECT_FOR_EDIT_CONNECTION').payload<
  'endpoint' | 'passphrase'
>()
export const stopEditingConnection = buildAction('STOP_EDITING_CONNECTION').empty()
