import * as yup from 'yup';
import { customerValidationSchema } from 'validationSchema/customers';

export const companyValidationSchema = yup.object().shape({
  name: yup.string().required(),
  description: yup.string(),
  image: yup.string(),
  user_id: yup.string().nullable().required(),
  customer: yup.array().of(customerValidationSchema),
});
