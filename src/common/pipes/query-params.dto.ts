import { Injectable } from '@nestjs/common';
import { Transform } from 'class-transformer';
import { IsEnum, IsOptional } from 'class-validator';

export enum Order {
  ASC = 'asc',
  DESC = 'desc',
}

@Injectable()
export class QueryParamsDto {
  readonly searchNameTerm = '';

  @Transform(({ value }) => {
    const num = parseInt(value);
    if (isNaN(num)) return 1;
    return num;
  })
  readonly pageNumber = 1;

  @Transform(({ value }) => {
    const num = parseInt(value);
    if (isNaN(num)) return 10;
    return num;
  })
  readonly pageSize = 10;

  @IsEnum(Order, { each: true })
  @IsOptional()
  readonly sortDirection: Order = Order.DESC;

  readonly sortBy: string = 'createdAt';

  get skip(): number {
    return this.pageSize * (this.pageNumber - 1);
  }

  get order(): 'ASC' | 'DESC' {
    return this.sortDirection === Order.ASC ? 'ASC' : 'DESC';
  }

  sortByField(Model: { new () }) {
    const sortModel = new Model();
    const checkSortField = sortModel.hasOwnProperty(this.sortBy);
    return checkSortField ? this.sortBy : 'createdAt';
  }
}
