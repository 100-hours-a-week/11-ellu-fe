import { validationRules } from '../validateRules';

describe('validationRules 테스트', () => {
  describe('scheduleTitle', () => {
    test('빈 문자열일 때 실패', () => {
      const result = validationRules.scheduleTitle('');
      expect(result.isValid).toBe(false);
      expect(result.message).toBe('제목을 입력해주세요.');
    });

    test('null일 때 실패', () => {
      const result = validationRules.scheduleTitle(null as any);
      expect(result.isValid).toBe(false);
      expect(result.message).toBe('제목을 입력해주세요.');
    });

    test('undefined일 때 실패', () => {
      const result = validationRules.scheduleTitle(undefined as any);
      expect(result.isValid).toBe(false);
      expect(result.message).toBe('제목을 입력해주세요.');
    });

    test('31자일 때 실패', () => {
      const longTitle = 'a'.repeat(31);
      const result = validationRules.scheduleTitle(longTitle);
      expect(result.isValid).toBe(false);
      expect(result.message).toBe('제목은 30자 이하여야 합니다.');
    });

    test('정상 제목일 때 성공', () => {
      const result = validationRules.scheduleTitle('정상 제목');
      expect(result.isValid).toBe(true);
      expect(result.message).toBe('');
    });

    test('30자 경계값 성공', () => {
      const result = validationRules.scheduleTitle('a'.repeat(30));
      expect(result.isValid).toBe(true);
      expect(result.message).toBe('');
    });
  });

  describe('scheduleDescription', () => {
    test('101자 초과일 때 실패', () => {
      const longDesc = 'a'.repeat(101);
      const result = validationRules.scheduleDescription(longDesc);
      expect(result.isValid).toBe(false);
      expect(result.message).toBe('할일은 100자 이하여야 합니다.');
    });

    test('빈 문자열일 때 성공', () => {
      const result = validationRules.scheduleDescription('');
      expect(result.isValid).toBe(true);
      expect(result.message).toBe('');
    });

    test('100자 이하일 때 성공', () => {
      const result = validationRules.scheduleDescription('a'.repeat(50));
      expect(result.isValid).toBe(true);
      expect(result.message).toBe('');
    });
  });

  describe('projectTitle', () => {
    test('빈 문자열일 때 실패', () => {
      const result = validationRules.projectTitle('');
      expect(result.isValid).toBe(false);
      expect(result.message).toBe('최소 1자, 최대 10자이내로 입력해주세요');
    });

    test('11자일 때 실패', () => {
      const result = validationRules.projectTitle('일이삼사오육칠팔구십일');
      expect(result.isValid).toBe(false);
      expect(result.message).toBe('최소 1자, 최대 10자이내로 입력해주세요');
    });

    test('특수문자 포함 시 실패', () => {
      const result = validationRules.projectTitle('테스트@');
      expect(result.isValid).toBe(false);
      expect(result.message).toBe('한글, 영문, 숫자만 입력 가능합니다');
    });

    test('이모지 포함 시 실패', () => {
      const result = validationRules.projectTitle('테스트😀');
      expect(result.isValid).toBe(false);
      expect(result.message).toBe('한글, 영문, 숫자만 입력 가능합니다');
    });

    test('한글만 성공', () => {
      const result = validationRules.projectTitle('테스트');
      expect(result.isValid).toBe(true);
      expect(result.message).toBe('');
    });

    test('영문만 성공', () => {
      const result = validationRules.projectTitle('test');
      expect(result.isValid).toBe(true);
      expect(result.message).toBe('');
    });

    test('숫자만 성공', () => {
      const result = validationRules.projectTitle('123');
      expect(result.isValid).toBe(true);
      expect(result.message).toBe('');
    });

    test('공백 포함 성공', () => {
      const result = validationRules.projectTitle('테스트 123');
      expect(result.isValid).toBe(true);
      expect(result.message).toBe('');
    });
  });

  describe('url', () => {
    test('잘못된 URL 형식 실패', () => {
      const result = validationRules.url('invalid-url');
      expect(result.isValid).toBe(false);
      expect(result.message).toBe('올바른 URL 형식이 아닙니다');
    });

    test('빈 문자열 실패', () => {
      const result = validationRules.url('');
      expect(result.isValid).toBe(false);
      expect(result.message).toBe('올바른 URL 형식이 아닙니다');
    });

    test('공백만 있을 때 실패', () => {
      const result = validationRules.url('   ');
      expect(result.isValid).toBe(false);
      expect(result.message).toBe('올바른 URL 형식이 아닙니다');
    });

    test('https URL 성공', () => {
      const result = validationRules.url('https://github.com/test');
      expect(result.isValid).toBe(true);
      expect(result.message).toBe('');
    });

    test('http URL 성공', () => {
      const result = validationRules.url('http://example.com');
      expect(result.isValid).toBe(true);
      expect(result.message).toBe('');
    });

    test('프로토콜 없는 URL 성공', () => {
      const result = validationRules.url('github.com');
      expect(result.isValid).toBe(true);
      expect(result.message).toBe('');
    });
  });

  describe('nickname', () => {
    test('빈 문자열 실패', () => {
      const result = validationRules.nickname('');
      expect(result.isValid).toBe(false);
      expect(result.message).toBe('닉네임을 입력해주세요.');
    });

    test('공백만 있을 때 실패', () => {
      const result = validationRules.nickname('   ');
      expect(result.isValid).toBe(false);
      expect(result.message).toBe('닉네임을 입력해주세요.');
    });

    test('11자 초과 실패', () => {
      const result = validationRules.nickname('abcdefghijk');
      expect(result.isValid).toBe(false);
      expect(result.message).toBe('닉네임은 최대 10자까지 가능합니다.');
    });

    test('허용되지 않는 특수문자 실패', () => {
      const result = validationRules.nickname('test@');
      expect(result.isValid).toBe(false);
      expect(result.message).toBe('닉네임은 . , _ 를 포함한 한글, 영문 또는 숫자만 사용할 수 있습니다.');
    });

    test('공백 포함 실패', () => {
      const result = validationRules.nickname('test name');
      expect(result.isValid).toBe(false);
      expect(result.message).toBe('닉네임은 . , _ 를 포함한 한글, 영문 또는 숫자만 사용할 수 있습니다.');
    });

    test('정상 닉네임 성공', () => {
      const result = validationRules.nickname('테스트');
      expect(result.isValid).toBe(true);
      expect(result.message).toBe('');
    });

    test('허용되는 특수문자 포함 성공', () => {
      const result = validationRules.nickname('user.123');
      expect(result.isValid).toBe(true);
      expect(result.message).toBe('');
    });
  });

  describe('required', () => {
    test('빈 문자열 실패', () => {
      const result = validationRules.required('', '테스트');
      expect(result.isValid).toBe(false);
      expect(result.message).toBe('테스트을(를) 입력해주세요.');
    });

    test('null 실패', () => {
      const result = validationRules.required(null as any, '테스트');
      expect(result.isValid).toBe(false);
      expect(result.message).toBe('테스트을(를) 입력해주세요.');
    });

    test('공백만 있을 때 실패', () => {
      const result = validationRules.required('   ', '테스트');
      expect(result.isValid).toBe(false);
      expect(result.message).toBe('테스트을(를) 입력해주세요.');
    });

    test('기본 fieldName 사용', () => {
      const result = validationRules.required('');
      expect(result.isValid).toBe(false);
      expect(result.message).toBe('값을(를) 입력해주세요.');
    });

    test('정상 값 성공', () => {
      const result = validationRules.required('테스트값', '테스트');
      expect(result.isValid).toBe(true);
      expect(result.message).toBe('');
    });
  });
});
