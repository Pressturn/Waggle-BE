import { Response } from 'express'
import { AuthRequest } from '../middleware/verifyToken'
import prisma from '../utils/prisma'

function generateInviteCode(): string {
    const characters = 'ABCDEFGHJKLMNOPQRSTUVWXYZ23456789'
    let code = ''
    for (let i = 0; i < 10; i++) {
        code += characters.charAt(Math.floor(Math.random() * characters.length))
    }
    return code
}

const createInvite = async (req: AuthRequest, res: Response) => {
    try {
        const accountId = req.account?.accountId
        const { role } = req.body

        if (!['MEMBER', 'STAFF'].includes(role)) {
            return res.status(400).json({ message: 'Invalid role' })
        }

        const profile = await prisma.profile.findFirst({
            where: { accountId }
        })

        if (!profile || !profile.householdId) {
            return res.status(400).json({ message: 'No household found' })
        }

        let code = generateInviteCode()
        let exists = await prisma.invite.findUnique({ where: { code } })

        while (exists) {
            code = generateInviteCode()
            exists = await prisma.invite.findUnique({ where: { code } })
        }

        const expiresAt = new Date()
        expiresAt.setHours(expiresAt.getHours() + 1)

        const invite = await prisma.invite.create({
            data: {
                code,
                householdId: profile.householdId,
                role: role,
                createdById: profile.id,
                expiresAt
            }
        })

        res.status(201).json({
            message: 'Invite created',
            code: invite.code,
            role: invite.role,
            expiresAt: invite.expiresAt
        })
    } catch (error) {
        console.error('Create invite error:', error)
        res.status(500).json({ message: 'Server Error' })
    }
}

export { createInvite }
