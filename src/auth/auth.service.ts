import { UnauthorizedException } from '@nestjs/common';
import { config } from '../config';
import * as jwt from 'jsonwebtoken';
import { Role } from './guards/role.enum';
import { users } from './users.db';

export class AuthService {
    // Checks a given email & password combination, returns token
    static login(email: string, password: string): string {
        const user = users.find(i => i.email === email && i.password === password);

        if (!user)
            throw new UnauthorizedException(`Username or password is incorrect`);

        return jwt.sign({
            uid: user.id,
            roles: ['user', ...(user.admin ? ['admin'] : [])]
        }, config.secret, {
            expiresIn: '1d'
        })
    }

    // Decodes a provided token
    static verify(token: string): Auth {
        return jwt.verify(token, config.secret) as Auth
    }
}

interface Auth {
    uid: number;
    roles: Role[];
}