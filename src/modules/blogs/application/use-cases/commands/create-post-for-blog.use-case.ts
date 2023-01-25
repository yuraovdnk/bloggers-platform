import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { NotFoundException } from '@nestjs/common';
import { CreatePostForBlogDto } from '../../../dto/create-post-for-blog.dto';
import { BlogsRepository } from '../../../infrastructure/repository/blogs.repository';
import { PostsRepository } from '../../../../posts/infrastructure/repository/posts.repository';
import { PostModule } from '../../../../posts/post.module';
import { DbPostDto } from '../../../../posts/typing/posts.type';

export class CreatePostForBlogCommand {
  constructor(
    public readonly blogId: string,
    public readonly createPostDto: CreatePostForBlogDto,
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
    if (!blog) {
      throw new NotFoundException();
    }
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
