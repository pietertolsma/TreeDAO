import { Button, Box, Center, Heading, Link, Text, Flex } from '@chakra-ui/react'
import Head from 'next/head'

import { useWeb3 } from "@3rdweb/hooks";

export default function Home() {

  const { connectWallet, address, error, provider } = useWeb3();
  console.log("Address:", address);
  
  const connect = (
    <Flex direction="column">
            <Heading>Hello World!</Heading>
            <Button onClick={() => connectWallet("injected")}>
              Connect your Wallet
            </Button>
    </Flex>
  )

  const connected = (
    <Flex direction="column">
      <Heading>Wallet connected!</Heading>
      <Text>Connected address: {address}</Text>
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
        <Center h="100vh">
          {address ? connected : connect}
        </Center>
      </main>

      <footer>
        <Center dir>
          <Text>This site was made for education purposes by Pieter Tolsma</Text>
          <Link href="https://github.com/pietertolsma/TreeDAO">Github</Link>
        </Center>
      </footer>
    </div>
  )
}
