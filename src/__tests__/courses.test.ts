import { api, createTestUserWithToken, createTestCourseData } from './helpers/supertest.helper';

describe('Course Module API', () => {
  let adminCourseId: string;
  let coachCourseId: string;

  describe('POST /courses', () => {
    it('allows ADMIN to create a new course', async () => {
      const { token } = await createTestUserWithToken('ADMIN');
      const courseData = createTestCourseData();

      const res = await api.post('/courses')
        .set('Authorization', `Bearer ${token}`)
        .send(courseData);

      expect(res.status).toBe(201);
      expect(res.body).toHaveProperty('id');
      adminCourseId = res.body.id;
    });

    it('allows COACH to create a new course', async () => {
      const { token } = await createTestUserWithToken('COACH');
      const courseData = createTestCourseData();

      const res = await api.post('/courses')
        .set('Authorization', `Bearer ${token}`)
        .send(courseData);

      expect(res.status).toBe(201);
      expect(res.body).toHaveProperty('id');
      coachCourseId = res.body.id;
    });

    it('STUDENT cannot create a course', async () => {
      const { token } = await createTestUserWithToken('STUDENT');
      const courseData = createTestCourseData();

      const res = await api.post('/courses')
        .set('Authorization', `Bearer ${token}`)
        .send(courseData);

      expect(res.status).toBe(403);
    });

    it('validation error when required fields missing', async () => {
      const { token } = await createTestUserWithToken('ADMIN');

      const res = await api.post('/courses')
        .set('Authorization', `Bearer ${token}`)
        .send({}); // بدون بيانات

      expect(res.status).toBe(400);
    });
  });

  describe('GET /courses', () => {
    it('returns a list of courses', async () => {
      const res = await api.get('/courses');
      expect(res.status).toBe(200);
      expect(Array.isArray(res.body)).toBe(true);
    });
  });

  describe('GET /courses/:id', () => {
    it('returns course details for valid ID', async () => {
      const res = await api.get(`/courses/${adminCourseId}`);
      expect(res.status).toBe(200);
      expect(res.body).toHaveProperty('id', adminCourseId);
    });

    it('returns 404 for invalid course ID', async () => {
      const res = await api.get(`/courses/invalid-id`);
      expect(res.status).toBe(404);
    });
  });

  describe('PUT /courses/:id', () => {
    it('allows creator (ADMIN) to update their course', async () => {
      const { token } = await createTestUserWithToken('ADMIN');
      const updatedData = { title: 'Updated Course' };

      const res = await api.put(`/courses/${adminCourseId}`)
        .set('Authorization', `Bearer ${token}`)
        .send(updatedData);

      expect(res.status).toBe(200);
      expect(res.body.title).toBe(updatedData.title);
    });

    it('STUDENT cannot update courses', async () => {
      const { token } = await createTestUserWithToken('STUDENT');
      const updatedData = { title: 'Student Update' };

      const res = await api.put(`/courses/${adminCourseId}`)
        .set('Authorization', `Bearer ${token}`)
        .send(updatedData);

      expect(res.status).toBe(403);
    });
  });

  describe('DELETE /courses/:id', () => {
    it('allows creator (ADMIN) to delete their course', async () => {
      const { token } = await createTestUserWithToken('ADMIN');

      const res = await api.delete(`/courses/${adminCourseId}`)
        .set('Authorization', `Bearer ${token}`);

      expect(res.status).toBe(204);
    });
  });
});
