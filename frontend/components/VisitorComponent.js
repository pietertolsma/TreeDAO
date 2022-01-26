import { Button, Box, Center, Heading, Link, Text, Flex } from '@chakra-ui/react'
import { useWeb3React } from '@web3-react/core';

import {  useState } from 'react';

import { mintMembershipNFT } from '../lib/contract';

export default function VisitorComponent() {
  const [isClaiming, setIsClaiming] = useState(false);

  const { account, library } = useWeb3React();

  const mintNft = () => {
    setIsClaiming(true);

    mintMembershipNFT(account, library, (res) => {
      setIsClaiming(res);
    }, (msg, err) => console.error(msg, err));
  }

  return (
    <Flex direction="column">
      <Text>You are not a member yet.</Text>
      <Button disabled={isClaiming} onClick={() => mintNft()}>
        {isClaiming ? "Minting..." : "Click here to mint your free membership!"}
      </Button>
    </Flex>
  )
}
