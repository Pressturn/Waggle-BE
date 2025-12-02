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

    } catch (error) {
        res.status(500).json({ message: 'Server Error' })
    }
}

const getTodayActivities = async (req: AuthRequest, res: Response) => {
    try {

    } catch (error) {
        res.status(500).json({ message: 'Server Error' })
    }
}

const updateActivity = async (req: AuthRequest, res: Response) => {
    try {

    } catch (error) {
        res.status(500).json({ message: 'Server Error' })
    }
}

const deleteActivity = async (req: AuthRequest, res: Response) => {
    try {

    } catch (error) {
        res.status(500).json({ message: 'Server Error' })
    }
}

export { createActivity, getAllActivities, getTodayActivities, updateActivity, deleteActivity }