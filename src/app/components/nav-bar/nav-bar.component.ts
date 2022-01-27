import { Component, OnInit } from '@angular/core';
import { UserService } from 'src/app/services/user.service';


@Component({
  selector: 'nav-bar',
  templateUrl: './nav-bar.component.html',
  styleUrls: ['./nav-bar.component.scss'],
})
export class NavBarComponent implements OnInit {
  public isLoggedIn = false;
  public user;
  constructor(private _userService: UserService) {
    this.initCurrentUser();
  }

  async initCurrentUser() {
    this.user = await this._userService.getCurrentUser();
    if (this.user) this.isLoggedIn = true;
  }

  async logIn() {
    if (this.user) return;
    await this._userService.authenticate();
    await this.initCurrentUser();
  }

  async logOut() {
    this._userService.logOut();
    this.isLoggedIn = false;
    this.user = null;
  }

  ngOnInit(): void {}
}
