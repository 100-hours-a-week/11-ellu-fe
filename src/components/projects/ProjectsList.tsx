'use client';

import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Avatar,
  Stack,
  Typography,
  IconButton,
  Button,
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import CalendarIcon from '@mui/icons-material/CalendarMonth';
import { Project } from '@/types/api/project';
import Link from 'next/link';

interface Props {
  projects: Project[];
}

export default function ProjectTable({ projects }: Props) {
  return (
    <TableContainer component={Paper} sx={{ height: '85%', maxHeight: '85%' }}>
      <Table aria-label="project table">
        <TableHead sx={{ backgroundColor: '#528ad3' }}>
          <TableRow>
            <TableCell sx={{ width: '30%', color: 'white' }}>프로젝트명</TableCell>
            <TableCell sx={{ width: '70%', color: 'white' }}>멤버</TableCell>
            <TableCell />
          </TableRow>
        </TableHead>
        <TableBody>
          {projects.map((project) => (
            <TableRow key={project.id}>
              <TableCell component="th" scope="row">
                <Stack direction="row" alignItems="center" spacing={1}>
                  <div
                    style={{
                      width: 12,
                      height: 12,
                      borderRadius: '50%',
                      backgroundColor: project.color,
                      border: '1px solid #ccc',
                    }}
                  />
                  <Typography variant="body1">{project.title}</Typography>
                </Stack>
              </TableCell>
              <TableCell>
                <Stack direction="row" spacing={1}>
                  {project.members.map((member) => (
                    <Avatar key={member.nickname} alt={member.nickname} src={member.profile_image_url} sx={{ width: 32, height: 32 }} />
                  ))}
                </Stack>
              </TableCell>
              <TableCell>
                <Stack direction="row" spacing={1} alignItems="center">
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
                  <Link href={`/projects/${project.id}/edit`}>
                    <IconButton aria-label="수정하기" size="small">
                      <EditIcon fontSize="small" />
                    </IconButton>
                  </Link>
                  <Link href={`/projects/${project.id}/delete`}>
                    <IconButton aria-label="삭제하기" size="small">
                      <DeleteIcon fontSize="small" />
                    </IconButton>
                  </Link>
                </Stack>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}
