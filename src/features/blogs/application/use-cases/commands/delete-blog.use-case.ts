import { CommandHandler, ICommand, ICommandHandler } from '@nestjs/cqrs';
import { ForbiddenException, NotFoundException } from '@nestjs/common';
import { BlogsRepository } from '../../../infrastructure/repository/blogs.repository';

export class DeleteBlogCommand implements ICommand {
  constructor(public readonly blogId: string, public readonly userId: string) {}
}

@CommandHandler(DeleteBlogCommand)
export class DeleteBlogUseCase implements ICommandHandler<DeleteBlogCommand> {
  constructor(private blogRepository: BlogsRepository) {}

  async execute(command: DeleteBlogCommand) {
    const blog = await this.blogRepository.findById(command.blogId);
    if (!blog) throw new NotFoundException();

    if (blog.userId !== command.userId) throw new ForbiddenException();

    await this.blogRepository.remove(blog);
  }
}
