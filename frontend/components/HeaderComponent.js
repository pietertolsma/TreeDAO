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

export default function HeaderComponent({ address, isMember, connectWallet }) {

    const { isOpen, onToggle } = useDisclosure();

    const connected = (
        <Button backgroundColor="green.100" _hover={{bg: 'green.200'}}>
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
        <Flex>
            <Link href="#">Home</Link>
            <Link href="#">Members</Link>
        </Flex>
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
            textAlign={useBreakpointValue({ base: 'center', md: 'left' })}
            fontFamily={'heading'}
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