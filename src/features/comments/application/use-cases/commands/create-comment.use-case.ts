import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { NotFoundException } from '@nestjs/common';
import { CreateCommentDto } from '../../../dto/create-comment.dto';
import { PostsRepository } from '../../../../posts/infrastructure/repository/posts.repository';
import { CommentsRepository } from '../../../infrastructure/repository/comments.repository';

export class CreateCommentCommand {
  constructor(
    public readonly userId: string,
    public readonly postId: string,
    public readonly createCommentDto: CreateCommentDto,
  ) {}
}
@CommandHandler(CreateCommentCommand)
export class CreateCommentUseCase implements ICommandHandler<CreateCommentCommand> {
  constructor(
    private postsRepository: PostsRepository,
    private commentsRepository: CommentsRepository,
  ) {}

  async execute(command: CreateCommentCommand) {
    const post = await this.postsRepository.findById(command.postId);
    if (!post) {
      throw new NotFoundException();
    }

    const newCommentDto = {
      content: command.createCommentDto.content,
      postId: command.postId,
      userId: command.userId,
    };

    return await this.commentsRepository.create(newCommentDto);
  }
}
