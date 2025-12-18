import { Response } from 'express'
import { AuthRequest } from '../middleware/verifyToken'
import prisma from '../utils/prisma'

const getHouseholdMembers = async (req: AuthRequest, res: Response) => {
    try {
        const accountId = req.account?.accountId

        const profile = await prisma.profile.findFirst({
            where: { accountId }
        })

        if (!profile || !profile.householdId) {
            return res.status(400).json({ message: 'No household found' })
        }

        const members = await prisma.profile.findMany({
            where: {
                householdId: profile.householdId
            },
            select: {
                id: true,
                name: true,
                role: true
            },
            orderBy: {
                role: 'asc'
            }
        })

        res.json({ members })
    } catch (error) {
        console.error('Get household members error:', error)
        res.status(500).json({ message: 'Server Error' })
    }
}

export { getHouseholdMembers }
