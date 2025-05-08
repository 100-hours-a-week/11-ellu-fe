import style from './page.module.css';
import { IconButton } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import Link from 'next/link';
import CreateMeetnote from '@/components/projects/CreateMeetnote';
import Calendar from '@/components/Calendar';

export default async function Page({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  return (
    <div className={style.container}>
      <div className={style.leftcontainer}>
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
          <h1>회의록 추가하기</h1>
        </div>
        <div className={style.meetnote}>
          <CreateMeetnote projectId={id} />
        </div>
      </div>
      <div className={style.rightcontainer}>
        <Calendar projectId={id} />
      </div>
    </div>
  );
}
