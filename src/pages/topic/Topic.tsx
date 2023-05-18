import Wrapper from '../../components/wapper/Wrapper';

import HEADTopicManagement from '../../components/topic_management/HEADTopicManagement';
import { useAppSelector } from '../../redux/hooks';

const Topic = () => {
  return (
    <Wrapper>
      <HEADTopicManagement />
    </Wrapper>
  );
};

export default Topic;
