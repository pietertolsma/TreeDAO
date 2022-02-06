import { Box, Button, Flex, Heading, Input, Link, Stack, Text } from "@chakra-ui/react";
import { useWeb3React } from "@web3-react/core";
import { ethers } from "ethers";
import Head from "next/head";
import { useEffect, useState } from "react";
import useWallet from "../hooks/useWallet";
import { delegateVotes, getVotingPower } from "../lib/contract";
import { useStore } from "../lib/store";

export default function Delegate() {

    const wallet = useWallet();
    const [delegate, setDelegate] = useState("");
    const [isDelegating, setIsDelegating] = useState(false);
    const [currentVotes, setCurrentVotes] = useState(0);
    const {tokens} = useStore();

    const { library } = useWeb3React();

    const submit = (to) => {
        setIsDelegating(true);
        delegateVotes(library, to)
            .then(() => setIsDelegating(false))
            .catch((reason) => {
                setIsDelegating(false);
                console.error("Something went wrong...", reason)
            });
    }

    useEffect(() => {
        if (!wallet.address) return;

        getVotingPower(wallet.provider, wallet.address).then((res) => setCurrentVotes(ethers.utils.formatEther(res)))
            .catch((err) => console.error("Something went wrong..", err));
    }, [wallet.address, isDelegating]);

    return (
        <div>
            <Head>
            <title>TreeDAO</title>
            <meta name="description" content="TreeDAO" />
            <link rel="icon" href="/favicon.ico" />
            </Head>
    
            <main>
            <Box minHeight="100vh" pt="5" backgroundColor="gray.100">
                <Box backgroundColor="white" maxWidth="1200px" m="0px auto" textAlign="center">
                    <Box maxWidth="800px" m="0 auto" p="5" >
                        <Heading align="left" mb="5">Delegate your votes.</Heading>
                        <Text align="left">In order to have voting power, you must delegate your 🌳 Sapling tokens to an address. If you want to delegate to yourself, press the 'delegate to self' button or enter your own address.</Text>
                        
                        <Text mt="5" fontSize="xl" align="left">Current voting power: {currentVotes} 🌳</Text>
                        <Text fontSize="xl" align="left">Current balance: {tokens} 🌳</Text>
                        
                        <Button mt="5" colorScheme="pink" disabled={isDelegating} onClick={() => submit(wallet.address)}>Delegate Voting Power to Self</Button>
                        <Text mt="5">or</Text>
                        <Flex mt="5">
                            <Input placeholder="Enter address" value={delegate} onChange={(e) => setDelegate(e.target.value)} />
                            <Button minWidth="200px" disabled={isDelegating}  ml="5" colorScheme="pink" onClick={() => submit(delegate)}>Delegate to Address</Button>
                        </Flex>
                    </Box>
                </Box>
            </Box> 
            </main>

        </div>
    );
}