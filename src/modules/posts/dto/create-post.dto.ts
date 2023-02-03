import { IsNotEmpty, IsUUID, Validate } from 'class-validator';
import { CreatePostForBlogDto } from '../../blogs/dto/create-post-for-blog.dto';
import { IsExistBlog } from '../../../common/validators/isExistBlog';

export class CreatePostDto extends CreatePostForBlogDto {
  @Validate(IsExistBlog, { message: 'Blog is not exist' })
  @IsNotEmpty()
  @IsUUID()
  blogId: string;
}
