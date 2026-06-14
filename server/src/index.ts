import cors from 'cors'
import dotenv from 'dotenv'
import express from 'express'
import { authRouter } from './routes/auth.routes'
import { userRouter } from './routes/user.routes'

dotenv.config()

const app = express()
const port = Number(process.env.PORT) || 4000

app.use(cors({
  origin: true,
  credentials: true,
}))

app.use(express.json())

app.get('/', (_req, res) => {
  res.json({
    ok: true,
    service: 'nexus-server',
    message: 'Nexus backend is running',
  })
})

app.get('/health', (_req, res) => {
  res.json({ ok: true, service: 'nexus-server' })
})

app.use('/api/auth', authRouter)
app.use('/api/users', userRouter)

app.use((err: unknown, _req: express.Request, res: express.Response, _next: express.NextFunction) => {
  console.error(err)
  res.status(500).json({ message: 'Internal server error.' })
})

app.listen(port, '0.0.0.0', () => {
  console.log(`Nexus server listening on port ${port}`)
})