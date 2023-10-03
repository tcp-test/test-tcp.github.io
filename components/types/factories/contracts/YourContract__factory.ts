/* Autogenerated file. Do not edit manually. */
/* tslint:disable */
/* eslint-disable */
import {
  Contract,
  ContractFactory,
  ContractTransactionResponse,
  Interface,
} from "ethers";
import type { Signer, ContractDeployTransaction, ContractRunner } from "ethers";
import type { PayableOverrides } from "../../common";
import type {
  YourContract,
  YourContractInterface,
} from "../../contracts/YourContract";

const _abi = [
  {
    inputs: [],
    stateMutability: "payable",
    type: "constructor",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: "address",
        name: "sender",
        type: "address",
      },
      {
        indexed: false,
        internalType: "string",
        name: "purpose",
        type: "string",
      },
    ],
    name: "SetPurpose",
    type: "event",
  },
  {
    stateMutability: "payable",
    type: "fallback",
  },
  {
    inputs: [],
    name: "purpose",
    outputs: [
      {
        internalType: "string",
        name: "",
        type: "string",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "string",
        name: "newPurpose",
        type: "string",
      },
    ],
    name: "setPurpose",
    outputs: [],
    stateMutability: "payable",
    type: "function",
  },
  {
    stateMutability: "payable",
    type: "receive",
  },
] as const;

const _bytecode =
  "0x60c0604052601c60808190527f4275696c64696e6720556e73746f707061626c6520417070732121210000000060a090815261003e9160009190610044565b50610118565b828054610050906100dd565b90600052602060002090601f01602090048101928261007257600085556100b8565b82601f1061008b57805160ff19168380011785556100b8565b828001600101855582156100b8579182015b828111156100b857825182559160200191906001019061009d565b506100c49291506100c8565b5090565b5b808211156100c457600081556001016100c9565b600181811c908216806100f157607f821691505b6020821081141561011257634e487b7160e01b600052602260045260246000fd5b50919050565b6105a9806101276000396000f3fe60806040526004361061002a5760003560e01c806370740aab14610033578063eb68757f1461005e57005b3661003157005b005b34801561003f57600080fd5b50610048610071565b604051610055919061035e565b60405180910390f35b61003161006c36600461038e565b6100ff565b6000805461007e9061043f565b80601f01602080910402602001604051908101604052809291908181526020018280546100aa9061043f565b80156100f75780601f106100cc576101008083540402835291602001916100f7565b820191906000526020600020905b8154815290600101906020018083116100da57829003601f168201915b505050505081565b8051610112906000906020840190610278565b506101ce336040518060400160405280600e81526020016d73657420707572706f736520746f60901b8152506000805461014b9061043f565b80601f01602080910402602001604051908101604052809291908181526020018280546101779061043f565b80156101c45780601f10610199576101008083540402835291602001916101c4565b820191906000526020600020905b8154815290600101906020018083116101a757829003601f168201915b505050505061020b565b7f6ea5d6383a120235c7728a9a6751672a8ac068e4ed34dcca2ee444182c1812de33600060405161020092919061047a565b60405180910390a150565b61025283838360405160240161022393929190610533565b60408051601f198184030181529190526020810180516001600160e01b031663fb77226560e01b179052610257565b505050565b80516a636f6e736f6c652e6c6f67602083016000808483855afa5050505050565b8280546102849061043f565b90600052602060002090601f0160209004810192826102a657600085556102ec565b82601f106102bf57805160ff19168380011785556102ec565b828001600101855582156102ec579182015b828111156102ec5782518255916020019190600101906102d1565b506102f89291506102fc565b5090565b5b808211156102f857600081556001016102fd565b6000815180845260005b818110156103375760208185018101518683018201520161031b565b81811115610349576000602083870101525b50601f01601f19169290920160200192915050565b6020815260006103716020830184610311565b9392505050565b634e487b7160e01b600052604160045260246000fd5b6000602082840312156103a057600080fd5b813567ffffffffffffffff808211156103b857600080fd5b818401915084601f8301126103cc57600080fd5b8135818111156103de576103de610378565b604051601f8201601f19908116603f0116810190838211818310171561040657610406610378565b8160405282815287602084870101111561041f57600080fd5b826020860160208301376000928101602001929092525095945050505050565b600181811c9082168061045357607f821691505b6020821081141561047457634e487b7160e01b600052602260045260246000fd5b50919050565b60018060a01b0383168152600060206040818401526000845481600182811c9150808316806104aa57607f831692505b8583108114156104c857634e487b7160e01b85526022600452602485fd5b60408801839052606088018180156104e757600181146104f857610523565b60ff19861682528782019650610523565b60008b81526020902060005b8681101561051d57815484820152908501908901610504565b83019750505b50949a9950505050505050505050565b6001600160a01b038416815260606020820181905260009061055790830185610311565b82810360408401526105698185610311565b969550505050505056fea264697066735822122009c55beefac01d75f188c9da33f5a40e8496e8e7c28de4ecba6544d23686490e64736f6c634300080a0033";

type YourContractConstructorParams =
  | [signer?: Signer]
  | ConstructorParameters<typeof ContractFactory>;

const isSuperArgs = (
  xs: YourContractConstructorParams
): xs is ConstructorParameters<typeof ContractFactory> => xs.length > 1;

export class YourContract__factory extends ContractFactory {
  constructor(...args: YourContractConstructorParams) {
    if (isSuperArgs(args)) {
      super(...args);
    } else {
      super(_abi, _bytecode, args[0]);
    }
  }

  override getDeployTransaction(
    overrides?: PayableOverrides & { from?: string }
  ): Promise<ContractDeployTransaction> {
    return super.getDeployTransaction(overrides || {});
  }
  override deploy(overrides?: PayableOverrides & { from?: string }) {
    return super.deploy(overrides || {}) as Promise<
      YourContract & {
        deploymentTransaction(): ContractTransactionResponse;
      }
    >;
  }
  override connect(runner: ContractRunner | null): YourContract__factory {
    return super.connect(runner) as YourContract__factory;
  }

  static readonly bytecode = _bytecode;
  static readonly abi = _abi;
  static createInterface(): YourContractInterface {
    return new Interface(_abi) as YourContractInterface;
  }
  static connect(
    address: string,
    runner?: ContractRunner | null
  ): YourContract {
    return new Contract(address, _abi, runner) as unknown as YourContract;
  }
}