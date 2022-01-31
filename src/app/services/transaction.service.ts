import { Injectable } from '@angular/core';
import { environment } from './../../environments/environment';
import { UserService } from '../services/user.service';
import { ethers, providers, utils } from 'ethers';
import { ScratchAbi } from 'src/app/abi/Scratch.abi';
declare const window: any;

declare var Moralis;
Moralis.start({
  serverUrl: environment.server_url,
  appId: environment.app_id,
});
@Injectable({
  providedIn: 'root',
})
export class TransactionService {
  constructor(private _userService: UserService) {}
}
