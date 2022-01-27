import { THIS_EXPR } from '@angular/compiler/src/output/output_ast';

export class Game {
  status: string;
  name: string;
  ticketPrice: number;
  requiredMatching: number;
  maxPrize: number;
  address: string;
  rangeNumber: number;
  liquidity: number;

  constructor(game) {
    this.requiredMatching = game.requiredMatching;
    this.name = game.name;
    this.ticketPrice = game.ticketPrice;
    this.maxPrize = game.maxPrize;
    this.status = game.status ? game.status : 'pending';
    this.rangeNumber = game.rangeNumber;
    this.address = game.address;
    this.liquidity = game.liquididty;
  }

  get odds() {
    const factorialOf = (integer) => {
      let factorial = 1;
      for (let i = 1; i <= integer; i++) {
        factorial *= i;
      }
      return factorial;
    };

    let totalPossibleNumber = this.rangeNumber;
    let numberOfNumberChosen = this.requiredMatching;;
    let num = factorialOf(totalPossibleNumber);
    let denum =
      factorialOf(numberOfNumberChosen) *
      factorialOf(totalPossibleNumber - numberOfNumberChosen);
    return num / denum;
  }

  get listNumber() {
    return Array.from({ length: this.rangeNumber }, (_, i) => i + 1);
  }
}
