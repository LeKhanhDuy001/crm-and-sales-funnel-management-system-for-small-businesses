import { Role } from '../../common/enums/role.enum';

export interface AuthenticatedUser {
  userId: number;
  fullName: string;
  email: string;
  role: Role;
}