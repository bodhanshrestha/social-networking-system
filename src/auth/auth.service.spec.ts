import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { generateRandomEmail, generateRandomName } from 'src/shared/utils/randomWordGenerator';

describe('AuthService', () => {
  let service: AuthService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [AuthService],
    }).compile();

    service = module.get<AuthService>(AuthService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it("should register a user", async () => {
    const payload = {
      email: generateRandomEmail(6),
      password: "password",
      confirmPassword: "password",
      name: generateRandomName(6),
      phone: "1234567890"
    }
    const user = await service.register(payload)
    expect(user).toBeDefined()
    expect(user.email).toBe(payload.email)
    expect(user.name).toBe(payload.name)
    expect(user.phone).toBe(payload.phone)
  })


});
