import { Injectable } from '@angular/core';
import { environment } from './../../environments/environment';

declare var Moralis;
Moralis.start({
  serverUrl: environment.server_url,
  appId: environment.app_id,
});

@Injectable({
  providedIn: 'root',
})
export class NetWorkService {
  constructor() {}

  async getName() {
    const netWorklist = { 80001: '0x13881', 43113: '0xa869' };
    const web3Provider = await Moralis.enableWeb3();
    const network = await web3Provider.getNetwork();
    return netWorklist[network.chainId];
  }
}
