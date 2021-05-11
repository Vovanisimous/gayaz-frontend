import {IContract, IContractRequestData} from "../entities/contract.entity";
import {transport} from "../services/Transport";

interface IContractHook {
    getContracts: () => Promise<IContract[]>
    getContract: (contractId: string) => Promise<IContract>
    deleteContract: (contractId: string) => Promise<void>
    createContract: (contract: IContractRequestData) => Promise<IContract>
}

export const useContract = (): IContractHook => {
    const getContracts = async () => {
        return await transport.get<IContract[]>('contract')
    }

    const getContract = async (contractId: string) => {
        return await transport.get<IContract>(`contract/${contractId}`)
    }

    const deleteContract = async (contractId: string) => {
        return await transport.post<any, {}>(`contract/${contractId}`, {})
    }

    const createContract = async (contract: IContractRequestData) => {
        return await transport.post<IContract, IContractRequestData>('contract', contract)
    }

    return {createContract, deleteContract, getContract, getContracts}
}