import axios from 'axios';
import queryString from 'query-string';
import { WaterBillInterface, WaterBillGetQueryInterface } from 'interfaces/water-bill';
import { GetQueryInterface } from '../../interfaces';

export const getWaterBills = async (query?: WaterBillGetQueryInterface) => {
  const response = await axios.get(`/api/water-bills${query ? `?${queryString.stringify(query)}` : ''}`);
  return response.data;
};

export const createWaterBill = async (waterBill: WaterBillInterface) => {
  const response = await axios.post('/api/water-bills', waterBill);
  return response.data;
};

export const updateWaterBillById = async (id: string, waterBill: WaterBillInterface) => {
  const response = await axios.put(`/api/water-bills/${id}`, waterBill);
  return response.data;
};

export const getWaterBillById = async (id: string, query?: GetQueryInterface) => {
  const response = await axios.get(`/api/water-bills/${id}${query ? `?${queryString.stringify(query)}` : ''}`);
  return response.data;
};

export const deleteWaterBillById = async (id: string) => {
  const response = await axios.delete(`/api/water-bills/${id}`);
  return response.data;
};
