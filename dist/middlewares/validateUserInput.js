"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createNewOrganisationValidate = exports.loginInputValidate = exports.registerInputValidate = void 0;
const yup = __importStar(require("yup"));
// Register Input Validation
const registerSchema = yup.object().shape({
    firstName: yup.string().required('First name is required'),
    lastName: yup.string().required('Last name is required'),
    email: yup.string().email('Invalid email format').required('Email is required'),
    password: yup
        .string()
        .required('Password is required')
        .min(8, 'Password must be at least 8 characters long')
        .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/, 'Password must contain at least one uppercase letter, one lowercase letter, one number and one special character'),
    phone: yup.string().nullable().notRequired(),
});
const registerInputValidate = async (req, res, next) => {
    try {
        await registerSchema.validate(req.body, { abortEarly: false });
        next();
    }
    catch (err) {
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
exports.registerInputValidate = registerInputValidate;
// Login Input Validation
const loginSchema = yup.object().shape({
    email: yup.string().email('Invalid email format').required('Email is required'),
    password: yup
        .string()
        .required('Password is required')
        .min(8, 'Password must be at least 8 characters long')
        .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/, 'Password must contain at least one uppercase letter, one lowercase letter, one number and one special character'),
});
const loginInputValidate = async (req, res, next) => {
    try {
        await loginSchema.validate(req.body, { abortEarly: false });
        next();
    }
    catch (err) {
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
exports.loginInputValidate = loginInputValidate;
// Create Organisation Validation
const createNewOrganisationSchema = yup.object().shape({
    name: yup.string().required('Name is required'),
});
const createNewOrganisationValidate = async (req, res, next) => {
    try {
        await createNewOrganisationSchema.validate(req.body, { abortEarly: false });
        next();
    }
    catch (err) {
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
exports.createNewOrganisationValidate = createNewOrganisationValidate;
//# sourceMappingURL=validateUserInput.js.map