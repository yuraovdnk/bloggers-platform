import { CreateBlogDto } from '../../dto/request/create-blog.dto';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { BlogsRepository } from '../../../infrastructure/repository/blogs.repository';
import { BlogInputDbType } from '../../types/blogs.types';
import { BadRequestException } from '@nestjs/common';

export class CreateBlogCommand {
  constructor(
    public readonly createBlogDto: CreateBlogDto,
    public readonly userId: string,
  ) {}
}

@CommandHandler(CreateBlogCommand)
export class CreateBlogUseCase implements ICommandHandler<CreateBlogCommand> {
  constructor(private blogRepository: BlogsRepository) {}

  async execute(command: CreateBlogCommand): Promise<string> {
    const newBlog: BlogInputDbType = {
      name: command.createBlogDto.name,
      description: command.createBlogDto.description,
      websiteUrl: command.createBlogDto.websiteUrl,
      userId: command.userId,
    };

    const createdBlog = await this.blogRepository.create(newBlog);
    return createdBlog.id;
  }
}
