import { Button, Box, Center, Heading, Link, Text, Flex, Spinner, color } from '@chakra-ui/react'
import Head from 'next/head'

import VisitorComponent from '../components/VisitorComponent';
import Navigation from '../components/Navigation';
import TokenListComponent from '../components/AddressListComponent';
import { useStore } from '../lib/store';

import React, { useEffect, useState } from 'react';
import useWallet from '../hooks/useWallet';
import { hasMembership } from '../lib/contract';

export default function Home() {

  const { isMember, setIsMember } = useStore((state) => state);
  const { address } = useWallet();

  const colors = ["#fea3aa", "#f8b88b", "#faf884", "#baed91", "#b2cefe", "#f2a2e8"]
  const [colorIndex, setColorIndex] = useState(0);

  useEffect(() => {
    if (!address) return;
    hasMembership(address, (res) => setIsMember(res), (msg, err) => console.error(msg, err));
  }, [address]);

  const memberView = (
    <TokenListComponent/>
  )

  const visitorView = (
    <VisitorComponent/>
  )

  const connected = (
    <Flex direction="column">
      {isMember ? memberView : visitorView}
    </Flex>
  )

  useEffect(() => {
    const interval = setTimeout(() => {
      if (colorIndex >= colors.length - 1) {
        setColorIndex((_) => 0);
      } else {
        setColorIndex((index) => index+1);
      }
    }, 1300);
    // return () => clearInterval(interval);
  }, [colorIndex])


  const backgroundStyle = {
    transition: "all 1s ease",
    WebkitTransition: "all 1s ease",
    MozTransition: "all 1s ease",
  }

  return (
    <div>
      <Head>
        <title>TreeDAO</title>
        <meta name="description" content="TreeDAO" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main>
        <Box height="100vh" style={backgroundStyle} backgroundColor={colors[colorIndex]}>
          <Navigation />
          <Box backgroundColor="white" minHeight="70vh" maxWidth="800px" m="0 auto" mt="10" textAlign="center">
            {connected}
          </Box>
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
