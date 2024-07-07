import { Request, Response, NextFunction } from 'express';
import * as yup from 'yup';

// Define the validation schema
const userSchema = yup.object().shape({
    firstName: yup.string().required('First name is required'),
    lastName: yup.string().required('Last name is required'),
    email: yup.string().email('Invalid email format').required('Email is required'),
    password: yup.string().required('Password is required'),
    phone: yup.string().nullable().notRequired(),
});

const validateUser = async (req: Request, res: Response, next: NextFunction) => {
    try {
        await userSchema.validate(req.body, { abortEarly: false });
        next();
    } catch (err) {
        if (err instanceof yup.ValidationError) {
            const errors = err.inner.map(error => ({
                field: error.path,
                message: error.message,
            }));
            return res.status(422).json({ errors });
        }
        next(err);
    }
};

export default validateUser;
