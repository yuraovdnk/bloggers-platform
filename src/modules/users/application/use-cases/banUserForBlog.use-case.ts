import { CommandHandler, ICommand, ICommandHandler } from '@nestjs/cqrs';
import { BanUserForBlogDto } from '../dto/request/banUserForBlog.dto';
import { BlogsRepository } from '../../../blogs/infrastructure/repository/blogs.repository';
import { UsersRepository } from '../../infrastructure/repository/users.repository';
import { NotFoundException } from '@nestjs/common';

export class BanUserForBlogCommand implements ICommand {
  constructor(
    public readonly userId: string,
    public readonly banUserForBlogDto: BanUserForBlogDto,
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

    if (command.banUserForBlogDto.isBanned) {
      return this.blogsRepository.banUserForBlog(command.userId, command.banUserForBlogDto);
    }
    return this.blogsRepository.unbanUserForBlog(
      command.userId,
      command.banUserForBlogDto.blogId,
    );
  }
}
