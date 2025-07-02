'use client';

import { Box, Modal, Button, IconButton, Avatar } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import SearchIcon from '@mui/icons-material/Search';
import CancelIcon from '@mui/icons-material/Cancel';
import styles from './InviteTeamMemberModal.module.css';
import { useState, useRef, useEffect } from 'react';
import { useSearchUser } from '@/hooks/api/user/useSearchUser';
import { User } from '@/types/api/user';
import { useDebounce } from '@/hooks/common/useDebounce';
import { InviteTeamMemberModalProps } from '@/types/project';
import { userStore } from '@/stores/userStore';

export default function InviteTeamMemberModal({ open, onClose, onSave }: InviteTeamMemberModalProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [showResults, setShowResults] = useState(true);
  const [invitedMembers, setInvitedMembers] = useState<User[]>([]);
  const currentUser = userStore((state) => state.user);
  const searchResultRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchResultRef.current && !searchResultRef.current.contains(event.target as Node)) {
        setShowResults(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const debouncedSearchTerm = useDebounce(searchTerm, 300); // 입력 멈춘후 0.3초마다 검색 api 호출
  const { data: searchResults } = useSearchUser(debouncedSearchTerm);
  const filteredMembers = searchResults || [];

  // 검색어 입력 핸들러
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
    setShowResults(true);
  };

  // 검색결과 처리 핸들러
  const handleInvite = (id: number, nickname: string, imageUrl: string) => {
    if (invitedMembers.length >= 7) {
      return;
    }
    // 이미 초대된 멤버 중에 자기 자신이 있는지 확인
    if (id === currentUser?.id) {
      alert('자기 자신은 초대 목록에 포함될 수 없습니다.');
      return;
    }
    if (invitedMembers.some((member) => member.id === id)) {
      alert('이미 초대된 멤버입니다.');
      return;
    }
    setInvitedMembers([...invitedMembers, { id, nickname, imageUrl }]);
    setShowResults(false);
    setSearchTerm('');
  };

  // 초대 멤버 삭제 핸들러
  const handleRemoveInvite = (id: number) => {
    setInvitedMembers(invitedMembers.filter((member) => member.id !== id));
  };

  // 저장 클릭시
  const handleSave = () => {
    onSave(invitedMembers);
    setInvitedMembers([]);
    onClose();
  };

  return (
    <Modal open={open} onClose={onClose}>
      <Box className={styles.modalContainer}>
        <div className={styles.header}>
          <h2>팀원 찾기</h2>
          <IconButton onClick={onClose} size="small">
            <CloseIcon />
          </IconButton>
        </div>
        <div className={styles.content}>
          <h2>팀원을 검색하고 초대하세요</h2>
          <div className={styles.search}>
            <div className={styles.searchContainer}>
              <div className={styles.searchIconWrapper}>
                <SearchIcon />
              </div>
              <input
                className={styles.searchInput}
                placeholder="닉네임을 입력하세요"
                aria-label="search"
                value={searchTerm}
                onChange={handleSearchChange}
                disabled={invitedMembers.length >= 7}
              />
            </div>
            {invitedMembers.length >= 7 && (
              <div className={styles.errorMessage}>최대 7명까지만 초대할 수 있습니다.</div>
            )}
          </div>
          <div className={styles.searchResultWrapper} ref={searchResultRef}>
            {searchTerm && filteredMembers.length > 0 && showResults && (
              <div className={styles.resultContainer}>
                {filteredMembers.map((member) => (
                  <div
                    key={member.id}
                    onClick={() => handleInvite(member.id, member.nickname, member.imageUrl)}
                    className={styles.resultItem}
                  >
                    <Avatar src={member.imageUrl} alt={member.nickname} className={styles.avatar} />
                    {member.nickname}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
        <div className={styles.bottom}>
          <h1>초대 목록</h1>
          <div className={styles.invitedList}>
            {invitedMembers.map(({ id, nickname, imageUrl }) => (
              <div key={id} className={styles.invitedItem}>
                <div className={styles.memberInfo}>
                  <Avatar src={imageUrl} alt={nickname} className={styles.avatar} />
                  <span>{nickname}</span>
                </div>
                <IconButton size="small" onClick={() => handleRemoveInvite(id)} className={styles.removeButton}>
                  <CancelIcon fontSize="small" />
                </IconButton>
              </div>
            ))}
          </div>
        </div>
        <Button
          variant="contained"
          color="primary"
          className={styles.inviteButton}
          disabled={invitedMembers.length === 0}
          onClick={handleSave}
        >
          저장
        </Button>
      </Box>
    </Modal>
  );
}
