import { Inject, Injectable } from '@nestjs/common';

@Injectable()
export abstract class BaseRepository {
  constructor(
    @Inject('PostgresDatabaseService')
    protected readonly postgresService: any,
  ) {}

  protected async executeQuery<T>(
    query: string, 
    params: any[] = [], 
    mapper?: (result: any) => T
  ): Promise<T> {
    const connection = await this.postgresService.getConnection();
    
    try {
      const result = await connection.query(query, params);  
      return mapper ? mapper(result) : result;
    } finally {
      connection.release(); 
    }
  }
}
