import { getConfig } from './common/configuration/config';
import { ConfigModule } from '@nestjs/config';
import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { CqrsModule } from '@nestjs/cqrs';
import { TruncateData } from './features/testing/truncateData';
import { ThrottlerGuard, ThrottlerModule } from '@nestjs/throttler';
import { DatabaseModule } from './adapters/database/database.module';
import { AuthModule } from './features/auth/auth.module';
import { UserModule } from './features/users/user.module';
import { SecurityModule } from './features/security/security.module';
import { APP_GUARD } from '@nestjs/core';
import { BlogModule } from './features/blogs/blog.module';
import { PostModule } from './features/posts/post.module';
import { CommentModule } from './features/comments/comment.module';

const configModule = ConfigModule.forRoot({
  load: [getConfig],
  isGlobal: true,
  envFilePath: ['.env'],
});
@Module({
  imports: [
    configModule,
    DatabaseModule,
    CqrsModule,
    PassportModule,
    JwtModule.register({}),
    ThrottlerModule.forRoot({}),
    AuthModule,
    UserModule,
    BlogModule,
    PostModule,
    CommentModule,
    SecurityModule,
  ],
  controllers: [TruncateData],
  providers: [
    {
      provide: APP_GUARD,
      useClass: ThrottlerGuard,
    },
  ],
})
export class AppModule {}
