"use client";

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
  Box,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import VisibilityIcon from "@mui/icons-material/Visibility";
import { Project } from "@/types/api/project";

interface Props {
  projects: Project[];
}

export default function ProjectTable({ projects }: Props) {
  return (
    <TableContainer component={Paper} sx={{ height: "90%" }}>
      <Table aria-label="project table">
        <TableHead sx={{ backgroundColor: "#528ad3" }}>
          <TableRow>
            <TableCell sx={{ width: "30%", color: "white" }}>
              프로젝트명
            </TableCell>
            <TableCell sx={{ width: "70%", color: "white" }}>멤버</TableCell>
            <TableCell />
          </TableRow>
        </TableHead>
        <TableBody>
          {projects.map((project) => (
            <TableRow key={project.title}>
              <TableCell component="th" scope="row">
                <Stack direction="row" alignItems="center" spacing={1}>
                  <div
                    style={{
                      width: 12,
                      height: 12,
                      borderRadius: "50%",
                      backgroundColor: project.color,
                      border: "1px solid #ccc",
                    }}
                  />
                  <Typography variant="body1">{project.title}</Typography>
                </Stack>
              </TableCell>
              <TableCell>
                <Stack direction="row" spacing={1}>
                  {project.members.map((member) => (
                    <Avatar
                      key={member.nickname}
                      alt={member.nickname}
                      src={member.profile_image_url}
                      sx={{ width: 32, height: 32 }}
                    />
                  ))}
                </Stack>
              </TableCell>
              <TableCell>
                <Stack direction="row" spacing={1}>
                  <IconButton aria-label="자세히 보기" size="small">
                    <VisibilityIcon fontSize="small" />
                  </IconButton>
                  <IconButton aria-label="편집" size="small">
                    <EditIcon fontSize="small" />
                  </IconButton>
                  <IconButton aria-label="삭제" size="small">
                    <DeleteIcon fontSize="small" />
                  </IconButton>
                </Stack>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}
