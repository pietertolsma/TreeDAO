import { Button, Box, Center, Heading, Link, Text, Flex, Spinner } from '@chakra-ui/react'
import Head from 'next/head'

import sdk from "../scripts/1-initialize-sdk";
import VisitorComponent from '../components/VisitorComponent';
import HeaderComponent from '../components/HeaderComponent';
import MemberView from '../components/MemberView';
import { useStore } from '../lib/store';

const bundleDropModule = sdk.getBundleDropModule(
  "0x156E3800528CC8604C77788f9d629D47113479d4",
);

export default function Home() {

  const {isMember, address} = useStore((state) => state);

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

  return (
    <div>
      <Head>
        <title>TreeDAO</title>
        <meta name="description" content="TreeDAO" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main>
        <HeaderComponent />
        <Box h="100vh" maxWidth="1200px" m="0 auto" textAlign="center">
          {connected}
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
