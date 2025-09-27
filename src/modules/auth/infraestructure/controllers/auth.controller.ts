import {
  Controller,
  Post, 
  Body, 
  Logger,
  HttpCode,
  HttpStatus, 
} from '@nestjs/common'; 
import { ApiTags, ApiOperation, ApiBody } from '@nestjs/swagger';
import { ApiResponseDto } from '../../../../shared/infrastructure/output/api-response.dto';
import { LoginDto } from '../../application/dto/login.dto';
import { AuthUseCase } from '../../application/use-cases/auth.use-case';

@ApiTags('Authentication')
@Controller('auth')
export class AuthController {
  private readonly logger = new Logger(AuthController.name);
  constructor(
    private readonly authUseCase: AuthUseCase,
  ) { }

  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Autenticar usuario',
    description: 'Autentica las credenciales del usuario y retorna token de acceso'
  })
  @ApiBody({
    type: LoginDto,
    description: 'Credenciales de acceso del usuario'
  })
  @Post()
  async login(@Body() dto: LoginDto) {
    try {
      this.logger.log('Iniciando proceso de autenticación', {
        usuario: dto.user,
      });

      const result = await this.authUseCase.authenticate(dto);
      
      this.logger.log('Autenticación exitosa', {
        usuario: dto.user,
        tokenExpiration: result.fechaValidez
      });

      return ApiResponseDto.success(result, 'Autenticación exitosa');
    } catch (error) {
      this.logger.error('Error en autenticación', {
        usuario: dto.user,
        error: error.message
      });
      return ApiResponseDto.error(error.message, 'Error en autenticación');
    }
  }
}