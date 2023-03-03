import { PipeTransform, Injectable, BadRequestException } from '@nestjs/common';
import { mapErrors } from '../exceptions/mapErrors';
import { StatusLike } from '../types/commonEnums';
@Injectable()
export class ParseStatusLikeEnumPipe implements PipeTransform {
  public transform(value: any) {
    if (value && Object.values(StatusLike).includes(value)) {
      return value;
    }
    throw new BadRequestException(mapErrors('Some error', 'likeStatus'));
  }
}
