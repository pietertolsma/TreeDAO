import { Button, Box, Center, Heading, Link, Text, Flex, Spinner, color } from '@chakra-ui/react'
import Head from 'next/head'
import Script from 'next/script'

import sdk from "../scripts/1-initialize-sdk";
import VisitorComponent from '../components/VisitorComponent';
import HeaderComponent from '../components/HeaderComponent';
import MemberView from '../components/MemberView';
import { useStore } from '../lib/store';

import $ from 'jquery';
import React, { useEffect, useState } from 'react';


const bundleDropModule = sdk.getBundleDropModule(
  "0x156E3800528CC8604C77788f9d629D47113479d4",
);

export default function Home() {

  const {isMember, address} = useStore((state) => state);
  const colors = ["#fea3aa", "#f8b88b", "#faf884", "#baed91", "#b2cefe", "#f2a2e8"]
  const [colorIndex, setColorIndex] = useState(0);

  const memberView = (
    <MemberView/>
  )

  const visitorView = (
    <VisitorComponent/>
  )

  const connected = (
    <Flex direction="column">
      {isMember ? memberView : visitorView}
    </Flex>
  )

  const loading = (
    <Spinner />
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
        <Box style={backgroundStyle} backgroundColor={colors[colorIndex]}>
        <HeaderComponent />
        <Box h="100vh" maxWidth="1200px" m="0 auto" textAlign="center">
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
