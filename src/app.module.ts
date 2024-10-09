import { mail } from '@config/mail.config';
import { CoreModule } from '@core/core.module';
import { SocketioGateway } from '@lib/pubsub/socket.gateway';
import { Datasource } from '@lib/typeorm/datasource.typeorm';
import { MailerModule } from '@nestjs-modules/mailer';
import { Module } from '@nestjs/common';
import { ScheduleModule } from '@nestjs/schedule';
import { RouterModule } from 'nest-router';
import { AppController } from './app.controller';
import { routes } from './app.routes';
import { CustomerModule } from './app/customer/customer.module';
import { OwnerModule } from './app/owner/owner.module';
import { RestaurantModule } from './app/restaurant/restaurant.module';
import { StaffModule } from './app/staff/staff.module';

@Module({
  imports: [
    RouterModule.forRoutes(routes),
    ScheduleModule.forRoot(),
    MailerModule.forRoot(mail),
    CoreModule,
    OwnerModule,
    RestaurantModule,
    CustomerModule,
    StaffModule,
  ],
  controllers: [AppController],
  providers: [
    SocketioGateway,
    {
      provide: Datasource,
      useFactory: () => Datasource.getInstance(),
    },
    {
      provide: 'DATA_SOURCE',
      useFactory: () => Datasource.getInstance().datasource,
    },
  ],
})
export class AppModule {}
