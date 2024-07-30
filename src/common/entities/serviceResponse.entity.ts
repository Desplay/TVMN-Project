import { CustomResponseType } from '../enum/serviceResponse.enum';

export type ServiceResponse = {
  status: CustomResponseType;
  code?: number;
  message: string;
  data?: any;
};
