import { Box, Button, Flex, FormControl, FormErrorMessage, FormLabel, HStack, IconButton, Input, NumberDecrementStepper, NumberIncrementStepper, NumberInput, NumberInputField, NumberInputStepper, Select, Text, Textarea } from "@chakra-ui/react";
import { CloseIcon } from '@chakra-ui/icons';
import { useWeb3React } from "@web3-react/core";
import { errors } from "ethers";
import { ErrorMessage, Field, FieldArray, Form, Formik, getIn } from 'formik';
import { useState } from "react";
import { submitProposal } from "../lib/contract";
import useWallet from "../hooks/useWallet";
import * as Yup from 'yup';


function ProposalForm(props) {

    const [ isProposing, setProposing ] = useState(false);
    const { library } = useWeb3React();

    function submit(values, actions) {
        console.log(values);
        setProposing(true);
        submitProposal(library, values.description, values.transactions)
            .then((id) => {
                console.log("Proposal created! With ID " + id)
                setProposing(false);
            })
            .catch((reason) => {
                console.error("Something went wrong with creating proposal..", reason)
                setProposing(false);
            });
    }

    const schema = Yup.object().shape({
        description: Yup.string().required('Required'),
        transactions: Yup.array()
            .of(
                Yup.object().shape({
                    amount: Yup.number().min(0, "Can't be negative").required('Required'),
                    to: Yup.string()
                        .test('valid-address', 'Invalid address', (val) => /^0x[a-fA-F0-9]{40}$/.test(val))
                        .required('Required')
                })
            )
    });

    const invalidField = (form, name) => {
        const error = getIn(form.errors, name);
        const touch = getIn(form.touched, name);

        return error && touch;
    }

    const ErrorMessage = ({ name }) => (
        <Field name={name}> 
        {
            (props) => {
                const error = getIn(props.form.errors, name);
                const touch = getIn(props.form.touched, name);
                if (touch && error) {
                    return (<FormErrorMessage>{error}</FormErrorMessage>) 
                }
                return (<Text></Text>);
          }}
        </Field>
      );

    const transactionComponents = (arrayHelpers, transactions) => {
        return transactions.map((val, index) => {

            const titleMap = {
                "eth" : "Withdraw ETH from treasury to address",
                "mint" : "Mint new 🌳 Sapling tokens to address"
            }

            return (
                <Flex mt="3" ml="5" key={index} direction='column'>
                    <Text align="left">#{index+1}: {titleMap[val.type]}</Text>
                    <Flex direction="row" align="center" mt="2">
                        <Field name={`transactions[${index}].amount`}>
                            {({field, form}) => {
                                
                                return (
                                    <FormControl mr="5" maxWidth="200px" isInvalid={invalidField(form, `transactions[${index}].amount`)}>
                                        {/* <FormLabel htmlFor='sapling_amount'>🌳 to Mint</FormLabel> */}
                                        <NumberInput id={`transactions[${index}].amount`} defaultValue={val.amount} precision={2} step={1}>
                                            <NumberInputField />
                                            <NumberInputStepper>
                                                <NumberIncrementStepper />
                                                <NumberDecrementStepper />
                                            </NumberInputStepper>
                                        </NumberInput>
                                        <ErrorMessage name={`transactions[${index}].amount`} />
                                    </FormControl>
                            )}}
                        </Field>
                        <Field name={`transactions[${index}].to`}>
                            {({field, form}) => (
                                <FormControl mr="2" value={val.to} isInvalid={invalidField(form, `transactions[${index}].to`)}>
                                    {/* <FormLabel htmlFor='to_address'>Target Address</FormLabel> */}
                                    <Input {...field} id={`transactions[${index}].to`} placeholder='0x...' />
                                    <ErrorMessage name={`transactions[${index}].to`} />
                                </FormControl>
                            )}
                        </Field>
                        <IconButton ml="3" aria-label='Remove TX' icon={<CloseIcon />} onClick={() => arrayHelpers.remove(index)} />
                    </Flex>
                </Flex>
                )
        });
    };

    return (
        <Box {...props}  borderWidth="1px" p="3" borderRadius="lg">
            <Formik initialValues={{ description: "", transactions: []}}
                    onSubmit={(values, actions) => {
                        submit(values)
                    }} validationSchema={schema} >
                {({values, errors}) => (
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
                        <FieldArray
                            name='transactions'
                            render={arrayHelpers => (
                                <Flex mt="5" direction="column">
                                    <FormLabel align="left">Transactions within this proposal:</FormLabel>
                                    <Text fontSize="sm" align="left">(All these transaction will be executed atomically once the proposal is executed.)</Text>
                                    {transactionComponents(arrayHelpers, values.transactions)}
                                    <Flex direction='column' mt="5" ml="5">
                                    <Select disabled={values.transactions.length >= 10} mt="1" placeholder='Select transaction type' value="" onChange={(e) => {
                                        arrayHelpers.push({type: e.target.value, amount: 0, to: ""})
                                    }}>
                                        <option value='eth'>Withdraw ETH</option>
                                        <option value='mint'>Mint SAP</option>
                                    </Select>
                            </Flex>
                                </Flex>
                            )}/>
                        <Button disabled={isProposing} type="submit" w="100%" colorScheme='pink' mt="5">Submit Proposal</Button>
                    </Form>
                )}
            </Formik>
        </Box>
    );
}

export default ProposalForm;