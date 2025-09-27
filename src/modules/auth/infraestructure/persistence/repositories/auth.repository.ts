import { Injectable, Logger } from '@nestjs/common';
import { BaseRepository } from '../../../../../shared/infrastructure/repository/base.repository';
import { AuthRepositoryInterface } from '../../../domain/repository/auth.repository.interface';
import { TecnicoEntity } from '../../../domain/entities/tecnico.entity';
import { AUTH_QUERY } from '../queries/auth.query';

@Injectable()
export class AuthRepository
  extends BaseRepository
  implements AuthRepositoryInterface {
  private readonly logger = new Logger(AuthRepository.name);

  async findUserByUsername(usuario: string): Promise<TecnicoEntity | null> {
    this.logger.debug('Buscando usuario por nombre de usuario', { usuario });

    return await this.executeQuery(
      AUTH_QUERY.FIND_USER_BY_USERNAME,
      [usuario],
      (result) => { 
        
        if (!result.rows || result.rows.length === 0) {
          this.logger.debug('Usuario no encontrado en la base de datos', { usuario });
          return null;
        }
 
        const row = result.rows[0];
        return new TecnicoEntity(
          row.id_tecnico,
          row.usuario,
          row.password,
          row.nombre,
          row.telefono,
          row.estado,
          row.fecha_creacion
        );
      }
    );
  }
}