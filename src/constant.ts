export const URL = 'https://manage-graduation-thesis-iuh.herokuapp.com/api';

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
