import { Injectable } from '@angular/core';
import { Game } from '../models/Game';
import { GameTransaction } from '../models/GameTransaction';
import { environment } from './../../environments/environment';
import { FactoryAbi } from 'src/app/abi/Factory.abi';
import { ScratchAbi } from 'src/app/abi/Scratch.abi';
import { EventService } from 'src/app/services/event.service';

declare var Moralis;
Moralis.start({
  serverUrl: environment.server_url,
  appId: environment.app_id,
  masterKey: environment.masterKey,
});
@Injectable({
  providedIn: 'root',
})
export class GameService {
  factoryAddress = '0x886e7695d5f3DE7547E32Bb4EE324bF7291BCCaF';
  zeroAddress = '0x0000000000000000000000000000000000000000';
  constructor(private _eventService: EventService) {}

  async create(gamePayload: Game) {
    await Moralis.enableWeb3();
    const Game = Moralis.Object.extend('Game');
    const game = new Game(gamePayload);
    game.set('odds', gamePayload.odds);
    await game.save();
    const sendOptions = {
      contractAddress: this.factoryAddress,
      functionName: 'createGame',
      abi: FactoryAbi.abi,
      params: {
        _token: this.zeroAddress,
        _ticketPrice: Moralis.Units.ETH(gamePayload.ticketPrice.toString()),
        _maxPrize: gamePayload.maxPrize,
        _requiredMatching: gamePayload.requiredMatching,
        _listNumber: gamePayload.listNumber,
      },
    };
    await Moralis.executeFunction(sendOptions);
    this.handleCreation(game);
    return game;
  }

  async get() {
    const MGame = Moralis.Object.extend('Game');
    const query = new Moralis.Query(MGame);
    const results = await query.find();
    return results.map((result) => new Game(result.attributes));
  }

  async addLiquididty(scratcherAddress: string, quantity: number) {
    await Moralis.enableWeb3();
    const sendOptions = {
      contractAddress: scratcherAddress,
      functionName: 'addLiquidity',
      params: { _tokenAmount: 0 },
      abi: ScratchAbi.abi,
      msgValue: Moralis.Units.ETH(quantity.toString()),
    };
    this.handleLiquidityAdded(scratcherAddress, quantity);
    await Moralis.executeFunction(sendOptions);
  }

  async removeLiquidity(scratcherAddress: string, quantity: number) {
    await Moralis.enableWeb3();
    const sendOptions = {
      contractAddress: scratcherAddress,
      functionName: 'removeLiquidity',
      params: { _amount: quantity },
      abi: ScratchAbi.abi,
    };
    // this.handleLiquidityAdded(scratcherAddress, quantity);
    await Moralis.executeFunction(sendOptions);
  }

  async getTotalSupply(scratcherAddress: string) {
    await Moralis.enableWeb3();
    const sendOptions = {
      contractAddress: scratcherAddress,
      functionName: 'totalSupply',
      abi: ScratchAbi.abi,
    };
    return await Moralis.executeFunction(sendOptions);
  }

  async playGame(
    scratcherAddress: string,
    selectedNumber: Array<any>,
    ticketPrice
  ) {
    console.log(scratcherAddress);
    await Moralis.enableWeb3();
    const sendOptions = {
      contractAddress: scratcherAddress,
      functionName: 'playGame',
      msgValue: Moralis.Units.ETH(ticketPrice.toString()),
      params: { _selectedNumber: selectedNumber },
      abi: ScratchAbi.abi,
    };
    await Moralis.executeFunction(sendOptions);
    this._eventService.drawn(scratcherAddress);
  }

  async getOne(address: string) {
    const MGame = Moralis.Object.extend('Game');
    const query = new Moralis.Query(MGame);
    query.equalTo('address', address);
    const results = await query.find();
    if (!results.length) return;
    return new Game(results[0].attributes);
  }

  async getLiquidity(scratcherAddress) {
    await Moralis.enableWeb3();
    const sendOptions = {
      contractAddress: scratcherAddress,
      functionName: 'getReserve',
      abi: ScratchAbi.abi,
    };

    return Moralis.Units.FromWei(await Moralis.executeFunction(sendOptions));
  }

  async handleLiquidityAdded(address, quantity) {
    const MGame = Moralis.Object.extend('Game');
    const query = new Moralis.Query(MGame);
    query.equalTo('address', address);
    const results = await query.find();
    results[0].set('liquididty', quantity);
    results[0].save();
  }

  async handleCreation(game) {
    let query = new Moralis.Query('ECreateGame');
    let subscription = await query.subscribe();
    subscription.on('create', async (object) => {
      game.set('status', 'done');
      game.set('address', object.attributes.gameAddress);
      game.save();
    });
  }

  async getTransactions(filter: any) {
    const MGame = Moralis.Object.extend('GameTransaction');
    const query = new Moralis.Query(MGame);
    if (filter.gameContractAddress) {
      query.equalTo('gameContractAddress', filter.gameContractAddress);
    }
    const results = await query.find();
    if (!results.length) return;
    return results.map((result) => new GameTransaction(result.attributes));
  }
}
