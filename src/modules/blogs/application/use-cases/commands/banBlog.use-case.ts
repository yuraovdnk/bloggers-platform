import { CommandHandler, ICommand, ICommandHandler } from '@nestjs/cqrs';
import { BlogsRepository } from '../../../infrastructure/repository/blogs.repository';
import { NotFoundException } from '@nestjs/common';

export class BanBlogCommand implements ICommand {
  constructor(public readonly blogId: string, public readonly banStatus: boolean) {}
}
@CommandHandler(BanBlogCommand)
export class BanBlogUseCase implements ICommandHandler<BanBlogCommand> {
  constructor(private blogsRepository: BlogsRepository) {}
  async execute(command: BanBlogCommand) {
    const blog = await this.blogsRepository.findById(command.blogId);
    if (!blog) throw new NotFoundException();

    if (!command.banStatus) {
      return this.blogsRepository.unBanBlog(command.blogId);
    }

    blog.ban();
    return this.blogsRepository.save(blog);
  }
}
