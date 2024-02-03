import { OwnerAuthGuard } from '@core/guards/auth.guard';
import { Controller, UseGuards } from '@nestjs/common';

@Controller()
@UseGuards(OwnerAuthGuard())
export class ProductController {}
