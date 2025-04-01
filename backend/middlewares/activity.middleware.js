import { asyncHandler } from '../utils/asyncHandler.js';
import prisma from '../utils/db.js';

export const userLastActivity = asyncHandler(async (req, res, next) => {
  const currentTime = new Date();
  const userLastSeen = await prisma.user.findUnique({
    where: {
      id: req.user.id,
    },
    select: {
      lastSeen: true,
    },
  });
  if (!userLastSeen || currentTime - userLastSeen.lastSeen > 5 * 60 * 1000) {
    await prisma.user.update({
      where: { id: req.user.id },
      data: { lastSeen: currentTime },
    });
  }

  next();
});
