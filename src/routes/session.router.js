import { Router } from "express";
import UserModel from "../dao/models/user.model.js";
import { generateToken } from "../utils.js";

const router = Router()

//Vista para registrar usuarios
router.get('/register', (req, res) => {
    res.render('sessions/register')
})

// API para crear usuarios en la DB
router.post('/register', async(req, res) => {
    const userNew = req.body
    console.log(userNew);

    const user = new UserModel(userNew)
    await user.save()

    const access_token = generateToken(user)

    // res.redirect('/session/login')
    res.send({ status: 'success', access_token })
})

// Vista de Login
router.get('/login', (req, res) => {
    res.render('sessions/login')
})

// API para login
router.post('/login', async (req, res) => {
    const { email, password } = req.body

    const user = await UserModel.findOne({email, password}).lean().exec()
    if(!user) {
        return res.status(401).render('errors/base', {
            error: 'Error en email y/o password'
        })
    }

    // req.session.user = user
    const access_token = generateToken(user)
    // res.redirect('/products')
    // res.send({ status: 'success', access_token })
    res.cookie('myToken', access_token).redirect('/products')
})

// Cerrar Session
router.get('/logout', (req, res) => {
    req.session.destroy(err => {
        if(err) {
            console.log(err);
            res.status(500).render('errors/base', {error: err})
        } else res.redirect('/sessions/login')
    })
})



export default router