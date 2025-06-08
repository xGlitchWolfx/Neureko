import { Router } from 'express'
import {
  register,
  login,
  confirmarCuenta,
  recuperarPassword,
  comprobarTokenPassword,
  crearNuevoPassword
} from '../controllers/usuario_Controller.js'

const router = Router()

// Autenticación y registro
router.post('/register', register) // Registrar nuevo usuario
router.post('/login', login) // Iniciar sesión
router.get('/confirmar/:token', confirmarCuenta) // Confirmar cuenta por token

// Recuperación de contraseña
router.post('/recuperar-password', recuperarPassword) // Solicitar recuperación (envía correo)
router.get('/recuperar-password/:token', comprobarTokenPassword) // Comprobar token recibido
router.post('/recuperar-password/:token', crearNuevoPassword) // Crear nueva contraseña con token

export default router
