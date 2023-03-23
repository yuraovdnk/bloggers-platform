import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  NotFoundException,
  Param,
  ParseUUIDPipe,
  Put,
  UseGuards,
} from '@nestjs/common';
import { CurrentUser } from '../../../../../common/decorators/current-user.decorator';
import { UpdateCommentDto } from '../../dto/update-comment.dto';
import { CommandBus } from '@nestjs/cqrs';
import { SetLikeStatusForCommentCommand } from '../../use-cases/commands/set-like-comment.use-case';
import { JwtExtractGuard } from '../../../../../common/guards/jwt-extract.guard';
import { UpdateCommentCommand } from '../../use-cases/commands/update-comment.use-case';
import { DeleteCommentCommand } from '../../use-cases/commands/delete-comment.use-case';
import { JwtGuard } from '../../../../../common/guards/jwt.strategy';
import { ParseStatusLikeEnumPipe } from '../../../../../common/pipes/status-like-enum.pipe';
import { CommentsQueryRepository } from '../../../infrastructure/repository/comments.query.repository';
import { StatusLike } from '../../../../../common/types/commonEnums';

@Controller('comments')
export class CommentsController {
  constructor(
    private commandBus: CommandBus,
    private commentsQueryRepository: CommentsQueryRepository,
  ) {
    console.log('CommentsController init');
  }

  //Update comment
  @UseGuards(JwtGuard)
  @Put(':commentId')
  @HttpCode(204)
  async updateComment(
    @Param('commentId', ParseUUIDPipe) commentId: string,
    @Body() updateCommentDto: UpdateCommentDto,
    @CurrentUser() userId: string,
  ) {
    return this.commandBus.execute(
      new UpdateCommentCommand(userId, commentId, updateCommentDto),
    );
  }

  //Delete Comment
  @UseGuards(JwtGuard)
  @Delete(':commentId')
  @HttpCode(204)
  async deleteComment(
    @Param('commentId', ParseUUIDPipe) commentId: string,
    @CurrentUser() userId: string,
  ) {
    return this.commandBus.execute(new DeleteCommentCommand(userId, commentId));
  }

  //Get comment by id
  @UseGuards(JwtExtractGuard)
  @Get(':commentId')
  async getCommentById(
    @Param('commentId', ParseUUIDPipe) commentId: string,
    @CurrentUser() userId: string,
  ) {
    const comment = await this.commentsQueryRepository.findById(commentId, userId);
    if (!comment) {
      throw new NotFoundException();
    }
    return comment;
  }

  //Set like for comment
  @Put(':commentId/like-status')
  @UseGuards(JwtGuard)
  @HttpCode(204)
  async setLikeStatus(
    @Param('commentId', ParseUUIDPipe) commentId: string,
    @CurrentUser() userId: string,
    @Body('likeStatus', ParseStatusLikeEnumPipe) likeStatus: StatusLike,
  ) {
    return this.commandBus.execute(
      new SetLikeStatusForCommentCommand(commentId, userId, likeStatus),
    );
  }
}
