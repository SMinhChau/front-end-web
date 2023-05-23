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

export interface IErrorCodeInfo {
  key: string;
  message: string;
}
export const ErrorCodeDefine: Record<string, IErrorCodeInfo> = {
  SERVER: {
    key: 'SERVER',
    message: 'Lỗi server!',
  },
  COMMON: {
    key: 'COMMON',
    message: 'Commom!',
  },
  NOT_FOUND: {
    key: 'NOT_FOUND',
    message: 'Không tìm thấy',
  },
  VALIDATE: {
    key: 'VALIDATE',
    message: 'Thông tin không hợp lệ',
  },
  UNAUTHORIZED: {
    key: 'UNAUTHORIZED',
    message: 'Không có quyền truy cập',
  },
  AUTHENTICATION: {
    key: 'AUTHENTICATION',
    message: 'Có quyền truy cập',
  },
  FORBIDDEN: {
    key: 'FORBIDDEN',
    message: '',
  },
  CONFLICT: {
    key: 'CONFLICT',
    message: 'Từ chối',
  },
  // USER
  LECTURER_NOT_FOUND: {
    key: 'LECTURER_NOT_FOUND',
    message: 'Không tìm thấy Giảng viên',
  },
  STUDENT_NOT_FOUND: {
    key: 'STUDENT_NOT_FOUND',
    message: 'Không tìm thấy Sinh viên',
  },
  LECTURER_MISSING_EMAIL: {
    key: 'LECTURER_MISSING_EMAIL',
    message: 'Giảng viên không có email',
  },
  STUDENT_MISSING_EMAIL: {
    key: 'STUDENT_MISSING_EMAIL',
    message: 'Sinh viên không có email',
  },
  IMPORT_LECTURER_MISSING_COLUMN: {
    key: 'IMPORT_LECTURER_MISSING_COLUMN',
    message: 'Thiếu thông tin của Giảng viên',
  },
  IMPORT_STUDENT_MISSING_COLUMN: {
    key: 'IMPORT_STUDENT_MISSING_COLUMN',
    message: 'Thiếu thông tin của Sinh viên',
  },
  DONT_HAVE_PERMISSION_THIS_MAJORS: {
    key: 'DONT_HAVE_PERMISSION_THIS_MAJORS',
    message: 'Không có quyền',
  },
  // USER TERM
  LECTURER_NOT_IN_TERM: {
    key: 'LECTURER_NOT_IN_TERM',
    message: 'Giảng viên không có trong họ kỳ',
  },
  STUDENT_NOT_IN_TERM: {
    key: 'STUDENT_NOT_IN_TERM',
    message: 'Sinh viên không có trong họ kỳ',
  },

  // DAO
  FAIL_CREATE_ENTITY: {
    key: 'FAIL_CREATE_ENTITY',
    message: 'Lỗi tạo, Vui lòng kiểm tra lại',
  },
  FAIL_DELETE_ENTITY: {
    key: 'FAIL_DELETE_ENTITY',
    message: 'Lỗi xóa,Vui lòng kiểm tra lại',
  },
  FAIL_UPDATE_ENTITY: {
    key: 'FAIL_DELETE_ENTITY',
    message: 'Lỗi cập nhật,Vui lòng kiểm tra lại',
  },

  // mail service
  SEND_MAIL_FAIL: {
    key: 'SEND_MAIL_FAIL',
    message: 'Gửi email không thành công',
  },

  // EVALUATION
  EVALUATION_DUPLICATE_NAME: {
    key: 'EVALUATION_DUPLICATE_NAME',
    message: 'Tên tiêu chí đã tồn tại',
  },
  EVALUATION_SUM_GRADE: {
    key: 'EVALUATION_SUM_GRADE',
    message: 'Tổng điểm tiêu chí',
  },

  // GROUP LECTURER
  GROUP_LECTURER_DUPLICATE_NAME: {
    key: 'GROUP_LECTURER_DUPLICATE_NAME',
    message: 'Tên nhóm đã tồn tại',
  },
  LECTURER_NOT_IN_THIS_GROUP: {
    key: 'LECTURER_NOT_IN_THIS_GROUP',
    message: 'Giảng viên không có trong nhóm này',
  },
  LECTURER_DO_NOT_HAVE_ASSIGN: {
    key: 'LECTURER_DO_NOT_HAVE_ASSIGN',
    message: 'Giảng viên khong có nhóm',
  },
  // GROUP
  STUDENT_NOT_IN_THIS_GROUP: {
    key: 'STUDENT_NOT_IN_THIS_GROUP',
    message: 'Sinh viên không có trong nhóm này',
  },
  STUDENT_DONT_HAVE_GROUP: {
    key: 'STUDENT_DONT_HAVE_GROUP',
    message: 'Sinh viên không có nhóm',
  },
  // MAJORS
  MAJORS_DUPLICATE_NAME: {
    key: 'MAJORS_DUPLICATE_NAME',
    message: 'Tên ngành đã tồn tại',
  },
  // MAJORS
  TOPIC_DUPLICATE_NAME: {
    key: 'TOPIC_DUPLICATE_NAME',
    message: 'Tên đề tài đã tồn tại',
  },
  // TERM
  TERM_DUPLICATE_NAME: {
    key: 'TERM_DUPLICATE_NAME',
    message: 'Tên học kỳ đã tồn tại',
  },

  TERM_HAS_NOT_STARTED: {
    key: 'TERM_HAS_NOT_STARTED',
    message: 'Học kỳ chưa bắt đầu',
  },
  TERM_HAS_EXPRIED: {
    key: 'TERM_HAS_EXPRIED',
    message: 'Học kỳ đã hết hạn',
  },
  TERM_SUBMIT_TOPIC_HAS_EXPRIED: {
    key: 'TERM_SUBMIT_TOPIC_HAS_EXPRIED',
    message: 'Chọn đề tài đã hết hạn',
  },
  TERM_CHOOSE_TOPIC_HAS_NOT_STARTED: {
    key: 'TERM_CHOOSE_TOPIC_HAS_NOT_STARTED',
    message: 'Thời gian chọn đề tài chưa bắt đầu',
  },
  TERM_CHOOSE_TOPIC_HAS_EXPRIED: {
    key: 'TERM_CHOOSE_TOPIC_HAS_EXPRIED',
    message: 'Thời gian chọn đề tài đã hết hạn ',
  },
  TERM_DISCUSSION_HAS_NOT_STARTED: {
    key: 'TERM_DISCUSSION_HAS_NOT_STARTED',
    message: 'Thời gian phân công, tạo nhóm hội đồng - Phản Biện chưa bắt đầu',
  },
  TERM_DISCUSSION_HAS_EXPRIED: {
    key: 'TERM_DISCUSSION_HAS_EXPRIED',
    message: 'Thời gian phân công, tạo nhóm hội đồng - Phản Biện đã hết hạn',
  },
  TERM_REPORT_HAS_EXPRIED: {
    key: 'TERM_REPORT_HAS_EXPRIED',
    message: 'Thời gian phân công, tạo nhóm hội đồng - Hội đông đã hết hạn',
  },
  TERM_REPORT_HAS_NOT_STARTED: {
    key: 'TERM_REPORT_HAS_NOT_STARTED',
    message: 'Thời gian phân công, tạo nhóm hội đồng - Hội đông chưa bắt đầu',
  },
};

export type ITypeNotificationLecturer =
  | 'UPDATE_STATUS_COMMENT_MY_TOPIC'
  | 'ASSIGN_REVIEW'
  | 'ASSIGN_SESSION_HOST'
  | 'ASSIGN_ADVISOR'
  | 'LECTURER'
  | 'GROUP_STUDENT';

export const TypeNotificationPath: Record<ITypeNotificationLecturer | string, string> = {
  UPDATE_STATUS_COMMENT_MY_TOPIC: '/topic',
  ASSIGN_REVIEW: '/evaluation-group-of-lecturer',
  ASSIGN_SESSION_HOST: '/evaluation-group-of-lecturer',
  ASSIGN_ADVISOR: '/evaluation-group-of-lecturer',
  LECTURER: '/group-lecturer', // khi thêm giảng viên vào học kỳ hoặc đôi role của lecturer
  GROUP_STUDENT: '/group-advisor-of-lecturer',
};

// // Khi nhận được thông báo
// const notification = {
//   message: "Hello",
//   type: "LECTURER",
// };

// const path = TypeNotificationPath[notification.type];

// window.location.href = path;

export const getStatusGroup = (status: string) => {
  switch (status) {
    case 'OPEN':
      return 'Nhóm mới tạo';
    case 'FAIL_ADVISOR':
      return 'Rớt hướng dẫn';
    case 'FAIL_REVIEWER':
      return 'Rớt phản biện';
    case 'FAIL_SESSION_HOST':
      return 'Rớt hội đồng';
    case 'PASS_ADVISOR':
      return 'Đậu phản biện';
    case 'PASS_REVIEWER':
      return 'Đậu hướng dẫn';
    case 'PASS_SESSION_HOST':
      return 'Đậu hội dồng';
  }
};
export const getStatusGroupColor = (status: string) => {
  switch (status) {
    case 'OPEN':
      return 'green';
    case 'FAIL_ADVISOR':
      return 'red';
    case 'FAIL_REVIEWER':
      return 'red';
    case 'red':
      return 'Rớt hội đồng';
    case 'green':
      return 'Đậu phản biện';
    case 'PASS_REVIEWER':
      return 'green';
    case 'PASS_SESSION_HOST':
      return 'green';
  }
};

export const getTypeGroupLecturer = (typeEvalution: string) => {
  switch (typeEvalution) {
    case 'ADVISOR':
      return 'Hướng dẫn';
    case 'REVIEWER':
      return 'Phản biện';
    case 'SESSION_HOST':
      return 'Hội đồng';
  }
};

export const getColorLecturer = (typeEvalution: string) => {
  switch (typeEvalution) {
    case 'ADVISOR':
      return 'green';
    case 'REVIEWER':
      return 'blue';
    case 'SESSION_HOST':
      return 'red';
  }
};

export const getStatusViewPoint = (status: number) => {
  switch (status) {
    case 1:
      return 'Đã công bố';
    case 0:
      return 'Chưa';
  }
};
