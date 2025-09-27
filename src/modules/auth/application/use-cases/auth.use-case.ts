import { Injectable, UnauthorizedException, Logger, Inject } from '@nestjs/common';
import type { AuthRepositoryInterface } from '../../domain/repository/auth.repository.interface';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { LoginDto } from '../dto/login.dto';
import { TecnicoEntity } from '../../domain/entities/tecnico.entity';
import { AuthResponse } from '../output/auth.response.dto';
import { JwtPayload } from '../interface/jwt-payload.interface';
import { MENU_ITEMS, ROLE_TYPES } from '../../../../shared/constants/menu.constants';

@Injectable()
export class AuthUseCase {
    private readonly logger = new Logger(AuthUseCase.name);
    private readonly TOKEN_EXPIRATION_HOURS = 1;

    constructor(
        @Inject('AuthRepositoryInterface')
        private readonly authRepository: AuthRepositoryInterface,
        private readonly jwtService: JwtService,
    ) { }

    async authenticate(dto: LoginDto): Promise<AuthResponse> {
        try {
            this.logger.log('Iniciando proceso de autenticación', { usuario: dto.user });

            this.logger.log('Validando usuario y contraseña', { usuario: dto.user });
            const user = await this.findAndValidateUser(dto);

            this.logger.log('Validando contraseña del usuario', { usuario: dto.user });
            await this.validatePassword(dto.password, user.password, dto.user);

            this.logger.log('Generando token JWT para el usuario', { usuario: dto.user });
            const token = this.generateJwtToken(user);

            this.logger.log('Token JWT generado exitosamente', { usuario: dto.user });
            const fechaValidez = this.calculateTokenExpiration();

            this.logger.log('Autenticación completada exitosamente', {
                usuario: dto.user,
                idTecnico: user.idTecnico,
                fechaValidez
            });

            return { token, fechaValidez };

        } catch (error) {
            this.logger.error('Error en proceso de autenticación', {
                usuario: dto.user,
                error: error.message
            });

            if (error instanceof UnauthorizedException) {
                throw error;
            }
            throw new UnauthorizedException('Error interno de autenticación');
        }
    }

    private async findAndValidateUser(dto: LoginDto): Promise<TecnicoEntity> {
        this.logger.log('Buscando usuario en la base de datos', { usuario: dto.user });

        const user = await this.authRepository.findUserByUsername(dto.user);

        this.logger.log('Usuario encontrado en la base de datos', { usuario: user?.usuario });

        if (!user) {
            this.logger.warn('Intento de autenticación con usuario no encontrado', {
                usuario: dto.user
            });
            throw new UnauthorizedException('Credenciales inválidas');
        }

        return user;
    }

    private async validatePassword(
        inputPassword: string,
        hashedPassword: string,
        usuario: string
    ): Promise<void> {
        this.logger.log('inputPassword', { input: inputPassword });
        this.logger.log('hashedPassword', { hash: hashedPassword });
        const isPasswordValid = await bcrypt.compare(inputPassword, hashedPassword);
        this.logger.log('Resultado validación', { isValid: isPasswordValid });

        if (!isPasswordValid) {
            this.logger.warn('Intento de autenticación con contraseña incorrecta', {
                usuario
            });
            throw new UnauthorizedException('Credenciales inválidas');
        }
    }

    private generateJwtToken(user: TecnicoEntity): string {
        const currentTime = Math.floor(Date.now() / 1000);
        const expirationTime = currentTime + (this.TOKEN_EXPIRATION_HOURS * 3600);

        const menuList = [
            MENU_ITEMS.OBTENER_MAS_SERVICIOS,
            MENU_ITEMS.CONFIGURACION
        ];

        const payload: JwtPayload = {
            sub: user.idTecnico, 
            usuario: user.usuario,
            nombre: user.nombre,
            role: ROLE_TYPES.TECNICO,
            menu: menuList,
        };

        return this.jwtService.sign(payload);
    }

    private calculateTokenExpiration(): Date {
        const fechaValidez = new Date();
        fechaValidez.setHours(fechaValidez.getHours() + this.TOKEN_EXPIRATION_HOURS);
        return fechaValidez;
    }
}