'use client';

import { Box, TextField, Button, MenuItem, Typography } from '@mui/material';
import { useState } from 'react';

const positions = [
  { value: 'FE', label: 'FE개발자' },
  { value: 'BE', label: 'BE개발자' },
  { value: 'CLOUD', label: '클라우드개발자' },
  { value: 'AI', label: 'AI 개발자' },
];

const mockProjectData = {
  '1': {
    title: 'Looper 프로젝트',
    wiki: 'Looper는 AI 기반 프로젝트 일정 관리 서비스입니다. 사용자가 프로젝트의 개요를 입력하면 AI가 자동으로 일정을 계획하고 관리해줍니다. 주요 기능으로는 프로젝트 일정 자동 생성, 일정 조정, 팀원 관리 등이 있습니다.',
    position: 'FE',
  },
  '2': {
    title: '쇼핑몰 프로젝트',
    wiki: '온라인 쇼핑몰 프로젝트입니다. 사용자 인증, 상품 관리, 장바구니, 결제 시스템 등을 구현합니다. React와 Node.js를 사용하여 개발하며, MongoDB를 데이터베이스로 사용합니다.',
    position: 'BE',
  },
};

interface ProjectInfoFormProps {
  id?: string;
}

export default function ProjectInfoForm({ id }: ProjectInfoFormProps) {
  console;
  const [formData, setFormData] = useState(() => {
    if (id && mockProjectData[id as keyof typeof mockProjectData]) {
      return mockProjectData[id as keyof typeof mockProjectData];
    }
    return {
      title: '',
      wiki: '',
      position: '',
    };
  });

  const [errors, setErrors] = useState({
    title: '',
    wiki: '',
    position: '',
  });

  const validateTitle = (value: string) => {
    if (value.length < 1 || value.length > 10) return '최소 1자, 최대 10자이내로 입력해주세요';
    if (!/^[가-힣a-zA-Z0-9\s]+$/.test(value)) return '한글, 영문, 숫자만 입력 가능합니다';
    return '';
  };

  const validateWiki = (value: string) => {
    if (value.length < 50) return '최소 50자 이상 입력해주세요';
    if (value.length > 1000) return '최대 1000자까지 입력 가능합니다';
    return '';
  };

  const validatePosition = (value: string) => {
    if (!value) return '포지션을 선택해주세요';
    return '';
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    if (name === 'title') {
      setErrors((prev) => ({
        ...prev,
        title: validateTitle(value),
      }));
    } else if (name === 'wiki') {
      setErrors((prev) => ({
        ...prev,
        wiki: validateWiki(value),
      }));
    } else if (name === 'position') {
      setErrors((prev) => ({
        ...prev,
        position: validatePosition(value),
      }));
    }
  };

  const isFormValid = () => {
    return !errors.title && !errors.wiki && !errors.position && formData.title.length >= 1 && formData.wiki.length >= 50 && formData.position !== '';
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log(formData);
  };

  return (
    <Box
      component="form"
      onSubmit={handleSubmit}
      sx={{
        display: 'flex',
        flexDirection: 'column',
        width: '60%',
        minWidth: '400px',
        '& .MuiFormHelperText-root': {
          position: 'absolute',
          bottom: '-20px',
          margin: 0,
        },
        '& .MuiTextField-root': {
          marginBottom: '40px',
          position: 'relative',
        },
      }}
    >
      <Typography variant="subtitle1" sx={{ fontSize: '1rem', fontWeight: 600, mb: 2 }}>
        생성할 프로젝트의 이름
      </Typography>
      <TextField
        label="프로젝트 이름"
        name="title"
        value={formData.title}
        onChange={handleChange}
        fullWidth
        required
        error={!!errors.title}
        helperText={errors.title}
        inputProps={{ maxLength: 10 }}
        sx={{ width: '50%', minWidth: '300px' }}
      />

      <Typography variant="subtitle1" sx={{ fontSize: '1rem', fontWeight: 600, mb: 0 }}>
        프로젝트 개요를 입력해주세요(깃허브 wiki, readme의 내용 등)
      </Typography>
      <Typography variant="subtitle2" sx={{ fontSize: '0.8rem', color: 'text.secondary', mb: 2 }}>
        프로젝트에 대한 자세한 설명이 있을 수록 Looper가 더욱 꼼꼼한 일정을 짜드릴 수 있어요
      </Typography>
      <TextField
        label="프로젝트 개요"
        name="wiki"
        value={formData.wiki}
        onChange={handleChange}
        multiline
        rows={6}
        fullWidth
        required
        error={!!errors.wiki}
        helperText={errors.wiki}
        inputProps={{ maxLength: 1000 }}
      />

      <Typography variant="subtitle1" sx={{ fontSize: '1rem', fontWeight: 600, mb: 2 }}>
        프로젝트에서 당신의 포지션을 선택해주세요
      </Typography>
      <TextField
        select
        label="포지션"
        name="position"
        value={formData.position}
        onChange={handleChange}
        fullWidth
        required
        error={!!errors.position}
        helperText={errors.position}
        sx={{ width: '20%', minWidth: '150px' }}
      >
        {positions.map((option) => (
          <MenuItem key={option.value} value={option.value}>
            {option.label}
          </MenuItem>
        ))}
      </TextField>

      <Button type="submit" variant="contained" color="primary" sx={{ mt: 1, height: '50px' }} disabled={!isFormValid()}>
        {id ? '프로젝트 수정' : '프로젝트 생성'}
      </Button>
    </Box>
  );
}
