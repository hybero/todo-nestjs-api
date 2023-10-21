import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { PassportStrategy } from "@nestjs/passport";
import { ExtractJwt, Strategy } from "passport-jwt";
import { JwtType } from "../types/jwt.type";

@Injectable()
export class AtStrategy extends PassportStrategy(Strategy, 'jwt-at') {
    constructor(
        private config: ConfigService
    ) {
        super({
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            secretOrKey: config.get('AT_SECRET')
        })
    }

    validate(payload: JwtType) {
        return payload
    }
}