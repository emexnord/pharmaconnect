import { Test, TestingModule } from '@nestjs/testing';
import { getModelToken } from '@nestjs/mongoose';
import * as tokenUtils from '../../core/utils/generate-token';
import { Model } from 'mongoose';
import { UserToken } from '../entities/token.entity';
import { TokenType } from '../enums/token-type.enum';
import { TokenService } from '../token.service';

describe('TokenService', () => {
  let service: TokenService;
  let userTokenModel: Model<UserToken>;

  const mockToken = {
    id: 'token123',
    userId: 'user123',
    token: '123456',
    type: TokenType.EMAIL_VERIFICATION,
    expiresAt: new Date(Date.now() + 60 * 60 * 1000),
  };

  const mockUserTokenModel = {
    findOneAndUpdate: jest.fn(),
    findById: jest.fn(),
    findOne: jest.fn(),
    findByIdAndDelete: jest.fn(),
    deleteMany: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TokenService,
        {
          provide: getModelToken(UserToken.name),
          useValue: mockUserTokenModel,
        },
      ],
    }).compile();

    service = module.get<TokenService>(TokenService);
    userTokenModel = module.get<Model<UserToken>>(
      getModelToken(UserToken.name),
    );
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('createEmailVerificationToken', () => {
    it('should create or overwrite an email verification token', async () => {
      const otp = '123456';
      const userId = 'user123';

      jest.spyOn(tokenUtils, 'generateOTP').mockReturnValue(otp);
      mockUserTokenModel.findOneAndUpdate.mockResolvedValue(mockToken);

      const result = await service.createEmailVerificationToken(userId);

      expect(tokenUtils.generateOTP).toHaveBeenCalled();
      expect(userTokenModel.findOneAndUpdate).toHaveBeenCalledWith(
        { userId: userId, type: TokenType.EMAIL_VERIFICATION },
        expect.objectContaining({
          userId: userId,
          token: otp,
          type: TokenType.EMAIL_VERIFICATION,
        }),
        { upsert: true, new: true },
      );
      expect(result).toEqual(mockToken);
    });

    it('should not create duplicate tokens of same type', async () => {});
  });

  describe('createPasswordResetToken', () => {
    it('should create or overwrite a password reset token', async () => {
      jest
        .spyOn(tokenUtils, 'generatePasswordResetToken')
        .mockReturnValue('reset123');
      mockUserTokenModel.findOneAndUpdate.mockResolvedValue({
        ...mockToken,
        token: 'reset123',
        type: TokenType.PASSWORD_RESET,
      });

      const result = await service.createPasswordResetToken('user123');

      expect(tokenUtils.generatePasswordResetToken).toHaveBeenCalled();
      expect(userTokenModel.findOneAndUpdate).toHaveBeenCalledWith(
        { userId: 'user123', type: TokenType.PASSWORD_RESET },
        expect.objectContaining({
          userId: 'user123',
          token: 'reset123',
          type: TokenType.PASSWORD_RESET,
        }),
        { upsert: true, new: true },
      );
      expect(result.token).toBe('reset123');
      expect(result.type).toBe(TokenType.PASSWORD_RESET);
    });
  });

  describe('findTokenById', () => {
    it('should return a token by ID', async () => {
      mockUserTokenModel.findById.mockResolvedValue(mockToken);

      const result = await service.findTokenById('token123');

      expect(userTokenModel.findById).toHaveBeenCalledWith('token123');
      expect(result).toEqual(mockToken);
    });
  });

  describe('findTokenByUserId', () => {
    it('should return a token by user ID and type', async () => {
      mockUserTokenModel.findOne.mockResolvedValue(mockToken);

      const result = await service.findTokenByUserId(
        'user123',
        TokenType.EMAIL_VERIFICATION,
      );

      expect(userTokenModel.findOne).toHaveBeenCalledWith({
        userId: 'user123',
        type: TokenType.EMAIL_VERIFICATION,
      });
      expect(result).toEqual(mockToken);
    });
  });

  describe('deleteTokenById', () => {
    it('should delete a token by ID', async () => {
      mockUserTokenModel.findByIdAndDelete.mockResolvedValue(mockToken);

      const result = await service.deleteTokenById('token123');

      expect(userTokenModel.findByIdAndDelete).toHaveBeenCalledWith('token123');
      expect(result).toEqual(mockToken);
    });
  });

  describe('deleteTokensByUserId', () => {
    it('should delete all tokens by user ID and type', async () => {
      mockUserTokenModel.deleteMany.mockResolvedValue({ deletedCount: 2 });

      const result = await service.deleteTokensByUserId(
        'user123',
        TokenType.PASSWORD_RESET,
      );

      expect(userTokenModel.deleteMany).toHaveBeenCalledWith({
        userId: 'user123',
        type: TokenType.PASSWORD_RESET,
      });
      expect(result).toBe(2);
    });
  });
});
