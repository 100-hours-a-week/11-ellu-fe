import Image from "next/image";
import Link from "next/link";
import style from "./AfterLoginHeader.module.css";

export default function AfterLoginHeader() {
  return (
    <header className={style.header}>
      <Link href={"/projects"}>
        <div className={style.logo}>
          <Image src={"/images/logo.svg"} width={30} height={50} alt={"로고"} />
          <p>Looper</p>
        </div>
      </Link>
    </header>
  );
}
