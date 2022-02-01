import sdk from "../scripts/1-initialize-sdk";

import { ethers } from "ethers";
import { useWeb3React } from "@web3-react/core";
import { ThirdwebSDK } from "@3rdweb/sdk";

const tokenModule = sdk.getTokenModule(
    "0x5fE4cf831d7E4A23aF72BeBC12622CCdcb32f8DD"
  );

const bundleDropModule = sdk.getBundleDropModule(
    "0x156E3800528CC8604C77788f9d629D47113479d4",
  );

const voteModule = sdk.getVoteModule("0xFeBC446D3D76D12b51FCdA642d81a7B8CB7E77bD");

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

export const submitProposal = (account, library, {description, to_address, eth_amount, sapling_amount}, callback, err) => {
  const signer = library.getSigner(account);
  const module = new ThirdwebSDK(signer).getVoteModule("0xFeBC446D3D76D12b51FCdA642d81a7B8CB7E77bD");

  const executions = [
    {
      toAddress : to_address,
      nativeTokenValue : eth_amount,
      transactionData: tokenModule.contract.interface.encodeFunctionData("mint", [
        module.address,
        10000
      ]),
    },
  ]

  module.propose(description, executions)
    .then(() => {
      callback(true);
    })
    .catch((error) => {
      err("Failed to propose", error);
    });
};

export const mintMembershipNFT = (account, library, callback, err) => {

  const signer = library.getSigner(account);
  const module = new ThirdwebSDK(signer).getBundleDropModule(
    "0x156E3800528CC8604C77788f9d629D47113479d4");

  module
      .claim("0", 1)
      .then(() => {
        callback(true);
      })
      .catch((error) => {
        err("Failed to claim :(", error);
      });
}

export const getMemberAccounts = (callback, err) => {
    getAllMembers((members) => {
        getAllHolderBalances((balances) => {
            callback(joinMembersWithBalances(members, balances).sort((left, right) => left.tokenAmount < right.tokenAmount));
        }, err);
    }, err);
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

export const getAllMembers = (callback, err) => {
    bundleDropModule
    .getAllClaimerAddresses("0")
    .then((addresses) => {
        // Add contracts as well
      callback(["0x96E88D1296D7A44c32684fbB1d9eB88e2D498cfd", "0xFeBC446D3D76D12b51FCdA642d81a7B8CB7E77bD", ...addresses]);
    })
    .catch((error) => {
      err("Failed to fetch members", error);
    });
}

export const getAllHolderBalances = (callback, err) => {
    tokenModule
      .getAllHolderBalances()
      .then((amounts) => {
        callback(amounts);
      })
      .catch((error) => {
        err("Failed to fetch amounts", error);
      });
}

export const getTotalSupply = (callback, err) => {
    tokenModule
      .totalSupply()
      .then((supply) => {
        callback(ethers.utils.formatUnits(
          supply || 1,
          18
        ));
      })
      .catch((error) => err("Failed to get total supply", error));
}

export const getTokens = (address, callback, err) => {
    tokenModule
        .balanceOf(address)
        .then((balance) => {
            const readableBalance = ethers.utils.formatUnits(
                balance.value || 0,
                18
              );
            callback(readableBalance);
        })
        .catch((error) => {
            err("Failed to get NFT balance", error);
        });
}

export const hasMembership = async (address, callback, err) => {
    bundleDropModule
        .balanceOf(address, "0") // "0" = tokenId
        .then((balance) => {
            if (balance.gt(0)) {
                callback(true);
            } else {
                callback(false);
            }
        })
        .catch((error) => {
            err("Failed to get NFT balance", error);
        });
}