import express from 'express'
import { getHouseholdMembers } from '../controllers/householdController'
import verifyToken from '../middleware/verifyToken'

const router = express.Router()

router.get('/members', verifyToken, getHouseholdMembers)

export default router