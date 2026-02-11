import { ApiResponse } from './api.model';

export class AddPostRequest {
  post_text: string;
  visibility: string;
}

export type PostResponse = ApiResponse<string>;

export class PostDataResponse {
  postId: number;
  post_text: string;
  visibility: string;
  user_id: number;
  created_at: string;
}

export class UpdatePostRequest {
  post_text: string;
  visibility: string;
}
