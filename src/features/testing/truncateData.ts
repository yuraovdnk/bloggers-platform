import { DataSource } from 'typeorm';
import { Controller, Delete, HttpCode } from '@nestjs/common';
import { InjectDataSource } from '@nestjs/typeorm';

@Controller('testing/all-data')
export class TruncateData {
  constructor(@InjectDataSource() private dataSource: DataSource) {}

  @Delete()
  @HttpCode(204)
  async deleteAllData() {
    try {
      await this.dataSource.query(
        `Truncate "Users","Likes","Posts","AuthSession","Blogs","Comments" RESTART IDENTITY CASCADE`,
      );
      return true;
    } catch (e) {
      new Error(e);
    }
  }
}
