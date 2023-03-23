import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { ForbiddenException, NotFoundException } from '@nestjs/common';
import { BlogsRepository } from '../../../infrastructure/repository/blogs.repository';
import { UpdatePostDto } from '../../dto/request/update-post.dto';
import { PostsRepository } from '../../../../posts/infrastructure/repository/posts.repository';

export class UpdatePostCommand {
  constructor(
    public readonly userId: string,
    public readonly postId: string,
    public readonly blogId: string,
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
    const [post, blog] = await Promise.all([
      this.postsRepository.findById(command.postId),
      this.blogsRepository.findById(command.blogId),
    ]);
    if (!blog || !post) {
      throw new NotFoundException();
    }

    const isOwnerBlog = blog.userId === command.userId;
    if (!isOwnerBlog) throw new ForbiddenException();

    const isBelongsToBlog = post.blogId === blog.id;
    if (!isBelongsToBlog) throw new ForbiddenException();

    post.title = command.updatePostDto.title;
    post.shortDescription = command.updatePostDto.shortDescription;
    post.content = command.updatePostDto.content;

    await this.postsRepository.save(post);
  }
}
