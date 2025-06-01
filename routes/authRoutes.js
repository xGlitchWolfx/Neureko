import { Router } from 'express'
import { register, login, confirmarCuenta } from '../controllers/authController.js'

const router = Router()

router.post('/register', register)
router.post('/login', login)
router.get('/confirmar/:token', confirmarCuenta)

export default router
