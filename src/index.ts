import express, { Express, Request, Response } from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import authRoutes from './routes/authRoutes'
import dogRoutes from './routes/dogRoutes'
import activityRoutes from './routes/activityRoutes'
import inviteRoutes from './routes/inviteRoutes'

dotenv.config()

const app: Express = express()
const PORT = process.env.PORT || 5001

app.use(cors())
app.use(express.json())

app.use('/api/auth', authRoutes)
app.use('/api/dogs', dogRoutes)
app.use('/api/activities', activityRoutes)
app.use('/api/invite', inviteRoutes)

app.get('/', (req, res ) => {
    res.json({ message: 'Api is running' })
})

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})
