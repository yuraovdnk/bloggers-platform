import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { NotFoundException } from '@nestjs/common';
import { PostsRepository } from '../../../infrastructure/repository/posts.repository';

export class DeletePostCommand {
  constructor(public readonly postId: string) {}
}

@CommandHandler(DeletePostCommand)
export class DeletePostUseCase implements ICommandHandler<DeletePostCommand> {
  constructor(private postsRepository: PostsRepository) {}
  async execute(command: DeletePostCommand) {
    const post = await this.postsRepository.findById(command.postId);
    if (!post) {
      throw new NotFoundException();
    }
    return this.postsRepository.remove(post);
  }
}
