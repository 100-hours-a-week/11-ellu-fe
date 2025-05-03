import style from './page.module.css';
import { IconButton } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import Link from 'next/link';
import ProjectInfoForm from '@/components/form/ProjectInfoForm';

export default function Page() {
  return (
    <div className={style.container}>
      <div className={style.header}>
        <Link href="/projects">
          <IconButton
            sx={{
              '&:hover': { backgroundColor: 'rgba(0, 0, 0, 0.04)' },
              '& .MuiSvgIcon-root': {
                fontSize: '2rem',
                color: 'black',
              },
            }}
          >
            <CloseIcon />
          </IconButton>
        </Link>
        <h1>새로운 프로젝트 생성하기</h1>
      </div>
      <div className={style.form}>
        <ProjectInfoForm />
      </div>
    </div>
  );
}
