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
      listener.removeListener();
    });
  }
}
