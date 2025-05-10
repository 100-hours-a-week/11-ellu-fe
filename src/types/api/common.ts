// 백엔드 API 표준 응답 형식
export interface ApiResponse<T> {
  message: string;
  data: T;
}
// 백엔드 AI API 응답 형식
export interface AiApiResponse<T> {
  message: string;
  detail: T;
}
