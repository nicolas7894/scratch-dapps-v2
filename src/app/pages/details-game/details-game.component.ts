import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Game } from 'src/app/models/Game';
import { GameTransaction } from 'src/app/models/GameTransaction';
import { GameService } from 'src/app/services/game.service';
import { MatDialog } from '@angular/material/dialog';
import { DialogAddLiquididtyComponent } from 'src/app/pages/details-game/dialog-add-liquididty/dialog-add-liquididty.component';
import { environment } from 'src/environments/environment';
import { DialogPlayGameComponent } from 'src/app/pages/details-game/dialog-play-game/dialog-play-game.component';
import {EventService} from '../../services/event.service';

declare var Moralis;
Moralis.start({
  serverUrl: environment.server_url,
  appId: environment.app_id,
  masterKey: environment.masterKey,
});

@Component({
  selector: 'app-details-game',
  templateUrl: './details-game.component.html',
  styleUrls: ['./details-game.component.scss'],
})
export class DetailsGameComponent implements OnInit {
  gameAddress: string;
  gameTransactions: Array<GameTransaction>;
  game: Game;
  liquidity: number;
  constructor(
    private route: ActivatedRoute,
    private _gameService: GameService,
    private _eventService: EventService,
    private dialog: MatDialog
  ) {}

  async ngOnInit() {
    this._eventService.liquidityChange$.subscribe(async (event: { smartContractAddress: string }) => {
      console.log(event);
      if (this.gameAddress === event.smartContractAddress) this.liquidity = await this._gameService.getLiquidity(event.smartContractAddress);
    });
    this.gameAddress = this.route.snapshot.paramMap.get('address');
    await this.getGameTransactions();
    await this.getGameDetails();
    await this.getGameLiquidity();
  }

  async getGameDetails() {
    this.game = await this._gameService.getOne(this.gameAddress);
    console.log(this.game);
  }

  async getGameLiquidity() {
    this.liquidity = await this._gameService.getLiquidity(this.gameAddress);
  }

  openModalAddLiquidity() {
    const dialogRef = this.dialog.open(DialogAddLiquididtyComponent, {
      data: { address: this.gameAddress },
    });

    dialogRef.afterClosed().subscribe((result) => {
      console.log(`Dialog result: ${result}`);
    });
  }

  openModalPlayGame() {
    const dialogRef = this.dialog.open(DialogPlayGameComponent, {
      data: { game: this.game },
      height: '40%',
      width: '60%'
    });

    dialogRef.afterClosed().subscribe((result) => {
      console.log(`Dialog result: ${result}`);
    });
  }

  async getGameTransactions() {
    this.gameTransactions = await this._gameService.getDrawnTransactions(this.gameAddress);
  }
}
