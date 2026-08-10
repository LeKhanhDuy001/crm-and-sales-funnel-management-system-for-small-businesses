import { UsersRepository } from './repositories/users.repository';
import { UsersService } from './users.service';

describe('UsersService', () => {
  let usersService: UsersService;

  let usersRepository: {
    findByEmail: jest.Mock;
    findById: jest.Mock;
    updatePassword: jest.Mock;
  };

  beforeEach(() => {
    usersRepository = {
      findByEmail: jest.fn(),
      findById: jest.fn(),
      updatePassword: jest.fn(),
    };

    usersService = new UsersService(
      usersRepository as unknown as UsersRepository,
    );
  });

  it('should normalize email before finding user', async () => {
    const expectedUser = {
      userid: 1,
      fullname: 'Admin Demo',
      email: 'admin@crm.com',
      status: true,
      roles: { rolename: 'Admin' },
    };

    usersRepository.findByEmail.mockResolvedValue(expectedUser);

    const result = await usersService.findByEmail('  ADMIN@CRM.COM  ');

    expect(usersRepository.findByEmail).toHaveBeenCalledWith('admin@crm.com');

    expect(result).toEqual(expectedUser);
  });

  it('should find user by id', async () => {
    const expectedUser = {
      userid: 1,
      fullname: 'Admin Demo',
      email: 'admin@crm.com',
      roles: {
        rolename: 'Admin',
      },
    };

    usersRepository.findById.mockResolvedValue(expectedUser);

    const result = await usersService.findById(1);

    expect(usersRepository.findById).toHaveBeenCalledWith(1);

    expect(result).toEqual(expectedUser);
  });

  it('should update password through repository', async () => {
    usersRepository.updatePassword.mockResolvedValue(undefined);

    await usersService.updatePassword(1, 'hashed-password');

    expect(usersRepository.updatePassword).toHaveBeenCalledWith(
      1,
      'hashed-password',
    );
  });
});
