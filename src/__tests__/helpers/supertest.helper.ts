// src/__tests__/helpers/supertest.helper.ts
import supertest from 'supertest';
import app from '../../server';
import { generateJWT } from '../../module/auth/util/jwt.util';
import { createArgonHash } from '../../module/auth/util/argon.util';
import { User } from '../../module/user/user.entity';
import { userService } from '../../module/user/user.service';

export const api = supertest(app);

export const createTestUserWithToken = async (role: 'ADMIN' | 'COACH' | 'STUDENT') => {
  const password = 'password123';
  const user: User = {
    id: 'user-' + Math.random().toString(36).substring(2, 10),
    name: `${role} Test`,
    email: `${role.toLowerCase()}@test.com`,
    role,
    password: await createArgonHash(password),
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  // mock userService ليعرف هذا المستخدم
  jest.spyOn(userService, 'getById').mockImplementation((id: string) => {
    return id === user.id ? user : undefined;
  });
  jest.spyOn(userService, 'isUserIdExist').mockImplementation((id: string) => id === user.id);

  const token = generateJWT({ userId: user.id, role: user.role });
  return { user, token };
};

export const createTestCourseData = () => ({
  title: 'Test Course ' + Math.random().toString(36).substring(2, 6),
  description: 'This is a test course',
  duration: 5,
});
test('dummy test to satisfy Jest', () => {
});