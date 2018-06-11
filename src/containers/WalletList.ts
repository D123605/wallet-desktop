import { changeView, deleteWallet, selectWallet } from '@actions'
import { getPasswordConfirmation, WalletList as WalletsPresentation } from '@components'
import { Dispatch, RootState } from '@store'
import { View, Wallet } from '@types'
import { connect } from 'react-redux'

const mapStateToProps = ({ wallets, view }: RootState) => ({
  currentWallet: view.currentView === View.dashboard ? wallets.currentlySelected : -1,
  wallets: wallets.walletList,
})

const mapDispatchToProps = (dispatch: Dispatch) => ({
  addWallet: () => dispatch(changeView(View.create)),
  selectWallet: (walletIndex: number) => {
    dispatch(selectWallet(walletIndex))
    dispatch(changeView(View.dashboard))
  },
  deleteWallet: async (wallet: Wallet) => {
    const isSureToDelete = await sweetAlert({
      buttons: ['Go back', 'Delete Account'],
      dangerMode: true,
      icon: 'warning',
      text: 'Once deleted, you will not be able to recover this account.',
      title: 'Are you sure?',
    })
    if (!isSureToDelete) {
      return
    }
    const { value: decryptedPrivateKeyOrEmpty } = await getPasswordConfirmation(wallet)
    if (decryptedPrivateKeyOrEmpty !== '') {
      dispatch(deleteWallet({ ...wallet, decryptedPrivateKey: decryptedPrivateKeyOrEmpty }))
    }
  },
})

export const WalletList = connect(mapStateToProps, mapDispatchToProps)(WalletsPresentation)
