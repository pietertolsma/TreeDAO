import sdk from "../scripts/1-initialize-sdk";

import { ethers } from "ethers";
import { ThirdwebSDK, VoteType } from "@3rdweb/sdk";
import { GOVERNANCE_ADDRESS, SAPLING_ADDRESS, TREEROLE_ADDRESS } from "./constants";
import { saplingAbi } from "./contracts/sapling";
import { treeRoleAbi } from "./contracts/treerole";
import { governanceAbi } from "./contracts/governance";

const tokenModule = sdk.getTokenModule(
    "0x5fE4cf831d7E4A23aF72BeBC12622CCdcb32f8DD"
  );

const bundleDropModule = sdk.getBundleDropModule(
    "0x156E3800528CC8604C77788f9d629D47113479d4",
  );

const voteModule = sdk.getVoteModule("0xFeBC446D3D76D12b51FCdA642d81a7B8CB7E77bD");

export const submitVotes = (account, library, votes) => {
  const signer = library.getSigner(account);
  const module = new ThirdwebSDK(signer).getVoteModule("0xFeBC446D3D76D12b51FCdA642d81a7B8CB7E77bD");

  const voteMap = {'For' : VoteType.For, 'Against' : VoteType.Against, 'Abstain' : VoteType.Abstain};

  return new Promise((success, reject) => {
    for (const vote of votes) {
      if (vote.currentVote != 'Inactive') {
        module.vote(vote.id, voteMap[vote.currentVote]);
      }
    }

    success();
  })
}

export const getHasVoted = (proposalId, account, callback, err) => {
  voteModule.hasVoted(proposalId, account)
    .then((res) => callback(res))
    .catch((error) => err("Failed to fetch vote status for " + proposalId, error))
}

export const getAllProposals = (callback, err) => {
  voteModule.getAll()
    .then((results) => {
      let props = [];
      for (const prop of results) {
        let executions = []
        for (const exec of prop.executions) {
          if (exec.transactionData != "0x") {
            executions.push({
              to: exec.toAddress, 
              eth: exec.nativeTokenValue.toString(),
              sapling: parseFloat(String(tokenModule.contract.interface.decodeFunctionData("mint", prop.executions[0].transactionData)).split(",")[1])
            });
          }
        }

        props.push({
          description: prop.description,
          id: prop.proposalId,
          currentVote: 'Inactive',
          proposer: prop.proposer,
          votes: {
            "Against" : parseInt(ethers.utils.formatEther(prop.votes[0].count)),
            "For" : parseInt(ethers.utils.formatEther(prop.votes[1].count)),
            "Abstain" : parseInt(ethers.utils.formatEther(prop.votes[2].count))
          },
          state: prop.state,
          executions,
        })
      }
      callback(props)
    })
    .catch((error) => err(error));
}

const parseCallData = (functionName, signature, parameters) => {
  let abiCode = [signature]
  let iface = new ethers.utils.Interface(abiCode);
  return iface.encodeFunctionData(functionName, parameters);
}

export const submitProposal = (library, desc, transactions) => {
  const signer = library.getSigner();
  const governanceContract = new ethers.Contract(GOVERNANCE_ADDRESS, governanceAbi, signer);

  return new Promise(async (resolve, reject) => {

    let targets = [];
    let calldatas = []
    let values = [];

    for (const tx of transactions) {
      console.log(tx);
      if (tx.type == 'mint') {
        targets.push(SAPLING_ADDRESS);
        values.push(0);
        calldatas.push(
          parseCallData("transfer", "function transfer(address to, uint256 amount)", [tx.to, ethers.utils.parseEther(tx.amount.toString())])
        );
      } else if (tx.type == 'eth') {
        targets.push(tx.to);
        values.push(ethers.utils.parseEther(tx.amount.toString()));
        calldatas.push(
          parseCallData("send", "function send(uint256 amount)", [ethers.utils.parseEther(tx.amount.toString())])
        );
      } else {
        reject("Unknown transaction type was found. Invalid proposal!");
      }
    }

    const tx = await governanceContract.propose(targets, values, calldatas, desc);
    const res = await tx.wait();
    resolve(res.events[0].args[0]);

  });

};

export const mintMembershipNFT = (signer) => {
  const treeroleContract = new ethers.Contract(TREEROLE_ADDRESS, treeRoleAbi, signer);
  return treeroleContract.mintMembership();
}

export const joinMembersWithBalances = (members, balances) => {
    return members.map((address) => {
        return {
          address,
          tokenAmount: ethers.utils.formatUnits(
            balances[address] || 0,
            18
          )
        };
      });
}

export const getTotalSupply = (provider) => {
  const saplingContract = new ethers.Contract(SAPLING_ADDRESS, saplingAbi, provider);
  return saplingContract.totalSupply();
}

export const getTokens = (address, provider) => {
  const saplingContract = new ethers.Contract(SAPLING_ADDRESS, saplingAbi, provider);
  return saplingContract.balanceOf(address);
}

export const hasMembership = (address, provider) => {
  console.log(address);
  const treeroleContract = new ethers.Contract(TREEROLE_ADDRESS, treeRoleAbi, provider);

  return new Promise(async (resolve, reject) => {
    const res = await treeroleContract.balanceOf(address, 0);
    resolve(parseFloat(res.toNumber()) > 0);
  });
}