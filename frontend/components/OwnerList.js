import { Heading, Text, Flex, Stack } from '@chakra-ui/react'
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
    return (<Stack direction="row" key={index}>
      <Text>{shortenAddress(address)}</Text>
      <Text>{tokenAmount + " SAPLING (" + Math.floor(1000 * (tokenAmount / totalSupply)) / 10 + "%)"}</Text>
    </Stack>)
  });

  return (
    <Flex direction="column">
        <Heading m="4" fontSize="l">Member list:</Heading>
        <Flex align="center" direction="column">
          {memberListView}
        </Flex>
    </Flex>
  )
}
