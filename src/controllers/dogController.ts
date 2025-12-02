import { Request, Response } from 'express'
import prisma from '../utils/prisma'

interface AuthRequest extends Request {
    account?: {
        accountId: string
    }
}

const createDog = async (req: AuthRequest, res: Response) => {
    try {
        const { name, breed, age, weight, photo, allergies, dietaryRestrictions, medication, vetContact }
            = req.body

        const accountId = req.account?.accountId

        const profile = await prisma.profile.findFirst({
            where: { accountId }
        })

        if (!profile || !profile.householdId) {
            return res.status(400).json({ message: 'No household found' })
        }

        const dog = await prisma.dog.create({
            data: {
                name,
                breed,
                age,
                weight,
                photo,
                allergies,
                dietaryRestrictions,
                medication,
                vetContact,
                householdId: profile.householdId
            }
        })

        res.status(201).json({ message: 'Dog created!', dog }
        )

    } catch (error) {
        res.status(500).json({ message: 'Server Error' })
    }
}

export { createDog }