import Calendar from '@/components/Calendar';
import ChatBot from '@/components/ChatBot';
import style from './page.module.css';

export default function ChatbotPage() {
  return (
    <div className={style.container}>
      <div className={style.leftcontainer}>
        <div className={style.chatbot}>
          <ChatBot />
        </div>
      </div>
      <div className={style.rightcontainer}>
        <Calendar />
      </div>
    </div>
  );
}
