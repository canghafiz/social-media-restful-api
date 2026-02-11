import {
  Body,
  Controller,
  Delete,
  Get,
  HttpStatus,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { PostService } from './post.service';
import {
  AddPostRequest,
  PostDataResponse,
  PostResponse,
  UpdatePostRequest,
} from '../model/post.model';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { CurrentUser } from '../auth/current-user.decorator';
import type { JwtPayload } from '../auth/jwt-payload.interface';
import { ApiResponse } from '../model/api.model';

@Controller('/api/posts')
export class PostController {
  constructor(private readonly postService: PostService) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  async addPost(
    @Body() request: AddPostRequest,
    @CurrentUser() user: JwtPayload,
  ): Promise<PostResponse> {
    const result = await this.postService.addPost(request, user.userId);
    return {
      success: true,
      code: HttpStatus.CREATED,
      data: result,
    };
  }

  @Get()
  @UseGuards(JwtAuthGuard)
  async getPosts(): Promise<ApiResponse<PostDataResponse[]>> {
    const result = await this.postService.readPosts();
    return {
      success: true,
      code: HttpStatus.OK,
      data: result,
    };
  }

  @Get('/users/:userId')
  @UseGuards(JwtAuthGuard)
  async getPostsByUser(
    @Param('userId', ParseIntPipe) userId: number,
  ): Promise<ApiResponse<PostDataResponse[]>> {
    const result = await this.postService.readPostsByUser(userId);
    return {
      success: true,
      code: HttpStatus.OK,
      data: result,
    };
  }

  @Patch('/:postId')
  @UseGuards(JwtAuthGuard)
  async updatePost(
    @Body() request: UpdatePostRequest,
    @Param('postId', ParseIntPipe) postId: number,
  ): Promise<{ success: boolean; code: number; data: PostDataResponse }> {
    const result = await this.postService.updatePost(request, postId);
    return {
      success: true,
      code: HttpStatus.OK,
      data: result,
    };
  }

  @Delete('/:postId')
  @UseGuards(JwtAuthGuard)
  async deletePost(
    @Param('postId', ParseIntPipe) postId: number,
  ): Promise<PostResponse> {
    const result = await this.postService.deletePost(postId);
    return {
      success: true,
      code: HttpStatus.OK,
      data: result,
    };
  }
}
