import { RBAcModule } from '@lib/rbac';
import AppDataSource from '@lib/typeorm/datasource.typeorm';
import { Global, Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { DataSource } from 'typeorm';
import { AuthService } from './services/auth.service';
import { RoleService } from './services/role.service';
import { TaskService } from './services/task.service';
import { JwtOwnerStrategy, JwtStrategy } from './services/token.service';

@Global()
@Module({
  imports: [PassportModule, JwtModule.register({}), RBAcModule.register(RoleService)],
  providers: [
    TaskService,
    JwtStrategy,
    AuthService,
    RoleService,
    JwtOwnerStrategy,
    {
      provide: DataSource,
      useFactory: async () => {
        return AppDataSource;
      },
    },
  ],
  exports: [TaskService, RoleService, AuthService, JwtStrategy, JwtOwnerStrategy, DataSource, RBAcModule],
})
export class CoreModule {}
