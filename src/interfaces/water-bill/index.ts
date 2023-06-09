import { CustomerInterface } from 'interfaces/customer';
import { UserInterface } from 'interfaces/user';
import { MeterReadingInterface } from 'interfaces/meter-reading';
import { GetQueryInterface } from 'interfaces';

export interface WaterBillInterface {
  id?: string;
  customer_id: string;
  treasurer_id: string;
  meter_reading_id: string;
  amount: number;
  billing_date: Date | string;
  created_at?: Date | string;
  updated_at?: Date | string;

  customer?: CustomerInterface;
  user?: UserInterface;
  meter_reading?: MeterReadingInterface;
  _count?: {};
}

export interface WaterBillGetQueryInterface extends GetQueryInterface {
  id?: string;
  customer_id?: string;
  treasurer_id?: string;
  meter_reading_id?: string;
}
