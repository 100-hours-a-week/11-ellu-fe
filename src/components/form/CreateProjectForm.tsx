'use client';

import { Box, TextField, Button, MenuItem, Typography } from '@mui/material';
import { useState } from 'react';

const positions = [
  { value: 'FE', label: 'FE개발자' },
  { value: 'BE', label: 'BE개발자' },
  { value: 'CLOUD', label: '클라우드개발자' },
  { value: 'AI', label: 'AI 개발자' },
];

export default function CreateProjectForm() {
  const [formData, setFormData] = useState({
    projectName: '',
    projectDescription: '',
    position: '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log(formData);
  };

  return (
    <Box component="form" onSubmit={handleSubmit} sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
      <Typography variant="h6">프로젝트 생성</Typography>

      <TextField label="프로젝트 이름" name="projectName" value={formData.projectName} onChange={handleChange} fullWidth required />

      <TextField
        label="프로젝트 개요"
        name="projectDescription"
        value={formData.projectDescription}
        onChange={handleChange}
        multiline
        rows={4}
        fullWidth
        required
      />

      <TextField select label="포지션" name="position" value={formData.position} onChange={handleChange} fullWidth required>
        {positions.map((option) => (
          <MenuItem key={option.value} value={option.value}>
            {option.label}
          </MenuItem>
        ))}
      </TextField>

      <Button type="submit" variant="contained" color="primary" sx={{ mt: 2 }}>
        프로젝트 생성
      </Button>
    </Box>
  );
}
