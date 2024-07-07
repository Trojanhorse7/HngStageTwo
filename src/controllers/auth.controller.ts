import { Response, Request } from "express";
import jwt, { Secret } from 'jsonwebtoken';
import bcrypt from "bcryptjs";
import { prisma } from "../index";
import dotenv from 'dotenv';
dotenv.config();

const JwtSecret =  process.env.JWT_SECRET as Secret;

export const registerUser = async (req: Request, res: Response) => {
  const { firstName, lastName, email, password, phone } = req.body

  try {

     // Check if the email already exists
    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) {
      return res.status(400).json({
        status: 'Bad request',
        message: 'Email already exists',
        statusCode: 400,
      });
    }

    //Hash Password
    const hashedPassword = await bcrypt.hash(password, 10)

    //Create User
    const user = await prisma.user.create({
      data: {
        firstName,
        lastName,
        email,
        password: hashedPassword,
        phone
      }
    })

    //Create Organization for User
    const organisation = await prisma.organisation.create({
      data: {
        name: `${firstName}'s Organisation`,
        users: {
          create: {
            userId: user.userId
          }
        }
      }
    })

    const token = jwt.sign({ userId: user.userId }, JwtSecret, { expiresIn: '1h' });
    
    res.status(201).json({
      status: 'success',
      message: 'Registration successful',
      data: {
        accessToken: token,
        user: {
          userId: user.userId,
          firstName: user.firstName,
          lastName: user.lastName,
          email: user.email,
          phone: user.phone
        }
      }
    })

  } catch (e) {

    res.status(400).json({
      status: 'Bad request',
      message: 'Registration unsuccessful',
      statusCode: 400
    })
  }
}
