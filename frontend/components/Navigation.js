import {
    Box,
    Flex,
    Text,
    IconButton,
    Button,
    Stack,
    Collapse,
    Link,
    Heading,
    useColorModeValue,
    useDisclosure,
    StackDivider,
    Switch,
  } from '@chakra-ui/react';
  import {
    HamburgerIcon,
    CloseIcon,
  } from '@chakra-ui/icons';
import { useEffect, useState } from 'react';
import { useStore } from '../lib/store';
import useWallet from '../hooks/useWallet';
import { getTokens } from '../lib/contract';
import { shortenAddress } from '../lib/util';
import { getSaplingOwners } from '../lib/scan';
import { ethers } from 'ethers';

export default function Navigation() {

    const {isMember, setDisco, disco, tokens, setTokens} = useStore();

    const { isOpen, onToggle } = useDisclosure();

    const { connectWallet, address, provider, disconnectWallet } = useWallet();

    useEffect(() => {
      if (!address) return;

      getTokens(address, provider).then((res) => setTokens(parseFloat(ethers.utils.formatEther(res))))
        .catch((reason) => console.error("Something went wrong", reason));
    }, [address, setTokens]);

    const connected = (
        <Button backgroundColor="green.100" onClick={() => disconnectWallet()} _hover={{bg: 'green.200'}}>
            <Stack direction="row">
            <Text>{shortenAddress(address)}</Text>
            <StackDivider />
            <Text>{tokens} 🌳</Text>
            </Stack>
        </Button>
    )

    const disconnected = (
        <Button
            display={{ base: 'none', md: 'inline-flex' }}
            fontSize={'sm'}
            fontWeight={600}
            color={'white'}
            bg={'pink.400'}
            href={'#'}
            onClick={() => connectWallet("injected")}
            _hover={{
              bg: 'pink.300',
            }}>
            Connect
          </Button>
    )

    const memberNav = (
        <Stack direction="row">
            <Link href="/">Home</Link>
            <Link href="/propose">Propose</Link>
            <Link href="/delegate">Delegate</Link>
        </Stack>
    )

    const nonMemberNav = (
      <Stack direction="row">
        <Link href="/">Home</Link>
        <Link href="/propose">Propose</Link>
        <Link href="/delegate">Delegate</Link>
      </Stack>
    )

    return (
        <Box>
      <Flex
        bg={useColorModeValue('white', 'gray.800')}
        color={useColorModeValue('gray.600', 'white')}
        minH={'60px'}
        py={{ base: 2 }}
        px={{ base: 4 }}
        borderBottom={1}
        borderStyle={'solid'}
        borderColor={useColorModeValue('gray.200', 'gray.900')}
        align={'center'}>
        <Flex
          flex={{ base: 1, md: 'auto' }}
          ml={{ base: -2 }}
          display={{ base: 'flex', md: 'none' }}>
          <IconButton
            onClick={onToggle}
            icon={
              isOpen ? <CloseIcon w={3} h={3} /> : <HamburgerIcon w={5} h={5} />
            }
            variant={'ghost'}
            aria-label={'Toggle Navigation'}
          />
        </Flex>
        <Flex flex={{ base: 1 }} justify={{ base: 'center', md: 'start' }}>
          <Heading
            fontSize="1.2em"
            color={useColorModeValue('gray.800', 'white')}>
            🌳 TreeDAO
          </Heading>

          <Flex align="center" display={{ base: 'none', md: 'flex' }} ml={10}>
            {isMember ? memberNav : nonMemberNav}
          </Flex>
        </Flex>
        <Stack direction="row" justifyContent="center" align="center">
          <Switch display={{base : "none", md: "block"}}size="lg" isChecked={disco} onChange={() => {setDisco(!disco)}}/>
          {address ? connected : disconnected}
        </Stack>
      </Flex>

      <Collapse in={isOpen} animateOpacity>
        <Link href="#">Home</Link>
        <Switch size="lg" isChecked={disco} onChange={() => {setDisco(!disco)}}/>
      </Collapse>
        </Box>
    )
}