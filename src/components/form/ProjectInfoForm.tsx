'use client';

import {
  Box,
  TextField,
  Button,
  MenuItem,
  Typography,
  CircularProgress,
  Alert,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Tooltip,
} from '@mui/material';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { ProjectFormData } from '@/types/api/project';
import { User } from '@/types/api/user';
import { useCreateProject } from '@/hooks/api/projects/useCreateProject';
import { useEditProject } from '@/hooks/api/projects/useEditProject';
import { useGetProjectById } from '@/hooks/api/projects/useGetProjectById';
import AddIcon from '@mui/icons-material/Add';
import CloseIcon from '@mui/icons-material/Close';
import CachedIcon from '@mui/icons-material/Cached';
import InviteTeamMemberModal from '../projects/InviteTeamMemberModal';
import styles from './ProjectInfoForm.module.css';

const positions = [
  { value: 'FE', label: 'FE 개발자' },
  { value: 'BE', label: 'BE 개발자' },
  { value: 'CLOUD', label: '클라우드개발자' },
  { value: 'AI', label: 'AI 개발자' },
];

const colorOptions = [
  { value: 'FEC178', label: '노랑' },
  { value: 'FFDDB4', label: '연한 노랑' },
  { value: 'FFB9B4', label: '핑크' },
  { value: 'FFD9D7', label: '연한 핑크' },
  { value: 'ECCAC5', label: '라일락' },
];

export default function ProjectInfoForm({ id }: { id?: string }) {
  const router = useRouter();
  const isEditMode = !!id; // id가 있으면 수정 모드
  const projectId = isEditMode ? Number(id) : undefined;

  const { mutate: createProject, isPending: isCreating } = useCreateProject();
  const { mutate: editProject, isPending: isEditing } = useEditProject();
  const { data: projectData, isLoading: isLoadingProject, error: fetchError } = useGetProjectById(projectId as number);

  const isLoading = isCreating || isEditing;

  const [formData, setFormData] = useState<ProjectFormData>({
    title: '',
    wiki: '',
    position: '',
    color: 'FEC178',
    added_members: [],
  });
  const [errors, setErrors] = useState({
    title: '',
    wiki: '',
    position: '',
    color: '',
  });
  const [openInviteModal, setOpenInviteModal] = useState(false);
  const [openRemoveModal, setOpenRemoveModal] = useState(false);
  const [memberToRemove, setMemberToRemove] = useState<number | null>(null);
  const [isRotating, setIsRotating] = useState(false);

  // 기존 프로젝트 데이터 불러오기
  useEffect(() => {
    if (isEditMode && projectData) {
      console.log(projectData);
      setFormData({
        title: projectData.title,
        wiki: projectData.wiki || '',
        position: projectData.position || '',
        color: projectData.color || 'FEC178',
        added_members: projectData.added_members,
      });
    }
  }, [isEditMode, projectData]);

  // url 형식 정규식
  const urlPattern = /^(https?:\/\/)?([\da-z\.-]+)\.([a-z\.]{2,6})([\/\w \.-]*)*\/?$/;

  // 유효성 검사 함수
  const validateTitle = (value: string) => {
    if (value.length < 1 || value.length > 10) return '최소 1자, 최대 10자이내로 입력해주세요';
    if (!/^[가-힣a-zA-Z0-9\s]+$/.test(value)) return '한글, 영문, 숫자만 입력 가능합니다';
    return '';
  };
  const validateWiki = (value: string) => {
    if (!urlPattern.test(value)) return '올바른 URL 형식이 아닙니다';
    return '';
  };
  const validatePosition = (value: string) => {
    if (!value) return '포지션을 선택해주세요';
    return '';
  };
  const validateColor = (value: string) => {
    if (!value) return '색상을 선택해주세요';
    return '';
  };

  // 폼 유효성 검사
  const isFormValid = () => {
    return (
      !errors.title &&
      !errors.wiki &&
      !errors.position &&
      formData.title.length >= 1 &&
      urlPattern.test(formData.wiki) &&
      formData.position !== '' &&
      formData.color !== ''
    );
  };

  // 입력 변경 핸들러
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
    } else if (name === 'color') {
      setErrors((prev) => ({
        ...prev,
        color: validateColor(value),
      }));
    }
  };

  // 폼 제출 핸들러
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (isEditMode) {
      // 수정 모드
      editProject(
        {
          projectId: Number(id),
          data: formData,
        },
        {
          onSuccess: () => {
            alert('프로젝트가 수정되었습니다.');
            router.push('/projects');
          },
          onError: (error) => {
            alert('프로젝트 수정에 실패했습니다');
          },
        }
      );
    } else {
      // 생성 모드
      createProject(formData, {
        onSuccess: () => {
          alert('프로젝트가 생성되었습니다.');
          router.push('/projects');
        },
        onError: (error) => {
          alert('프로젝트 생성에 실패했습니다');
        },
      });
    }
  };

  const handleOpenInviteModal = () => {
    setOpenInviteModal(true);
  };

  const handleCloseInviteModal = () => {
    setOpenInviteModal(false);
  };

  const handleSaveInvitedMembers = (invitedMembers: User[]) => {
    console.log(formData.added_members, invitedMembers);
    if (formData.added_members.length + invitedMembers.length > 7) {
      alert('프로젝트 멤버는 최대 7명까지만 추가할 수 있습니다.');
      return;
    }

    const hasDuplicate = invitedMembers.some((invitedMember) =>
      formData.added_members.some((existingMember) => existingMember.id === invitedMember.id)
    );

    if (hasDuplicate) {
      alert('이미 초대된 멤버가 있습니다.');
      return;
    }

    const membersWithPosition = invitedMembers.map((member) => ({
      id: member.id,
      nickname: member.nickname,
      profileImageUrl: member.imageUrl,
      position: 'FE', // 모든 멤버의 포지션을 FE로 설정
    }));

    setFormData((prev) => ({
      ...prev,
      added_members: [...prev.added_members, ...membersWithPosition],
    }));
  };

  const handleRemoveMember = (memberId: number) => {
    if (isEditMode && projectData) {
      setMemberToRemove(memberId);
      setOpenRemoveModal(true);
    } else {
      setFormData((prev) => ({
        ...prev,
        added_members: prev.added_members.filter((member) => member.id !== memberId),
      }));
    }
  };

  const handleConfirmRemove = () => {
    if (memberToRemove) {
      setFormData((prev) => ({
        ...prev,
        added_members: prev.added_members.filter((member) => member.id !== memberToRemove),
      }));
      setOpenRemoveModal(false);
      setMemberToRemove(null);
    }
  };

  const handleCancelRemove = () => {
    setOpenRemoveModal(false);
    setMemberToRemove(null);
  };

  const handlePositionChange = (memberId: number, position: string) => {
    setFormData((prev) => ({
      ...prev,
      added_members: prev.added_members.map((member) => (member.id === memberId ? { ...member, position } : member)),
    }));
  };

  // 프로젝트 개요 URL 동기화
  const handleSyncClick = () => {
    if (!urlPattern.test(formData.wiki)) {
      return;
    }
    setIsRotating(true);
    editProject(
      {
        projectId: Number(id),
        data: formData,
      },
      {
        onSuccess: () => {
          setTimeout(() => {
            setIsRotating(false);
          }, 3000);
        },
        onError: (error) => {
          console.log('동기화에 실패했습니다');
        },
      }
    );
  };

  // 프로젝트 정보 불러오기 로딩
  if (isEditMode && isLoadingProject) {
    return (
      <Box className={styles.loadingContainer}>
        <CircularProgress />
      </Box>
    );
  }
  // 프로젝트 정보 불러오기 실패
  if (isEditMode && fetchError) {
    return (
      <Box className={styles.errorContainer}>
        <Alert severity="error" className={styles.errorAlert}>
          프로젝트 정보를 불러오는데 실패했습니다:
        </Alert>
      </Box>
    );
  }

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
        {isEditMode ? '수정할' : '생성할'} 프로젝트의 이름
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
        disabled={isLoading}
        sx={{ width: '50%', minWidth: '300px' }}
      />

      <Typography variant="subtitle1" sx={{ fontSize: '1rem', fontWeight: 600, mb: 2 }}>
        프로젝트의 색상을 설정해주세요
      </Typography>
      <TextField
        select
        label="색상"
        name="color"
        value={formData.color}
        onChange={handleChange}
        error={!!errors.color}
        helperText={errors.color}
        required
        disabled={isLoading}
        sx={{ width: '160px', minWidth: '160px', mb: 4 }}
      >
        {colorOptions.map((option) => (
          <MenuItem key={option.value} value={option.value}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <Box
                sx={{
                  width: 20,
                  height: 20,
                  backgroundColor: `#${option.value}`,
                  borderRadius: '50%',
                  border: '1px solid #ddd',
                }}
              />
              {option.label}
            </Box>
          </MenuItem>
        ))}
      </TextField>

      <Typography variant="subtitle1" sx={{ fontSize: '1rem', fontWeight: 600, mb: 0 }}>
        프로젝트 개요를 입력해주세요(깃허브 wiki, readme의 내용 등)
      </Typography>
      <Typography variant="subtitle2" sx={{ fontSize: '0.8rem', color: 'text.secondary', mb: 3 }}>
        프로젝트에 대한 자세한 설명이 있을 수록 Looper가 더욱 꼼꼼한 일정을 짜드릴 수 있어요
      </Typography>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
        <TextField
          label="프로젝트 개요 URL"
          name="wiki"
          value={formData.wiki}
          onChange={handleChange}
          required
          error={!!errors.wiki}
          helperText={errors.wiki}
          disabled={isLoading}
          sx={{ width: '70%', minWidth: '400px' }}
        />
        {isEditMode && (
          <Tooltip title="동기화" placement="bottom">
            <IconButton
              sx={{
                mt: -5,
                ml: 1,
                border: '1px solid #e0e0e0',
                '&:hover': {
                  backgroundColor: 'rgba(0, 0, 0, 0.04)',
                },
              }}
              onClick={handleSyncClick}
            >
              <CachedIcon className={isRotating ? styles.rotating : ''} />
            </IconButton>
          </Tooltip>
        )}
      </Box>

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
        disabled={isLoading}
      >
        {positions.map((option) => (
          <MenuItem key={option.value} value={option.value}>
            {option.label}
          </MenuItem>
        ))}
      </TextField>

      <Typography
        variant="subtitle1"
        sx={{ fontSize: '1rem', fontWeight: 600, mb: 2, display: 'flex', alignItems: 'center', gap: 1 }}
      >
        프로젝트에 초대할 팀원을 선택해주세요
        {formData.added_members && formData.added_members.length > 0 ? (
          <IconButton onClick={handleOpenInviteModal} className={styles.addButton}>
            <AddIcon />
          </IconButton>
        ) : null}
      </Typography>
      <Box className={styles.memberListContainer}>
        {formData.added_members && formData.added_members.length > 0 ? (
          <Box className={styles.memberList}>
            {formData.added_members.map((member) => (
              <Box key={member.id} className={styles.memberItem}>
                <Box className={styles.memberInfo}>
                  {member.profileImageUrl && (
                    <Box
                      component="img"
                      src={member.profileImageUrl}
                      alt={member.nickname}
                      className={styles.memberImage}
                    />
                  )}
                  <Typography variant="body2" className={styles.memberName}>
                    {member.nickname}
                  </Typography>
                </Box>
                <Box className={styles.controlsContainer}>
                  <TextField
                    select
                    value={member.position || ''}
                    onChange={(e) => handlePositionChange(member.id, e.target.value)}
                    className={styles.positionSelect}
                    size="small"
                  >
                    {positions.map((option) => (
                      <MenuItem key={option.value} value={option.value}>
                        {option.label}
                      </MenuItem>
                    ))}
                  </TextField>
                  <IconButton
                    size="small"
                    onClick={() => handleRemoveMember(member.id)}
                    className={styles.removeButton}
                  >
                    <CloseIcon fontSize="small" />
                  </IconButton>
                </Box>
              </Box>
            ))}
          </Box>
        ) : (
          <Box className={styles.addButtonContainer}>
            <IconButton onClick={handleOpenInviteModal} className={styles.addButton}>
              <AddIcon />
            </IconButton>
          </Box>
        )}
      </Box>

      <InviteTeamMemberModal
        open={openInviteModal}
        onClose={handleCloseInviteModal}
        onSave={handleSaveInvitedMembers}
      />

      <Dialog open={openRemoveModal} onClose={handleCancelRemove} aria-labelledby="remove-member-dialog-title">
        <DialogTitle id="remove-member-dialog-title">정말로 이 멤버를 프로젝트에서 제거하시겠습니까?</DialogTitle>
        <DialogContent>
          <Typography>해당 팀원이 프로젝트에서 추방됩니다.</Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCancelRemove} color="primary">
            취소
          </Button>
          <Button onClick={handleConfirmRemove} color="error" autoFocus>
            제거
          </Button>
        </DialogActions>
      </Dialog>

      <Button
        type="submit"
        variant="contained"
        color="primary"
        sx={{ mt: 1, height: '50px' }}
        disabled={!isFormValid() || isLoading}
      >
        {isLoading ? '처리 중...' : isEditMode ? '프로젝트 수정' : '프로젝트 생성'}
      </Button>
    </Box>
  );
}
