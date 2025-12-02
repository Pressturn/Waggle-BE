import { Router } from 'express'
import { createActivity, getAllActivities, getTodayActivities, updateActivity, deleteActivity } from '../controllers/activityController'
import verifyToken from '../middleware/verifyToken'

const router = Router()

router.post('/', verifyToken, createActivity)
router.post('/', verifyToken, getAllActivities)
router.post('/', verifyToken, getTodayActivities)
router.post('/', verifyToken, updateActivity)
router.post('/', verifyToken, deleteActivity)

export default router