import User from '../models/User.js'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import sendMailToRegister from '../utils/sendMailToRegister.js'

// Función para generar token JWT (uso en login)
const generateToken = (user) => {
  return jwt.sign(
    { id: user._id, role: user.rol },
    process.env.JWT_SECRET,
    { expiresIn: '1d' }
  )
}

// Registro de usuario con validaciones y envío de correo
export const register = async (req, res) => {
  const { nombre, correo, contrasena } = req.body

  if (!nombre || !correo || !contrasena)
    return res.status(400).json({ msg: 'Todos los campos son obligatorios' })

  if (contrasena.length < 5)
    return res.status(400).json({ msg: 'La contraseña debe tener al menos 5 caracteres' })

  try {
    const existe = await User.findOne({ correo })
    if (existe)
      return res.status(400).json({ msg: 'Correo ya registrado' })

    const nuevoUsuario = new User({
      nombre,
      correo,
      rol: 'usuario'
    })

    nuevoUsuario.contrasena = await nuevoUsuario.encriptarContrasena(contrasena)
    const token = nuevoUsuario.generarToken()

    await nuevoUsuario.save()
    await sendMailToRegister(correo, token)

    return res.status(201).json({
      msg: 'Usuario registrado. Revisa tu correo para confirmar tu cuenta.'
    })

  } catch (error) {
    console.error(error)
    return res.status(500).json({ msg: 'Error en el servidor' })
  }
}

// Login de usuario
export const login = async (req, res) => {
  const { correo, contrasena } = req.body

  try {
    const usuario = await User.findOne({ correo })
    if (!usuario)
      return res.status(404).json({ msg: 'Usuario no encontrado' })

    const esValida = await bcrypt.compare(contrasena, usuario.contrasena)
    if (!esValida)
      return res.status(400).json({ msg: 'Contraseña incorrecta' })

    if (!usuario.confirmEmail)
      return res.status(403).json({ msg: 'Debes confirmar tu correo antes de iniciar sesión' })

    const token = generateToken(usuario)
    return res.json({ token })

  } catch (error) {
    console.error(error)
    return res.status(500).json({ msg: 'Error al iniciar sesión' })
  }
}

// Confirmación de cuenta mediante token enviado por correo
export const confirmarCuenta = async (req, res) => {
  const { token } = req.params

  try {
    const usuario = await User.findOne({ token })

    if (!usuario)
      return res.status(404).json({ msg: 'Token no válido o cuenta ya confirmada' })

    usuario.confirmEmail = true
    usuario.token = null
    await usuario.save()

    res.json({ msg: 'uenta confirmada correctamente. Ya puedes iniciar sesión.' })
  } catch (error) {
    console.error(error)
    res.status(500).json({ msg: 'Error al confirmar la cuenta' })
  }
}
