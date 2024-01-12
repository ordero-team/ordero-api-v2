import { mail } from '@config/mail.config';
import { CoreModule } from '@core/core.module';
import { MailerModule } from '@nestjs-modules/mailer';
import { Module } from '@nestjs/common';
import { ScheduleModule } from '@nestjs/schedule';
import { RouterModule } from 'nest-router';
import { AppController } from './app.controller';
import { routes } from './app.routes';
import { OwnerModule } from './app/owner/owner.module';

@Module({
  imports: [RouterModule.forRoutes(routes), ScheduleModule.forRoot(), MailerModule.forRoot(mail), CoreModule, OwnerModule],
  controllers: [AppController],
  providers: [],
})
export class AppModule {}
