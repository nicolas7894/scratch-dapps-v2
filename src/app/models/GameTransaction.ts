export class GameTransaction {
  playerNumbers: Array<number>;
  createdAt: Date;
  winningNumber: Array<number>;
  transactionHash: string;
  playerAddress: string;
  gameContractAddress: string;

  constructor(transaction) {
    this.createdAt = transaction.createdAt;
    this.playerNumbers = transaction.playerNumbers;
    this.playerAddress = transaction.playerAddress;
    this.winningNumber = transaction.winningNumber;
    this.transactionHash = transaction.transactionHash;
    this.gameContractAddress = transaction.gameContractAddress;
  }

  get isRowWinner() {
    if (this.winningNumber.length !== this.playerNumbers.length) {
      return false;
    }
    for (let i = 0; i < this.winningNumber.length; i++) {
      if (!this.playerNumbers.includes(this.winningNumber[i])) {
        return false;
      }
    }
    return true;
  }
}
