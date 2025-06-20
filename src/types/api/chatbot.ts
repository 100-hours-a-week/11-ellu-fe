export interface ChatMessage {
  role: 'USER' | 'ASSISTANT';
  content: string;
}

export interface ChatHistoryResponse {
  history: ChatMessage[];
}
