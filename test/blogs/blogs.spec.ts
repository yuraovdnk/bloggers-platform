import request from 'supertest';
import { INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { AppModule } from '../../src/app.module';
import { createApp } from '../../src/main';
import { v4 as uuid } from 'uuid';

describe('Blog', () => {
  jest.setTimeout(1000 * 60 * 3);
  let app: INestApplication;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    app = await createApp(app);
    await app.init();

    //await request(app.getHttpServer()).delete('/testing/all-data').expect(204);
  });

  describe('CREATE BLOG', () => {
    it('Should create Blogger with Correct data', async () => {
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
    });
    it('Shouldn`t create blog with incorrect data', async () => {
      const reqBody = {
        name: '',
        description: 'bla-bla-bla',
        websiteUrl: 'htrtert',
      };
      await request(app.getHttpServer())
        .post('/blogs')
        .auth('admin', 'qwerty')
        .send(reqBody)
        .expect(400);
    });
  });

  describe('UPDATE BLOG', () => {
    let createdBlogId = null;
    beforeAll(async () => {
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
      createdBlogId = res.body.id;
    });

    it('Should update blog with correct data', async () => {
      const newData = {
        name: 'YuraOvdnk',
        description: 'about something',
        websiteUrl: 'https://www.youtube.com/c/ITKAMASUTRA',
      };

      await request(app.getHttpServer())
        .put(`/blogs/` + createdBlogId)
        .auth('admin', 'qwerty')
        .send(newData)
        .expect(204);

      const updatedBlog = await request(app.getHttpServer())
        .get('/blogs/' + createdBlogId)
        .expect(200);
      expect(updatedBlog.body.name).toStrictEqual(newData.name);
      expect(updatedBlog.body.description).toStrictEqual(newData.description);
      expect(updatedBlog.body.websiteUrl).toStrictEqual(newData.websiteUrl);
    });

    it('Should`t update blog with incorrect data', async () => {
      const newData = {
        name: 'YuraOvdnk',
        description: 'about somethindsf sfsderter treterter tertg',
        websiteUrl: 'httpdfsdfs',
      };

      await request(app.getHttpServer())
        .put(`/blogs/` + createdBlogId)
        .auth('admin', 'qwerty')
        .send(newData)
        .expect(400);
    });

    it('Should`t update blog with not existing blogId', async () => {
      const newData = {
        name: 'YuraOvdnk',
        description: 'about something',
        websiteUrl: 'https://www.youtube.com/c/ITKAMASUTRA',
      };
      const faceBlogId = uuid();
      await request(app.getHttpServer())
        .put(`/blogs/` + faceBlogId)
        .auth('admin', 'qwerty')
        .send(newData)
        .expect(404);
    });
  });

  describe('DELETE BLOG', () => {
    let createdBlogId = null;

    beforeAll(async () => {
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
      createdBlogId = res.body.id;
    });

    it('Shouldn`t delete blog if blogId incorrect ', async () => {
      const faceBlogId = uuid();
      await request(app.getHttpServer())
        .delete('/blogs/' + faceBlogId)
        .auth('admin', 'qwerty')
        .expect(404);
    });
    it('Should delete blog ', async () => {
      await request(app.getHttpServer())
        .delete('/blogs/' + createdBlogId)
        .auth('admin', 'qwerty')
        .expect(204);
    });
    it('Should return exception after delete blog ', async () => {
      await request(app.getHttpServer())
        .get('/blogs/' + createdBlogId)
        .expect(404);

      expect(404);
    });
  });

  describe('CREATE POST FOR BLOG', () => {
    let createdBlogId = null;

    beforeAll(async () => {
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
      createdBlogId = res.body.id;
    });

    it('Should create posts for blog with correct Data', async () => {
      const postPayload = {
        title: 'about war',
        shortDescription: 'rwe',
        content: 'ewrw',
      };
      const res = await request(app.getHttpServer())
        .post(`/blogs/${createdBlogId}/posts`)
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
  });

  afterAll(async () => {
    await app.close();
  });
});
