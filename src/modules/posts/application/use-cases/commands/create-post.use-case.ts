import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { NotFoundException } from '@nestjs/common';
import { BlogsRepository } from '../../../../blogs/infrastructure/repository/blogs.repository';
import { CreatePostDto } from '../../../dto/create-post.dto';
import { PostsRepository } from '../../../infrastructure/repository/posts.repository';

export class CreatePostCommand {
  constructor(public readonly createPostDto: CreatePostDto) {}
}

@CommandHandler(CreatePostCommand)
export class CreatePostUseCase implements ICommandHandler<CreatePostCommand> {
  constructor(
    private postsRepository: PostsRepository,
    private blogsRepository: BlogsRepository,
  ) {}

  async execute(command: CreatePostCommand) {
    const blog = await this.blogsRepository.findById(command.createPostDto.blogId);
    if (!blog) {
      throw new NotFoundException();
    }
    const newPost = {
      title: command.createPostDto.title,
      shortDescription: command.createPostDto.shortDescription,
      content: command.createPostDto.content,
      blogId: blog.id,
    };
    const createdPost = await this.postsRepository.create(newPost);
    return createdPost.id;
  }
}
