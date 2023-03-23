import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { UpdateBlogDto } from '../../dto/request/update-blog.dto';
import {
  ForbiddenException,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { BlogsRepository } from '../../../infrastructure/repository/blogs.repository';

export class UpdateBlogCommand {
  constructor(
    public readonly userId: string,
    public readonly blogId: string,
    public readonly updateBlogDto: UpdateBlogDto,
  ) {}
}
@CommandHandler(UpdateBlogCommand)
export class UpdateBlogUseCase implements ICommandHandler<UpdateBlogCommand> {
  constructor(private blogRepository: BlogsRepository) {}

  async execute(command: UpdateBlogCommand): Promise<boolean> {
    const blog = await this.blogRepository.findById(command.blogId);
    if (!blog) {
      throw new NotFoundException();
    }
    const isOwnerBlog = blog.userId === command.userId;
    if (!isOwnerBlog) throw new ForbiddenException();

    blog.name = command.updateBlogDto.name;
    blog.description = command.updateBlogDto.description;
    blog.websiteUrl = command.updateBlogDto.websiteUrl;

    try {
      await this.blogRepository.save(blog);
      return true;
    } catch (e) {
      throw new InternalServerErrorException();
    }
  }
}
