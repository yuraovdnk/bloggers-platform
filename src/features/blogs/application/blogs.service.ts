import { Injectable } from '@nestjs/common';

@Injectable()
export class BlogsService {
  constructor() {
    console.log('BlogsService');
  }
}
