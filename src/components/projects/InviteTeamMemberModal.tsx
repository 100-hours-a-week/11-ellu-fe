'use client';

import { Box, Modal, Typography, Button, IconButton } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import SearchIcon from '@mui/icons-material/Search';
import CancelIcon from '@mui/icons-material/Cancel';
import styles from './InviteTeamMemberModal.module.css';
import { InviteTeamMemberModalProps } from '../../types/project';
import { useState } from 'react';

// 목데이터 타입 정의
interface TeamMember {
  id: number;
  nickname: string;
}

// 목데이터
const mockData: TeamMember[] = [
  { id: 1, nickname: '홍길동' },
  { id: 2, nickname: '김철수' },
  { id: 3, nickname: '이영희' },
  { id: 4, nickname: '박지성' },
  { id: 5, nickname: '최유진' },
  { id: 6, nickname: '홍리' },
  { id: 7, nickname: '홍리' },
  { id: 8, nickname: '홍리22' },
];

export default function InviteTeamMemberModal({ open, onClose }: InviteTeamMemberModalProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [showResults, setShowResults] = useState(true);
  const [invitedMembers, setInvitedMembers] = useState<string[]>([]);

  const filteredMembers = mockData.filter((member) => member.nickname.toLowerCase().includes(searchTerm.toLowerCase()));

  // 검색어 입력 핸들러
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
    setShowResults(true);
  };

  // 검색결과 처리 핸들러
  const handleInvite = (id: number, nickname: string) => {
    if (!invitedMembers.includes(nickname)) {
      setInvitedMembers([...invitedMembers, nickname]);
    }
    setShowResults(false);
    setSearchTerm('');
  };

  // 초대 멤버 삭제 핸들러
  const handleRemoveInvite = (nicknameToRemove: string) => {
    setInvitedMembers(invitedMembers.filter((nickname) => nickname !== nicknameToRemove));
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
                    onClick={() => handleInvite(member.id, member.nickname)}
                    className={styles.resultItem}
                  >
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
            {invitedMembers.map((nickname, index) => (
              <div key={index} className={styles.invitedItem}>
                <span>{nickname}</span>
                <IconButton size="small" onClick={() => handleRemoveInvite(nickname)} className={styles.removeButton}>
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
