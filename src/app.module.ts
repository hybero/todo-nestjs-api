import { Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { UserModule } from './user/user.module';
import { ListModule } from './list/list.module';
import { TaskModule } from './task/task.module';
import { PrismaModule } from './prisma/prisma.module';
import { ConfigModule } from '@nestjs/config';
import { APP_GUARD } from '@nestjs/core';
import { AtGuard } from './auth/guard';

@Module({
    imports: [
        ConfigModule.forRoot({
            isGlobal: true // Does the same thing as @Global decorator in other services
        }),
        AuthModule, 
        UserModule, 
        ListModule, 
        TaskModule, 
        PrismaModule
    ],
    providers: [
        {
            provide: APP_GUARD,
            useClass: AtGuard
        }
    ]
})
export class AppModule {}
