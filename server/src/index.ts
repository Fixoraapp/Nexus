import cors from 'cors'
import dotenv from 'dotenv'
import express from 'express'
import { authRouter } from './routes/auth.routes'
import { userRouter } from './routes/user.routes'

dotenv.config()

const app = express()
const port = Number(process.env.PORT || 4000)
const clientUrl = process.env.CLIENT_URL || 'http://localhost:5173'

app.use(cors({
  credentials: true,
  origin: clientUrl,
}))
app.use(express.json())

app.get('/health', (_req, res) => {
  res.json({ ok: true, service: 'nexus-server' })
})

app.use('/api/auth', authRouter)
app.use('/api/users', userRouter)

app.use((err: unknown, _req: express.Request, res: express.Response, next: express.NextFunction) => {
  void next
  console.error(err)
  res.status(500).json({ message: 'Internal server error.' })
})

app.listen(port, () => {
  console.log(`Nexus server listening on http://localhost:${port}`)
})
