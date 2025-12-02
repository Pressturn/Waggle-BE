import { Router } from 'express'
import { createActivity, getAllActivities, getTodayActivities, updateActivity, deleteActivity } from '../controllers/activityController'
import verifyToken from '../middleware/verifyToken'

const router = Router()

router.post('/', verifyToken, createActivity)
router.get('/', verifyToken, getAllActivities)
router.get('/', verifyToken, getTodayActivities)
router.put('/', verifyToken, updateActivity)
router.delete('/', verifyToken, deleteActivity)

export default router