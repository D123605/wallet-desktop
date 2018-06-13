import { changeTransferView, changeWalletView, transferRequest, updateTransferForm } from '@actions'
import { TransferForm as TransferPresentation } from '@components'
import { getFeeInKinesis } from '@services/kinesis'
import { RootState } from '@store'
import { Payee, Wallet } from '@types'
import { connect } from 'react-redux'

const mapStateToProps = ({ wallets, connections, transfer, accounts, payees }: RootState) => {
  const activeWallet = wallets.selectedWallet as Wallet
  const otherWalletsAsPayees: Payee[] = wallets.walletList
    .filter((wallet) => wallet.publicKey !== activeWallet.publicKey)
    .map((wallet): Payee => ({ name: wallet.accountName, publicKey: wallet.publicKey }))
  return {
    ...transfer.form,
    getFee: (amount: number) => getFeeInKinesis(connections.currentConnection, amount),
    isTransferring: transfer.isTransferring,
    isWalletUnlocked: !!activeWallet.decryptedPrivateKey,
    accountBalance: accounts.accountsMap[activeWallet.publicKey].balance,
    payees: payees.payees.concat(otherWalletsAsPayees),
    activeWallet,
  }
}

const mapDispatchToProps = {
  changeWalletView,
  changeTransferView,
  transferRequest,
  updateTransferForm,
}

export type TransferProps = ReturnType<typeof mapStateToProps> & typeof mapDispatchToProps
export const TransferForm = connect(
  mapStateToProps,
  mapDispatchToProps,
)(TransferPresentation)
