import { toast } from 'react-toastify';

export const URL = 'https://graduation-thesis-iuh.top/api';

export const checkGender = (value: string) => {
  if (value === 'MALE') return 'Nam';
  if (value === 'FEMALE') return 'Nữ';
};
export const checkDegree = (value: string) => {
  if (value === 'MASTERS') return 'Tiến sĩ';
  if (value === 'DOCTER') return 'Thạc sĩ';
};

export const checkRole = (value: string) => {
  if (value === 'HEAD_LECTURER') return 'Trưởng khoa';
  if (value === 'SUB_HEAD_LECTURER') return 'Khóa Trưởng khoa';
  if (value === 'LECTURER') return 'Giảng viên';
};

export interface TypeEvaluation {
  ADVISOR: string;
  REVIEWER: string;
  SESSION_HO: string;
}

export const showMessage = (mess: any, timeShow: number) => {
  return toast.success(mess, {
    position: 'top-center',
    autoClose: timeShow,
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
    progress: undefined,
  });
};
export const showMessageEror = (mess: any, timeShow: number) => {
  return toast.error(mess, {
    position: 'top-center',
    autoClose: timeShow,
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
    progress: undefined,
  });
};

export const checkTypeTraining = (value: string) => {
  if (value === 'UNIVERSITY') return 'Đại Học';
  if (value === 'COLLEGE') return 'Cao Đẳng';
};
