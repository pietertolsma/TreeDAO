import { Button, Box, Center, Heading, Link, Text, Flex } from '@chakra-ui/react'
import Head from 'next/head'

import { useWeb3 } from "@3rdweb/hooks";
import { ThirdwebSDK } from "@3rdweb/sdk";
import { useEffect, useState } from 'react';

import sdk from "../scripts/1-initialize-sdk";
import VisitorComponent from '../components/VisitorComponent';
import LandingView from '../components/LandingView';
import HeaderComponent from '../components/HeaderComponent';
import MemberView from '../components/MemberComponent';

const bundleDropModule = sdk.getBundleDropModule(
  "0x156E3800528CC8604C77788f9d629D47113479d4",
);

export default function Home() {

  const { connectWallet, address, error, provider } = useWeb3();

  const signer = provider ? provider.getSigner() : undefined;

  const [hasClaimedNFT, setHasClaimedNFT] = useState(false);

  useEffect(() => {
    sdk.setProviderOrSigner(signer);
  }, [signer]);

  const memberView = (
    <MemberView />
  )

  const visitorView = (
    <VisitorComponent address={address} provider={provider} setHasClaimedNFT={setHasClaimedNFT}/>
  )
  
  const connect = (
    <LandingView connectWallet={connectWallet}/>
  )

  const connected = (
    <Flex direction="column">
      {hasClaimedNFT ? memberView : visitorView}
    </Flex>
  )

  return (
    <div>
      <Head>
        <title>TreeDAO</title>
        <meta name="description" content="TreeDAO" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main>
        <HeaderComponent address={address} isMember={hasClaimedNFT} connectWallet={connectWallet}/>
        <Box h="100vh" maxWidth="1200px" m="0 auto" textAlign="center">
          {address ? connected : connect}
        </Box>
      </main>

      <footer>
        <Center>
          <Text>This site was made for education purposes by Pieter Tolsma</Text>
          <Link href="https://github.com/pietertolsma/TreeDAO">Github</Link>
        </Center>
      </footer>
    </div>
  )
}
