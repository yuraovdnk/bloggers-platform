import { CreateBlogDto } from '../../../dto/create-blog.dto';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { BlogsRepository } from '../../../infrastructure/repository/blogs.repository';
import { BlogInputDbType } from '../../../typing/blogs.types';
import { BadRequestException } from '@nestjs/common';

export class CreateBlogCommand {
  constructor(public readonly createBlogDto: CreateBlogDto) {}
}

@CommandHandler(CreateBlogCommand)
export class CreateBlogUseCase implements ICommandHandler<CreateBlogCommand> {
  constructor(private blogRepository: BlogsRepository) {}

  async execute(command: CreateBlogCommand): Promise<string> {
    const newBlog: BlogInputDbType = {
      name: command.createBlogDto.name,
      description: command.createBlogDto.description,
      websiteUrl: command.createBlogDto.websiteUrl,
    };

    const createdBlog = await this.blogRepository.create(newBlog);
    return createdBlog.id;
  }
}
