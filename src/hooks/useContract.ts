import {IContract, IContractRequestData} from "../entities/contract.entity";
import {contract} from "../database/contract";
import { v4 as uuidv4 } from 'uuid';

interface IContractHook {
    getContracts: () => Promise<IContract[]>
    getContract: (contractId: string) => Promise<IContract | undefined>
    deleteContract: (contractId: string) => Promise<void>
    createContract: (contract1: IContractRequestData) => Promise<IContract | undefined>
}

export const useContract = (): IContractHook => {
    const getContracts = async () => {
        // return await transport.get<IContract[]>('contract')
        return contract
    }

    const getContract = async (contractId: string) => {
        // return await transport.get<IContract>(`contract/${contractId}`)
        return contract.find((item) => {
            return item.id === contractId
        })

    }

    const deleteContract = async (contractId: string) => {
        // return await transport.post<any, {}>(`contract/${contractId}`, {})
        const contractIndex = contract.findIndex((item) => {
            return item.id === contractId
        })
        contract.splice(contractIndex, 1)
    }

    const createContract = async (contract1: IContractRequestData) => {
        // return await transport.post<IContract, IContractRequestData>('contract', contract)
        const id = uuidv4()
        contract.push({id: id, ...contract1});
        return getContract(id)
    }

    return {createContract, deleteContract, getContract, getContracts}
}
