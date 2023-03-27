import { INestApplication, Logger } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { AppModule } from '../../src/app.module';
import { createApp } from '../../src/main';
import request from 'supertest';
import { v4 as uuid } from 'uuid';

describe('Blogger', () => {
  jest.setTimeout(1000 * 60 * 3);
  let app: INestApplication;
  let user1AuthToken = null;
  let user2AuthToken = null;
  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    app = await createApp(app);
    app.useLogger(new Logger());
    await app.init();

    await request(app.getHttpServer()).delete('/testing/all-data').expect(204);

    const user1RegisterPayload = {
      login: 'sadsadas',
      email: 'ovdey1999@gmail.com',
      password: '123456',
    };
    const user2RegisterPayload = {
      login: 'Yurii',
      email: 'yura.ovdey@gmail.com',
      password: '123456',
    };
    const registerUser1 = await request(app.getHttpServer())
      .post('/sa/users')
      .auth('admin', 'qwerty')
      .send(user1RegisterPayload)
      .expect(201);

    const registerUser2 = await request(app.getHttpServer())
      .post('/sa/users')
      .auth('admin', 'qwerty')
      .send(user2RegisterPayload)
      .expect(201);

    const loginUser1 = await request(app.getHttpServer())
      .post('/auth/login')
      .send({
        loginOrEmail: user1RegisterPayload.email,
        password: user1RegisterPayload.password,
      })
      .expect(200);

    const loginUser2 = await request(app.getHttpServer())
      .post('/auth/login')
      .send({
        loginOrEmail: user2RegisterPayload.email,
        password: user2RegisterPayload.password,
      })
      .expect(200);

    user1AuthToken = loginUser1.body.accessToken;
    user2AuthToken = loginUser2.body.accessToken;
  });

  describe('CREATING BLOG', () => {
    const blogPayload = {
      name: 'rtertertertertd',
      description: 'rterterterterte',
      websiteUrl: 'https://github.com/yuraovdnk',
    };
    it('should create blog', async function () {
      const res = await request(app.getHttpServer())
        .post('/blogger/blogs')
        .send(blogPayload)
        .auth(user1AuthToken, { type: 'bearer' })
        .expect(201);
      expect(res.body.name).toEqual(blogPayload.name);
      expect(res.body.description).toEqual(blogPayload.description);
      expect(res.body.websiteUrl).toEqual(blogPayload.websiteUrl);
    });

    it('shouldn`t create blog', async function () {
      await request(app.getHttpServer())
        .post('/blogger/blogs')
        .send({
          name: 'rtertertertertddfsdgdfgdfgdfgdfgdfgdfgdfgdfgdf',
          description: 'rterterterterte',
          websiteUrl: 'https://github',
        })
        .auth(user1AuthToken, { type: 'bearer' })
        .expect(400);
    });
  });

  describe('DELETING BLOG', () => {
    let createdBlogId = null;
    beforeAll(async () => {
      const res = await request(app.getHttpServer())
        .post('/blogger/blogs')
        .send({
          name: 'rtertertertertd',
          description: 'rterterterterte',
          websiteUrl: 'https://github.com/yuraovdnk',
        })
        .auth(user1AuthToken, { type: 'bearer' })
        .expect(201);
      createdBlogId = res.body.id;
    });

    it('shouldn`t update if user dont own this blog ', async function () {
      const updateBlogPayload = {
        name: 'Ovdey',
        description: 'rterterterterte sf fsdisfhusd fsdfsgsdgdsgs',
        websiteUrl: 'https://github.com/yuraovdnk',
      };
      await request(app.getHttpServer())
        .put('/blogger/blogs/' + createdBlogId)
        .auth(user2AuthToken, { type: 'bearer' })
        .send(updateBlogPayload)
        .expect(403);
    });

    it('should not delete blog if blogId is incorrect', async function () {
      const fakeBlogId = uuid();
      await request(app.getHttpServer())
        .delete('/blogger/blogs/' + fakeBlogId)
        .auth(user1AuthToken, { type: 'bearer' })
        .expect(404);
    });

    it('should delete blog', async function () {
      await request(app.getHttpServer())
        .delete('/blogger/blogs/' + createdBlogId)
        .auth(user1AuthToken, { type: 'bearer' })
        .expect(204);
    });
  });

  describe('UPDATING BLOG', () => {
    let createdBlogId = null;
    beforeAll(async () => {
      const res = await request(app.getHttpServer())
        .post('/blogger/blogs')
        .send({
          name: 'rtertertertertd',
          description: 'rterterterterte',
          websiteUrl: 'https://github.com/yuraovdnk',
        })
        .auth(user1AuthToken, { type: 'bearer' })
        .expect(201);
      createdBlogId = res.body.id;
    });
    it('should update blog', async () => {
      const updateBlogPayload = {
        name: 'Ovdey',
        description: 'rterterterterte sf fsdisfhusd fsdfsgsdgdsgs',
        websiteUrl: 'https://github.com/yuraovdnk',
      };
      await request(app.getHttpServer())
        .put('/blogger/blogs/' + createdBlogId)
        .auth(user1AuthToken, { type: 'bearer' })
        .send(updateBlogPayload)
        .expect(204);
    });

    it('shouldn`t update blog if input value is incorrect', async () => {
      const updateBlogPayload = {
        name: 'Ovdeyfdsdfsddfssfsd',
        description: 'rterterterterte sf fsdisfhusd fsdfsgsdgdsgs',
        websiteUrl: 'https://github.com/yuraovdnk',
      };
      await request(app.getHttpServer())
        .put('/blogger/blogs/' + createdBlogId)
        .auth(user1AuthToken, { type: 'bearer' })
        .send(updateBlogPayload)
        .expect(400);
    });

    it('shouldn`t update if user dont own this blog ', async function () {
      const updateBlogPayload = {
        name: 'Ovdey',
        description: 'rterterterterte sf fsdisfhusd fsdfsgsdgdsgs',
        websiteUrl: 'https://github.com/yuraovdnk',
      };
      await request(app.getHttpServer())
        .put('/blogger/blogs/' + createdBlogId)
        .auth(user2AuthToken, { type: 'bearer' })
        .send(updateBlogPayload)
        .expect(403);
    });
  });

  describe('GETTING BLOGS WITH PAGING', () => {
    const countBlog = 10;
    const queryParams = {
      pageNumber: 1,
      pageSize: 5,
    };
    it('creating 10 blogs ', async function () {
      const lof = await new Promise<void>(async (resolve, reject) => {
        for (let i = 0; i < countBlog; i++) {
          await request(app.getHttpServer())
            .post('/blogger/blogs')
            .send({
              name: Math.random().toString(36).substring(1, 15),
              description: Math.random().toString(36).substring(1, 15),
              websiteUrl: 'https://github.com/yuraovdnk',
            })
            .auth(user1AuthToken, { type: 'bearer' })
            .expect(201);
        }
        resolve();
      });
    });
    it('should ', async function () {
      const blogs = await request(app.getHttpServer())
        .get('/blogger/blogs')
        .auth(user1AuthToken, { type: 'bearer' })
        .set(queryParams)
        .expect(200);

      expect(blogs.body.totalCount).toEqual(countBlog);
      expect(blogs.body.pageNumber).toEqual(queryParams.pageNumber);
      expect(blogs.body.pageSize).toEqual(queryParams.pageSize);
    });
  });

  describe('CREATE POST', () => {
    let createdBlogId = null;
    beforeAll(async () => {
      const res = await request(app.getHttpServer())
        .post('/blogger/blogs')
        .send({
          name: 'rtertertertertd',
          description: 'rterterterterte',
          websiteUrl: 'https://github.com/yuraovdnk',
        })
        .auth(user1AuthToken, { type: 'bearer' })
        .expect(201);
      createdBlogId = res.body.id;
    });
    it('should create blog ', async function () {
      const createdPost = await request(app.getHttpServer())
        .post('/blogger/blogs/' + createdBlogId + '/posts')
        .send({
          title: 'string',
          shortDescription: 'stridgfdgng',
          content: 'strifdgdfgdfgng',
        })
        .auth(user1AuthToken, { type: 'bearer' })
        .expect(201);
    });

    it('shouldn`t create blog ', async function () {
      const createdPost = await request(app.getHttpServer())
        .post('/blogger/blogs/' + createdBlogId + '/posts')
        .send({
          title: 'stringgfdgd gdfgd dfg dfgdfgdfg dfgdfgdfgdfgdf',
          shortDescription: 'stridgfdgng',
          content: 'strifdgdfgdfgng',
        })
        .auth(user1AuthToken, { type: 'bearer' })
        .expect(400);
    });

    it('shouldn`t create if user is not owner this blog', async function () {
      const createdPost = await request(app.getHttpServer())
        .post('/blogger/blogs/' + createdBlogId + '/posts')
        .send({
          title: 'stringgfdgd',
          shortDescription: 'stridgfdgng',
          content: 'strifdgdfgdfgng',
        })
        .auth(user2AuthToken, { type: 'bearer' })
        .expect(403);
    });
  });

  describe('DELETE POST', () => {
    let createBlogId = null;
    let createdPostId = null;
    beforeAll(async () => {
      //create blog
      const createdBlog = await request(app.getHttpServer())
        .post('/blogger/blogs')
        .send({
          name: 'rtertertertertd',
          description: 'rterterterterte',
          websiteUrl: 'https://github.com/yuraovdnk',
        })
        .auth(user1AuthToken, { type: 'bearer' })
        .expect(201);
      createBlogId = createdBlog.body.id;
      //create blogs
      const createdPost = await request(app.getHttpServer())
        .post('/blogger/blogs/' + createBlogId + '/posts')
        .send({
          title: 'string',
          shortDescription: 'stridgfdgng',
          content: 'strifdgdfgdfgng',
        })
        .auth(user1AuthToken, { type: 'bearer' })
        .expect(201);
      createdPostId = createdPost.body.id;
    });

    it('should`t delete if blog or blogs not found ', async function () {
      await request(app.getHttpServer())
        .delete('/blogger/blogs/' + createBlogId + '/posts/' + uuid())
        .auth(user1AuthToken, { type: 'bearer' })
        .expect(404);
    });
    it('should`t delete if user is not owner this blog ', async function () {
      await request(app.getHttpServer())
        .delete('/blogger/blogs/' + createBlogId + '/posts/' + createdPostId)
        .auth(user2AuthToken, { type: 'bearer' })
        .expect(403);
    });
    it('should`t delete', async function () {
      await request(app.getHttpServer())
        .delete('/blogger/blogs/' + createBlogId + '/posts/' + createdPostId)
        .auth(user1AuthToken, { type: 'bearer' })
        .expect(204);
    });
  });

  describe('UPDATING POST', () => {
    let createBlogId = null;
    let createdPostId = null;
    beforeAll(async () => {
      //create blog
      const createdBlog = await request(app.getHttpServer())
        .post('/blogger/blogs')
        .send({
          name: 'rtertertertertd',
          description: 'rterterterterte',
          websiteUrl: 'https://github.com/yuraovdnk',
        })
        .auth(user1AuthToken, { type: 'bearer' })
        .expect(201);
      createBlogId = createdBlog.body.id;
      //create blogs
      const createdPost = await request(app.getHttpServer())
        .post('/blogger/blogs/' + createBlogId + '/posts')
        .send({
          title: 'string',
          shortDescription: 'stridgfdgng',
          content: 'strifdgdfgdfgng',
        })
        .auth(user1AuthToken, { type: 'bearer' })
        .expect(201);
      createdPostId = createdPost.body.id;
    });
    it('SHOULD UPDATE WITH CORRECT PAYLOAD', async function () {
      await request(app.getHttpServer())
        .put('/blogger/blogs/' + createBlogId + '/posts/' + createdPostId)
        .send({
          title: 'JSlanguage',
          shortDescription: 'WHYT SF fdsfh beaci toe tew',
          content: 'strifdgdfgdfgng',
        })
        .auth(user1AuthToken, { type: 'bearer' })
        .expect(204);
    });
    it('SHOULDN`T UPDATE WITH INCORRECT PAYLOAD', async function () {
      await request(app.getHttpServer())
        .put('/blogger/blogs/' + createBlogId + '/posts/' + createdPostId)
        .send({
          title: 'JSlanguage is govno.WHY?',
          shortDescription: 'WHYT SF fdsfh beaci toe tew',
          content: 'strifdgdfgdfgng',
        })
        .auth(user1AuthToken, { type: 'bearer' })
        .expect(400);
    });
    it('SHOULDN`T UPDATE IF USER IS NOT OWNER THIS BLOG', async function () {
      await request(app.getHttpServer())
        .put('/blogger/blogs/' + createBlogId + '/posts/' + createdPostId)
        .send({
          title: 'JSlanguage',
          shortDescription: 'Why the fdsfh beaci toe tew',
          content: 'strifdgd fgdfgng beacuer',
        })
        .auth(user2AuthToken, { type: 'bearer' })
        .expect(403);
    });
    it('SHOULDN`T UPDATE IF BLOG OR POST NOT FOUND', async function () {
      await request(app.getHttpServer())
        .put('/blogger/blogs/' + uuid() + '/posts/' + uuid())
        .send({
          title: 'JSlanguage',
          shortDescription: 'Why the fdsfh beaci toe tew',
          content: 'strifdgd fgdfgng beacuer',
        })
        .auth(user1AuthToken, { type: 'bearer' })
        .expect(404);
    });
  });
});
