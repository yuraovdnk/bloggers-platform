import { ConfigService } from '@nestjs/config';
import { Injectable } from '@nestjs/common';

@Injectable()
export class EnvConfigService {
  constructor(private configService: ConfigService) {}
  getProductionDbUri() {
    return this.configService.get<string>('db.postgresUriProduction');
  }
  getDevDbUri() {
    return this.configService.get<string>('db.postgresUriDev');
  }
}
