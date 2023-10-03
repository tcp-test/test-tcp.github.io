import { useChainId } from 'wagmi';
import contractsList from "../types/hardhat_contracts.json"


interface Result {
    address:`0x${string}`,
    abi:[]
}

export function useContractInfo(name?: string): Result {
    const chainId = useChainId();
    const address = contractsList[chainId][0].contracts[name].address;
    const abi = contractsList[chainId][0].contracts[name].abi;
    return {
        address,
        abi
    }
}