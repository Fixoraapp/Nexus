import { Router } from 'express'
import { Prisma } from '@prisma/client'
import { authMiddleware, type AuthenticatedRequest } from '../middleware/authMiddleware'
import { prisma } from '../prisma'
import { signToken } from '../utils/jwt'
import { hashPassword, validatePassword, verifyPassword } from '../utils/password'

const router = Router()

const userSelect = {
  avatar: true,
  bio: true,
  createdAt: true,
  email: true,
  firstName: true,
  id: true,
  lastName: true,
  status: true,
  updatedAt: true,
  username: true,
} satisfies Prisma.UserSelect

function normalizeEmail(email: string) {
  return email.trim().toLowerCase()
}

function normalizeUsername(username: string) {
  return username.trim().toLowerCase()
}

function isValidEmail(email: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
}

router.post('/register', async (req, res) => {
  const { confirmPassword, email, firstName, lastName, password, username } = req.body as Record<string, string>
  const normalizedEmail = normalizeEmail(email || '')
  const normalizedUsername = normalizeUsername(username || '')

  if (!firstName?.trim() || !lastName?.trim() || !normalizedUsername || !normalizedEmail || !password || !confirmPassword) {
    return res.status(400).json({ message: 'All fields are required.' })
  }

  if (!isValidEmail(normalizedEmail)) {
    return res.status(400).json({ message: 'Email is invalid.' })
  }

  if (!validatePassword(password)) {
    return res.status(400).json({ message: 'Password must be at least 8 characters and contain at least one letter and one number.' })
  }

  if (password !== confirmPassword) {
    return res.status(400).json({ message: 'Passwords do not match.' })
  }

  const existingUser = await prisma.user.findFirst({
    where: {
      OR: [
        { email: normalizedEmail },
        { username: normalizedUsername },
      ],
    },
    select: { email: true, username: true },
  })

  if (existingUser?.email === normalizedEmail) {
    return res.status(409).json({ message: 'Email is already registered.' })
  }

  if (existingUser?.username === normalizedUsername) {
    return res.status(409).json({ message: 'Username is already taken.' })
  }

  const user = await prisma.user.create({
    data: {
      avatar: `${firstName.trim()[0] ?? ''}${lastName.trim()[0] ?? ''}`.toUpperCase(),
      email: normalizedEmail,
      firstName: firstName.trim(),
      lastName: lastName.trim(),
      passwordHash: await hashPassword(password),
      username: normalizedUsername,
    },
    select: userSelect,
  })
  const token = signToken({ userId: user.id })

  return res.status(201).json({ token, user })
})

router.post('/login', async (req, res) => {
  const { login, password } = req.body as Record<string, string>
  const normalizedLogin = (login || '').trim().toLowerCase()

  if (!normalizedLogin || !password) {
    return res.status(400).json({ message: 'Login and password are required.' })
  }

  const user = await prisma.user.findFirst({
    where: {
      OR: [
        { email: normalizedLogin },
        { username: normalizedLogin },
      ],
    },
  })

  if (!user || !(await verifyPassword(password, user.passwordHash))) {
    return res.status(401).json({ message: 'Invalid login or password.' })
  }

  const safeUser = await prisma.user.findUniqueOrThrow({ where: { id: user.id }, select: userSelect })
  const token = signToken({ userId: user.id })

  return res.json({ token, user: safeUser })
})

router.get('/me', authMiddleware, async (req: AuthenticatedRequest, res) => {
  const user = await prisma.user.findUnique({
    where: { id: req.user?.id },
    select: userSelect,
  })

  if (!user) {
    return res.status(404).json({ message: 'User not found.' })
  }

  return res.json({ user })
})

export { router as authRouter, userSelect }
