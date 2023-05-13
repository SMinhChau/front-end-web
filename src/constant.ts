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

export const checkString = (str: string) => {
  var regex = /^[a-zA-Z0-9]*$/;
  return regex.test(str);
};

export const checkPoint = (str: string) => {
  const regex = /^([0-9](\.[0-9])?|10(\.0)?)|0\.5$/;
  return regex.test(str);
};

export const removeAccents = (str: string) => {
  var AccentsMap = [
    'aàảãáạăằẳẵắặâầẩẫấậ',
    'AÀẢÃÁẠĂẰẲẴẮẶÂẦẨẪẤẬ',
    'dđ',
    'DĐ',
    'eèẻẽéẹêềểễếệ',
    'EÈẺẼÉẸÊỀỂỄẾỆ',
    'iìỉĩíị',
    'IÌỈĨÍỊ',
    'oòỏõóọôồổỗốộơờởỡớợ',
    'OÒỎÕÓỌÔỒỔỖỐỘƠỜỞỠỚỢ',
    'uùủũúụưừửữứự',
    'UÙỦŨÚỤƯỪỬỮỨỰ',
    'yỳỷỹýỵ',
    'YỲỶỸÝỴ',
  ];
  for (var i = 0; i < AccentsMap.length; i++) {
    var re = new RegExp('[' + AccentsMap[i].substr(1) + ']', 'g');
    var char = AccentsMap[i][0];
    str = str.replace(re, char);
  }
  return str;
};

export const getNameStatus = (value: string) => {
  if (value === 'REFUSE') return 'Không được duyệt';
  if (value === 'PEDING') return 'Đang chờ';
  if (value === 'ACCEPT') return 'Đã duyệt';
};

export enum TypeStatusGroup {
  OPEN = 'OPEN',
  FAIL_ADVISOR = 'FAIL_ADVISOR',
  FAIL_REVIEWER = 'FAIL_REVIEWER',
  FAIL_SESSION_HOST = 'FAIL_SESSION_HOST',
  PASS_ADVISOR = 'PASS_ADVISOR',
  PASS_REVIEWER = 'PASS_REVIEWER',
  PASS_SESSION_HOST = 'PASS_SESSION_HOST',
}
