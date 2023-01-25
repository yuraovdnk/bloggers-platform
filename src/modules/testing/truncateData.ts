import { DataSource } from 'typeorm';
import { Controller, Delete, HttpCode } from '@nestjs/common';
import { InjectDataSource } from '@nestjs/typeorm';

@Controller('testing/all-data')
export class TruncateData {
  constructor(@InjectDataSource() private dataSource: DataSource) {}

  @Delete()
  @HttpCode(204)
  async deleteAllData() {
    const entities = this.dataSource.entityMetadatas;
    for (const entity of entities) {
      await this.dataSource.query(`Truncate "${entity.tableName}" RESTART IDENTITY CASCADE`);
    }
  }
}
