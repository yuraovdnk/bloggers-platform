import { ValidatorConstraint, ValidatorConstraintInterface } from 'class-validator';
import { BlogsRepository } from '../../features/blogs/infrastructure/repository/blogs.repository';
import { Injectable } from '@nestjs/common';

@ValidatorConstraint({ name: 'IsExistBlog', async: true })
@Injectable()
export class IsExistBlog implements ValidatorConstraintInterface {
  constructor(private blogRepo: BlogsRepository) {}
  async validate(value: string): Promise<boolean> {
    const blog = await this.blogRepo.findById(value);
    return !!blog;
  }
}
