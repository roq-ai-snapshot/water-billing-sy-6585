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
} from '@chakra-ui/react';
import { useFormik, FormikHelpers } from 'formik';
import * as yup from 'yup';
import DatePicker from 'react-datepicker';
import { useRouter } from 'next/router';
import { createWaterBill } from 'apiSdk/water-bills';
import { Error } from 'components/error';
import { waterBillValidationSchema } from 'validationSchema/water-bills';
import { AsyncSelect } from 'components/async-select';
import { ArrayFormField } from 'components/array-form-field';
import { AccessOperationEnum, AccessServiceEnum, withAuthorization } from '@roq/nextjs';
import { CustomerInterface } from 'interfaces/customer';
import { UserInterface } from 'interfaces/user';
import { MeterReadingInterface } from 'interfaces/meter-reading';
import { getCustomers } from 'apiSdk/customers';
import { getUsers } from 'apiSdk/users';
import { getMeterReadings } from 'apiSdk/meter-readings';
import { WaterBillInterface } from 'interfaces/water-bill';

function WaterBillCreatePage() {
  const router = useRouter();
  const [error, setError] = useState(null);

  const handleSubmit = async (values: WaterBillInterface, { resetForm }: FormikHelpers<any>) => {
    setError(null);
    try {
      await createWaterBill(values);
      resetForm();
      router.push('/water-bills');
    } catch (error) {
      setError(error);
    }
  };

  const formik = useFormik<WaterBillInterface>({
    initialValues: {
      amount: 0,
      billing_date: new Date(new Date().toDateString()),
      customer_id: (router.query.customer_id as string) ?? null,
      treasurer_id: (router.query.treasurer_id as string) ?? null,
      meter_reading_id: (router.query.meter_reading_id as string) ?? null,
    },
    validationSchema: waterBillValidationSchema,
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
            Create Water Bill
          </Text>
        </Box>
        {error && (
          <Box mb={4}>
            <Error error={error} />
          </Box>
        )}
        <form onSubmit={formik.handleSubmit}>
          <FormControl id="amount" mb="4" isInvalid={!!formik.errors?.amount}>
            <FormLabel>Amount</FormLabel>
            <NumberInput
              name="amount"
              value={formik.values?.amount}
              onChange={(valueString, valueNumber) =>
                formik.setFieldValue('amount', Number.isNaN(valueNumber) ? 0 : valueNumber)
              }
            >
              <NumberInputField />
              <NumberInputStepper>
                <NumberIncrementStepper />
                <NumberDecrementStepper />
              </NumberInputStepper>
            </NumberInput>
            {formik.errors.amount && <FormErrorMessage>{formik.errors?.amount}</FormErrorMessage>}
          </FormControl>
          <FormControl id="billing_date" mb="4">
            <FormLabel>Billing Date</FormLabel>
            <DatePicker
              dateFormat={'dd/MM/yyyy'}
              selected={formik.values?.billing_date as Date}
              onChange={(value: Date) => formik.setFieldValue('billing_date', value)}
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
            name={'treasurer_id'}
            label={'Select User'}
            placeholder={'Select User'}
            fetcher={getUsers}
            renderOption={(record) => (
              <option key={record.id} value={record.id}>
                {record?.email as string}
              </option>
            )}
          />
          <AsyncSelect<MeterReadingInterface>
            formik={formik}
            name={'meter_reading_id'}
            label={'Select Meter Reading'}
            placeholder={'Select Meter Reading'}
            fetcher={getMeterReadings}
            renderOption={(record) => (
              <option key={record.id} value={record.id}>
                {record?.reading as string}
              </option>
            )}
          />
          <Button isDisabled={formik?.isSubmitting} colorScheme="blue" type="submit" mr="4">
            Submit
          </Button>
        </form>
      </Box>
    </AppLayout>
  );
}

export default withAuthorization({
  service: AccessServiceEnum.PROJECT,
  entity: 'water_bill',
  operation: AccessOperationEnum.CREATE,
})(WaterBillCreatePage);
