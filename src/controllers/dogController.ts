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

const getAllDogs = async (req: AuthRequest, res: Response) => {
    try {
        const accountId = req.account?.accountId

        const profile = await prisma.profile.findFirst({
            where: { accountId }
        })

        if (!profile || !profile.householdId) {
            return res.status(400).json({ message: 'No household found' })
        }

        const dogs = await prisma.dog.findMany({
            where: { householdId: profile.householdId }
        })

        res.json({ dogs })
    } catch (error) {
        res.status(500).json({ message: 'Server Error' })
    }
}

const getSingleDog = async (req: AuthRequest, res: Response) => {
    try {
        const { id } = req.params
        const dog = await prisma.dog.findUnique({
            where: { id }
        })

        if (!dog) {
            return res.status(404).json({ message: 'Dog not found' })
        }

        res.json({ dog })
    } catch (error) {
        res.status(500).json({ messsage: 'Server Error' })
    }
}

export { createDog, getAllDogs, getSingleDog }