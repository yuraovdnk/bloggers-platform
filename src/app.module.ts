import { getConfig } from './configuration/config';
import { ConfigModule } from '@nestjs/config';
import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { CqrsModule } from '@nestjs/cqrs';
import { TruncateData } from './modules/testing/truncateData';
import { ThrottlerGuard, ThrottlerModule } from '@nestjs/throttler';
import { DatabaseModule } from './adapters/database/database.module';
import { AuthModule } from './modules/auth/auth.module';
import { UserModule } from './modules/users/user.module';
import { SecurityModule } from './modules/security/security.module';
import { APP_GUARD } from '@nestjs/core';
import { BlogModule } from './modules/blogs/blog.module';
import { PostModule } from './modules/posts/post.module';
import { CommentModule } from './modules/comments/comment.module';

const configModule = ConfigModule.forRoot({
  load: [getConfig],
  isGlobal: true,
  envFilePath: ['.env'],
});
@Module({
  imports: [
    configModule,
    //EnvConfigModule,
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
