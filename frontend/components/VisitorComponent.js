import { Button, Box, Center, Heading, Link, Text, Flex } from '@chakra-ui/react'
import Head from 'next/head'

import { useWeb3 } from "@3rdweb/hooks";
import { ThirdwebSDK } from "@3rdweb/sdk";
import { useEffect, useState } from 'react';

import sdk from "../scripts/1-initialize-sdk";

const bundleDropModule = sdk.getBundleDropModule(
  "0x156E3800528CC8604C77788f9d629D47113479d4",
);

export default function VisitorComponent({ address, provider, setHasClaimedNFT}) {

  const signer = provider ? provider.getSigner() : undefined;

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


  return (
    <Flex direction="column">
      <Text>You are not a member yet.</Text>
      <Button disabled={isClaiming} onClick={() => mintNft()}>
        {isClaiming ? "Minting..." : "Click here to mint your free membership!"}
      </Button>
    </Flex>
  )
}
