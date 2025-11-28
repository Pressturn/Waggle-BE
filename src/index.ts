import express, { Express, Request, Response } from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import authRoutes from './routes/authRoutes'

dotenv.config()

const app: Express = express()
const PORT = process.env.PORT || 5001

app.use(cors())
app.use(express.json())

app.use('/api/auth', authRoutes)

app.get('/', (req: Request, res: Response) => {
    res.json({ message: 'Api is running' })
})

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})