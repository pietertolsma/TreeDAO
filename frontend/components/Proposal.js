import { Box, HStack, Radio, RadioGroup, Text, useRadio, useRadioGroup } from "@chakra-ui/react";
import { useState } from "react";

//https://chakra-ui.com/docs/form/radio
function VoteCard(props) {
    const { getInputProps, getCheckboxProps } = useRadio(props)
  
    const input = getInputProps()
    const checkbox = getCheckboxProps()

    const style = props.checked ? {
        backgroundColor: 'gray',
        color: 'white',
        borderColor: 'teal.600',
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
  

export default function Proposal({proposal}) {

    const options = ['Against', 'For', 'Abstain'];

    const [active, setActive] = useState("Abstain");

    const { getRootProps, getRadioProps } = useRadioGroup({
        name: 'vote',
        defaultValue: 'none',
        onChange: (val) => {console.log(val)},
      });

    const group = getRootProps();

    return (
        <Box borderWidth="1px" p="3" borderRadius="lg" width="100%" mb="3">
            <Text>{proposal.description}</Text>
            <HStack {...group} justifyContent="center" m="3">
                {options.map((val) => {
                    const radio = getRadioProps({val});
                    return (
                        <VoteCard key={val} {...radio} onChange={() => setActive(val)} checked={val==active}>{val}</VoteCard>
                    )
                })}
            </HStack>
        </Box>
    )
}