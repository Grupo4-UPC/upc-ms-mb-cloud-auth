import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { PostgresDatabaseService } from './services/pg.database.service';

@Module({
  imports: [ConfigModule],
  providers: [
    {
      provide: 'PostgresDatabaseService',
      useClass: PostgresDatabaseService,
    }
  ],
  exports: ['PostgresDatabaseService'],
}) 

export class DatabaseModule {}