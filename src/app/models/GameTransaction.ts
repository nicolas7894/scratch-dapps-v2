export class GameTransaction {
  transactionHash: string;
  playerNumbers: Array<number>;
  createdAt: Date;
  winningNumber: Array<number>;
  gameContractAddress: string;

  constructor(transaction) {
    this.createdAt = transaction.block_timestamp;
    this.playerNumbers = transaction.data.playerNumbers;
    this.winningNumber = transaction.data._randomNumber;
    this.transactionHash = transaction.transaction_hash;
    this.gameContractAddress = transaction.address;
  }

  get isRowWinner() {
    if (this.winningNumber?.length !== this.playerNumbers?.length) {
      return false;
    }
    for (let i = 0; i < this.winningNumber.length; i++) {
      if (!this.playerNumbers?.includes(this.winningNumber[i])) {
        return false;
      }
    }
    return true;
  }
}
