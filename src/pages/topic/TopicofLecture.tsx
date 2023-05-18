import React from 'react';
import Wrapper from '../../components/wapper/Wrapper';
import TopicManagement from '../../components/topic_management/TopicManagement';

import { useAppSelector } from '../../redux/hooks';

const TopicofLecture = () => {
  return (
    <Wrapper>
      <TopicManagement />
    </Wrapper>
  );
};

export default TopicofLecture;
