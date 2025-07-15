import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { useRouter } from 'next/navigation';
import SignupForm from '../SignupForm';
import { getMyInfo } from '@/api/user';

jest.mock('next/navigation', () => ({
  useRouter: jest.fn(),
}));

jest.mock('@/stores/userStore', () => ({
  userStore: jest.fn((selector) => {
    const state = {
      setUser: mockSetUser,
      user: null,
      accessToken: null,
      clearAuth: jest.fn(),
    };

    if (typeof selector === 'function') {
      return selector(state);
    }

    return state;
  }),
}));

jest.mock('@/api/user', () => ({
  getMyInfo: jest.fn(),
}));

jest.mock('@/hooks/api/auth/useSignup', () => ({
  useSignup: () => ({
    mutate: mockSignupMutate,
    isPending: false,
  }),
}));

const mockPush = jest.fn();
const mockReplace = jest.fn();
const mockSetUser = jest.fn();
const mockSignupMutate = jest.fn();
const mockGetMyInfo = getMyInfo as jest.MockedFunction<typeof getMyInfo>;

const mockAlert = jest.fn();
global.alert = mockAlert;

describe('SignupForm', () => {
  beforeEach(() => {
    jest.clearAllMocks();

    (useRouter as jest.Mock).mockReturnValue({
      push: mockPush,
      replace: mockReplace,
    });
  });

  test('컴포넌트가 올바르게 렌더링된다', () => {
    render(<SignupForm />);

    expect(screen.getByText('닉네임')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /회원가입 완료/ })).toBeInTheDocument();
    expect(screen.getByText('한글, 영문, 숫자만 입력해주세요 (1~10자)')).toBeInTheDocument();
    expect(screen.getByRole('textbox')).toHaveValue('');
    expect(screen.getByRole('button')).toBeDisabled();
    expect(screen.getByRole('textbox')).toHaveAttribute('required');
  });

  test('입력값에 따른 버튼 상태 변경 체크', async () => {
    render(<SignupForm />);

    const nicknameInput = screen.getByRole('textbox');
    const submitButton = screen.getByRole('button', { name: /회원가입 완료/ });

    // 빈 값
    expect(submitButton).toBeDisabled();

    // 잘못된 값
    fireEvent.change(nicknameInput, { target: { value: 'test@invalid' } });
    await waitFor(() => {
      expect(submitButton).toBeDisabled();
    });

    // 올바른 값
    fireEvent.change(nicknameInput, { target: { value: '올바른닉네임' } });
    await waitFor(() => {
      expect(submitButton).toBeEnabled();
    });
  });

  test('회원가입 성공 시 프로젝트 페이지로 이동한다', async () => {
    const mockUser = { id: 1, nickname: '테스트닉네임', imageUrl: 'test.jpg' };
    mockGetMyInfo.mockResolvedValueOnce(mockUser);

    render(<SignupForm />);

    const nicknameInput = screen.getByRole('textbox');
    const submitButton = screen.getByRole('button', { name: /회원가입 완료/ });

    fireEvent.change(nicknameInput, { target: { value: '테스트닉네임' } });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(mockSignupMutate).toHaveBeenCalledWith('테스트닉네임', expect.any(Object));
    });

    const signupCall = mockSignupMutate.mock.calls[0];
    const callbacks = signupCall[1];
    await callbacks.onSuccess();

    expect(mockGetMyInfo).toHaveBeenCalled();
    expect(mockSetUser).toHaveBeenCalledWith(mockUser);
    expect(mockReplace).toHaveBeenCalledWith('/projects');
  });

  test('중복 닉네임으로 회원가입 시도 시 에러 메시지가 표시된다', async () => {
    render(<SignupForm />);

    const nicknameInput = screen.getByRole('textbox');
    const submitButton = screen.getByRole('button', { name: /회원가입 완료/ });

    fireEvent.change(nicknameInput, { target: { value: '중복닉네임' } });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(mockSignupMutate).toHaveBeenCalledWith('중복닉네임', expect.any(Object));
    });

    const signupCall = mockSignupMutate.mock.calls[0];
    const callbacks = signupCall[1];
    const error409 = { response: { status: 409 } };
    callbacks.onError(error409);

    await waitFor(() => {
      expect(screen.getByText('이미 사용 중인 닉네임입니다.')).toBeInTheDocument();
    });

    expect(mockReplace).not.toHaveBeenCalled();
  });

  test('회원가입 처리 중 서버 에러시 alert가 표시된다', async () => {
    render(<SignupForm />);

    const nicknameInput = screen.getByRole('textbox');
    const submitButton = screen.getByRole('button', { name: /회원가입 완료/ });

    fireEvent.change(nicknameInput, { target: { value: '테스트닉네임' } });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(mockSignupMutate).toHaveBeenCalled();
    });

    const signupCall = mockSignupMutate.mock.calls[0];
    const callbacks = signupCall[1];
    const generalError = { response: { status: 500 } };
    callbacks.onError(generalError);

    expect(mockAlert).toHaveBeenCalledWith('회원가입 처리 중 문제가 발생했습니다.');
    expect(mockReplace).not.toHaveBeenCalled();
  });

  test('회원가입 성공 후 사용자 정보 조회 실패 시 로그인 페이지로 이동한다', async () => {
    mockGetMyInfo.mockRejectedValueOnce(new Error('User info fetch failed'));

    render(<SignupForm />);

    const nicknameInput = screen.getByRole('textbox');
    const submitButton = screen.getByRole('button', { name: /회원가입 완료/ });

    fireEvent.change(nicknameInput, { target: { value: '테스트닉네임' } });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(mockSignupMutate).toHaveBeenCalled();
    });

    const signupCall = mockSignupMutate.mock.calls[0];
    const callbacks = signupCall[1];
    await callbacks.onSuccess();

    await waitFor(() => {
      expect(mockAlert).toHaveBeenCalledWith('회원가입은 완료되었지만 사용자 정보 불러오기에 실패했습니다.');
      expect(mockReplace).toHaveBeenCalledWith('/auth/login');
    });
  });
});
