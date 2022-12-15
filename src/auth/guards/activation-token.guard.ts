import { Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class ActivationJwtAuthGuard extends AuthGuard('jwt-activation-token') {}
