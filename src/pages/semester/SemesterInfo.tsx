import React from 'react';
import Wrapper from '../../components/wapper/Wrapper';
import { default as TermInfo } from 'src/components/semester_management/SemesterInfo';

const SemesterInfo = () => {
  return (
    <div>
      <Wrapper>
        <TermInfo />
      </Wrapper>
    </div>
  );
};

export default SemesterInfo;
