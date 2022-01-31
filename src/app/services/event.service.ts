import {Injectable} from '@angular/core';
import {environment} from './../../environments/environment';
import {ethers, providers, utils} from 'ethers';
import {ScratchAbi} from 'src/app/abi/Scratch.abi';
import {UserService} from 'src/app/services/user.service';
import {GameTransaction} from '../models/GameTransaction';
import {ToastrService} from "ngx-toastr";
import {Subject} from "rxjs";

declare const window: any;
declare var Moralis;
Moralis.start({
  serverUrl: environment.server_url,
  appId: environment.app_id,
  masterKey: environment.masterKey,
});

@Injectable({
  providedIn: 'root',
})
export class EventService {

  public liquidityChange$ = new Subject();
  public drawn$ = new Subject();

  constructor(private _userService: UserService, private toaster: ToastrService) {
  }

  async drawn(smartContractAddress) {
    const provider = new providers.Web3Provider(window.ethereum);
    const contract = new ethers.Contract(
      smartContractAddress,
      ScratchAbi.abi,
      provider
    );

    contract.on('Drawn', async (playerNumbers, winningNumber, listener) => {
      const user = await this._userService.getCurrentUser();
      const transaction = new GameTransaction({
        playerNumbers: playerNumbers.map((value) => value.toString()),
        gameContractAddress: smartContractAddress,
        winningNumber: winningNumber.map((value) => value.toString()),
        transactionHash: listener.transactionHash,
        playerAddress: user.get('ethAddress'),
      });
      if (transaction.isRowWinner) this.toaster.success('You win prize!', 'Game', {positionClass: 'toast-bottom-right'});
      else this.toaster.warning('You loose, play again!', 'Game', {positionClass: 'toast-bottom-right'});
      this.liquidityChange$.next({smartContractAddress});
      this.drawn$.next({smartContractAddress, playerNumbers, winningNumber});
      listener.removeListener();
    });
  }

  async liquidityAdded(smartContractAddress) {
    const provider = new providers.Web3Provider(window.ethereum);
    const contract = new ethers.Contract(
      smartContractAddress,
      ScratchAbi.abi,
      provider
    );
    contract.on('LiquidityAdded', async (quantity, listener) => {
      this.liquidityChange$.next({smartContractAddress});
      this.toaster.success('Adding confirmed!', 'Liquidity', {positionClass: 'toast-bottom-right'});
    });
  }

  async liquidityRemoved(smartContractAddress) {
    this.toaster.info('Withdraw in progress!', 'Liquidity', {positionClass: 'toast-bottom-right'});
    const provider = new providers.Web3Provider(window.ethereum);
    const contract = new ethers.Contract(
      smartContractAddress,
      ScratchAbi.abi,
      provider
    );
    contract.on('LiquidityRemoved', async (quantity, listener) => {
      this.liquidityChange$.next({smartContractAddress});
      this.toaster.success('Withdraw confirmed!', 'Liquidity', {positionClass: 'toast-bottom-right'});
    });
  }
}
