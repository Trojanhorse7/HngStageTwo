import { Request, Response, NextFunction } from 'express';
import * as yup from 'yup';

// Register Input Validation
const registerSchema = yup.object().shape({
    firstName: yup.string().required('First name is required'),
    lastName: yup.string().required('Last name is required'),
    email: yup.string().email('Invalid email format').required('Email is required'),
    password: yup
    .string()
    .required('Password is required')
    .min(8, 'Password must be at least 8 characters long')
    .matches(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
        'Password must contain at least one uppercase letter, one lowercase letter, one number and one special character'
    ),
    phone: yup.string().nullable().notRequired(),
});

export const registerInputValidate = async (req: Request, res: Response, next: NextFunction) => {
    try {
        await registerSchema.validate(req.body, { abortEarly: false });
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

// Login Input Validation
const loginSchema = yup.object().shape({
    email: yup.string().email('Invalid email format').required('Email is required'),
    password: yup
    .string()
    .required('Password is required')
    .min(8, 'Password must be at least 8 characters long')
    .matches(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
        'Password must contain at least one uppercase letter, one lowercase letter, one number and one special character'
    ),
});

export const loginInputValidate = async (req: Request, res: Response, next: NextFunction) => {
    try {
        await loginSchema.validate(req.body, { abortEarly: false });
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

// Create Organisation Validation
const createNewOrganisationSchema = yup.object().shape({
    name: yup.string().required('Name is required'),
});

export const createNewOrganisationValidate = async (req: Request, res: Response, next: NextFunction) => {
    try {
        await createNewOrganisationSchema.validate(req.body, { abortEarly: false });
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