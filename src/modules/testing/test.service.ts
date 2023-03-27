import { Injectable } from '@nestjs/common';
import { DataSource } from 'typeorm';
import { InjectDataSource } from '@nestjs/typeorm';

@Injectable()
export class TestService {
  constructor(@InjectDataSource() public dataSource: DataSource) {}
  async clearDb() {
    const entities = this.dataSource.entityMetadatas
      .map((i) => `"${i.tableName}"`)
      .join(', ');

    await this.dataSource.query(`TRUNCATE ${entities} RESTART IDENTITY CASCADE`);
  }
}
