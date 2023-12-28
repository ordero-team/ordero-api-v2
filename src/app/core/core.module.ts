import AppDataSource from '@lib/typeorm/datasource.typeorm';
import { Global, Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { DataSource } from 'typeorm';
import { TaskService } from './services/task.service';
import { JwtStrategy, TokenStrategy } from './services/token.service';

@Global()
@Module({
  imports: [PassportModule, JwtModule.register({})],
  providers: [
    TaskService,
    JwtStrategy,
    TokenStrategy,
    {
      provide: DataSource,
      useFactory: async () => {
        return AppDataSource;
      },
    },
  ],
  exports: [TaskService, JwtStrategy, TokenStrategy, DataSource],
})
export class CoreModule {}
