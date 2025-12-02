import { Router } from 'express'
import { createDog } from '../controllers/dogController'
import verifyToken from '../middleware/verifyToken'

const router = Router()

router.post('/', verifyToken, createDog)
// router.get('/', verifyToken, getAllDogs)
// router.get('/:id', verifyToken, getSingleDog)
// router.put('/:id', verifyToken, updateDog)
// router.delete('/:id, verifyToken', deleteDog)

export default router