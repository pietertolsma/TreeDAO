import { Contract, ethers } from "ethers";
import { GOVERNANCE_ADDRESS, PROPOSAL_STATE, SAPLING_ADDRESS } from "./constants";
import { governanceAbi } from "./contracts/governance";
import { saplingAbi } from "./contracts/sapling";

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

const tryDecode = (abi, fn, calldata) => {
    try {
        const iface = new ethers.utils.Interface(abi);
        return iface.decodeFunctionData(fn, calldata);
    } catch (e) {
        return undefined;
    }
}

export const getProposals = (provider, address) => {

    const governanceContract = new ethers.Contract(GOVERNANCE_ADDRESS, governanceAbi, provider);

    return new Promise(async (resolve, reject) => {
        const abi = ["event ProposalCreated(uint proposalId, address proposer, address[] targets, uint[] values, string[] signatures, bytes[] calldatas, uint startBlock, uint endblock, string description)"]
        const contract = new Contract(GOVERNANCE_ADDRESS, abi, provider.getSigner(0))
    
        const eventFilter = await contract.filters.ProposalCreated();
        const events = await contract.queryFilter(eventFilter);

        const proposals = [];

        for (const e of events) {

            let transactions = [];
            
            let index = 0;
            for (const cd of e.args.calldatas) {

                let res;
                if (res = tryDecode(["function transfer(address to, uint256 amount)"], "transfer", cd)) {
                    transactions.push({
                        "type":  "SAP",
                        "amount" : ethers.utils.formatEther(res.amount),
                        "to" : res.to
                    });
                } else if (res = tryDecode(["function send(uint256 amount)"], "send", cd)) {
                    transactions.push({
                        "type":  "ETH",
                        "amount" : (res / 10**18).toString(),
                        "to" : e.args.targets[index]
                    });
                }

                index++;
            }

            const proposalStatus = await governanceContract.state(e.args.proposalId);
            const hasVoted = await governanceContract.hasVoted(e.args.proposalId, address);

            proposals.push({
                id: e.args.proposalId,
                description: e.args.description,
                proposer: e.args.proposer,
                startBlock: e.args.startBlock,
                endBlock: e.args.endBlock,
                targets: e.args.targets,
                state: PROPOSAL_STATE[proposalStatus],
                hasVoted,
                votes: {
                    'Against' : 0,
                    'For' : 0,
                    'Abstain' : 0
                },
                transactions
            })
        }

        resolve(proposals);
    });
}
