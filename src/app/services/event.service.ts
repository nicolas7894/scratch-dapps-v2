import { Injectable } from '@angular/core';
import { environment } from './../../environments/environment';
import { ethers, providers, utils } from 'ethers';
import { ScratchAbi } from 'src/app/abi/Scratch.abi';
import { UserService } from 'src/app/services/user.service';
import { GameTransaction } from '../models/GameTransaction';

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
  constructor(private _userService: UserService) {}

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
      const Mtransaction = Moralis.Object.extend('GameTransaction');
      const mtransaction = new Mtransaction(transaction);
      await mtransaction.save();
      listener.removeListener();
    });
  }
}
