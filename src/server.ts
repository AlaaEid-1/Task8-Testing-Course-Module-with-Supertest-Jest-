// src/server.ts
import 'dotenv/config';
import express, { Request, Response, NextFunction } from 'express';
import session from 'express-session';
import { PORT, SESSION_SECRET } from './config/app.config';
import authRoutes from './module/auth/auth.routes';
import userRoutes from './module/user/user.routes';
import courseRoutes from './module/courses/courses.routes'; // تعديل المسار
import { handleError } from './shared/exception';

const app = express();

app.use(express.json());
app.use(
  session({
    secret: SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
  })
);

app.use('/auth', authRoutes);
app.use('/users', userRoutes);
app.use('/courses', courseRoutes);

app.use((_req: Request, res: Response) => {
  res.status(404).send('Route not found');
});

app.use((err: unknown, _req: Request, res: Response, _next: NextFunction) => {
  handleError(err, res);
});

export default app;

// لا نشغل السيرفر أثناء الاختبارات
if (process.env.NODE_ENV !== 'test') {
  app.listen(PORT, () => {
    console.log('App is running on port: ', PORT);
  });
}
