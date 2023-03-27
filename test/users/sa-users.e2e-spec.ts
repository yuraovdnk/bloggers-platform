import { Test, TestingModule } from '@nestjs/testing';
import { AppModule } from '../../src/app.module';
import { createApp } from '../../src/main';
import { INestApplication, Logger } from '@nestjs/common';
import { UsersRepository } from '../../src/modules/users/infrastructure/repository/users.repository';
import { BlogsRepository } from '../../src/modules/blogs/infrastructure/repository/blogs.repository';
import { v4 as uuid } from 'uuid';
import { add } from 'date-fns';
import request from 'supertest';
import { TestService } from '../../src/modules/testing/test.service';
import { PostsRepository } from '../../src/modules/posts/infrastructure/repository/posts.repository';

describe('SA-BLOGS', () => {
  let app: INestApplication;
  let usersRepository: UsersRepository;
  let blogsRepository: BlogsRepository;
  let postsRepository: PostsRepository;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
      providers: [TestService],
    }).compile();
    app = moduleFixture.createNestApplication();
    app = await createApp(app);
    app.useLogger(new Logger());
    await app.init();

    usersRepository = moduleFixture.get<UsersRepository>(UsersRepository);
    blogsRepository = moduleFixture.get<BlogsRepository>(BlogsRepository);
    postsRepository = moduleFixture.get<PostsRepository>(PostsRepository);
    await moduleFixture.get(TestService).clearDb();
  });

  describe('ban blog', () => {
    it('should ban blog', async function () {
      const user = await usersRepository.create({
        login: 'login',
        email: '12345@gmail.com',
        passwordHash: 'hash',
        confirmationCode: uuid(),
        expirationConfirmCode: add(new Date(), {
          hours: 1,
        }),
        isConfirmedEmail: true,
      });
      expect(user).toBeTruthy();
      const mockBlog = await blogsRepository.create({
        name: 'blog',
        description: 'dsfdsfsdf',
        userId: user.id,
        websiteUrl: 'dadsa',
      });
      console.log(mockBlog);
      const res = await request(app.getHttpServer())
        .put('/sa/blogs/' + mockBlog.id + '/ban')
        .send({ isBanned: true })
        .auth('admin', 'qwerty')
        .expect(204);
    });
    it('should`t return posts for banned blog', async function () {
      const user = await usersRepository.create({
        login: 'login',
        email: '12345@gmail.com',
        passwordHash: 'hash',
        confirmationCode: uuid(),
        expirationConfirmCode: add(new Date(), {
          hours: 1,
        }),
        isConfirmedEmail: true,
      });
      expect(user).toBeTruthy();
      const mockBlog = await blogsRepository.create({
        name: 'blog',
        description: 'dsfdsfsdf',
        userId: user.id,
        websiteUrl: 'dadsa',
      });

      const post = await postsRepository.create({
        content: '432',
        shortDescription: 'dfgdfgdfgdfgdfgdfg',
        blogId: mockBlog.id,
        title: 'blofsds swe',
      });
      await request(app.getHttpServer())
        .put('/sa/blogs/' + mockBlog.id + '/ban')
        .send({ isBanned: true })
        .auth('admin', 'qwerty')
        .expect(204);

      const posts = await request(app.getHttpServer())
        .get('/blogs/' + mockBlog.id + '/posts')
        .expect(200);
      expect(posts.body.totalCount).toEqual(0);
    });
  });
});
