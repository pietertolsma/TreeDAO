import { Heading, Text, Flex, Stack, SimpleGrid, Divider, RangeSlider, RangeSliderTrack, RangeSliderFilledTrack } from '@chakra-ui/react'
import { useEffect, useMemo, useState } from "react";
import useWallet from '../hooks/useWallet';

import { getMemberAccounts, getTotalSupply } from "../lib/contract";
import { shortenAddress } from '../lib/util';

export default function OwnerList() {

  const [memberAccounts, setMemberAccounts] = useState([]);
  const [totalSupply, setTotalSupply] = useState(1);

  const wallet = useWallet();

  useEffect(() => {
    getTotalSupply((res) => setTotalSupply(res), (msg, err) => console.error(msg, err));
    getMemberAccounts((res) => setMemberAccounts(res), (msg, err) => console.error(msg, err));
  }, []);


  const memberListView = memberAccounts.map(({address, tokenAmount}, index) => {
    return (<SimpleGrid columns={2} spacing="5" m="1" direction="row" key={index} width="100%" backgroundColor={address == wallet.address ? "gray.200" : "white"}>
      <Flex justifyContent="right" align="center" height="50px">{shortenAddress(address)}</Flex>
      <Flex height="50px" direction="column" m="0 20px">
        <Text m="1" textAlign={"left"}>{tokenAmount + " 🌳 (" + Math.floor(1000 * (tokenAmount / totalSupply)) / 10 + "%)"}</Text>
        <RangeSlider defaultValue={[0, Math.floor(100 * (tokenAmount / totalSupply))]}>
          <RangeSliderTrack>
            <RangeSliderFilledTrack />
          </RangeSliderTrack>
        </RangeSlider>
      </Flex>
    </SimpleGrid>)
  });

  return (
    <Flex direction="column" borderWidth="1px" maxWidth="500px" margin="20px auto" borderRadius="lg">
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
