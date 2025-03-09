import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { ConfigService } from '@nestjs/config';
import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';


@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, 'jwt') {
    constructor(
        private prisma: PrismaService,
        configService: ConfigService,
    ) {
        const jwtSecret = configService.get('JWT_SECRET');

        // console.log('Log Secret ', jwtSecret);
        super({
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            ignoreExpiration: false,
            secretOrKey: jwtSecret,

        });
    }

    async validate(payload: { sub: number }) {
        console.log(payload);

        //Come back here to define what you want from the user based on the id if you really want...

        const user = await this.prisma.user.findUnique({
            where: {
                id: payload.sub,
            },
        });

        if (!user) {
            throw new Error('Error finding the user');
        }

        const { password: string, ...safeUser } = user;

        return safeUser;


    }
}