import { ExecutionContext, createParamDecorator } from '@nestjs/common';

export const GetPharmacy = createParamDecorator(
  (data, ctx: ExecutionContext) => {
    const req = ctx.switchToHttp().getRequest();
    return req['pharmacy'];
  },
);
