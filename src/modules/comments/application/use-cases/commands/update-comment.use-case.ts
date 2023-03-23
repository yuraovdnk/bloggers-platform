import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { ForbiddenException, NotFoundException } from '@nestjs/common';
import { UpdateCommentDto } from '../../dto/update-comment.dto';
import { CommentsRepository } from '../../../infrastructure/repository/comments.repository';

export class UpdateCommentCommand {
  constructor(
    public readonly userId: string,
    public readonly commentId: string,
    public readonly updateCommentDto: UpdateCommentDto,
  ) {}
}
@CommandHandler(UpdateCommentCommand)
export class UpdateCommentUseCase implements ICommandHandler<UpdateCommentCommand> {
  constructor(private commentsRepository: CommentsRepository) {}

  async execute(command: UpdateCommentCommand) {
    const comment = await this.commentsRepository.findById(command.commentId);
    if (!comment) {
      throw new NotFoundException();
    }

    if (comment.userId !== command.userId) {
      throw new ForbiddenException();
    }
    comment.content = command.updateCommentDto.content;
    await this.commentsRepository.save(comment);
  }
}
