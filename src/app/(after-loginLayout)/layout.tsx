import { ReactNode } from "react";

export default function Layout({ children }: { children: ReactNode }) {
  return (
    <div>
      <div>임시 레이아웃</div>
      {children}
    </div>
  );
}
