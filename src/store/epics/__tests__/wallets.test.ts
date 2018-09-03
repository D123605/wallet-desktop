import { unlockWalletFailure, unlockWalletRequest, unlockWalletSuccess } from '@actions'
import { unlockWallet$, walletLockFailure$ } from '../wallets'

import { epicTest } from './helpers'

describe('wallets epic', () => {
  describe('unlock failure', () => {
    it('throws failure alert on failure', async () => {
      const generalFailureAlert = jest.fn(() => Promise.resolve())
      await epicTest({
        epic: walletLockFailure$,
        inputActions: [unlockWalletFailure()],
        expectedActions: [],
        dependencies: { generalFailureAlert },
      })
      expect(generalFailureAlert).toHaveBeenCalled()
    })
  })

  describe('unlock wallet request', () => {
    it('sends success action', async () => {
      const decryptedPrivateKey = 'success'
      const publicKey = 'publicKey'
      const password = 'password'

      const decryptPrivateKey = jest.fn(() => decryptedPrivateKey)

      await epicTest({
        epic: unlockWallet$,
        inputActions: [unlockWalletRequest()],
        expectedActions: [unlockWalletSuccess({ password, publicKey, decryptedPrivateKey })],
        dependencies: { decryptPrivateKey },
        state: {
          wallets: {
            activeWallet: {
              encryptedPrivateKey: 'jumble',
              publicKey,
            },
          },
          passwords: {
            currentInput: password,
          },
        },
      })

      expect(decryptPrivateKey).toHaveBeenCalled()
      expect(decryptPrivateKey).toHaveBeenCalledWith('jumble', password)
    })

    it('sends failure action', async () => {
      const decryptPrivateKey = jest.fn(() => '')

      await epicTest({
        epic: unlockWallet$,
        inputActions: [unlockWalletRequest()],
        dependencies: { decryptPrivateKey },
        expectedActions: [unlockWalletFailure()],
        state: {
          wallets: {
            activeWallet: {
              encryptedPrivateKey: 'jumble',
            },
          },
          passwords: {
            currentInput: 'password',
          },
        },
      })

      expect(decryptPrivateKey).toHaveBeenCalledWith('jumble', 'password')
    })
  })
})