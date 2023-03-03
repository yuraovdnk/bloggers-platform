import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { ForbiddenException, NotFoundException } from '@nestjs/common';
import { CommentsRepository } from '../../../infrastructure/repository/comments.repository';

export class DeleteCommentCommand {
  constructor(public readonly userId: string, public readonly commentId: string) {}
}
@CommandHandler(DeleteCommentCommand)
export class DeleteCommentUseCase implements ICommandHandler<DeleteCommentCommand> {
  constructor(private commentsRepository: CommentsRepository) {}

  async execute(command: DeleteCommentCommand) {
    const comment = await this.commentsRepository.findById(command.commentId);
    if (!comment) {
      throw new NotFoundException();
    }
    if (comment.userId !== command.userId) {
      throw new ForbiddenException();
    }
    await this.commentsRepository.remove(comment);
  }
}
