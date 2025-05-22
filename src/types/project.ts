import { User } from '@/types/api/user';
export interface InviteTeamMemberModalProps {
  open: boolean;
  onClose: () => void;
  onSave: (members: User[]) => void;
}
