import { INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { AppModule } from '../../src/app.module';
import { createApp } from '../../src/main';
import request from 'supertest';
import { v4 as uuid } from 'uuid';

describe('Posts', () => {
  jest.setTimeout(1000 * 60 * 3);
  let app: INestApplication;

  const createBloggerFn = async () => {
    const reqBody = {
      name: 'Yura',
      description: 'bla-bla-bla',
      websiteUrl: 'https://www.youtube.com/c/TarunSharma7372',
    };
    const res = await request(app.getHttpServer())
      .post('/blogs')
      .auth('admin', 'qwerty')
      .send(reqBody)
      .expect(201);
    expect(res.body.id).toBeDefined();
    expect(res.body.name).toEqual(reqBody.name);
    expect(res.body.description).toEqual(reqBody.description);
    expect(res.body.websiteUrl).toEqual(reqBody.websiteUrl);
    return res.body.id;
  };
  //const createPost = () => {};

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    app = await createApp(app);
    await app.init();

    await request(app.getHttpServer()).delete('/testing/all-data').expect(204);
  });

  describe('CREATE POST', () => {
    let createdBlogId = null;
    beforeAll(async () => {
      createdBlogId = await createBloggerFn();
    });

    it('Should create posts with correct Data', async () => {
      const postPayload = {
        title: 'About Football',
        shortDescription: 'UA team to win Champions',
        content: 'Today UA National Team win FiFA Cup in Qatar',
        blogId: createdBlogId,
      };
      const res = await request(app.getHttpServer())
        .post(`/posts`)
        .auth('admin', 'qwerty')
        .send(postPayload)
        .expect(201);

      expect(res.body.title).toEqual(postPayload.title);
      expect(res.body.shortDescription).toEqual(postPayload.shortDescription);
      expect(res.body.content).toEqual(postPayload.content);
      expect(res.body.blogId).toEqual(createdBlogId);

      expect(res.body.extendedLikesInfo.myStatus).toEqual('None');
      expect(res.body.extendedLikesInfo.likesCount).toBe(0);
      expect(res.body.extendedLikesInfo.dislikesCount).toBe(0);
      expect(res.body.extendedLikesInfo.newestLikes).toEqual([]);
    });

    it('shouldn`t create posts with incorrect data ', async () => {
      const postPayload = {
        title: 'About Politics',
        content: 'Today UA troops deocupate Crimea',
        blogId: createdBlogId,
      };
      await request(app.getHttpServer())
        .post(`/posts`)
        .auth('admin', 'qwerty')
        .send(postPayload);
      expect(400);
    });

    it('should create post if blogId is not exist', async () => {
      const fakeBlogId = uuid();
      const postPayload = {
        title: 'About Football',
        content: 'Today UA National Team win FiFA Cup in Qatar',
        shortDescription: 'UA National',
        blogId: fakeBlogId,
      };
      await request(app.getHttpServer())
        .post(`/posts`)
        .auth('admin', 'qwerty')
        .send(postPayload);
      expect(404);
    });
  });

  describe('UPDATE POST', () => {
    let createdBlogId = null;
    beforeAll(async () => {
      createdBlogId = await createBloggerFn();
    });
    it('should update post', async () => {
      const postPayload = {
        title: 'About Politics',
        content: 'Today UA troops deocupate Crimea',
        shortDescription: 'UA National',
        blogId: createdBlogId,
      };
      await request(app.getHttpServer())
        .put(`/posts/` + createdBlogId)
        .auth('admin', 'qwerty')
        .send(postPayload)
        .expect(204);
    });

    it('shouldn`t update post with incorrect payload', async () => {
      const postPayload = {
        title: 'About Politics sdfsdf sdfsadasd asfsdfsdfsdfsdfs',
        content: 'Today UA troops deocupate Crimea',
        blogId: createdBlogId,
      };
      await request(app.getHttpServer())
        .put(`/posts/` + createdBlogId)
        .auth('admin', 'qwerty')
        .send(postPayload)
        .expect(400);
    });
  });

  afterAll(async () => {
    await app.close();
  });
});
