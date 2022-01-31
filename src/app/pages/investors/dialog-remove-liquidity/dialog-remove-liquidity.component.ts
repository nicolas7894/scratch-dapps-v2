import {Component, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialog} from '@angular/material/dialog';
import {GameService} from '../../../services/game.service';
import {ToastrService} from 'ngx-toastr';
import {FormControl, Validators} from "@angular/forms";

@Component({
  selector: 'app-dialog-remove-liquidity',
  templateUrl: './dialog-remove-liquidity.component.html',
  styleUrls: ['./dialog-remove-liquidity.component.scss']
})
export class DialogRemoveLiquidityComponent implements OnInit {

  amount = new FormControl(0, [Validators.required]);
  disabledButton: boolean;

  constructor(
    private dialog: MatDialog,
    private _gameService: GameService,
    @Inject(MAT_DIALOG_DATA) public data: {address: string},
    private toaster: ToastrService
  ) {
  }

  ngOnInit(): void {
  }

  public async withdraw() {
    if (this.amount.valid) {
      this.disabledButton = true;
      console.log(this.data);
      await this._gameService.removeLiquidity(this.data.address, this.amount.value);
      this.disabledButton = false;
      this.dialog.closeAll();
    }
  }
}
