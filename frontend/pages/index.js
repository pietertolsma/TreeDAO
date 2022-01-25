import { Button, Box, Center, Heading, Link, Text, Flex } from '@chakra-ui/react'
import Head from 'next/head'

import { useWeb3 } from "@3rdweb/hooks";
import { ThirdwebSDK } from "@3rdweb/sdk";
import { useEffect, useState } from 'react';

import sdk from "../scripts/1-initialize-sdk";

const bundleDropModule = sdk.getBundleDropModule(
  "0x156E3800528CC8604C77788f9d629D47113479d4",
);

export default function Home() {

  const { connectWallet, address, error, provider } = useWeb3();

  const signer = provider ? provider.getSigner() : undefined;

  const [hasClaimedNFT, setHasClaimedNFT] = useState(false);
  const [isClaiming, setIsClaiming] = useState(false);

  useEffect(() => {
    sdk.setProviderOrSigner(signer);
  }, [signer]);

  useEffect(() => {
    if (!address) return;

    return bundleDropModule
        .balanceOf(address, "0") // "0" = tokenId
        .then((balance) => {
          if (balance.gt(0)) {
            setHasClaimedNFT(true);
            console.log(
              `🌊 You are a member! Check it our on OpenSea: https://testnets.opensea.io/assets/${bundleDropModule.address.toLowerCase()}/0`
            );
          } else {
            setHasClaimedNFT(false);
          }
        })
        .catch((error) => {
          setHasClaimedNFT(false);
          console.log("Failed to get NFT balance", error);
        });
  }, [address]);

  const mintNft = () => {
    setIsClaiming(true);
    bundleDropModule
      .claim("0", 1)
      .then(() => {
        setHasClaimedNFT(true);
        console.log(
          `🌊 Successfully Minted! Check it our on OpenSea: https://testnets.opensea.io/assets/${bundleDropModule.address.toLowerCase()}/0`
        );
      })
      .catch((err) => {
        console.error("Failed to claim :(", err);
      })
      .finally(() => {
        setIsClaiming(false);
      });
  }

  const memberView = (
    <Text>You are a member! Awesome!</Text>
  )

  const nonMemberView = (
    <Flex direction="column">
      <Text>You are not a member yet.</Text>
      <Button disabled={isClaiming} onClick={() => mintNft()}>
        {isClaiming ? "Minting..." : "Click here to mint your free membership!"}
      </Button>
    </Flex>
  )
  
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
      <Heading>Wallet Connected!</Heading>
      <Text>Connected address: {address}</Text>
      {hasClaimedNFT ? memberView : nonMemberView}
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
        <Center h="100vh" textAlign="center">
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
