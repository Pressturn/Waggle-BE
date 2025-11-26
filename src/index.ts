import express, { Express, Request, Response } from 'express'
import cors from 'cors'
import dotenv from 'dotenv'

dotenv.config

const app: Express = express()
const PORT = process.env.PORT || 5000

app.use(cors())
app.use(express.json())

app.get('/', (req: Request, res: Response) => {
    res.json({ message: 'Api is running' })
})

app.listen(PORT, () => {
    console.log(`SErver running on port ${PORT}`)
})