import { CommandHandler, ICommand, ICommandHandler } from '@nestjs/cqrs';
import { BanUserForBlogDto } from '../dto/request/banUserForBlog.dto';
import { BlogsRepository } from '../../../blogs/infrastructure/repository/blogs.repository';
import { UsersRepository } from '../../infrastructure/repository/users.repository';
import { ForbiddenException, NotFoundException } from '@nestjs/common';

export class BanUserForBlogCommand implements ICommand {
  constructor(
    public readonly userId: string,
    public readonly banUserForBlogDto: BanUserForBlogDto,
    public readonly currentUserId: string,
  ) {}
}

@CommandHandler(BanUserForBlogCommand)
export class BanUserForBlogUseCase implements ICommandHandler<BanUserForBlogCommand> {
  constructor(
    private blogsRepository: BlogsRepository,
    private usersRepository: UsersRepository,
  ) {}
  async execute(command: BanUserForBlogCommand) {
    const user = await this.usersRepository.findById(command.userId);
    if (!user) throw new NotFoundException();

    const blog = await this.blogsRepository.findById(command.banUserForBlogDto.blogId);

    if (blog.userId !== command.currentUserId) throw new ForbiddenException();

    if (command.banUserForBlogDto.isBanned) {
      return this.blogsRepository.banUserForBlog(command.userId, command.banUserForBlogDto);
    }

    return this.blogsRepository.unbanUserForBlog(
      command.userId,
      command.banUserForBlogDto.blogId,
    );
  }
}
