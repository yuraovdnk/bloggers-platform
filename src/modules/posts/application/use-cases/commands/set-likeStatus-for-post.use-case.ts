import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { StatusLike } from '../../../../../common/types/commonEnums';
import { PostsRepository } from '../../../infrastructure/repository/posts.repository';
import { LikesRepository } from '../../../../likes/infrastructure/likes.repository';

export class SetLikeStatusForPostCommand {
  parentType = 'post';
  constructor(
    public readonly postId: string,
    public readonly likeStatus: StatusLike,
    public readonly userId: string,
  ) {}
}
@CommandHandler(SetLikeStatusForPostCommand)
export class SetLikeStatusForPostUseCase
  implements ICommandHandler<SetLikeStatusForPostCommand>
{
  constructor(
    private postsRepository: PostsRepository,
    private likesRepository: LikesRepository,
  ) {}

  async execute(command: SetLikeStatusForPostCommand): Promise<any> {
    const post = await this.postsRepository.findById(command.postId);
    if (!post) {
      throw new NotFoundException();
    }

    //Find like for parentId (postId) by userId.
    const like = await this.likesRepository.findByParentAndUserId(
      command.userId,
      command.postId,
      command.parentType,
    );

    //If not exist, then create LikeEntity (create new like with default status "Like")
    if (!like) {
      try {
        await this.likesRepository.create(
          command.postId,
          command.userId,
          command.parentType,
          command.likeStatus,
        );
        return true;
      } catch (e) {
        throw new InternalServerErrorException(e);
      }
    }
    if (command.likeStatus === StatusLike.None) {
      await this.likesRepository.remove(like);
      return true;
    }

    like.changeStatusLike = command.likeStatus;

    return await this.likesRepository.save(like);
  }
}
