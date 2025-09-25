import { Course } from './courses.entity';
import { v4 as uuidv4 } from 'uuid';
import { CustomError } from '../../shared/exception';
import { HttpErrorStatus } from '../../shared/util.types';

class CourseService {
  private courses: Course[] = [];

  getAll(): Course[] {
    return this.courses;
  }

  getById(id: string): Course | undefined {
    return this.courses.find(c => c.id === id);
  }

  create(course: Partial<Course>): Course {
    // تحقق من الحقول المطلوبة
    if (!course.title || !course.description || !course.creatorId) {
      throw new CustomError(
        'Missing required fields',
        'COURSE',
        HttpErrorStatus.BadRequest
      );
    }

    const now = new Date();
    const newCourse: Course = {
      id: uuidv4(),
      title: course.title,
      description: course.description,
      image: course.image ?? '', 
      creatorId: course.creatorId,
      createdAt: now,
      updatedAt: now,
    };

    this.courses.push(newCourse);
    return newCourse;
  }

  update(
    id: string,
    userId: string,
    data: Partial<Course>,
    role: 'ADMIN' | 'COACH' | 'STUDENT'
  ): Course {
    const course = this.getById(id);
    if (!course) throw new CustomError('Course not found', 'COURSE', HttpErrorStatus.NotFound);

    if (role !== 'ADMIN' && course.creatorId !== userId) {
      throw new CustomError('Forbidden', 'COURSE', HttpErrorStatus.Forbidden);
    }

    Object.assign(course, data, { updatedAt: new Date() });
    return course;
  }

  delete(
    id: string,
    userId: string,
    role: 'ADMIN' | 'COACH' | 'STUDENT'
  ): void {
    const index = this.courses.findIndex(c => c.id === id);
    if (index === -1) throw new CustomError('Course not found', 'COURSE', HttpErrorStatus.NotFound);

    const course = this.courses[index];
    if (!course) throw new CustomError('Course not found', 'COURSE', HttpErrorStatus.NotFound);

    if (role !== 'ADMIN' && course.creatorId !== userId) {
      throw new CustomError('Forbidden', 'COURSE', HttpErrorStatus.Forbidden);
    }

    this.courses.splice(index, 1);
  }
}

export const courseService = new CourseService();
