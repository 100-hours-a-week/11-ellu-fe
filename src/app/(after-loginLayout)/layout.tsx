import { ReactNode } from "react";
import style from "./layout.module.css";
import LeftNavigationBar from "@/components/LeftNavigationBar";
import AfterLoginHeader from "@/components/AfterLoginHeader";

export default function Layout({ children }: { children: ReactNode }) {
  return (
    <div className={style.container}>
      <AfterLoginHeader />
      <div className={style.box}>
        <LeftNavigationBar />
        <div className={style.mainbox}>{children}</div>
      </div>
    </div>
  );
}
