import express, { Express, Request, Response } from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import authRoutes from './routes/authRoutes'
import dogRoutes from './routes/dogRoutes'
import activityRoutes from './routes/activityRoutes'
import inviteRoutes from './routes/inviteRoutes'
import householdRoutes from './routes/householdRoutes'

dotenv.config()

const app: Express = express()
const PORT = process.env.PORT || 5001

app.use(cors({
    origin: process.env.FRONTEND_URL || 'http://localhost:5173',
    credentials: true
}))

app.use(express.json())

app.use('/api/auth', authRoutes)
app.use('/api/dogs', dogRoutes)
app.use('/api/activities', activityRoutes)
app.use('/api/invites', inviteRoutes)
app.use('/api/households', householdRoutes)

app.get('/', (req, res) => {
    res.json({ message: 'Api is running' })
})

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})
