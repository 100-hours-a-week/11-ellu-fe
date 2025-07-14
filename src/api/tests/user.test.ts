import { signup, getMyInfo, editMyInfo, searchUsersByNickname } from '../user';
import api from '@/config/axios';
import { User } from '@/types/api/user';

jest.mock('@/config/axios');
const mockedApi = api as jest.Mocked<typeof api>;

describe('User API', () => {
  beforeEach(() => {
    jest.clearAllMocks(); // 모든 테스트 전 모킹 상태 초기화
  });

  describe('signup', () => {
    test('POST /auth/users/nickname 엔드포인트 테스트', async () => {
      // API 응답 모킹
      mockedApi.post.mockResolvedValueOnce({ data: { data: null } });

      // 테스트 대상 함수 호출
      await signup('테스트닉네임');

      // 호출 내용 검증
      expect(mockedApi.post).toHaveBeenCalledWith('/auth/users/nickname', {
        nickname: '테스트닉네임',
      });

      // 호출 횟수 확인(1번)
      expect(mockedApi.post).toHaveBeenCalledTimes(1);
    });

    test('중복닉네임 예외처리', async () => {
      const errorResponse = new Error('409 Conflict');
      mockedApi.post.mockRejectedValueOnce(errorResponse);

      await expect(signup('중복닉네임')).rejects.toThrow('409 Conflict');

      expect(mockedApi.post).toHaveBeenCalledWith('/auth/users/nickname', {
        nickname: '중복닉네임',
      });
    });

    test('빈 문자열로 호출 시 예외처리', async () => {
      mockedApi.post.mockResolvedValueOnce({ data: { data: null } });

      await signup('');

      expect(mockedApi.post).toHaveBeenCalledWith('/auth/users/nickname', {
        nickname: '',
      });
    });
  });

  describe('getMyInfo', () => {
    test('GET /users/me 엔드포인트 테스트', async () => {
      const mockUser: User = {
        id: 1,
        nickname: '테스트사용자',
        imageUrl: 'https://example.com/profile.jpg',
      };

      mockedApi.get.mockResolvedValueOnce({
        data: { data: mockUser },
      });

      const result = await getMyInfo();

      expect(mockedApi.get).toHaveBeenCalledWith('/users/me');
      expect(result).toEqual(mockUser);
    });

    test('권한없을 시 예외처리', async () => {
      mockedApi.get.mockRejectedValueOnce(new Error('401 Unauthorized'));

      await expect(getMyInfo()).rejects.toThrow('401 Unauthorized');
    });
  });

  describe('editMyInfo', () => {
    test('PATCH /users/me 엔드포인트 테스트', async () => {
      mockedApi.patch.mockResolvedValueOnce({ data: { data: null } });

      await editMyInfo('새로운닉네임');

      expect(mockedApi.patch).toHaveBeenCalledWith('/users/me', {
        nickname: '새로운닉네임',
      });
    });

    test('잘못된 닉네임 예외처리', async () => {
      mockedApi.patch.mockRejectedValueOnce(new Error('400 Bad Request'));

      await expect(editMyInfo('잘못된닉네임')).rejects.toThrow('400 Bad Request');
    });

    test('권한없을 시 예외처리', async () => {
      mockedApi.get.mockRejectedValueOnce(new Error('401 Unauthorized'));

      await expect(editMyInfo('닉네임')).rejects.toThrow('401 Unauthorized');
    });
  });

  describe('searchUsersByNickname', () => {
    test('GET /users?query= 엔드포인트 테스트', async () => {
      const mockUsers: User[] = [
        { id: 1, nickname: '테스트1', imageUrl: 'url1' },
        { id: 2, nickname: '테스트2', imageUrl: 'url2' },
      ];

      mockedApi.get.mockResolvedValueOnce({
        data: { data: mockUsers },
      });

      const result = await searchUsersByNickname('테스트');

      expect(mockedApi.get).toHaveBeenCalledWith('/users?query=테스트');
      expect(result).toEqual(mockUsers);
    });

    test('빈 검색어로 호출 시 예외처리', async () => {
      mockedApi.get.mockResolvedValueOnce({ data: { data: [] } });

      const result = await searchUsersByNickname('');

      expect(mockedApi.get).toHaveBeenCalledWith('/users?query=');
      expect(result).toEqual([]);
    });

    test('특수문자가 포함된 검색어 예외처리', async () => {
      mockedApi.get.mockResolvedValueOnce({ data: { data: [] } });

      await searchUsersByNickname('test@#$');

      expect(mockedApi.get).toHaveBeenCalledWith('/users?query=test@#$');
    });
  });
});
