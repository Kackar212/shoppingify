import { ResponseMessage } from './../constants';

export class ResponseDto<Entity> {
  status: number;
  data: Entity;
  message: typeof ResponseMessage[keyof typeof ResponseMessage];

  constructor({ data, status, message }: ResponseDto<Entity>) {
    Object.assign(this, { data, status, message });
  }
}
