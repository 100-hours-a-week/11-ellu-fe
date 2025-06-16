'use client';

import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Tooltip,
  Paper,
  Avatar,
  Stack,
  Typography,
  IconButton,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  CircularProgress,
  Box,
  Alert,
  AvatarGroup,
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import CalendarIcon from '@mui/icons-material/CalendarMonth';
import RefreshIcon from '@mui/icons-material/Refresh';
import { Project } from '@/types/api/project';
import Link from 'next/link';
import Image from 'next/image';
import { useState } from 'react';
import { useDeleteProject } from '@/hooks/api/projects/useDeleteProject';
import { useGetProjects } from '@/hooks/api/projects/useGetProjects';
import style from './ProjectsList.module.css';
import { userStore } from '@/stores/userStore';

export default function ProjectsList() {
  const [open, setOpen] = useState(false);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);

  const { user } = userStore();

  const { data: projects, isLoading, isError, error, refetch } = useGetProjects();
  const { mutate: deleteProject } = useDeleteProject();

  const handleClickOpen = (project: Project) => {
    setSelectedProject(project);
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setSelectedProject(null);
  };

  const handleDelete = () => {
    if (selectedProject) {
      deleteProject(selectedProject.id, {
        onSuccess: () => {
          handleClose();
        },
        onError: (error) => {
          alert(`삭제 실패: ${error.response?.data?.message || '알 수 없는 오류가 발생했습니다.'}`);
          handleClose();
        },
      });
    }
  };

  if (isLoading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" height="60%">
        <CircularProgress sx={{ scale: '1.5' }} />
      </Box>
    );
  }

  console.log(projects);

  if (isError) {
    return (
      <Box display="flex" flexDirection="column" alignItems="center" justifyContent="center" height="60%" gap={2}>
        <Alert severity="error">
          프로젝트 목록을 불러오는 중 오류가 발생했습니다.
          {error instanceof Error && `: ${error.message}`}
        </Alert>
        <Button variant="outlined" onClick={() => refetch()} startIcon={<RefreshIcon />}>
          다시 시도
        </Button>
      </Box>
    );
  }

  if (!projects || projects.length === 0) {
    return (
      <Link href="/projects/create" className={style.noProject}>
        <Image src="/images/createproject.svg" alt="프로젝트 없음" width={270} height={270} />
        <div>
          프로젝트를 추가하여 <br /> Looper를 시작해보세요!
        </div>
      </Link>
    );
  }

  return (
    <div className={style.container}>
      <TableContainer component={Paper} sx={{ height: '95%' }}>
        <Table aria-label="project table">
          <TableHead sx={{ backgroundColor: '#528ad3' }}>
            <TableRow>
              <TableCell sx={{ width: '30%', color: 'white' }}>프로젝트명</TableCell>
              <TableCell sx={{ width: '70%', color: 'white' }}>팀원</TableCell>
              <TableCell />
            </TableRow>
          </TableHead>
          <TableBody>
            {projects?.map((project) => (
              <TableRow key={project.id}>
                <TableCell component="th" scope="row">
                  <Stack direction="row" alignItems="center" spacing={1}>
                    <div
                      style={{
                        width: 12,
                        height: 12,
                        borderRadius: '50%',
                        backgroundColor: `#${project.color}`,
                        border: '1px solid #ccc',
                      }}
                    />
                    <Typography variant="body1" className={style.projectTitle}>
                      {project.title}
                    </Typography>
                  </Stack>
                </TableCell>
                <TableCell>
                  <Stack direction="row" spacing={1} className={style.membersContainer}>
                    <AvatarGroup spacing="small">
                      {project.members.map((member) => (
                        <Tooltip title={member.nickname} key={member.nickname} arrow>
                          <Avatar
                            alt={member.nickname}
                            src={member.profileImageUrl}
                            sx={{ width: 40, height: 40, bgcolor: 'gray' }}
                          />
                        </Tooltip>
                      ))}
                    </AvatarGroup>
                  </Stack>
                </TableCell>
                <TableCell>
                  <Stack direction="row" spacing={1} alignItems="center" justifyContent="flex-end">
                    <Link href={`/projects/${project.id}/meetnote`}>
                      <Button
                        variant="contained"
                        size="small"
                        sx={{
                          width: 90,
                          color: 'black',
                          backgroundColor: '#e8f9ff',
                        }}
                      >
                        회의록 추가
                      </Button>
                    </Link>
                    <Link href={`/projects/${project.id}`}>
                      <IconButton aria-label="일정보기" size="small">
                        <CalendarIcon />
                      </IconButton>
                    </Link>
                    {project.members[0].nickname === user?.nickname && (
                      <>
                        <Link href={`/projects/${project.id}/edit`}>
                          <IconButton aria-label="수정하기" size="small">
                            <EditIcon fontSize="small" />
                          </IconButton>
                        </Link>
                        <IconButton aria-label="삭제하기" size="small" onClick={() => handleClickOpen(project)}>
                          <DeleteIcon fontSize="small" />
                        </IconButton>
                      </>
                    )}
                  </Stack>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Dialog
        open={open}
        onClose={handleClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">프로젝트 삭제</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            정말로 "{selectedProject?.title}" 프로젝트를 삭제하시겠습니까? <br />이 작업은 되돌릴 수 없습니다.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>취소</Button>
          <Button onClick={handleDelete}>삭제</Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}
