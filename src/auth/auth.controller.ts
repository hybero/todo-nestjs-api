import { Body, Controller, HttpCode, HttpStatus, Post, Req, UseGuards } from "@nestjs/common";
import { AuthService } from "./auth.service";
import { AuthDto } from "./dto";
import { Tokens } from "./type/tokens.type";
import { RtGuard } from "./guard";
import { GetCurrentUser, GetCurrentUserId, Public } from "./decorator";

@Controller('auth')
export class AuthController {
    constructor(private authService: AuthService){}

    @Public()
    @Post('register')
    @HttpCode(HttpStatus.CREATED)
    register(@Body() dto: AuthDto): Promise<Tokens> {
        return this.authService.register(dto)
    }

    @Public()
    @Post('login')
    @HttpCode(HttpStatus.OK)
    login(@Body() dto: AuthDto): Promise<Tokens> {
        return this.authService.login(dto)
    }

    @Post('logout')
    @HttpCode(HttpStatus.NO_CONTENT)
    logout(@GetCurrentUserId() userId: number) {
        return this.authService.logout(userId)
    }

    @Public()
    @UseGuards(RtGuard)
    @Post('refresh')
    @HttpCode(HttpStatus.OK)
    refreshTokens(
        @GetCurrentUserId() userId: number, 
        @GetCurrentUser('refreshToken') refreshToken: string
    ): Promise<Tokens> {
        return this.authService.refreshTokens(userId, refreshToken)
    }
}