import { Heading, Text, Flex, Stack, SimpleGrid, Divider } from '@chakra-ui/react'
import { useEffect, useMemo, useState } from "react";

import { getMemberAccounts, getTotalSupply } from "../lib/contract";

export default function OwnerList() {

  const [memberAccounts, setMemberAccounts] = useState([]);
  const [totalSupply, setTotalSupply] = useState(1);

  const shortenAddress = (str) => {
    return str.substring(0,6) + "..." + str.substring(str.length - 4);
  }

  useEffect(() => {
    getTotalSupply((res) => setTotalSupply(res), (msg, err) => console.error(msg, err));
    getMemberAccounts((res) => setMemberAccounts(res), (msg, err) => console.error(msg, err));
  }, []);


  const memberListView = memberAccounts.map(({address, tokenAmount}, index) => {
    return (<SimpleGrid columns={2} spacing="5" m="1" direction="row" key={index} width="100%">
      <Text textAlign={"right"}>{shortenAddress(address)}</Text>
      <Text textAlign={"left"}>{tokenAmount + " SAPLING (" + Math.floor(1000 * (tokenAmount / totalSupply)) / 10 + "%)"}</Text>
    </SimpleGrid>)
  });

  return (
    <Flex direction="column" borderWidth="1px" borderRadius="lg" m="5">
        <SimpleGrid columns={2} m="1" spacing="5" direction="row">
          <Text fontSize="lg" fontWeight="bold" textAlign={"right"}>Address</Text>
          <Text fontSize="lg" fontWeight="bold" textAlign={"left"}>Ownership</Text>
        </SimpleGrid>
        <Divider />
        <Flex align="center" direction="column">
          {memberListView}
        </Flex>
    </Flex>
  )
}
