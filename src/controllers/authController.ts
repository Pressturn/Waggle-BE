import { Request, Response } from 'express'
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import prisma from '../utils/prisma'

const saltRounds = 10

const signUp = async (req: Request, res: Response) => {
    try {
        const { name, email, password } = req.body

        const existingUser = await prisma.user.findUnique({
            where: { email }
        })

        if (existingUser) {
            return res.status(400).json({ message: 'User already exists' })
        }

        const hashedPassword = await bcrypt.hash(password, saltRounds)

        const user = await prisma.user.create({
            data: {
                name,
                email,
                password: hashedPassword
            }
        })

        const token = jwt.sign(
            { userId: user.id },
            process.env.JWT_SECRET as string,
            { expiresIn: '1d' }
        )

        res.status(201).json({
            message: 'User created successfully',
            token,
            user: {
                id: user.id,
                name: user.name,
                email: user.email
            }
        })
    } catch (error) {
        console.error('Signup error:', error)
        res.status(500).json({ message: 'Server Error' })
    }
}

const signIn = async (req: Request, res: Response) => {
    try {

        const { email, password } = req.body

        const user = await prisma.user.findUnique({
            where: { email }
        })

        if (!user) {
            return res.status(400).json({ message: 'Invalid credentials' })
        }

        const correctPassword = await bcrypt.compare(password, user.password)

        if (!correctPassword) {
            return res.status(400).json({ messsage: 'Invalid credentials' })
        }

        const token = jwt.sign(
            { userId: user.id },
            process.env.JWT_SECRET as string,
            { expiresIn: '6hr' }
        )

        res.json({
            messsage: 'Login successful',
            token,
            user: {
                id: user.id,
                name: user.name,
                email: user.email
            }
        })

    } catch (error) {
        console.error('Signin error:', error)
        res.status(500).json({ message: 'Serevr Error' })
    }
}

export { signUp, signIn }