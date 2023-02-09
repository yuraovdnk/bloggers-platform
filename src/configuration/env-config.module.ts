import { Global, Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { getConfig } from './config';
import { EnvConfigService } from './env-config.service';

@Global()
@Module({
  exports: [EnvConfigService],
  imports: [
    ConfigModule.forRoot({
      load: [getConfig],
      isGlobal: true,
      envFilePath: ['.env'],
    }),
  ],
  providers: [ConfigService, EnvConfigService],
})
export class EnvConfigModule {}
