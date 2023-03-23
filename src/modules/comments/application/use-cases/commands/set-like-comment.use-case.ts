import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { NotFoundException } from '@nestjs/common';
import { StatusLike } from '../../../../../common/types/commonEnums';
import { CommentsRepository } from '../../../infrastructure/repository/comments.repository';
import { LikesRepository } from '../../../../likes/infrastructure/likes.repository';

export class SetLikeStatusForCommentCommand {
  parentType = 'comment';
  constructor(
    public readonly commentId: string,
    public readonly userId: string,
    public readonly likeStatus: StatusLike,
  ) {}
}
@CommandHandler(SetLikeStatusForCommentCommand)
export class SetLikeStatusForCommentUseCase
  implements ICommandHandler<SetLikeStatusForCommentCommand>
{
  constructor(
    private commentsRepository: CommentsRepository,
    private likeRepository: LikesRepository,
  ) {}

  async execute(command: SetLikeStatusForCommentCommand) {
    const comment = await this.commentsRepository.findById(command.commentId);
    if (!comment) {
      throw new NotFoundException();
    }

    const like = await this.likeRepository.findByParentAndUserId(
      command.userId,
      command.commentId,
      command.parentType,
    );

    if (!like) {
      await this.likeRepository.create(
        command.commentId,
        command.userId,
        command.parentType,
        command.likeStatus,
      );
      return true;
    }

    if (command.likeStatus === StatusLike.None) {
      return this.likeRepository.remove(like);
    }
    like.changeStatusLike = command.likeStatus;
    await this.likeRepository.save(like);
  }
}
