import { Button, Box, Center, Heading, Link, Text, Flex, Spinner, color, Icon, Stack } from '@chakra-ui/react'
import Head from 'next/head'

import EnrollButton from '../components/EnrollButton';
import Navigation from '../components/Navigation';
import OwnerList from '../components/OwnerList';
import { useStore } from '../lib/store';

import React, { useEffect, useState } from 'react';
import useWallet from '../hooks/useWallet';
import { hasMembership } from '../lib/contract';
import WalletButton from '../components/WalletButton';
import ProposalList from '../components/ProposalList';

export default function Home() {

  const { isMember, setIsMember, disco} = useStore((state) => state);
  const { address } = useWallet();

  const defaultBackground = "gray.100";
  const colors = ["#fea3aa", "#f8b88b", "#faf884", "#baed91", "#b2cefe", "#f2a2e8"]
  const [colorIndex, setColorIndex] = useState(0);

  useEffect(() => {
    if (!address) return;
    hasMembership(address, (res) => setIsMember(res), (msg, err) => console.error(msg, err));
  }, [address]);

  const memberView = (
    <Box>
      <Box minHeight="100px">
        <Heading m="5">TreeDAO</Heading>
      </Box>
      <Flex>
        <Box width="50%">
          <Heading fontSize="3xl">Owners</Heading>
          <OwnerList/>
        </Box>
        <Box width="50%">
          <Heading fontSize="3xl">Proposals</Heading>
          <ProposalList width="50%" />
        </Box>
      </Flex>
    </Box>
  )

  const visitorView = (
    <Box m="10">
      <Heading>🌳 Welcome to TreeDAO 🌳</Heading>
      <Text m="3" fontSize="xl">TreeDAO was created to demonstrate why DAOs are awesome. <br /> By clicking the button below, you can mint an NFTree and become a member of this DAO instantly.</Text>
      {address ? (<EnrollButton maxWidth="500px" m="0 auto"/>) : (<WalletButton maxWidth="500px" m="0 auto"/>)}
    </Box>
  )

  const connected = (
    <Flex direction="column">
      {address && isMember ? memberView : visitorView}
    </Flex>
  )

  useEffect(() => {
    if (!disco) return;

    setTimeout(() => {
      if (colorIndex >= colors.length - 1) {
        setColorIndex((_) => 0);
      } else {
        setColorIndex((index) => index+1);
      }
    }, 1300);
    // return () => clearInterval(interval);
  }, [colorIndex, disco])


  const backgroundStyle = {
    transition: "background-color 1s ease",
    WebkitTransition: "background-color 1s ease",
    MozTransition: "background-color 1s ease",
  }

  return (
    <div>
      <Head>
        <title>TreeDAO</title>
        <meta name="description" content="TreeDAO" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main>
        <Box height="100vh" style={backgroundStyle} backgroundColor={disco ? colors[colorIndex] : defaultBackground}>
          <Navigation />
          <Box backgroundColor="white" maxWidth="1200px" m="0px auto" mt="10" textAlign="center">
            {connected}
          </Box>
        </Box> 
      </main>

      <footer>
        <Flex direction="column" justifyContent={"center"} align="center">
          <Text>This site was made for education purposes by Pieter Tolsma</Text>
          <Stack direction="row">
            <Link href="https://github.com/pietertolsma/TreeDAO">Github</Link>
            <Link href="https://twitter.com/0xgamut">Twitter</Link>
          </Stack>
        </Flex>
      </footer>
    </div>
  )
}
