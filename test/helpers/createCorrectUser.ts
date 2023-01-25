import request from 'supertest';

export async function createCorrectUser(app) {
  const testPayload = {
    login: 'Yurii',
    email: 'ovdey1999@gmail.com',
    password: '123456',
  };

  it('Successfully registration', async () => {
    await request(app.getHttpServer())
      .post('/auth/registration')
      .send(testPayload)
      .expect(204);
  });
}
