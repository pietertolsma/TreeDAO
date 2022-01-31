import { Button, Text, Flex } from '@chakra-ui/react'
import useWallet from '../hooks/useWallet';
import { useStore } from '../lib/store';

export default function VoteButton(props) {

  const { account, connectWallet } = useWallet();
  const { tokens } = useStore();

  return (
    <Flex {...props} direction="column">
        <Button
            size="lg" colorScheme="pink"
            disabled={tokens == 0}
            onClick={() => connectWallet("injected")}
            >
            {tokens > 0 ? "Vote" : "No Voting Power"}
        </Button>
    </Flex>
  )
}
