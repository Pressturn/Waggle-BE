import { Request, Response } from 'express'
import prisma from '../utils/prisma'

interface AuthRequest extends Request {
    account?: {
        accountId: string
    }
}

const createActivity = async (req: AuthRequest, res: Response) => {
    try {
        const { type, date, time, foodType, portion, activityKind, medication, notes, photo, dogId }
            = req.body

        const accountId = req.account?.accountId
        const profile = await prisma.profile.findFirst({
            where: { accountId }
        })

        if (!profile) {
            return res.status(400).json({ message: 'Profile not found' })
        }

        const dog = await prisma.dog.findUnique({
            where: { id: dogId }
        })

        if (!dog) {
            return res.status(404).json({ message: 'Dog not found' })
        }

        if (dog.householdId !== profile.householdId) {
            return res.status(403).json({ message: 'Dog not in your household' })
        }

        const activity = await prisma.activity.create({
            data: {
                type,
                date: new Date(date),
                time,
                foodType,
                portion,
                activityKind,
                medication,
                notes,
                photo,
                dogId,
                loggedById: profile.id
            },
            include: {
                dog: true,
                loggedBy: true
            }
        })

        res.status(201).json({ message: 'Activity Logged', activity })
    } catch (error) {
        res.status(500).json({ message: 'Server Error' })
    }
}

const getAllActivities = async (req: AuthRequest, res: Response) => {
    try {
        const accountId = req.account?.accountId

        const profile = await prisma.profile.findFirst({
            where: { accountId }
        })

        if (!profile || !profile.householdId) {
            return res.status(400).json({ message: 'No household found' })
        }

        const householdDogs = await prisma.dog.findMany({
            where: { householdId: profile.householdId },
            select: { id: true }
        })

        const dogIds = householdDogs.map(dog => dog.id)

        const activities = await prisma.activity.findMany({
            where: {
                dogId: { in: dogIds }
            },
            include: {
                dog: true,
                loggedBy: true
            },
            orderBy: {
                date: 'desc'
            }
        })

        res.json({ activities })
    } catch (error) {
        res.status(500).json({ message: 'Server Error' })
    }
}

const updateActivity = async (req: AuthRequest, res: Response) => {
    try {

        const { id } = req.params
        const { type, date, time, foodType, portion, activityKind, medication, notes, photo }
            = req.body

        const existingActivity = await prisma.activity.findUnique({
            where: { id }
        })

        if (!existingActivity) {
            return res.status(404).json({ message: 'Activity not found' })
        }

        const activity = await prisma.activity.update({
            where: { id },
            data: {
                type,
                date: date ? new Date(date) : undefined,
                time,
                foodType,
                portion,
                activityKind,
                medication,
                notes,
                photo
            },
            include: {
                dog: true,
                loggedBy: true,
            }
        })

        res.json({ message: 'Activity updated successfully', activity })
    } catch (error) {
        console.error('Update activity error:', error)  // ← Add this to see actual error

        res.status(500).json({ message: 'Server Error' })
    }
}

const deleteActivity = async (req: AuthRequest, res: Response) => {
    try {

        const { id } = req.params

        const existingActivity = await prisma.activity.findUnique({
            where: { id }
        })

        if (!existingActivity) {
            return res.status(404).json({ message: 'Activity not found' })
        }

        await prisma.activity.delete({
            where: { id }
        })

        res.json({ message: 'Activity deleted successfully' })
    } catch (error) {
        console.error(error)
        res.status(500).json({ message: 'Server Error' })
    }
}

export { createActivity, getAllActivities, updateActivity, deleteActivity }