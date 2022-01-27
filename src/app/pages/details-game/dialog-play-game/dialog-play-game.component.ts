import { Component, OnInit, Inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { GameService } from 'src/app/services/game.service';
import { MAT_DIALOG_DATA, MatDialog } from '@angular/material/dialog';
import { Game } from 'src/app/models/Game';
import {ToastrService} from "ngx-toastr";

export interface DialogData {
  game: Game;
}

@Component({
  selector: 'app-dialog-play-game',
  templateUrl: './dialog-play-game.component.html',
  styleUrls: ['./dialog-play-game.component.scss'],
})
export class DialogPlayGameComponent implements OnInit {
  number: string;
  disabledButton: boolean = false;
  listNumberForm: Array<any>;

  constructor(
    private dialog:MatDialog,
    private _gameService: GameService,
    @Inject(MAT_DIALOG_DATA) public data: DialogData,
    private toaster: ToastrService
  ) {}

  ngOnInit(): void {
    this.getFormArray();
  }

  checkNumber(index: number) {
    if (this.listNumberForm[index].checked == true) {
      this.listNumberForm[index].checked = false;
    } else {
      if (this.countCheckedButton() == this.data.game.requiredMatching) return;
      this.listNumberForm[index].checked = true;
    }
  }

  getFormArray() {
    this.listNumberForm = this.data.game.listNumber.map((value) => {
      return { checked: false, value };
    });
  }

  countCheckedButton() {
    return this.listNumberForm.reduce(
      (acc, cur) => (cur.checked === true ? ++acc : acc),
      0
    );
  }

  stringToArray(str) {
    let arr = [];
    for (let index = 0; index < str.length; index++) {
      arr.push(str.charAt(index));
    }
    return arr;
  }

  async playGame() {
    try {
      const numberArr = this.listNumberForm.reduce(function (filtered, nbr) {
        if (nbr.checked) {
          filtered.push(nbr.value);
        }
        return filtered;
      }, []);
      if (numberArr.length != this.data.game.requiredMatching) return;
      this.disabledButton = true;
      await this._gameService.playGame(
        this.data.game.address,
        numberArr,
        this.data.game.ticketPrice
      );
      this.toaster.info('Position sent!', 'Game', {  positionClass: 'toast-bottom-right'});
      this.disabledButton = false;
      this.dialog.closeAll();
    } catch (error) {
      this.toaster.error('An error occurred', 'Error');
      this.disabledButton = false;
    }
  }
}
