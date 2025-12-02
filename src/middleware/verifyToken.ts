import { Request, Response, NextFunction } from 'express'
import jwt from 'jsonwebtoken'

interface AuthRequest extends Request {
    account?: {
        accountId: string
    }
}

const verifyToken = (req: AuthRequest, res: Response, next: NextFunction) => {
    const token = req.headers.authorization

    if (!token) {
        return res.status(401).json({ error: 'No token provided' })
    }

    const tokenWithoutBearer = token.split(' ')[1]

    try {
        const decoded = jwt.verify(tokenWithoutBearer, process.env.JWT_SECRET as string) as { accountId: string }
        req.account = decoded
        next()
    } catch (error) {
        return res.status(401).json({ error: 'Invalid Token' })
    }
}

export default verifyToken 