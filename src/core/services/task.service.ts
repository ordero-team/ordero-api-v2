import { Injectable, Logger } from '@nestjs/common';

@Injectable()
export class TaskService {
  private readonly logger = new Logger(TaskService.name);

  // @Cron(CronExpression.EVERY_MINUTE)
  // handleCronEveryMin() {
  //   this.logger.log('Called every minute');
  // }
}
