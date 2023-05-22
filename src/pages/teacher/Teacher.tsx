import React from 'react';
import Wrapper from '../../components/wapper/Wrapper';
import TeacherManagement from '../../components/teacher_management/TeacherManagement';
import { useAppSelector } from 'src/redux/hooks';
import { RoleCheck } from 'src/enum';
import TeacherManagementHead from 'src/components/teacher_management/TeacherManagementHead';

const Teacher = () => {
  const userState = useAppSelector((state) => state.user);

  return <Wrapper>{userState.isRole === RoleCheck.ADMIN ? <TeacherManagement /> : <TeacherManagementHead />}</Wrapper>;
};

export default Teacher;
