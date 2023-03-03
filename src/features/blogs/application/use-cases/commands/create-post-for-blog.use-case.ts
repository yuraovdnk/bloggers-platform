import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { ForbiddenException, NotFoundException } from '@nestjs/common';
import { CreatePostForBlogDto } from '../../../dto/request/create-post-for-blog.dto';
import { BlogsRepository } from '../../../infrastructure/repository/blogs.repository';
import { PostsRepository } from '../../../../posts/infrastructure/repository/posts.repository';
import { DbPostDto } from '../../../../posts/typing/posts.type';

export class CreatePostForBlogCommand {
  constructor(
    public readonly blogId: string,
    public readonly createPostDto: CreatePostForBlogDto,
    public readonly userId: string,
  ) {}
}
@CommandHandler(CreatePostForBlogCommand)
export class CreatePostForBlogUseCase implements ICommandHandler<CreatePostForBlogCommand> {
  constructor(
    private blogsRepository: BlogsRepository,
    private postsRepository: PostsRepository,
  ) {}

  async execute(command: CreatePostForBlogCommand): Promise<string> {
    const blog = await this.blogsRepository.findById(command.blogId);
    if (!blog) throw new NotFoundException();

    const isOwner = blog.userId === command.userId;
    if (!isOwner) throw new ForbiddenException();

    const newPost: DbPostDto = {
      title: command.createPostDto.title,
      shortDescription: command.createPostDto.shortDescription,
      content: command.createPostDto.content,
      blogId: command.blogId,
    };
    const createdPost = await this.postsRepository.create(newPost);
    return createdPost.id;
  }
}
