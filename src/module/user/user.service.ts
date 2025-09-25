import { User } from './user.entity';
import { v4 as uuidv4 } from 'uuid';
import { CustomError } from '../../shared/exception';
import { HttpErrorStatus } from '../../shared/util.types';

class UserService {
  private users: User[] = [];

  getAll(): User[] {
    return this.users;
  }

  getById(id: string): User | undefined {
    return this.users.find(u => u.id === id);
  }

  getByEmail(email: string): User | undefined {
    return this.users.find(u => u.email === email);
  }

  isUserIdExist(id: string): boolean {
    return !!this.getById(id);
  }

  create(data: Partial<User>): User {
    const now = new Date();
    const user: User = {
      id: uuidv4(),
      name: data.name!,
      email: data.email!,
      password: data.password!,
      role: data.role || 'STUDENT', 
      createdAt: now,
      updatedAt: now,
    };
    this.users.push(user);
    return user;
  }

  update(id: string, data: Partial<User>): User {
    const user = this.getById(id);
    if (!user) throw new CustomError('User not found', 'USER', HttpErrorStatus.NotFound);

    Object.assign(user, data, { updatedAt: new Date() });
    return user;
  }

  delete(id: string): void {
    const index = this.users.findIndex(u => u.id === id);
    if (index === -1) throw new CustomError('User not found', 'USER', HttpErrorStatus.NotFound);

    this.users.splice(index, 1);
  }
}

export const userService = new UserService();
