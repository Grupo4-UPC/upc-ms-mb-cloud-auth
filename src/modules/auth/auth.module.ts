import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { DatabaseModule } from '../../shared/infrastructure/database/database.module';
import { AuthController } from './infraestructure/controllers/auth.controller';
import { AuthUseCase } from './application/use-cases/auth.use-case';
import { AuthRepository } from './infraestructure/persistence/repositories/auth.repository';

@Module({
    imports: [
        DatabaseModule,
        ConfigModule,
        JwtModule.registerAsync({
            imports: [ConfigModule],
            inject: [ConfigService],
            useFactory: async (configService: ConfigService) => {
                const secret = configService.get<string>('SECRET_KEY_JWT');
                if (!secret) {
                    throw new Error('SECRET_KEY_JWT environment variable is required');
                }
                return {
                    secret: secret,
                    signOptions: { expiresIn: '1h' },
                };
            },
        }),
    ],
    controllers: [AuthController],
    providers: [
        AuthUseCase,
        {
            provide: 'AuthRepositoryInterface',
            useClass: AuthRepository,
        },
        {
            provide: 'AuthUseCaseInterface',
            useClass: AuthUseCase,
        },
    ],
})
export class AuthModule { }