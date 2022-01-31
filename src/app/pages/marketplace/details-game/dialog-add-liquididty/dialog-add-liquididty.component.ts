import { Component, OnInit, Inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { GameService } from 'src/app/services/game.service';
import {MAT_DIALOG_DATA, MatDialog} from '@angular/material/dialog';
import {ToastrService} from "ngx-toastr";

export interface DialogData {
  address: string;
}
@Component({
  selector: 'app-dialog-add-liquididty',
  templateUrl: './dialog-add-liquididty.component.html',
  styleUrls: ['./dialog-add-liquididty.component.scss'],
})
export class DialogAddLiquididtyComponent implements OnInit {
  disabledButton: boolean = false;
  liquidityForm: FormGroup;
  liquididty: number;
  sharePool: number = 0;

  constructor(
    private dialog:MatDialog,
    private fb: FormBuilder,
    private _gameService: GameService,
    private toastr: ToastrService,
    @Inject(MAT_DIALOG_DATA) public data: DialogData
  ) {}

  ngOnInit(): void {
    this.createLiquidityForm();
    this.subscribeToFormChange();
  }

  async subscribeToFormChange() {
    this.f.quantity.valueChanges.subscribe(async (value) => {
      this.liquididty = await this.getLiquidity();
      this.updateSahrePool();
    });
  }

  createLiquidityForm() {
    this.liquidityForm = this.fb.group({
      quantity: [null, Validators.required],
    });
  }

  updateSahrePool() {
    if (this.f.quantity.value >= this.liquididty) {
      this.sharePool = 100;
    } else {
      this.sharePool = (100 * this.f.quantity.value) / this.liquididty;
    }
  }

  public get f() {
    return this.liquidityForm.controls;
  }

  async addLiquidity() {
    try {
      if (this.liquidityForm.invalid) return;
      this.disabledButton = true;
      await this._gameService.addLiquididty(
        this.data.address,
        this.f.quantity.value
      );
      this.toastr.info('Deposit in progress!', 'Liquidity', {  positionClass: 'toast-bottom-right'});
      this.disabledButton = false;
      this.dialog.closeAll();
    } catch (error) {
      this.toastr.error('An error occurred!', 'Error', {  positionClass: 'toast-bottom-right'});
      this.disabledButton = false;
    }
  }

  async getLiquidity() {
    return await this._gameService.getLiquidity(this.data.address);
  }
}
