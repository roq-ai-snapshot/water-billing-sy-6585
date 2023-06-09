const mapping: Record<string, string> = {
  companies: 'company',
  customers: 'customer',
  'meter-readings': 'meter_reading',
  users: 'user',
  'water-bills': 'water_bill',
};

export function convertRouteToEntityUtil(route: string) {
  return mapping[route] || route;
}
