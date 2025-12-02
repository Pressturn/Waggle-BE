import { Request, Response } from 'express'
import prisma from '../utils/prisma'

interface AuthRequest extends Request {
    account?: {
        accountId: string
    }
}

const createActivity = async (req: AuthRequest, res: Response){
    try {

    } catch (error) {
        res.status(500).json({ message: 'Server Error' })
    }
}

const getAllActivities = async (req: AuthRequest, res: Response){
    try {

    } catch (error) {
        res.status(500).json({ message: 'Server Error' })
    }
}

const getTodayActivities = async (req: AuthRequest, res: Response){
    try {

    } catch (error) {
        res.status(500).json({ message: 'Server Error' })
    }
}

const updateActivity = async (req: AuthRequest, res: Response){
    try {

    } catch (error) {
        res.status(500).json({ message: 'Server Error' })
    }
}

const deleteActivity = async (req: AuthRequest, res: Response){
    try {

    } catch (error) {
        res.status(500).json({ message: 'Server Error' })
    }
}

export { createActivity, getAllActivities, getTodayActivities, updateActivity, deleteActivity }