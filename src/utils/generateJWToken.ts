import jwt, { Secret } from 'jsonwebtoken';
const JwtSecret =  process.env.JWT_SECRET as Secret;

//Generate JWT Token with Secret
const generateJWTToken = async (userId : string) => {
    const token = jwt.sign({ userId }, JwtSecret, { expiresIn: '1d' });
    return token;
}

export default generateJWTToken;
