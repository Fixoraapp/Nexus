import type { NextFunction, Request, Response } from 'express'
import { prisma } from '../prisma'
import { verifyToken } from '../utils/jwt'

export type AuthenticatedRequest = Request & {
  user?: {
    id: string
  }
}

export async function authMiddleware(req: AuthenticatedRequest, res: Response, next: NextFunction) {
  const header = req.headers.authorization
  const token = header?.startsWith('Bearer ') ? header.slice('Bearer '.length) : ''

  if (!token) {
    return res.status(401).json({ message: 'Authorization token is required.' })
  }

  try {
    const payload = verifyToken(token)
    const user = await prisma.user.findUnique({ where: { id: payload.userId }, select: { id: true } })

    if (!user) {
      return res.status(401).json({ message: 'User no longer exists.' })
    }

    req.user = user
    return next()
  } catch {
    return res.status(401).json({ message: 'Invalid or expired token.' })
  }
}
