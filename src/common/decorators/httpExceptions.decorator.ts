import { applyDecorators } from '@nestjs/common';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';

const TEMPLATE_API_RESPONSE = [
  {
    status: 400,
    description: 'Không tìm thấy thông tin người dùng',
  },
  { status: 401, description: 'Không có quyền truy cập' },
  { status: 403, description: 'Token không hợp lệ' },
];

const merge = (a, b, p) =>
  a.filter((aa) => !b.find((bb) => aa[p] === bb[p])).concat(b);

export const ApiResponses = (
  summary: string,
  descriptions?: CustomDescription[],
) => {
  const summaryDecorator = ApiOperation({ summary });
  if (!descriptions) {
    return applyDecorators(summaryDecorator);
  }
  const description = descriptions.map((item) => {
    return {
      status: item.status,
      description: item.description,
      type: item.type,
    };
  });

  const newDescription = merge(
    TEMPLATE_API_RESPONSE,
    description,
    'status',
  );
  newDescription.sort((a, b) => a.status - b.status);
  const descriptionDecorator = newDescription.map((item) => {
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
