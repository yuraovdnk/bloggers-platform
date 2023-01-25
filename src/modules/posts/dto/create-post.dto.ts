import { IsNotEmpty, IsUUID } from 'class-validator';
import { CreatePostForBlogDto } from '../../blogs/dto/create-post-for-blog.dto';

export class CreatePostDto extends CreatePostForBlogDto {
  @IsNotEmpty()
  @IsUUID()
  blogId: string;
}
