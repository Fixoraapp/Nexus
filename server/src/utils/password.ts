import bcrypt from 'bcryptjs'

const SALT_ROUNDS = 12

export function validatePassword(password: string) {
  return password.length >= 8 && /\d/.test(password) && /[a-zа-яё]/i.test(password)
}

export function hashPassword(password: string) {
  return bcrypt.hash(password, SALT_ROUNDS)
}

export function verifyPassword(password: string, passwordHash: string) {
  return bcrypt.compare(password, passwordHash)
}
