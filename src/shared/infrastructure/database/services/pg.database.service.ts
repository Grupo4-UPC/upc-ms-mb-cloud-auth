import { Injectable, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Pool, PoolClient } from 'pg';

@Injectable()
export class PostgresDatabaseService implements OnModuleInit, OnModuleDestroy {
  private pool: Pool;

  constructor(private readonly configService: ConfigService) {}

  async onModuleInit() {
    this.pool = new Pool({
      host: this.configService.get<string>('DB_POSTGRES_HOST'),
      port: this.configService.get<number>('DB_POSTGRES_PORT'),
      database: this.configService.get<string>('DB_POSTGRES_DATABASE'),
      user: this.configService.get<string>('DB_POSTGRES_USERNAME'),
      password: this.configService.get<string>('DB_POSTGRES_PASSWORD'),
      min: 5,
      max: 20,
      idleTimeoutMillis: 60000,
      connectionTimeoutMillis: 10000,
    });
  }

  async getConnection(): Promise<PoolClient> {
    if (!this.pool) {
      throw new Error('PostgreSQL connection pool is not initialized');
    }

    try {
      return await this.pool.connect();
    } catch (error) {
      console.error('Error al obtener una conexión del pool:', error);
      throw new Error('No se pudo obtener una conexión de la base de datos');
    }
  }

  getPoolStatus(): any {
    if (this.pool) {
      return {
        totalConnections: this.pool.totalCount,
        idleConnections: this.pool.idleCount,
        waitingClients: this.pool.waitingCount,
      };
    }
    return null;
  }

  async onModuleDestroy() {
    if (this.pool) {
      await this.pool.end();
      console.log('PostgreSQL connection pool closed');
    }
  }
}