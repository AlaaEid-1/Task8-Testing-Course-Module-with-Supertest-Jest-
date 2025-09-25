import { Request, Response, NextFunction } from 'express';
import { courseService } from './courses.service';
import { CustomError } from '../../shared/exception';
import { HttpErrorStatus } from '../../shared/util.types';

export class CourseController {
  getAll(req: Request, res: Response, next: NextFunction) {
    try {
      const courses = courseService.getAll();
      res.status(200).json(courses);
    } catch (err) {
      next(err);
    }
  }

  getById(req: Request, res: Response, next: NextFunction) {
    try {
      const id = req.params.id;
      if (!id) throw new CustomError('Course ID is required', 'COURSE', HttpErrorStatus.BadRequest);

      const course = courseService.getById(id);
      if (!course) throw new CustomError('Course not found', 'COURSE', HttpErrorStatus.NotFound);

      res.status(200).json(course);
    } catch (err) {
      next(err);
    }
  }

  create(req: Request, res: Response, next: NextFunction) {
    try {
      const creatorId = (req.session as any)?.userId;
      if (!creatorId) throw new CustomError('Unauthorized', 'COURSE', HttpErrorStatus.Unauthorized);

      const course = courseService.create({ ...req.body, creatorId });
      res.status(201).json(course);
    } catch (err) {
      next(err);
    }
  }

  update(req: Request, res: Response, next: NextFunction) {
    try {
      const id = req.params.id;
      const userId = (req.session as any)?.userId;
      const role = (req.session as any)?.role;

      if (!id || !userId || !role) {
        throw new CustomError('Unauthorized', 'COURSE', HttpErrorStatus.Unauthorized);
      }

      const course = courseService.update(id, userId, req.body, role);
      res.status(200).json(course);
    } catch (err) {
      next(err);
    }
  }

  delete(req: Request, res: Response, next: NextFunction) {
    try {
      const id = req.params.id;
      const userId = (req.session as any)?.userId;
      const role = (req.session as any)?.role;

      if (!id || !userId || !role) {
        throw new CustomError('Unauthorized', 'COURSE', HttpErrorStatus.Unauthorized);
      }

      courseService.delete(id, userId, role);
      res.status(204).send();
    } catch (err) {
      next(err);
    }
  }
}

export const courseController = new CourseController();
