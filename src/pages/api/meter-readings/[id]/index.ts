import type { NextApiRequest, NextApiResponse } from 'next';
import { roqClient } from 'server/roq';
import { prisma } from 'server/db';
import { errorHandlerMiddleware } from 'server/middlewares';
import { meterReadingValidationSchema } from 'validationSchema/meter-readings';
import { HttpMethod, convertMethodToOperation, convertQueryToPrismaUtil } from 'server/utils';
import { getServerSession } from '@roq/nextjs';

async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { roqUserId, user } = await getServerSession(req);
  await prisma.meter_reading
    .withAuthorization({
      roqUserId,
      tenantId: user.tenantId,
      roles: user.roles,
    })
    .hasAccess(req.query.id as string, convertMethodToOperation(req.method as HttpMethod));

  switch (req.method) {
    case 'GET':
      return getMeterReadingById();
    case 'PUT':
      return updateMeterReadingById();
    case 'DELETE':
      return deleteMeterReadingById();
    default:
      return res.status(405).json({ message: `Method ${req.method} not allowed` });
  }

  async function getMeterReadingById() {
    const data = await prisma.meter_reading.findFirst(convertQueryToPrismaUtil(req.query, 'meter_reading'));
    return res.status(200).json(data);
  }

  async function updateMeterReadingById() {
    await meterReadingValidationSchema.validate(req.body);
    const data = await prisma.meter_reading.update({
      where: { id: req.query.id as string },
      data: {
        ...req.body,
      },
    });

    return res.status(200).json(data);
  }
  async function deleteMeterReadingById() {
    const data = await prisma.meter_reading.delete({
      where: { id: req.query.id as string },
    });
    return res.status(200).json(data);
  }
}

export default function apiHandler(req: NextApiRequest, res: NextApiResponse) {
  return errorHandlerMiddleware(handler)(req, res);
}
