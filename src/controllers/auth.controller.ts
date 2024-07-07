import { Response, Request } from "express";
import { prisma } from "../app";
import generateJWTToken from "../utils/generateJWToken";
import { hashPassword, comparePasswords } from "../utils/hashPasswordAndVerify"

//Register User Route
export const registerUser = async (req: Request, res: Response) => {
  const { firstName, lastName, email, password, phone } = req.body;

  try {
    // Check if the email already exists
    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) {
      return res.status(422).json({
        errors: [{ field: "email", message: "Email already exists" }],
      });
    }

    //Hash Password
    const hashedPassword = await hashPassword(password);

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

    //Create JWT Token with Secret
    const token = await generateJWTToken(user.userId);
    
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

//Login User Route
export const loginUser = async (req: Request, res: Response) => {
  const { email, password } = req.body

  try {
    const user = await prisma.user.findUnique({ where: { email } })
    if (!user) {
      return res.status(404).json({
        status: 'Bad request',
        message: 'User not found',
        statusCode: 404,
      });
    }

    const isValid = await comparePasswords(password, user.password);
    if (!isValid) {
      return res.status(401).json({
        status: 'Bad request',
        message: 'Authentication failed',
        statusCode: 401,
      });
    }

    //Create JWT Token with Secret
    const token = await generateJWTToken(user.userId);

    res.status(200).json({
      status: 'success',
      message: 'Login successful',
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
  } catch (error) {
    res.status(401).json({
      status: 'Bad request',
      message: 'Authentication failed',
      statusCode: 401
    })
  }
}