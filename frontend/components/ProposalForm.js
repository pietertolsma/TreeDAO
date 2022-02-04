import { Box, Button, Flex, FormControl, FormErrorMessage, FormLabel, HStack, IconButton, Input, NumberDecrementStepper, NumberIncrementStepper, NumberInput, NumberInputField, NumberInputStepper, Select, Text, Textarea } from "@chakra-ui/react";
import { CloseIcon } from '@chakra-ui/icons';
import { useWeb3React } from "@web3-react/core";
import { errors } from "ethers";
import { Field, Form, Formik } from 'formik';
import { useState } from "react";
import { submitProposal } from "../lib/contract";


function ProposalForm(props) {

    const [ isProposing, setProposing ] = useState(false);
    const { account, library } = useWeb3React();

    const [ transactions, setTransactions ] = useState([]);

    const onTxSelect = (e) => {
        setTransactions([...transactions, e.target.value]);
    }

    function submit(values, actions) {
        setProposing(true);
        submitProposal(account, library, values, (res) => {
            console.log("Succesfully proposed!");
            setProposing(false);
        }, (msg, err) => {
            console.error(msg, err)
            setProposing(false);
        });
    }

    function validate(val) {
        const errors = {};
        if (!val.description) {
            errors.description = 'Required'
        }

        if (!val.to_address) {
            errors.to_address = 'Required'
        } else if (!/^0x[a-fA-F0-9]{40}$/.test(val.to_address)) {
            errors.to_address = 'Invalid address format'
        }
        return errors;
    }

    const transactionComponents = transactions.map((val, index) => {

        const titleMap = {
            "eth" : "Withdraw ETH from treasury to address",
            "mint" : "Mint new 🌳 Sapling tokens to address"
        }

        return (
            <Flex mt="3" ml="5" key={index} direction='column'>
                <Text align="left">#{index+1}: {titleMap[val]}</Text>
                <Flex direction="row" align="center" mt="2">
                    <Field name={"amount"+index}>
                        {({field, form}) => (
                            <FormControl mr="5" maxWidth="200px" isInvalid={errors.sapling_amount && form.touched.sapling_amount}>
                                {/* <FormLabel htmlFor='sapling_amount'>🌳 to Mint</FormLabel> */}
                                <NumberInput defaultValue={0} id={"amount"+index} precision={2} step={1}>
                                    <NumberInputField />
                                    <NumberInputStepper>
                                        <NumberIncrementStepper />
                                        <NumberDecrementStepper />
                                    </NumberInputStepper>
                                </NumberInput>
                                <FormErrorMessage>{errors.sapling_amount}</FormErrorMessage>
                            </FormControl>
                        )}
                    </Field>
                    <Field name={"to_address"+index}>
                        {({field, form}) => (
                            <FormControl mr="2" isInvalid={errors.to_address && form.touched.to_address}>
                                {/* <FormLabel htmlFor='to_address'>Target Address</FormLabel> */}
                                <Input {...field} id={"to_address"+index} placeholder='0x...' />
                                <FormErrorMessage>{errors.to_address}</FormErrorMessage>
                            </FormControl>
                        )}
                    </Field>
                    <IconButton ml="3" aria-label='Remove TX' icon={<CloseIcon />} onClick={() => setTransactions(transactions.filter((_, i) => i != index))} />
                </Flex>
            </Flex>
            )
    });

    return (
        <Box {...props}  borderWidth="1px" p="3" borderRadius="lg">
            <Formik initialValues={{ description: "", to_address: "", eth_amount: 0, sapling_amount: 0}}
                    onSubmit={(values, actions) => {
                        submit(values)
                    }} validate={validate} >
                {({errors}) => (
                    <Form>
                        <Field name='description' isRequired>
                            {({field, form}) => (
                                <FormControl isInvalid={errors.description && form.touched.description}>
                                    <FormLabel htmlFor='description'>Proposal Description</FormLabel>
                                    <Textarea {...field} id='description' placeholder='description' />
                                    <FormErrorMessage>{errors.description}</FormErrorMessage>
                                </FormControl>
                            )}
                        </Field>
                        <Flex mt="5" direction="column">
                            <FormLabel align="left">Transactions within this proposal:</FormLabel>
                            <Text fontSize="sm" align="left">(All these transaction will be executed atomically once the proposal is executed.)</Text>
                            {transactionComponents}
                            <Flex direction='column' mt="5" ml="5">
                                <Select mt="1" placeholder='Select transaction type' value="" onChange={(e) => onTxSelect(e)}>
                                    <option value='eth'>Withdraw ETH</option>
                                    <option value='mint'>Mint SAP</option>
                                </Select>
                            </Flex>
                        </Flex>
                        <Button disabled={isProposing} type="submit" w="100%" colorScheme='pink' mt="5">Submit Proposal</Button>
                    </Form>
                )}
            </Formik>
        </Box>
    );
}

export default ProposalForm;