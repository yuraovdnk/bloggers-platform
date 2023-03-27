import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  ParseUUIDPipe,
  Post,
  Put,
  Query,
  UseGuards,
} from '@nestjs/common';
import { CreateUserDto } from '../../dto/request/create-user.dto';
import { CommandBus } from '@nestjs/cqrs';
import { CreateUserCommand } from '../../use-cases/createUser';
import { UsersQueryRepository } from '../../../infrastructure/repository/users.query.repository';
import { RemoveUserCommand } from '../../use-cases/removeUser';
import { BasicAuthGuard } from '../../../../auth/application/strategies/basic.strategy';
import { BanUserCommand } from '../../use-cases/banUser.use-case';
import { BanUserDto } from '../../dto/request/banUser.dto';
import { SaQueryParamsDto } from '../../../../../common/dtos/sa-query-params.dto';

@UseGuards(BasicAuthGuard)
@Controller('sa/users')
export class SaUsersController {
  constructor(
    private readonly usersQueryRepository: UsersQueryRepository,
    private commandBus: CommandBus,
  ) {}

  //create User
  @Post()
  @HttpCode(HttpStatus.CREATED)
  async create(@Body() createUserDto: CreateUserDto) {
    const createdUserId = await this.commandBus.execute(
      new CreateUserCommand(createUserDto),
    );
    return this.usersQueryRepository.findById(createdUserId);
  }

  //get all users
  @Get()
  findAllUsers(@Query() queryParams: SaQueryParamsDto) {
    return this.usersQueryRepository.findAll(queryParams);
  }

  //get user by id
  @Delete(':userId')
  @HttpCode(HttpStatus.NO_CONTENT)
  async removeUser(@Param('userId', ParseUUIDPipe) userId: string) {
    await this.commandBus.execute(new RemoveUserCommand(userId));
  }

  //ban user
  @Put(':userId/ban')
  @HttpCode(HttpStatus.NO_CONTENT)
  async banUser(@Param('userId') userId: string, @Body() banUserDto: BanUserDto) {
    await this.commandBus.execute(
      new BanUserCommand(userId, banUserDto.banReason, banUserDto.isBanned),
    );
  }
}
