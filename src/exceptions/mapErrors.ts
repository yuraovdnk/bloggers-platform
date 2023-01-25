import { BadRequestException } from '@nestjs/common';

export function mapValidationErrors(errors) {
  const responseError = [];
  errors.forEach((item) => {
    const constraintKeys = Object.keys(item.constraints);
    constraintKeys.forEach((key) => {
      responseError.push({
        message: item.constraints[key],
        field: item.property,
      });
    });
  });
  throw new BadRequestException(responseError);
}
export function mapErrors(message: string, field: string) {
  return [
    {
      message,
      field,
    },
  ];
}
