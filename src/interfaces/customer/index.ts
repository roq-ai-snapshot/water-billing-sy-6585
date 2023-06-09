import { MeterReadingInterface } from 'interfaces/meter-reading';
import { WaterBillInterface } from 'interfaces/water-bill';
import { UserInterface } from 'interfaces/user';
import { CompanyInterface } from 'interfaces/company';
import { GetQueryInterface } from 'interfaces';

export interface CustomerInterface {
  id?: string;
  user_id: string;
  company_id: string;
  created_at?: Date | string;
  updated_at?: Date | string;
  meter_reading?: MeterReadingInterface[];
  water_bill?: WaterBillInterface[];
  user?: UserInterface;
  company?: CompanyInterface;
  _count?: {
    meter_reading?: number;
    water_bill?: number;
  };
}

export interface CustomerGetQueryInterface extends GetQueryInterface {
  id?: string;
  user_id?: string;
  company_id?: string;
}
