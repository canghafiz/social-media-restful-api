export class ApiResponse<T = unknown> {
  success: boolean;
  code: number;
  data?: T | null;
}
