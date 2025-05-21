'use client';

import { Box, Modal, Typography, Button, IconButton, Avatar } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import SearchIcon from '@mui/icons-material/Search';
import CancelIcon from '@mui/icons-material/Cancel';
import styles from './InviteTeamMemberModal.module.css';
import { InviteTeamMemberModalProps } from '../../types/project';
import { useState } from 'react';
import { useSearchUser } from '@/hooks/api/user/useSearchUser';
import { User } from '@/types/api/user';
import { useDebounce } from '@/hooks/useDebounce';

export default function InviteTeamMemberModal({ open, onClose }: InviteTeamMemberModalProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [showResults, setShowResults] = useState(true);
  const [invitedMembers, setInvitedMembers] = useState<User[]>([]);

  const debouncedSearchTerm = useDebounce(searchTerm, 800); // 입력 멈춘후 0.8초마다 검색 api 호출
  const { data: searchResults } = useSearchUser(debouncedSearchTerm);
  const filteredMembers = searchResults || [];

  // 검색어 입력 핸들러
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
    setShowResults(true);
  };

  // 검색결과 처리 핸들러
  const handleInvite = (id: number, nickname: string, imageUrl: string) => {
    if (!invitedMembers.some((member) => member.id === id)) {
      setInvitedMembers([...invitedMembers, { id, nickname, imageUrl }]);
    }
    setShowResults(false);
    setSearchTerm('');
  };

  // 초대 멤버 삭제 핸들러
  const handleRemoveInvite = (id: number) => {
    setInvitedMembers(invitedMembers.filter((member) => member.id !== id));
  };

  // 저장 클릭시
  const handleSave = () => {
    console.log('초대된 멤버:', invitedMembers);
    // onClose();
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
              />
            </div>
          </div>
          <div className={styles.searchResultWrapper}>
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
