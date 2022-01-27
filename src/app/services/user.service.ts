import { Injectable } from '@angular/core';
import { environment } from './../../environments/environment';


declare var Moralis;
Moralis.start({
  serverUrl: environment.server_url,
  appId: environment.app_id,
  masterKey: environment.masterKey,
});

@Injectable({
  providedIn: 'root'
})
export class UserService {

  constructor() { }

  async getCurrentUser() {
    return await Moralis.User.current();
  }

  async authenticate() {
    return await Moralis.authenticate();
  }

  async logOut() {
    return await Moralis.User.logOut();
  }
}
