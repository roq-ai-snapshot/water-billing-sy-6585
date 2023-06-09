import * as yup from 'yup';

export const waterBillValidationSchema = yup.object().shape({
  amount: yup.number().integer().required(),
  billing_date: yup.date().required(),
  customer_id: yup.string().nullable().required(),
  treasurer_id: yup.string().nullable().required(),
  meter_reading_id: yup.string().nullable().required(),
});
