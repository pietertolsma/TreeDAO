import { Box, Button, Flex, FormControl, FormErrorMessage, FormLabel, Input, NumberDecrementStepper, NumberIncrementStepper, NumberInput, NumberInputField, NumberInputStepper, Textarea } from "@chakra-ui/react";
import { errors } from "ethers";
import { Field, Form, Formik } from 'formik';


function ProposalForm(props) {

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

    return (
        <Box {...props} >
            <Formik initialValues={{ description: "", to_address: "", eth_amount: 0}}
                    onSubmit={(values, actions) => {
                        console.log(values)
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
                        <Flex mt="5">
                            <Field name='to_address'>
                                {({field, form}) => (
                                    <FormControl mr="2" isInvalid={errors.to_address && form.touched.to_address}>
                                        <FormLabel htmlFor='to_address'>Target Address</FormLabel>
                                        <Input {...field} id='to_address' placeholder='0x...' />
                                        <FormErrorMessage>{errors.to_address}</FormErrorMessage>
                                    </FormControl>
                                )}
                            </Field>
                        </Flex>
                        <Flex mt="5">
                            <Field name='eth_amount'>
                                {({field, form}) => (
                                        <FormControl ml="2" isInvalid={errors.eth_amount && form.touched.eth_amount}>
                                            <FormLabel htmlFor='eth_amount'>ETH to send</FormLabel>
                                            <NumberInput defaultValue={0} id="eth_amount" precision={8} step={0.0001}>
                                                <NumberInputField />
                                                <NumberInputStepper>
                                                    <NumberIncrementStepper />
                                                    <NumberDecrementStepper />
                                                </NumberInputStepper>
                                            </NumberInput>
                                            <FormErrorMessage>{errors.eth_amount}</FormErrorMessage>
                                        </FormControl>
                                    )}
                            </Field>
                            <Field name='sapling_amount'>
                                {({field, form}) => (
                                    <FormControl ml="2" isInvalid={errors.eth_amount && form.touched.eth_amount}>
                                        <FormLabel htmlFor='eth_amount'>SAPLING to mint</FormLabel>
                                        <NumberInput defaultValue={0} id="eth_amount" precision={2} step={1}>
                                            <NumberInputField />
                                            <NumberInputStepper>
                                                <NumberIncrementStepper />
                                                <NumberDecrementStepper />
                                            </NumberInputStepper>
                                        </NumberInput>
                                        <FormErrorMessage>{errors.eth_amount}</FormErrorMessage>
                                    </FormControl>
                                )}
                            </Field>
                        </Flex>
                        <Button type="submit" w="100%" colorScheme='pink' mt="5">Submit</Button>
                    </Form>
                )}
            </Formik>
        </Box>
    );
}

export default ProposalForm;