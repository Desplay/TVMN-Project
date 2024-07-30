import { applyDecorators } from '@nestjs/common';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';

export const ApiResponses = (
  summary: string,
  descriptions: CustomDescription[],
) => {
  const summaryDecorator = ApiOperation({ summary });
  const descriptionDecorator = descriptions.map((item) => {
    return ApiResponse({
      status: item.status,
      description: item.description,
      type: item.type,
    });
  });
  return applyDecorators(summaryDecorator, ...descriptionDecorator);
};

export type CustomDescription = {
  status: number;
  description: string;
  type?: any;
};
