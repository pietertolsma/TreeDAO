import { Contract, ethers } from "ethers";
import { GOVERNANCE_ADDRESS, SAPLING_ADDRESS } from "./constants";

export const getSaplingOwners = (provider) => {
    return new Promise(async (resolve, reject) => {
        const abi = ["event Transfer(address indexed src, address indexed dst, uint val)"]
        const contract = new Contract(SAPLING_ADDRESS, abi, provider.getSigner(0))

        const eventFilter = await contract.filters.Transfer(null, null);
        const events = await contract.queryFilter(eventFilter)

        const owners = {}

        for (const evt of events) {
            const src = evt.args[0]
            const dst = evt.args[1]
            const amount = parseFloat(ethers.utils.formatEther(evt.args[2]));

            if (parseInt(src) != 0) {
                if (src in owners) {
                    owners[src] -= amount;
                } else {
                    reject("Sender of SAP had no balance");
                }
            }

            if (parseInt(dst) != 0) {
                if (dst in owners) {
                    owners[dst] += amount;
                } else {
                    owners[dst] = amount;
                }
            }
        }

        resolve(owners);

    });
}

export const getProposals = (provider) => {
    return new Promise(async (resolve, reject) => {
        const abi = ["event ProposalCreated(uint proposalId, address proposer, address[] targets, uint[] values, string[] signatures, bytes[] calldatas, uint startBlock, uint endblock, string description)"]
        const contract = new Contract(GOVERNANCE_ADDRESS, abi, provider.getSigner(0))
    
        const eventFilter = await contract.filters.ProposalCreated();
        const events = await contract.queryFilter(eventFilter);

        const proposals = [];

        for (const prop of proposals) {
            console.log(prop);
            //TODO IMPLEMENT THIS
        }

        resolve(proposals);
    });
}
