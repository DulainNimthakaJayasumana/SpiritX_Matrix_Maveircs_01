import { Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { PrismaModule } from './prisma/prisma.module';
import {ConfigModule} from "@nestjs/config";

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,  // makes ConfigService available everywhere
    }),
      AuthModule, PrismaModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
