import { INestApplication, Logger } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { AppModule } from '../../src/app.module';
import { createApp } from '../../src/main';
import request from 'supertest';
import { v4 as uuid } from 'uuid';

describe('Commetns', () => {
  jest.setTimeout(1000 * 60 * 3);
  let app: INestApplication;
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

  describe('UPDATING COMMENT', () => {
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

    it('should update comment with correct data ', async function () {
      const comment = await request(app.getHttpServer())
        .post('/posts/' + createdPostId + '/comments')
        .send({ content: 'dsfsdfwe wrerwercf wrew' })
        .auth(user1AuthToken, { type: 'bearer' })
        .expect(201);

      await request(app.getHttpServer())
        .put('/comments/' + comment.body.id)
        .send({ content: 'I LOVE UKRAINE AND UIT SFSSsfss' })
        .auth(user1AuthToken, { type: 'bearer' })
        .expect(204);
    });

    it('shouldn`t update comment with incorrect data ', async function () {
      const comment = await request(app.getHttpServer())
        .post('/posts/' + createdPostId + '/comments')
        .send({ content: 'dsfsdfwe wrerwercf wrew' })
        .auth(user1AuthToken, { type: 'bearer' })
        .expect(201);

      await request(app.getHttpServer())
        .put('/comments/' + comment.body.id)
        .send({ content: 'Ifdsf' })
        .auth(user1AuthToken, { type: 'bearer' })
        .expect(400);
    });
    it('shouldn`t update if user is not owner this comment ', async function () {
      const comment = await request(app.getHttpServer())
        .post('/posts/' + createdPostId + '/comments')
        .send({ content: 'dsfsdfwe wrerwercf wrew' })
        .auth(user1AuthToken, { type: 'bearer' })
        .expect(201);

      await request(app.getHttpServer())
        .put('/comments/' + comment.body.id)
        .send({ content: 'Ifdsfggfdgd dfgdfgdfgdfg' })
        .auth(user2AuthToken, { type: 'bearer' })
        .expect(403);
    });
  });

  describe('DETETING COMMENT', () => {
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
    it('should throw exception if comment is not exist', async function () {
      const comment = await request(app.getHttpServer())
        .delete('/posts/' + uuid + '/comments')
        .auth(user1AuthToken, { type: 'bearer' })
        .expect(404);
    });

    it('should throw exception if user is not owner this comment', async function () {
      const comment = await request(app.getHttpServer())
        .post('/posts/' + createdPostId + '/comments')
        .send({ content: 'dsfsdfwe wrerwercf wrew' })
        .auth(user1AuthToken, { type: 'bearer' })
        .expect(201);

      await request(app.getHttpServer())
        .delete('/comments/' + comment.body.id)
        .auth(user2AuthToken, { type: 'bearer' })
        .expect(403);
    });

    it('should delete ', async function () {
      const comment = await request(app.getHttpServer())
        .post('/posts/' + createdPostId + '/comments')
        .send({ content: 'dsfsdfwe wrerwercf wrew' })
        .auth(user1AuthToken, { type: 'bearer' })
        .expect(201);

      await request(app.getHttpServer())
        .delete('/comments/' + comment.body.id)
        .auth(user1AuthToken, { type: 'bearer' })
        .expect(204);
    });
  });

  describe('SET LIKE FOR COMMENT', () => {
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
    it('shouldn`t execute if comment is not exist', async function () {
      //created comment
      const comment = await request(app.getHttpServer())
        .post('/posts/' + createdPostId + '/comments')
        .send({ content: 'dsfsdfwe wrerwercf wrew' })
        .auth(user1AuthToken, { type: 'bearer' })
        .expect(201);

      await request(app.getHttpServer())
        .put('/comments/' + uuid() + '/like-status')
        .send({ likeStatus: 'Like' })
        .auth(user1AuthToken, { type: 'bearer' })
        .expect(404);
    });
    it('shouldn`t execute if payload is incorrect', async function () {
      const comment = await request(app.getHttpServer())
        .post('/posts/' + createdPostId + '/comments')
        .send({ content: 'dsfsdfwe wrerwercf wrew' })
        .auth(user1AuthToken, { type: 'bearer' })
        .expect(201);

      await request(app.getHttpServer())
        .put('/comments/' + comment.body.id + '/like-status')
        .send({ likeStatus: 'LIKEN' })
        .auth(user1AuthToken, { type: 'bearer' })
        .expect(400);
    });
    it('shouldn`t execute if user unathorized', async function () {
      const comment = await request(app.getHttpServer())
        .post('/posts/' + createdPostId + '/comments')
        .send({ content: 'dsfsdfwe wrerwercf wrew' })
        .auth(user1AuthToken, { type: 'bearer' })
        .expect(201);

      await request(app.getHttpServer())
        .put('/comments/' + comment.body.id + '/like-status')
        .send({ likeStatus: 'LIKEN' })
        .auth(user1AuthToken, { type: 'bearer' })
        .expect(400);
    });
    it('should set like for comment ', async function () {
      const createdComment = await request(app.getHttpServer())
        .post('/posts/' + createdPostId + '/comments')
        .send({ content: 'dsfsdfwe wrerwercf wrew' })
        .auth(user1AuthToken, { type: 'bearer' })
        .expect(201);

      await request(app.getHttpServer())
        .put('/comments/' + createdComment.body.id + '/like-status')
        .send({ likeStatus: 'Like' })
        .auth(user1AuthToken, { type: 'bearer' })
        .expect(204);

      const comment = await request(app.getHttpServer())
        .get('/comments/' + createdComment.body.id)
        .auth(user1AuthToken, { type: 'bearer' })
        .expect(200);
      expect(comment.body.commentatorInfo.userLogin).toEqual(user1RegisterPayload.login);
      expect(comment.body.likesInfo.likesCount).toEqual(1);
      expect(comment.body.likesInfo.dislikesCount).toEqual(0);
      expect(comment.body.likesInfo.myStatus).toEqual('Like');
    });
  });
});
