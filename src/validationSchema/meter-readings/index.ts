import * as yup from 'yup';
import { waterBillValidationSchema } from 'validationSchema/water-bills';

export const meterReadingValidationSchema = yup.object().shape({
  reading: yup.number().integer().required(),
  reading_date: yup.date().required(),
  customer_id: yup.string().nullable().required(),
  encoder_id: yup.string().nullable().required(),
  water_bill: yup.array().of(waterBillValidationSchema),
});
