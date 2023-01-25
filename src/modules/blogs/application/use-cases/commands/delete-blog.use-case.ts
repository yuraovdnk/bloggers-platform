import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { BlogsRepository } from '../../../infrastructure/repository/blogs.repository';

export class DeleteBlogCommand {
  constructor(public readonly blogId: string) {}
}

@CommandHandler(DeleteBlogCommand)
export class DeleteBlogUseCase implements ICommandHandler<DeleteBlogCommand> {
  constructor(private blogRepository: BlogsRepository) {}

  async execute(command: DeleteBlogCommand) {
    const blog = await this.blogRepository.findById(command.blogId);
    if (!blog) {
      throw new NotFoundException();
    }
    await this.blogRepository.remove(blog);
  }
}
