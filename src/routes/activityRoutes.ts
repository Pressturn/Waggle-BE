import { Router } from 'express'
import { createActivity, getAllActivities, updateActivity, deleteActivity } from '../controllers/activityController'
import verifyToken from '../middleware/verifyToken'

const router = Router()

router.post('/', verifyToken, createActivity)
router.get('/', verifyToken, getAllActivities)
router.put('/:id', verifyToken, updateActivity)
router.delete('/:id', verifyToken, deleteActivity)

export default router