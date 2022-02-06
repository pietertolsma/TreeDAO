import { Box, Divider, Flex, Heading, Icon, Text } from "@chakra-ui/react";
import { ethers } from "ethers";
import { useEffect, useState } from "react";
import useWallet from "../hooks/useWallet";
import { TIMELOCK_ADDRESS } from "../lib/constants";
import { getTokens } from "../lib/contract";

import {SiEthereum} from 'react-icons/si'

function Treasury() {

    const wallet = useWallet();

    const [ethBalance, setEthBalance] = useState(0.0);
    const [sapBalance, setSapBalance] = useState(0.0);

    useEffect(() => {
        wallet.provider.getBalance(TIMELOCK_ADDRESS)
            .then((res) => {
                setEthBalance(ethers.utils.formatEther(res));
            })
            .catch((reason) => console.error("Something went wrong..", reason));
        
        getTokens(TIMELOCK_ADDRESS, wallet.provider)
            .then((res) => {
                setSapBalance(ethers.utils.formatEther(res));
            })
            .catch((reason) => console.error("Something went wrong..", reason));
    }, []);

    return (
        <Box m="5" maxWidth="500px" m="0 auto">
            <Heading fontSize="l">Treesury Overview</Heading>
            <Text fontSize="sm" m="2">Address: {TIMELOCK_ADDRESS}</Text>
            <Divider />
            <Flex justifyContent="center" mt="2">
                <Text fontSize="3xl">{ethBalance} <Icon as={SiEthereum} /></Text>
                <Text ml="3" fontSize="3xl">{sapBalance} 🌳</Text>
            </Flex>
        </Box>
    );
}

export default Treasury;