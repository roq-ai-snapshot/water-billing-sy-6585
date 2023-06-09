import axios from 'axios';
import queryString from 'query-string';
import { MeterReadingInterface, MeterReadingGetQueryInterface } from 'interfaces/meter-reading';
import { GetQueryInterface } from '../../interfaces';

export const getMeterReadings = async (query?: MeterReadingGetQueryInterface) => {
  const response = await axios.get(`/api/meter-readings${query ? `?${queryString.stringify(query)}` : ''}`);
  return response.data;
};

export const createMeterReading = async (meterReading: MeterReadingInterface) => {
  const response = await axios.post('/api/meter-readings', meterReading);
  return response.data;
};

export const updateMeterReadingById = async (id: string, meterReading: MeterReadingInterface) => {
  const response = await axios.put(`/api/meter-readings/${id}`, meterReading);
  return response.data;
};

export const getMeterReadingById = async (id: string, query?: GetQueryInterface) => {
  const response = await axios.get(`/api/meter-readings/${id}${query ? `?${queryString.stringify(query)}` : ''}`);
  return response.data;
};

export const deleteMeterReadingById = async (id: string) => {
  const response = await axios.delete(`/api/meter-readings/${id}`);
  return response.data;
};
