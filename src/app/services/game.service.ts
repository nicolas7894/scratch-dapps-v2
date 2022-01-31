import { Injectable } from '@angular/core';
import { Game } from '../models/Game';
import { GameTransaction } from '../models/GameTransaction';
import { environment } from './../../environments/environment';
import { FactoryAbi } from 'src/app/abi/Factory.abi';
import { ScratchAbi } from 'src/app/abi/Scratch.abi';
import { EventService } from 'src/app/services/event.service';
import { UserService } from 'src/app/services/user.service';
import { NetWorkService } from 'src/app/services/network.service';

declare var Moralis;
Moralis.start({
  serverUrl: environment.server_url,
  appId: environment.app_id,
});
@Injectable({
  providedIn: 'root',
})
export class GameService {
  factoryAddress = '0x055158B128f8CF9867eaFd113EeCd6ab2E9a80cA';
  zeroAddress = '0x0000000000000000000000000000000000000000';
  constructor(
    private _eventService: EventService,
    private _netWorkService: NetWorkService
  ) {
  }

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
        _mode: "1"
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
    await Moralis.executeFunction(sendOptions);
    await this._eventService.liquidityAdded(scratcherAddress);
  }

  async removeLiquidity(scratcherAddress: string, quantity: number) {
    await Moralis.enableWeb3();
    const sendOptions = {
      contractAddress: scratcherAddress,
      functionName: 'removeLiquidity',
      params: { _amount: Moralis.Units.ETH(quantity) },
      abi: ScratchAbi.abi,
    };
    await Moralis.executeFunction(sendOptions);
    await this._eventService.liquidityRemoved(scratcherAddress);
  }

  async getTotalSupply(scratcherAddress: string) {
    await Moralis.enableWeb3();
    const sendOptions = {
      contractAddress: scratcherAddress,
      functionName: 'totalSupply',
      abi: ScratchAbi.abi,
    };
    return Moralis.Units.FromWei(await Moralis.executeFunction(sendOptions));
  }

  async playGame(
    scratcherAddress: string,
    selectedNumber: Array<any>,
    ticketPrice
  ) {
    await Moralis.enableWeb3();
    const sendOptions = {
      contractAddress: scratcherAddress,
      functionName: 'playGame',
      msgValue: Moralis.Units.ETH(ticketPrice.toString()),
      params: { _selectedNumber: selectedNumber },
      abi: ScratchAbi.abi,
    };
    await Moralis.executeFunction(sendOptions);
    await this._eventService.drawn(scratcherAddress);
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
    const sendOptions = {
      contractAddress: scratcherAddress,
      functionName: 'getReserve',
      abi: ScratchAbi.abi,
    };
    const reserve = Moralis.Units.FromWei(await Moralis.executeFunction(sendOptions));
    return reserve;
  }

  async getTransactionLiquididty(filter: any) {
    return await Moralis.Cloud.run('getPositions', filter);
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

  async getDrawnTransactions(contractAddress) {
    const options = {
      chain: '0xa869',
      address: contractAddress,
      topic:
        '0xce870b5a6ec6a9d611c9b988a73379847061a65e3551b6070420405c3189e5f6',
      abi: {
        anonymous: false,
        inputs: [
          {
            indexed: false,
            internalType: 'uint256[]',
            name: 'playerNumbers',
            type: 'uint256[]',
          },
          {
            indexed: false,
            internalType: 'uint256[]',
            name: '_randomNumber',
            type: 'uint256[]',
          },
        ],
        name: 'Drawn',
        type: 'event',
      },
    };
    const results = await Moralis.Web3API.native.getContractEvents(options);
    console.log(results);
    return results.result.map((result) => new GameTransaction(result));

  }

  async getAllPosition() {
    const positions = [];
    const erc20Tokens = await Moralis.Web3.getAllERC20({
      chain: await this._netWorkService.getName(),
    });
    await Promise.all(
      await erc20Tokens.map(async (token) => {
        if (token.symbol == 'SCR') {
          const game = await this.getOne(token.tokenAddress);
          if (game) {
            token.balance = Moralis.Units.FromWei(token.balance);
            token.gameName = game.name;
            positions.push(token);
          }
        }
      })
    );
    return positions;
  }
}
