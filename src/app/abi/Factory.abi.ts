export const FactoryAbi = {
  _format: 'hh-sol-artifact-1',
  contractName: 'Factory',
  sourceName: 'contracts/Factory.sol',
  abi: [
    {
      inputs: [
        {
          internalType: 'address',
          name: '_randomNumberGenerator',
          type: 'address',
        },
      ],
      stateMutability: 'nonpayable',
      type: 'constructor',
    },
    {
      anonymous: false,
      inputs: [
        {
          indexed: false,
          internalType: 'address',
          name: 'gameAddress',
          type: 'address',
        },
      ],
      name: 'GameCreated',
      type: 'event',
    },
    {
      inputs: [
        {
          internalType: 'address',
          name: '_token',
          type: 'address',
        },
        {
          internalType: 'uint256',
          name: '_ticketPrice',
          type: 'uint256',
        },
        {
          internalType: 'uint256',
          name: '_maxPrize',
          type: 'uint256',
        },
        {
          internalType: 'uint256',
          name: '_requiredMatching',
          type: 'uint256',
        },
        {
          internalType: 'uint256[]',
          name: '_listNumber',
          type: 'uint256[]',
        },
      ],
      name: 'createGame',
      outputs: [
        {
          internalType: 'address',
          name: '',
          type: 'address',
        },
      ],
      stateMutability: 'nonpayable',
      type: 'function',
    },
  ],
};
