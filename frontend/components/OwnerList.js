import { Heading, Text, Flex, Stack, SimpleGrid, Divider, RangeSlider, RangeSliderTrack, RangeSliderFilledTrack, Skeleton } from '@chakra-ui/react'
import { ethers } from 'ethers';
import { useEffect, useMemo, useState } from "react";
import useWallet from '../hooks/useWallet';

import { getMemberAccounts, getTotalSupply } from "../lib/contract";
import { getSaplingOwners } from '../lib/scan';
import { useStore } from '../lib/store';
import { shortenAddress } from '../lib/util';

export default function OwnerList() {

  const [memberAccounts, setMemberAccounts] = useState({});
  const {totalSupply, setTotalSupply} = useStore();

  const wallet = useWallet();

  useEffect(() => {
    getTotalSupply(wallet.provider).then((res) => setTotalSupply(parseFloat(ethers.utils.formatEther(res))))
      .catch((reason) => console.error("Something went wrong", reason));
    getSaplingOwners(wallet.provider)
      .then((res) => setMemberAccounts(res))
      .catch((reason) => console.error("Something went wrong", reason));
  }, [totalSupply]);

  const memberListView = Object.keys(memberAccounts).map((address, index) => {
    const tokenAmount = memberAccounts[address];

    if (totalSupply == 0) return (<Text key={index}>Nothing here.</Text>);

    return (<SimpleGrid columns={2} spacing="5" m="1" direction="row" key={index} width="100%" backgroundColor={address == wallet.address ? "gray.200" : "white"}>
      <Flex justifyContent="right" align="center" height="50px">{shortenAddress(address)}</Flex>
      <Flex height="50px" direction="column" m="0 20px">
        <Text m="1" textAlign={"left"} fontSize="sm">{tokenAmount + " 🌳 (" + Math.floor(1000 * (tokenAmount / totalSupply)) / 10 + "%)"}</Text>
        <RangeSlider defaultValue={[0, (100*tokenAmount) / totalSupply]}>
          <RangeSliderTrack>
            <RangeSliderFilledTrack />
          </RangeSliderTrack>
        </RangeSlider>
      </Flex>
    </SimpleGrid>)
  });

  const memberLoadingView = (
    <Flex m="1" direction="column" maxWidth="500px">
      <Skeleton m="2" height="50px" width="480px"/>
      <Skeleton m="2" height="50px" width="470px"/>
      <Skeleton m="2" height="50px" width="460px"/>
    </Flex>
  )

  return (
    <Flex direction="column" borderWidth="1px" maxWidth="500px" margin="20px auto" borderRadius="lg">
        <SimpleGrid columns={2} m="1" spacing="5" direction="row">
          <Text fontSize="lg" fontWeight="bold" textAlign={"right"}>Address</Text>
          <Text fontSize="lg" fontWeight="bold" textAlign={"left"}>Ownership</Text>
        </SimpleGrid>
        <Divider />
        <Flex align="center" direction="column">
          {memberListView.length > 0 ? memberListView : memberLoadingView}
        </Flex>
    </Flex>
  )
}
