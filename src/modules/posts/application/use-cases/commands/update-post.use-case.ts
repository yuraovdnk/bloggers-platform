import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { NotFoundException } from '@nestjs/common';
import { BlogsRepository } from '../../../../blogs/infrastructure/repository/blogs.repository';
import { UpdatePostDto } from '../../../dto/update-post.dto';
import { PostsRepository } from '../../../infrastructure/repository/posts.repository';

export class UpdatePostCommand {
  constructor(
    public readonly postId: string,
    public readonly updatePostDto: UpdatePostDto,
  ) {}
}
@CommandHandler(UpdatePostCommand)
export class UpdatePostUseCase implements ICommandHandler<UpdatePostCommand> {
  constructor(
    private postsRepository: PostsRepository,
    private blogsRepository: BlogsRepository,
  ) {}

  async execute(command: UpdatePostCommand) {
    const post = await this.postsRepository.findById(command.postId);
    if (!post) {
      throw new NotFoundException();
    }

    const blog = await this.blogsRepository.findById(command.updatePostDto.blogId);
    if (!blog) {
      throw new NotFoundException();
    }

    post.title = command.updatePostDto.title;
    post.shortDescription = command.updatePostDto.shortDescription;
    post.content = command.updatePostDto.content;
    post.blogId = command.updatePostDto.blogId;

    await this.postsRepository.save(post);
  }
}
