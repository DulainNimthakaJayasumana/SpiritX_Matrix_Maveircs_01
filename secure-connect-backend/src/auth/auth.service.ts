import {ForbiddenException, Injectable} from '@nestjs/common';
import {PrismaService} from "../prisma/prisma.service";
import { JwtService } from '@nestjs/jwt';
import {AuthDto} from "./AuthDTO";
import * as argon from 'argon2';
import {PrismaClientKnownRequestError} from "@prisma/client/runtime/client";
import {catchError} from "rxjs";

@Injectable()
export class AuthService {

    constructor(
        private prisma: PrismaService,
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



            //return the user here.

        }catch (error) {
            if (error instanceof PrismaClientKnownRequestError) {
                if (error.code === 'P2002') {
                    throw new ForbiddenException('Credentials taken');
                }
            }
            throw error;
        }
    }


    async login(dto: AuthDto){

        try{
            const user = await this.prisma.user.findUniqueOrThrow({
                where: {
                    username: dto.username
                }
            });

            //check of the password compatibility

            const {password, ...safeUser} = user;
            // return the user





        }catch (error) {
            if (error instanceof PrismaClientKnownRequestError) {
                if (error.code === 'P2025') {
                    throw new ForbiddenException('User not found');
                }
            }
        }



    }








}
