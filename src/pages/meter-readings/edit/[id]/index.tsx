import AppLayout from 'layout/app-layout';
import React, { useState } from 'react';
import {
  FormControl,
  FormLabel,
  Input,
  Button,
  Text,
  Box,
  Spinner,
  FormErrorMessage,
  Switch,
  NumberInputStepper,
  NumberDecrementStepper,
  NumberInputField,
  NumberIncrementStepper,
  NumberInput,
  Center,
} from '@chakra-ui/react';
import * as yup from 'yup';
import DatePicker from 'react-datepicker';
import { useFormik, FormikHelpers } from 'formik';
import { getMeterReadingById, updateMeterReadingById } from 'apiSdk/meter-readings';
import { Error } from 'components/error';
import { meterReadingValidationSchema } from 'validationSchema/meter-readings';
import { MeterReadingInterface } from 'interfaces/meter-reading';
import useSWR from 'swr';
import { useRouter } from 'next/router';
import { AsyncSelect } from 'components/async-select';
import { ArrayFormField } from 'components/array-form-field';
import { AccessOperationEnum, AccessServiceEnum, withAuthorization } from '@roq/nextjs';
import { CustomerInterface } from 'interfaces/customer';
import { UserInterface } from 'interfaces/user';
import { getCustomers } from 'apiSdk/customers';
import { getUsers } from 'apiSdk/users';
import { waterBillValidationSchema } from 'validationSchema/water-bills';

function MeterReadingEditPage() {
  const router = useRouter();
  const id = router.query.id as string;
  const { data, error, isLoading, mutate } = useSWR<MeterReadingInterface>(
    () => (id ? `/meter-readings/${id}` : null),
    () => getMeterReadingById(id),
  );
  const [formError, setFormError] = useState(null);

  const handleSubmit = async (values: MeterReadingInterface, { resetForm }: FormikHelpers<any>) => {
    setFormError(null);
    try {
      const updated = await updateMeterReadingById(id, values);
      mutate(updated);
      resetForm();
      router.push('/meter-readings');
    } catch (error) {
      setFormError(error);
    }
  };

  const formik = useFormik<MeterReadingInterface>({
    initialValues: data,
    validationSchema: meterReadingValidationSchema,
    onSubmit: handleSubmit,
    enableReinitialize: true,
    validateOnChange: false,
    validateOnBlur: false,
  });

  return (
    <AppLayout>
      <Box bg="white" p={4} rounded="md" shadow="md">
        <Box mb={4}>
          <Text as="h1" fontSize="2xl" fontWeight="bold">
            Edit Meter Reading
          </Text>
        </Box>
        {error && (
          <Box mb={4}>
            <Error error={error} />
          </Box>
        )}
        {formError && (
          <Box mb={4}>
            <Error error={formError} />
          </Box>
        )}
        {isLoading || (!formik.values && !error) ? (
          <Center>
            <Spinner />
          </Center>
        ) : (
          <form onSubmit={formik.handleSubmit}>
            <FormControl id="reading" mb="4" isInvalid={!!formik.errors?.reading}>
              <FormLabel>Reading</FormLabel>
              <NumberInput
                name="reading"
                value={formik.values?.reading}
                onChange={(valueString, valueNumber) =>
                  formik.setFieldValue('reading', Number.isNaN(valueNumber) ? 0 : valueNumber)
                }
              >
                <NumberInputField />
                <NumberInputStepper>
                  <NumberIncrementStepper />
                  <NumberDecrementStepper />
                </NumberInputStepper>
              </NumberInput>
              {formik.errors.reading && <FormErrorMessage>{formik.errors?.reading}</FormErrorMessage>}
            </FormControl>
            <FormControl id="reading_date" mb="4">
              <FormLabel>Reading Date</FormLabel>
              <DatePicker
                dateFormat={'dd/MM/yyyy'}
                selected={formik.values?.reading_date as Date}
                onChange={(value: Date) => formik.setFieldValue('reading_date', value)}
              />
            </FormControl>
            <AsyncSelect<CustomerInterface>
              formik={formik}
              name={'customer_id'}
              label={'Select Customer'}
              placeholder={'Select Customer'}
              fetcher={getCustomers}
              renderOption={(record) => (
                <option key={record.id} value={record.id}>
                  {record?.id as string}
                </option>
              )}
            />
            <AsyncSelect<UserInterface>
              formik={formik}
              name={'encoder_id'}
              label={'Select User'}
              placeholder={'Select User'}
              fetcher={getUsers}
              renderOption={(record) => (
                <option key={record.id} value={record.id}>
                  {record?.email as string}
                </option>
              )}
            />
            <Button isDisabled={formik?.isSubmitting} colorScheme="blue" type="submit" mr="4">
              Submit
            </Button>
          </form>
        )}
      </Box>
    </AppLayout>
  );
}

export default withAuthorization({
  service: AccessServiceEnum.PROJECT,
  entity: 'meter_reading',
  operation: AccessOperationEnum.UPDATE,
})(MeterReadingEditPage);
