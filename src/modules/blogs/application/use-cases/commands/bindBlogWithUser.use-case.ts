import { CommandHandler, ICommand, ICommandHandler } from '@nestjs/cqrs';
import { BlogsRepository } from '../../../infrastructure/repository/blogs.repository';
import { UsersRepository } from '../../../../users/infrastructure/repository/users.repository';
import { NotFoundException } from '@nestjs/common';

export class BindBlogWithUserCommand implements ICommand {
  constructor(public readonly userId: string, public readonly blogId: string) {}
}
@CommandHandler(BindBlogWithUserCommand)
export class BindBlogWithUserUseCase implements ICommandHandler<BindBlogWithUserCommand> {
  constructor(
    private blogsRepository: BlogsRepository,
    private usersRepository: UsersRepository,
  ) {}
  async execute(command: BindBlogWithUserCommand): Promise<any> {
    const [blog, user] = await Promise.all([
      this.blogsRepository.findById(command.blogId),
      this.usersRepository.findById(command.userId),
    ]);
    if (!blog || !user) throw new NotFoundException();
    blog.userId = command.userId;
    await this.blogsRepository.save(blog);
  }
}
