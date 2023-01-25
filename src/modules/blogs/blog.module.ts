import { forwardRef, Module } from '@nestjs/common';
import { BlogsController } from './infrastructure/controller/blogs.controller';
import { CreateBlogUseCase } from './application/use-cases/commands/create-blog.use-case';
import { BlogsService } from './application/blogs.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Blog } from './domain/blog.entity';
import { CqrsModule } from '@nestjs/cqrs';
import { BlogsRepository } from './infrastructure/repository/blogs.repository';
import { BlogsQueryRepository } from './infrastructure/repository/blogs.query.repository';
import { UpdateBlogUseCase } from './application/use-cases/commands/update-blog.use-case';
import { DeleteBlogUseCase } from './application/use-cases/commands/delete-blog.use-case';
import { PostModule } from '../posts/post.module';
import { JwtExtractGuard } from '../../common/guards/jwt-extract.guard';
import { JwtService } from '@nestjs/jwt';
import { UserModule } from '../users/user.module';

const useCases = [CreateBlogUseCase, UpdateBlogUseCase, DeleteBlogUseCase];
@Module({
  imports: [
    CqrsModule,
    TypeOrmModule.forFeature([Blog]),
    forwardRef(() => PostModule),
    UserModule,
  ],
  controllers: [BlogsController],
  providers: [
    BlogsService,
    BlogsQueryRepository,
    BlogsRepository,
    JwtExtractGuard,
    JwtService,
    ...useCases,
  ],
  exports: [BlogsRepository],
})
export class BlogModule {}
