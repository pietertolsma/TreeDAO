import { ethers } from "ethers";
import { Button, Box, Center, Heading, Link, Text, Flex, Stack, SimpleGrid } from '@chakra-ui/react'
import { useEffect, useMemo, useState } from "react";

import sdk from "../scripts/1-initialize-sdk";

const bundleDropModule = sdk.getBundleDropModule(
  "0x156E3800528CC8604C77788f9d629D47113479d4",
);

const tokenModule = sdk.getTokenModule(
  "0x5fE4cf831d7E4A23aF72BeBC12622CCdcb32f8DD"
);

export default function MemberListComponent() {

  const [memberTokenAmounts, setMemberTokenAmounts] = useState({});

  const [memberAddresses, setMemberAddresses] = useState([]);

  const [totalSupply, setTotalSupply] = useState(1);

  const shortenAddress = (str) => {
    return str.substring(0,6) + "..." + str.substring(str.length - 4);
  }

  
  useEffect(() => {

    bundleDropModule
      .getAllClaimerAddresses("0")
      .then((addresses) => {
        setMemberAddresses(["0x96E88D1296D7A44c32684fbB1d9eB88e2D498cfd", "0xFeBC446D3D76D12b51FCdA642d81a7B8CB7E77bD", ...addresses]);
      })
      .catch((err) => {
        console.error("Failed to fetch members", err);
      });
  });

  useEffect(() => {

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
        setMemberTokenAmounts(amounts);
      })
      .catch((err) => {
        console.error("Failed to fetch amounts", err);
      });
  });

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
    return (<SimpleGrid columns={2} key={index}>
      <Text>{shortenAddress(address)}</Text>
      <Text>{tokenAmount + " SAPLING (" + Math.floor(1000 * (tokenAmount / totalSupply)) / 10 + "%)"}</Text>
    </SimpleGrid>)
  });

  return (
    <Flex direction="column">

        <Heading m="4">Member list:</Heading>
        <Flex align="center" direction="column">
        <SimpleGrid columns={2} key={index}>
          <Text>Adress</Text>
          <Text>Ownership</Text>
        </SimpleGrid>
          {memberListView}
        </Flex>
    </Flex>
  )
}
