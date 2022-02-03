import { Button, Text, Flex } from '@chakra-ui/react'
import { useWeb3React } from '@web3-react/core';

import {  useState } from 'react';

import { hasMembership, mintMembershipNFT } from '../lib/contract';

export default function EnrollButton(props) {
  const [isClaiming, setIsClaiming] = useState(false);

  const { account, provider, library } = useWeb3React();

  const mintNft = () => {
    setIsClaiming(true);

    mintMembershipNFT(library.getSigner())
      .then((res) => {
        hasMembership(account, provider).then((res)=>setIsClaiming(false));
      })
      .catch((reason) => console.error("Something went wrong..", reason));
  }

  return (
    <Flex {...props} direction="column">
      <Button size="lg" colorScheme="pink" disabled={isClaiming || !account} onClick={() => mintNft()}>
        {isClaiming ? "Minting..." : !account ? "Connect your wallet first" : "Join the DAO!"}
      </Button>
    </Flex>
  )
}
