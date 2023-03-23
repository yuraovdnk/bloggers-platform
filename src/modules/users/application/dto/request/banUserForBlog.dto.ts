import { BanUserDto } from './banUser.dto';
import { Validate } from 'class-validator';
import { IsExistBlog } from '../../../../../common/validators/isExistBlog';

export class BanUserForBlogDto extends BanUserDto {
  @Validate(IsExistBlog, { message: 'Blog is not exist' })
  blogId: string;
}
