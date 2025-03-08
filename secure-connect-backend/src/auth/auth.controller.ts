import {Body, Controller, Post} from '@nestjs/common';
import {AuthDto} from "./AuthDTO";
import {AuthService} from "./auth.service";

@Controller('auth')
export class AuthController {

    constructor(
        private authService: AuthService
    ){}


    @Post('signUp')
    signUp(@Body() dto: AuthDto){


        return this.authService.signUp(dto);
    }

    @Post('login')
    login(@Body() dto: AuthDto){

        return this.authService.login(dto);


    }



}
