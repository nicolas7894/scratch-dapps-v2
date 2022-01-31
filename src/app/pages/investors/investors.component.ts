import { Component, OnInit } from '@angular/core';
import { GameService } from 'src/app/services/game.service';
import { MatDialog } from '@angular/material/dialog';
import { DialogRemoveLiquidityComponent } from 'src/app/pages/investors/dialog-remove-liquidity/dialog-remove-liquidity.component'
import {EventService} from "../../services/event.service";

@Component({
  selector: 'app-investors',
  templateUrl: './investors.component.html',
  styleUrls: ['./investors.component.scss'],
})
export class InvestorsComponent implements OnInit {
  positions: any;

  constructor(
    private _gameService: GameService,
    private _eventService: EventService,
    private dialog: MatDialog,
  ) {}

  async ngOnInit() {
    await this.getAllPosition();
    await this.calculateEstimatedReward();
    this._eventService.liquidityChange$.subscribe(async address => {
      await this.getAllPosition();
    });
  }

  async calculateEstimatedReward() {
    for (let index = 0; index < this.positions.length; index++) {
      const position = this.positions[index];
      const totalSupply = await this._gameService.getTotalSupply(position.tokenAddress);
      const gameLiqudity = await this._gameService.getLiquidity(position.tokenAddress);
      position.estimatedReward = (gameLiqudity * position.balance) / totalSupply;
      position.percentageChange = 100 * ((position.estimatedReward - position.balance) /position.balance)
    }
  }

  openRemoveLiquidity(gameAddress) {
    console.log(gameAddress);
    const dialogRef = this.dialog.open(DialogRemoveLiquidityComponent, {
      data: { address: gameAddress },
    });

    dialogRef.afterClosed().subscribe((result) => {
      console.log(`Dialog result: ${result}`);
    });
  }

  async getAllPosition() {
    this.positions = await this._gameService.getAllPosition();
  }

}
