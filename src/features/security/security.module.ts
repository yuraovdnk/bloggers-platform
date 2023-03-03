import { Module } from '@nestjs/common';
import { SecurityController } from './infrastructure/controller/security.controller';
import { AuthModule } from '../auth/auth.module';
import { SecurityService } from './application/security.service';

@Module({
  imports: [AuthModule],
  providers: [SecurityService],
  controllers: [SecurityController],
})
export class SecurityModule {}
