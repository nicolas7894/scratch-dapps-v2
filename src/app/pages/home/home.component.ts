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

  async ngOnInit(): Promise<void> {
    await Moralis.enableWeb3();
    await this.getGameList();
    await this.listenChange();
  }

  async listenChange() {
    let query = new Moralis.Query('ECreateGame');
    let subscription = await query.subscribe();
    subscription.on('update', async () => {
      await this.getGameList();
    });
  }

  async getliquidity(gameAddress) {
    return this._gameService.getLiquidity(gameAddress);
  }

  async getGameList() {
    this.games = await this._gameService.get();
    this.games.map(async g => {
      g.liquidity = await this.getliquidity(g.address);
    });
  }
}
