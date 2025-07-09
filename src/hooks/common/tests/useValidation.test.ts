import { renderHook, act } from '@testing-library/react';
import { useValidation } from '../useValidation';

describe('useValidation Hook', () => {
  test('초기 상태에서는 에러가 없어야 한다', () => {
    const { result } = renderHook(() => useValidation());

    expect(result.current.errors).toEqual({});
    expect(result.current.hasErrors()).toBe(false);
  });

  test('validateField - 유효하지 않은 값일 때 에러 설정', () => {
    const { result } = renderHook(() => useValidation());

    act(() => {
      const isValid = result.current.validateField('title', '', 'projectTitle');
      expect(isValid).toBe(false);
    });

    expect(result.current.errors.title).toBe('최소 1자, 최대 10자이내로 입력해주세요');
    expect(result.current.hasErrors()).toBe(true);
  });

  test('validateField - 유효한 값일 때 에러 제거', () => {
    const { result } = renderHook(() => useValidation());

    act(() => {
      result.current.validateField('title', '', 'projectTitle');
    });
    expect(result.current.hasErrors()).toBe(true);

    act(() => {
      const isValid = result.current.validateField('title', '테스트', 'projectTitle');
      expect(isValid).toBe(true);
    });

    expect(result.current.errors.title).toBe('');
    expect(result.current.hasErrors()).toBe(false);
  });

  test('여러 필드 동시 검증', () => {
    const { result } = renderHook(() => useValidation());

    act(() => {
      result.current.validateField('title', '', 'projectTitle');
      result.current.validateField('nickname', 'very_long_nickname_test', 'nickname');
    });

    expect(result.current.errors.title).toBe('최소 1자, 최대 10자이내로 입력해주세요');
    expect(result.current.errors.nickname).toBe('닉네임은 최대 10자까지 가능합니다.');
    expect(result.current.hasErrors()).toBe(true);
  });

  test('setError - 수동으로 에러 설정', () => {
    const { result } = renderHook(() => useValidation());

    act(() => {
      result.current.setError('customField', '커스텀 에러 메시지');
    });

    expect(result.current.errors.customField).toBe('커스텀 에러 메시지');
    expect(result.current.hasErrors()).toBe(true);
  });

  test('기존 에러가 있는 상태에서 새로운 필드 검증', () => {
    const { result } = renderHook(() => useValidation());

    act(() => {
      result.current.validateField('title', '', 'projectTitle');
    });

    act(() => {
      result.current.validateField('url', 'invalid-url', 'url');
    });

    expect(result.current.errors.title).toBe('최소 1자, 최대 10자이내로 입력해주세요');
    expect(result.current.errors.url).toBe('올바른 URL 형식이 아닙니다');
    expect(result.current.hasErrors()).toBe(true);
  });

  test('scheduleTitle 검증', () => {
    const { result } = renderHook(() => useValidation());

    act(() => {
      const isValid = result.current.validateField('scheduleTitle', 'a'.repeat(31), 'scheduleTitle');
      expect(isValid).toBe(false);
    });

    expect(result.current.errors.scheduleTitle).toBe('제목은 30자 이하여야 합니다.');
    expect(result.current.hasErrors()).toBe(true);
  });

  test('required 검증', () => {
    const { result } = renderHook(() => useValidation());

    act(() => {
      const isValid = result.current.validateField('position', '', 'required');
      expect(isValid).toBe(false);
    });

    expect(result.current.errors.position).toBe('값을(를) 입력해주세요.');
    expect(result.current.hasErrors()).toBe(true);
  });
});
