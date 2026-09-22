import {
  Controller,
  Get,
  INestApplication,
  Injectable,
  UseGuards,
} from '@nestjs/common';
import { JwtModule, JwtService } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { PassportStrategy } from '@nestjs/passport';
import { Test, TestingModule } from '@nestjs/testing';
import { ExtractJwt, Strategy } from 'passport-jwt';
import request from 'supertest';
import type { Server } from 'node:http';

import { JwtAuthGuard } from '../src/auth/guards/jwt-auth.guard';
import { Roles } from '../src/common/decorators/roles.decorator';
import { Role } from '../src/common/enums/role.enum';
import { RolesGuard } from '../src/common/guards/roles.guard';

const JWT_SECRET = 'e2e-security-test-secret';

type MessageResponse = {
  message: string;
};

function getHttpServer(app: INestApplication): Server {
  const httpServer: unknown = app.getHttpServer();
  return httpServer as Server;
}

@Injectable()
class TestJwtStrategy extends PassportStrategy(Strategy) {
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: JWT_SECRET,
    });
  }

  validate(payload: { sub: number; role: Role }) {
    return {
      userId: payload.sub,
      fullName: 'E2E Test User',
      email: 'e2e@test.local',
      role: payload.role,
    };
  }
}

@Controller('security-test')
@UseGuards(JwtAuthGuard, RolesGuard)
class SecurityTestController {
  @Get('admin')
  @Roles(Role.ADMIN)
  adminOnly() {
    return {
      message: 'Admin được phép truy cập.',
    };
  }
}

describe('Security (e2e)', () => {
  let app: INestApplication;
  let jwtService: JwtService;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [
        PassportModule.register({
          defaultStrategy: 'jwt',
        }),
        JwtModule.register({
          secret: JWT_SECRET,
          signOptions: {
            expiresIn: '1h',
          },
        }),
      ],
      controllers: [SecurityTestController],
      providers: [JwtAuthGuard, RolesGuard, TestJwtStrategy],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.setGlobalPrefix('api/v1');

    jwtService = moduleFixture.get<JwtService>(JwtService);

    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  it('không có JWT thì trả về 401', async () => {
    await request(getHttpServer(app))
      .get('/api/v1/security-test/admin')
      .expect(401);
  });

  it('JWT không hợp lệ thì trả về 401', async () => {
    await request(getHttpServer(app))
      .get('/api/v1/security-test/admin')
      .set('Authorization', 'Bearer token-khong-hop-le')
      .expect(401);
  });

  it('JWT hợp lệ nhưng sai role thì trả về 403', async () => {
    const token = jwtService.sign({
      sub: 2,
      role: Role.SALES,
    });

    const response = await request(getHttpServer(app))
      .get('/api/v1/security-test/admin')
      .set('Authorization', `Bearer ${token}`)
      .expect(403);

    const body = response.body as unknown as MessageResponse;

    expect(body.message).toBe('Bạn không có quyền truy cập chức năng này.');
  });

  it('JWT hợp lệ và đúng role thì trả về 200', async () => {
    const token = jwtService.sign({
      sub: 1,
      role: Role.ADMIN,
    });

    const response = await request(getHttpServer(app))
      .get('/api/v1/security-test/admin')
      .set('Authorization', `Bearer ${token}`)
      .expect(200);

    const body = response.body as unknown as MessageResponse;

    expect(body).toEqual({
      message: 'Admin được phép truy cập.',
    });
  });

  it('JWT hết hạn thì trả về 401', async () => {
    const token = jwtService.sign(
      {
        sub: 1,
        role: Role.ADMIN,
      },
      {
        expiresIn: -1,
      },
    );

    await request(getHttpServer(app))
      .get('/api/v1/security-test/admin')
      .set('Authorization', `Bearer ${token}`)
      .expect(401);
  });
});
