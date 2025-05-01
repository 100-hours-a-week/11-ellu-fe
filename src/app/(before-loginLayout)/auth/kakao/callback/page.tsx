export const dynamic = "force-dynamic";

import KakaoLoading from "@/components/KakaoLoading";
import style from "./page.module.css";

export default function Page() {
  return (
    <div className={style.container}>
      <KakaoLoading />
    </div>
  );
}
