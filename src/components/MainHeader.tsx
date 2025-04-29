import Image from "next/image";
import Link from "next/link";
import style from "./MainHeader.module.css";
import Button from "@mui/material/Button";

export default function MainHeader() {
  return (
    <header className={style.header}>
      <Link href={"/"}>
        <div className={style.logo}>
          <Image src={"/images/logo.svg"} width={30} height={47} alt={"로고"} />
          <p>Looper</p>
        </div>
      </Link>
      <Link href={"/auth/login"}>
        <Button variant="contained">로그인</Button>
      </Link>
    </header>
  );
}
