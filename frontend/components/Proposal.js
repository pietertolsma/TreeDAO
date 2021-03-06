import { Box, Flex, HStack, Radio, RadioGroup, Tag, Text, useRadio, useRadioGroup } from "@chakra-ui/react";
import { useEffect, useState } from "react";
import {theme} from '@chakra-ui/theme'
import { shortenAddress } from "../lib/util";
import { useWeb3React } from "@web3-react/core";
import { getHasVoted } from "../lib/contract";
import VoteBar from "./VoteBar";
import { ethers } from "ethers";
import useWallet from "../hooks/useWallet";


//https://chakra-ui.com/docs/form/radio
function VoteCard({label, ...props}) {
    const { getInputProps, getCheckboxProps } = useRadio(props)
  
    const input = getInputProps()
    const checkbox = getCheckboxProps()

    const colorThemes = {
      'For' : [theme.colors.green[100], theme.colors.green[200]],
      'Against' : [theme.colors.red[200], theme.colors.red[200]],
      'Abstain' : [theme.colors.gray[100], theme.colors.gray[200], theme.colors.black[300]]
    }

    const style = props.checked ? {
        backgroundColor: colorThemes[label][0],
        color: colorThemes[label][2],
        borderColor: colorThemes[label][1],
      } : {};
  
    return (
      <Box as='label'>
        <input {...input} />
        <Box
          {...checkbox}
          cursor='pointer'
          borderWidth='1px'
          borderRadius='md'
          boxShadow='md'
          minWidth="110px"
          style={style}
          px={1}
          py={1}
        >
          {props.children}
        </Box>
      </Box>
    )
  }
  

export default function Proposal({changeVote, proposal, votingPower}) {

    const options = ['For', 'Against'];
    const { account } = useWeb3React();
    const wallet = useWallet();

    const stateColor = {
      "Active" : 'green',
      "Defeated" : 'red',
      "Succeeded": 'green',
    }

    const { getRootProps, getRadioProps } = useRadioGroup({
        name: 'vote',
        defaultValue: 'none',
      });

    const group = getRootProps();

    const executions = proposal.transactions.map((tx, index) => (
      <Box key={index} borderWidth="1px" p="3" textAlign='left'>
        <Text fontSize='xs'>Transaction #{index}</Text>
        <Text fontSize='xs'>{tx.type == "ETH" ? "Transfer" : "Mint"} {tx.amount} {tx.type} to {shortenAddress(tx.to)}</Text>
      </Box>
    ))

    const noExecutions = (
      <Box borderWidth="1px" p="3" borderRadius="lg">
        <Text fontSize='xs' textAlign='left'>This proposal has no transactions associated with it.</Text>
      </Box>
    )

    const voteButtons = (
      <HStack {...group} justifyContent="center" m="3">
        {options.map((val) => {
            const radio = getRadioProps({val});
            return (
                <VoteCard key={val} label={val} {...radio} onChange={() => changeVote(val)} checked={val==proposal.currentVote}>{val}</VoteCard>
            )
        })}
     </HStack>
    )

    const alreadyVoted = (
      <Text fontSize="small" m="2">You already voted on this proposal.</Text>
    )

    return (
        <Box borderWidth="1px" p="3" borderRadius="lg" width="100%" mb="3">
            <Flex justifyContent="space-between">
              <Text fontSize="sm">By {shortenAddress(proposal.proposer)}</Text>
              <Tag colorScheme={proposal.state in stateColor ? stateColor[proposal.state] : 'gray'}>{proposal.state}</Tag>
            </Flex>
            <Text m="2" fontSize='lg'>{proposal.description}</Text>
            <Flex direction='column'>
              {proposal.transactions.length > 0 ? executions : noExecutions}
            </Flex>
            {proposal.hasVoted ? alreadyVoted : voteButtons}
            <VoteBar votingPower={votingPower} votes={proposal.votes} currentVote={proposal.hasVoted ? "" : proposal.currentVote}/>
        </Box>
    )
}