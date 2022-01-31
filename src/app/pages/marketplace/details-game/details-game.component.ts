import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Game } from 'src/app/models/Game';
import { GameService } from 'src/app/services/game.service';
import { MatDialog } from '@angular/material/dialog';
import { DialogAddLiquididtyComponent } from 'src/app/pages/details-game/dialog-add-liquididty/dialog-add-liquididty.component';
import { environment } from 'src/environments/environment';
import { DialogPlayGameComponent } from 'src/app/pages/details-game/dialog-play-game/dialog-play-game.component';
import {EventService} from "../../services/event.service";
import {EventService} from "../../services/event.service";

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
  gameTransactions: Array<any>;
  game: Game;
  liquidity: number;
  constructor(
    private route: ActivatedRoute,
    private _gameService: GameService,
    private _eventService: EventService,
    private dialog: MatDialog
  ) {}

  ngOnInit(): void {
    this._eventService.liquidityChange$.subscribe(async (event: { smartContractAddress: string }) => {
      console.log(event);
      if (this.gameAddress === event.smartContractAddress) this.liquidity = await this._gameService.getLiquidity(event.smartContractAddress);
    });
    this.gameAddress = this.route.snapshot.paramMap.get('address');
    this.getGameDetails();
    this.getGameTransactions();
    this.getGameLiquidity();
    this.listenGameChange();
    this.listenGameTransactionChange();
  }

  async getGameDetails() {
    this.game = await this._gameService.getOne(this.gameAddress);
  }

  async getGameLiquidity() {
    this.liquidity = await this._gameService.getLiquidity(this.gameAddress);
  }

  async getGameTransactions() {
    const filter = { gameContractAddress: this.gameAddress };
    this.gameTransactions = await this._gameService.getTransactions(filter);
  }

  async listenGameChange() {
    let query = new Moralis.Query('Game');
    let subscription = await query.subscribe();
    subscription.on('update', async () => {
      this.getGameDetails();
    });
  }

  async listenGameTransactionChange() {
    let query = new Moralis.Query('GameTransaction');
    let subscription = await query.subscribe();
    subscription.on('create', async () => {
      this.getGameTransactions();
    });
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
}
