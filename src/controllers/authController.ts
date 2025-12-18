import { Request, Response } from 'express'
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import prisma from '../utils/prisma'

const saltRounds = 10

const signUp = async (req: Request, res: Response) => {
    try {
        const { name, email, password, householdCode } = req.body

        const existingAccount = await prisma.account.findUnique({
            where: { email }
        })

        if (existingAccount) {
            return res.status(400).json({ message: 'User already exists' })
        }

        const hashedPassword = await bcrypt.hash(password, saltRounds)

        let householdId: string | undefined
        let role: 'OWNER' | 'MEMBER' = 'OWNER'

        if (householdCode) {
            const household = await prisma.household.findUnique({
                where: { code: householdCode }
            })


            if (!household) {
                return res.status(400).json({ message: 'Invalid household code' })
            }

            householdId = household.id
            role = 'MEMBER'
        }
        
        const account = await prisma.account.create({
            data: {
                name,
                email,
                password: hashedPassword,
                Profile: {
                    create: {
                        type: 'FAMILY',
                        name: name,
                        role: 'OWNER',
                        household: {
                            create: {
                                name: `${name}'s Family`
                            }
                        }
                    }
                }
            },
            include: {
                Profile: {
                    include: {
                        household: true
                    }
                }
            }
        })

        const token = jwt.sign(
            { accountId: account.id },
            process.env.JWT_SECRET as string,
            { expiresIn: '1d' }
        )

        res.status(201).json({
            message: 'User created successfully',
            token,
            account: {
                id: account.id,
                name: account.name,
                email: account.email,
                profile: account.Profile[0]
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

        const account = await prisma.account.findUnique({
            where: { email }
        })

        if (!account) {
            return res.status(400).json({ message: 'Invalid credentials' })
        }

        const correctPassword = await bcrypt.compare(password, account.password)

        if (!correctPassword) {
            return res.status(400).json({ message: 'Invalid credentials' })
        }

        const token = jwt.sign(
            { accountId: account.id },
            process.env.JWT_SECRET as string,
            { expiresIn: '6hr' }
        )

        res.json({
            message: 'Login successful',
            token,
            account: {
                id: account.id,
                name: account.name,
                email: account.email
            }
        })

    } catch (error) {
        console.error('Signin error:', error)
        res.status(500).json({ message: 'Server Error' })
    }
}

const signOut = async (req: Request, res: Response) => {
    res.json({ message: 'Signed out' })
}

export { signUp, signIn, signOut }