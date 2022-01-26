import { Button, Text, Flex } from '@chakra-ui/react'
import useWallet from '../hooks/useWallet';

export default function WalletButton(props) {

  const { account, connectWallet } = useWallet();

  return (
    <Flex {...props} direction="column">
        <Button
            size="lg" colorScheme="pink"
            onClick={() => connectWallet("injected")}
            >
            Connect Wallet
        </Button>
    </Flex>
  )
}
