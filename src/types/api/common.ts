// 백엔드 API 표준 응답 형식
export interface ApiResponse<T> {
  message: string;
  data: T;
}
