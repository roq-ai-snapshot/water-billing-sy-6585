import { WaterBillInterface } from 'interfaces/water-bill';
import { CustomerInterface } from 'interfaces/customer';
import { UserInterface } from 'interfaces/user';
import { GetQueryInterface } from 'interfaces';

export interface MeterReadingInterface {
  id?: string;
  customer_id: string;
  encoder_id: string;
  reading: number;
  reading_date: Date | string;
  created_at?: Date | string;
  updated_at?: Date | string;
  water_bill?: WaterBillInterface[];
  customer?: CustomerInterface;
  user?: UserInterface;
  _count?: {
    water_bill?: number;
  };
}

export interface MeterReadingGetQueryInterface extends GetQueryInterface {
  id?: string;
  customer_id?: string;
  encoder_id?: string;
}
