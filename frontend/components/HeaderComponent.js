import {
    Box,
    Flex,
    Text,
    IconButton,
    Button,
    Stack,
    Collapse,
    Icon,
    Link,
    Popover,
    PopoverTrigger,
    PopoverContent,
    Heading,
    useColorModeValue,
    useBreakpointValue,
    useDisclosure,
  } from '@chakra-ui/react';
  import {
    HamburgerIcon,
    CloseIcon,
    ChevronDownIcon,
    ChevronRightIcon,
  } from '@chakra-ui/icons';
import { useWeb3 } from '@3rdweb/hooks';
import { useEffect } from 'react';
import { useStore } from '../lib/store';
import sdk from '../scripts/1-initialize-sdk';

const bundleDropModule = sdk.getBundleDropModule(
  "0x156E3800528CC8604C77788f9d629D47113479d4",
);

export default function HeaderComponent() {

    const {isMember, setIsMember, provider, setAddress, setProvider} = useStore();

    const { isOpen, onToggle } = useDisclosure();

    const { connectWallet, address, error, newProvider, disconnectWallet } = useWeb3();

    const signer = provider ? provider.getSigner() : undefined;

    useEffect(() => {
      setAddress(address);
    }, [])
  
    // useEffect(() => {
    //   sdk.setProviderOrSigner(signer);
  
    // }, [signer]);

    useEffect(() => {
      setProvider(newProvider);
    }, [newProvider]);

    useEffect(() => {
      console.log(address);
      if (!address) return;
  
      return bundleDropModule
          .balanceOf(address, "0") // "0" = tokenId
          .then((balance) => {
            if (balance.gt(0)) {
              setIsMember(true);
              console.log(
                `🌊 You are a member! Check it our on OpenSea: https://testnets.opensea.io/assets/${bundleDropModule.address.toLowerCase()}/0`
              );
            } else {
              console.log("Not a member");
              setIsMember(false);
            }
          })
          .catch((error) => {
            setIsMember(false);
            console.log("Failed to get NFT balance", error);
          });
    }, [address]);

    const connected = (
        <Button backgroundColor="green.100" onClick={() => disconnectWallet()} _hover={{bg: 'green.200'}}>
            <Text width="120px" isTruncated>{address}</Text>
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
            <Link href="#">Home</Link>
            <Link href="/lounge">Lounge</Link>
        </Stack>
    )

    const nonMemberNav = (
        <Flex>
            <Link href="#">Home</Link>
        </Flex>
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
            TreeDAO
          </Heading>

          <Flex align="center" display={{ base: 'none', md: 'flex' }} ml={10}>
            {isMember ? memberNav : nonMemberNav}
          </Flex>
        </Flex>

        {address ? connected : disconnected}
      </Flex>

      <Collapse in={isOpen} animateOpacity>
        <Link href="#">Home</Link>
      </Collapse>
        </Box>
    )
}