import { Module, NestModule } from '@nestjs/common';
import { JwtModule as NestJwtModule, JwtService } from '@nestjs/jwt';
import { JwtAuthService } from './jwt.service';

@Module({
  imports: [
    NestJwtModule.register({
      global: true,
      signOptions: { expiresIn: 604800 },
    }),
  ],
  providers: [JwtAuthService, JwtService],
  exports: [JwtAuthService],
})
export class JwtModule implements NestModule {
  configure() {}
}
