import {ForbiddenException, Injectable} from '@nestjs/common';
import {PrismaService} from "../prisma/prisma.service";
import {AuthDto} from "./AuthDTO";
import * as argon from 'argon2';
import {PrismaClientKnownRequestError} from "@prisma/client/runtime/client";
import {ConfigService} from "@nestjs/config";
import {JwtService} from "@nestjs/jwt";

@Injectable()
export class AuthService {

    constructor(
        private prisma: PrismaService,
        private config: ConfigService,
        private jwt: JwtService
    ){}


    async signUp(dto: AuthDto){

        try {
            const hash = await argon.hash(dto.password);

            const user = await this.prisma.user.create({
                data: {
                    username: dto.username,
                    password: hash
                },
                select: {
                    id: true,
                    username: true,
                }
            });



            return this.signToken(user.id, user.username);

        }catch (error) {
            if (error instanceof PrismaClientKnownRequestError) {
                if (error.code === 'P2002') {
                    throw new ForbiddenException('Credentials taken');
                }
            }
            throw error;
        }
    }

    async signToken(
        sub: number,
        username: string,

    ){

        const payload = {
            sub,
            username,

        }

        const secret = this.config.get('JWT_SECRET');

        const token = await this.jwt.signAsync(
            payload,
            {
                expiresIn: '15m',
                secret,
            });

        return {
            access_token:token,
        };


    }



    async login(dto: AuthDto){


        const user = await this.prisma.user.findUnique({
            where: {
                username: dto.username
            }
        });

        if (!user) {
            throw new ForbiddenException('Credentials incorrect');
        }

        const matched = await argon.verify(user.password, dto.password);

        if (!matched) {
            throw new ForbiddenException('Credentials incorrect ');
        }


        return this.signToken(user.id, user.username);

        
    }








}
