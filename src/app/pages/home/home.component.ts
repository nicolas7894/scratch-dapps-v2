import { Component, OnInit } from '@angular/core';
import { GameService } from 'src/app/services/game.service';
import { environment } from 'src/environments/environment';

declare var Moralis;
Moralis.start({
  serverUrl: environment.server_url,
  appId: environment.app_id,
  masterKey: environment.masterKey,
});

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent implements OnInit {
  games: any;

  constructor(private _gameService: GameService) {}

  ngOnInit(): void {
    this.getGameList();
    this.listenChange();
  }

  async listenChange() {
    let query = new Moralis.Query('ECreateGame');
    let subscription = await query.subscribe();
    subscription.on('update', async () => {
      this.getGameList();
    });
  }

  getLiquidity(gameAddress) {
    return this._gameService.getLiquidity(gameAddress)
  }

  async getGameList() {
    this.games = await this._gameService.get();
    console.log(this.games)
  }
}
