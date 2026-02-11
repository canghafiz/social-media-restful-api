import { ValidationService } from '../common/validation.service';
import { HttpException, Inject, Injectable } from '@nestjs/common';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import { Logger } from 'winston';
import { PrismaService } from '../common/prisma.service';
import {
  AddPostRequest,
  PostDataResponse,
  UpdatePostRequest,
} from '../model/post.model';
import { PostValidation } from './post.validation';
import { Visibility } from '@prisma/client';

@Injectable()
export class PostService {
  constructor(
    private validationService: ValidationService,
    @Inject(WINSTON_MODULE_PROVIDER) private logger: Logger,
    private prismaService: PrismaService,
  ) {}

  async addPost(request: AddPostRequest, userId: number): Promise<string> {
    this.logger.debug(`Add new post ${JSON.stringify(request)}`);

    const addRequest = this.validationService.validate(
      PostValidation.ADD,
      request,
    ) as AddPostRequest;

    const visibilityEnum: Visibility = addRequest.visibility as Visibility;

    await this.prismaService.post.create({
      data: {
        post_text: addRequest.post_text,
        visibility: visibilityEnum,
        user_id: userId,
      },
    });

    return 'your status successfully added';
  }

  async updatePost(
    request: UpdatePostRequest,
    postId: number,
  ): Promise<PostDataResponse> {
    this.logger.debug(`Update post ${JSON.stringify(request)}`);

    const updateRequest = this.validationService.validate(
      PostValidation.UPDATE,
      request,
    ) as UpdatePostRequest;

    const visibilityEnum: Visibility = updateRequest.visibility as Visibility;

    const updatedPost = await this.prismaService.post.update({
      where: {
        postId: postId,
      },
      data: {
        post_text: updateRequest.post_text,
        visibility: visibilityEnum,
      },
    });

    return {
      postId: updatedPost.postId,
      post_text: updatedPost.post_text,
      visibility: updatedPost.visibility,
      user_id: updatedPost.user_id,
      created_at: updatedPost.created_at.toISOString(),
    };
  }

  async readPosts(): Promise<PostDataResponse[]> {
    this.logger.debug('Get all posts');

    const results = await this.prismaService.post.findMany({
      include: {
        user: {
          select: {
            userId: true,
          },
        },
      },
      orderBy: { created_at: 'desc' },
    });

    return results.map((post) => ({
      postId: post.postId,
      post_text: post.post_text,
      visibility: post.visibility,
      user_id: post.user_id,
      created_at: post.created_at.toISOString(),
    }));
  }

  async readPostsByUser(userId: number): Promise<PostDataResponse[]> {
    this.logger.debug(`Get posts for user ${userId}`);

    const results = await this.prismaService.post.findMany({
      where: { user_id: userId },
      orderBy: { created_at: 'desc' },
    });

    return results.map((post) => ({
      postId: post.postId,
      post_text: post.post_text,
      visibility: post.visibility,
      user_id: post.user_id,
      created_at: post.created_at.toISOString(),
    }));
  }

  async deletePost(postId: number): Promise<string> {
    this.logger.debug(`Delete post ${postId}`);

    const foundPost = await this.prismaService.post.findUnique({
      where: { postId },
    });

    if (!foundPost) {
      throw new HttpException('failed to delete post', 400);
    }

    await this.prismaService.post.delete({
      where: {
        postId: postId,
      },
    });

    return 'post successfully deleted';
  }
}
