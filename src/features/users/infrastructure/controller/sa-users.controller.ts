import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  Param,
  ParseUUIDPipe,
  Post,
  Put,
  Query,
  UseGuards,
} from '@nestjs/common';
import { CreateUserDto } from '../../dto/request/create-user.dto';
import { CommandBus } from '@nestjs/cqrs';
import { CreateUserCommand } from '../../application/use-cases/createUser';
import { UsersQueryRepository } from '../repository/users.query.repository';
import { RemoveUserCommand } from '../../application/use-cases/removeUser';
import { BasicAuthGuard } from '../../../auth/strategies/basic.strategy';
import { BanUserCommand } from '../../application/use-cases/banUser.use-case';
import { BanUserDto } from '../../dto/request/banUser.dto';
import { SaQueryParamsDto } from '../../dto/request/sa-query-params.dto';

@UseGuards(BasicAuthGuard)
@Controller('sa/users')
export class SaUsersController {
  constructor(
    private readonly usersQueryRepository: UsersQueryRepository,
    private commandBus: CommandBus,
  ) {
    console.log('SaUsersController init');
  }

  //create User
  @Post()
  @HttpCode(201)
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
  @HttpCode(204)
  async removeUser(@Param('userId', ParseUUIDPipe) userId: string) {
    await this.commandBus.execute(new RemoveUserCommand(userId));
  }

  //ban user
  @Put(':userId/ban')
  async banUser(@Param('userId') userId: string, @Body() banUserDto: BanUserDto) {
    return this.commandBus.execute(
      new BanUserCommand(userId, banUserDto.banReason, banUserDto.isBanned),
    );
  }
}
