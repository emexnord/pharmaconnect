import { Module } from '@nestjs/common';
import { TokenService } from './token.service';
import { MongooseModule } from '@nestjs/mongoose';
import { UserToken, UserTokenSchema } from './entities/token.entity';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: UserToken.name, schema: UserTokenSchema },
    ]),
  ],
  providers: [TokenService],
  exports: [TokenService],
})
export class SharedModule {}
