import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { ForbiddenException, NotFoundException } from '@nestjs/common';
import { PostsRepository } from '../../../../posts/infrastructure/repository/posts.repository';
import { BlogsRepository } from '../../../infrastructure/repository/blogs.repository';

export class DeletePostCommand {
  constructor(
    public readonly postId: string,
    public readonly blogId: string,
    public readonly userId: string,
  ) {}
}

@CommandHandler(DeletePostCommand)
export class DeletePostUseCase implements ICommandHandler<DeletePostCommand> {
  constructor(
    private postsRepository: PostsRepository,
    private blogsRepository: BlogsRepository,
  ) {}
  async execute(command: DeletePostCommand) {
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

    return this.postsRepository.remove(post);
  }
}
