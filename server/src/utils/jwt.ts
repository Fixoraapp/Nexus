import jwt from 'jsonwebtoken'

const JWT_EXPIRES_IN = '30d'

function getJwtSecret() {
  const secret = process.env.JWT_SECRET

  if (!secret) {
    throw new Error('JWT_SECRET is not configured')
  }

  return secret
}

export type JwtPayload = {
  userId: string
}

export function signToken(payload: JwtPayload) {
  return jwt.sign(payload, getJwtSecret(), { expiresIn: JWT_EXPIRES_IN })
}

export function verifyToken(token: string) {
  return jwt.verify(token, getJwtSecret()) as JwtPayload
}
