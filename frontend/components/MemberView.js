import { ethers } from "ethers";
import { Button, Box, Center, Heading, Link, Text, Flex, Stack } from '@chakra-ui/react'
import { useEffect, useMemo, useState } from "react";

import sdk from "../scripts/1-initialize-sdk";
import { BundleDropModule } from "@3rdweb/sdk";
import { useStore } from "../lib/store";
import VisitorComponent from "./VisitorComponent";

const bundleDropModule = sdk.getBundleDropModule(
  "0x156E3800528CC8604C77788f9d629D47113479d4",
);

const tokenModule = sdk.getTokenModule(
  "0x5fE4cf831d7E4A23aF72BeBC12622CCdcb32f8DD"
);

export default function MemberView() {

  const {isMember} = useStore();

  const [memberTokenAmounts, setMemberTokenAmounts] = useState({});

  const [memberAddresses, setMemberAddresses] = useState([]);

  const [totalSupply, setTotalSupply] = useState(1);

  const shortenAddress = (str) => {
    return str.substring(0,6) + "..." + str.substring(str.length - 4);
  }

  useEffect(() => {
    if (!isMember) return;

    tokenModule
      .totalSupply()
      .then((supply) => {
        setTotalSupply(ethers.utils.formatUnits(
          supply || 1,
          18
        ));
      })
      .catch((err) => console.log("Failed to get total supply", err));


    tokenModule
      .getAllHolderBalances()
      .then((amounts) => {
        console.log("amounts: ", amounts);
        setMemberTokenAmounts(amounts);
      })
      .catch((err) => {
        console.error("Failed to fetch amounts", err);
      });

      bundleDropModule
      .getAllClaimerAddresses("0")
      .then((addresses) => {
        setMemberAddresses(["0x96E88D1296D7A44c32684fbB1d9eB88e2D498cfd", "0xFeBC446D3D76D12b51FCdA642d81a7B8CB7E77bD", ...addresses]);
      })
      .catch((err) => {
        console.error("Failed to fetch members", err);
      });
  }, [isMember]);

  const memberList = useMemo(() => {
    return memberAddresses.map((address) => {
      return {
        address,
        tokenAmount: ethers.utils.formatUnits(
          memberTokenAmounts[address] || 0,
          18
        )
      };
    });
  }, [memberAddresses, memberTokenAmounts]);

  const memberListView = memberList.map(({address, tokenAmount}, index) => {
    return (<Stack direction="row" key={index}>
      <Text>{shortenAddress(address)}</Text>
      <Text>{tokenAmount + " SAPLING (" + Math.floor(1000 * (tokenAmount / totalSupply)) / 10 + "%)"}</Text>
    </Stack>)
  });

  return (
    <Flex direction="column">
        <Heading mt="10">Welcome member!</Heading>

        <Heading m="4" fontSize="l">Member list:</Heading>
        <Flex align="center" direction="column">
          {memberListView}
        </Flex>
    </Flex>
  )
}
