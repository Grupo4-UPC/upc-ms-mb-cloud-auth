import { TecnicoEntity } from '../entities/tecnico.entity';

export interface AuthRepositoryInterface {
   findUserByUsername(usuario: string): Promise<TecnicoEntity | null>;
}
