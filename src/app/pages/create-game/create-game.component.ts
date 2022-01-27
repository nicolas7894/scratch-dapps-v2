import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { GameService } from 'src/app/services/game.service';
import { Router } from '@angular/router';
import { Game } from 'src/app/models/Game';

@Component({
  selector: 'app-create-game',
  templateUrl: './create-game.component.html',
  styleUrls: ['./create-game.component.scss'],
})
export class CreateGameComponent implements OnInit {
  gameForm: FormGroup;
  disabledButton = false;
  submited = false;
  constructor(
    private router: Router,
    private fb: FormBuilder,
    private _gameService: GameService
  ) {}

  ngOnInit(): void {
    this.createGameForm();
    this.subscribeToFormChange();
  }

  createGameForm() {
    this.gameForm = this.fb.group({
      name: [null, Validators.required],
      ticketPrice: [null, Validators.required],
      requiredMatching: [null],
      maxPrize: [0],
      rangeNumber: [
        null,
        [Validators.required, Validators.max(45), Validators.min(1)],
      ],
      hasFixedPrice: [false, Validators.required],
    });
  }

  public get f() {
    return this.gameForm.controls;
  }

  subscribeToFormChange() {
    this.f.rangeNumber.valueChanges.subscribe((value) => {
      this.f.requiredMatching.setValidators([
        Validators.min(1),
        Validators.max(value),
      ]);
    });
  }

  getGameOdds(): number {
    return new Game(this.gameForm.value).odds;
  }

  async create() {
    this.submited = true;
    if (this.gameForm.invalid) return;
    this.disabledButton = true;
    await this._gameService.create(new Game(this.gameForm.value));
    this.disabledButton = false;
    this.router.navigate(['/home']);
  }
}