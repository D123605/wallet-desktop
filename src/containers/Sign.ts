import { changeSignFocus, signMessage, updateSignForm, updateVerifyForm, verifyMessage } from '@actions'
import { Sign as SignPresentation } from '@components'
import { Dispatch, RootState } from '@store'
import { RawMessage, SignBehaviour, SignedMessage, Wallet } from '@types'
import { connect } from 'react-redux'

const mapStateToProps = ({ sign, wallets, passwords, accounts }: RootState) => {
  const activeWallet = wallets.activeWallet as Wallet
  const isWalletUnlocked = accounts.accountsMap[activeWallet.publicKey].isUnlocked
  const decryptedPrivateKey = isWalletUnlocked ? passwords.livePasswords[activeWallet.publicKey].privateKey : ''
  return {
    decryptedPrivateKey,
    isWalletUnlocked,
    focus: sign.focus,
    signature: sign.signature,
    isValidSignature: sign.isValidSignature,
    signData: sign.signData,
    verifyData: sign.verifyData,
  }
}

const mapDispatchToProps = (dispatch: Dispatch) => ({
  changeSignFocus: (focus: SignBehaviour): void => {
    dispatch(changeSignFocus(focus))
  },
  handleSignFormChange: (field: keyof RawMessage, newValue: string) => {
    dispatch(updateSignForm({ field, newValue }))
  },
  handleVerifyFormChange: (field: keyof SignedMessage, newValue: string) => {
    dispatch(updateVerifyForm({ field, newValue }))
  },
  signMessage: (signature: string) => dispatch(signMessage(signature)),
  verifyMessage: (isValid: boolean) => dispatch(verifyMessage(isValid)),
})

export type SignProps = ReturnType<typeof mapStateToProps> & ReturnType<typeof mapDispatchToProps>
export const Sign = connect(mapStateToProps, mapDispatchToProps)(SignPresentation)