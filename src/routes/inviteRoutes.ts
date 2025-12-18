import { Router } from 'express'
import { createInvite } from '../controllers/inviteController'
import verifyToken from '../middleware/verifyToken'

const router = Router()

router.post('/', verifyToken, createInvite)

export default router