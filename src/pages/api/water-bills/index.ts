import type { NextApiRequest, NextApiResponse } from 'next';
import { roqClient } from 'server/roq';
import { prisma } from 'server/db';
import { authorizationValidationMiddleware, errorHandlerMiddleware } from 'server/middlewares';
import { waterBillValidationSchema } from 'validationSchema/water-bills';
import { convertQueryToPrismaUtil } from 'server/utils';
import { getServerSession } from '@roq/nextjs';

async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { roqUserId, user } = await getServerSession(req);
  switch (req.method) {
    case 'GET':
      return getWaterBills();
    case 'POST':
      return createWaterBill();
    default:
      return res.status(405).json({ message: `Method ${req.method} not allowed` });
  }

  async function getWaterBills() {
    const data = await prisma.water_bill
      .withAuthorization({
        roqUserId,
        tenantId: user.tenantId,
        roles: user.roles,
      })
      .findMany(convertQueryToPrismaUtil(req.query, 'water_bill'));
    return res.status(200).json(data);
  }

  async function createWaterBill() {
    await waterBillValidationSchema.validate(req.body);
    const body = { ...req.body };

    const data = await prisma.water_bill.create({
      data: body,
    });
    return res.status(200).json(data);
  }
}

export default function apiHandler(req: NextApiRequest, res: NextApiResponse) {
  return errorHandlerMiddleware(authorizationValidationMiddleware(handler))(req, res);
}
