import { Router } from 'express'
import { authMiddleware, type AuthenticatedRequest } from '../middleware/authMiddleware'
import { prisma } from '../prisma'
import { userSelect } from './auth.routes'

const router = Router()

router.patch('/me', authMiddleware, async (req: AuthenticatedRequest, res) => {
  const { avatar, bio, firstName, lastName, status, username } = req.body as Record<string, string | undefined>
  const data: Record<string, string> = {}

  if (firstName !== undefined) data.firstName = firstName.trim()
  if (lastName !== undefined) data.lastName = lastName.trim()
  if (username !== undefined) data.username = username.trim().toLowerCase()
  if (avatar !== undefined) data.avatar = avatar.trim()
  if (bio !== undefined) data.bio = bio.trim()
  if (status !== undefined) data.status = status.trim()

  if (Object.values(data).some((value) => value.length === 0)) {
    return res.status(400).json({ message: 'Updated fields cannot be empty.' })
  }

  try {
    const user = await prisma.user.update({
      data,
      where: { id: req.user?.id },
      select: userSelect,
    })

    return res.json({ user })
  } catch (error) {
    if (error instanceof Error && error.message.includes('Unique constraint')) {
      return res.status(409).json({ message: 'Username is already taken.' })
    }

    return res.status(500).json({ message: 'Could not update profile.' })
  }
})

export { router as userRouter }
