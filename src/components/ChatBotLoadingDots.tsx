import style from './ChatBotLoadingDots.module.css';

export default function ChatBotLoadingDots() {
  return (
    <div className={style.loadingDots}>
      <div className={style.loadingDot}></div>
      <div className={style.loadingDot}></div>
      <div className={style.loadingDot}></div>
    </div>
  );
}
