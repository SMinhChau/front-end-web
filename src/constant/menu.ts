import { AiOutlineCalendar } from 'react-icons/ai';
import { GiTeacher } from 'react-icons/gi';

const menus = {
  ADMIN: [
    {
      name: 'Quản lý chuyên ngành',
      image: AiOutlineCalendar,
      url: '/major',
    },
    {
      name: 'Quản lý Giảng Viên',
      image: GiTeacher,
      url: '/teacher',
    },
    {
      name: 'Quản lý nhóm',
      image: AiOutlineCalendar,
      url: '/grading',
    },
    {
      name: 'Quản lý nhóm Giảng viên',
      image: AiOutlineCalendar,
      url: '/group-lecturer',
    },
  ],
  HEAD_LECTURER: [
    {
      name: 'Quản lý Học Kỳ',
      image: AiOutlineCalendar,
      url: '/term',
    },
    {
      name: 'Quản lý Giảng Viên',
      image: AiOutlineCalendar,
      url: '/teacher',
    },
    {
      name: 'Quản lý Sinh Viên',
      image: AiOutlineCalendar,
      url: '/student',
    },
    {
      name: 'Quản lý Đề tài',
      image: AiOutlineCalendar,
      url: '/topic',
    },
    {
      name: 'Quản lý Đánh giá',
      image: AiOutlineCalendar,
      url: '/evaluate',
    },
    {
      name: 'Quản lý nhóm',
      image: AiOutlineCalendar,
      url: '/grading',
    },
    {
      name: 'Quản lý nhóm Giảng viên',
      image: AiOutlineCalendar,
      url: '/group-lecturer',
    },
    {
      name: 'Quản Lý Chấm Điểm',
      image: AiOutlineCalendar,
      url: '/evaluation-group-of-lecturer',
    },
  ],
  SUB_HEAD_LECTURER: [
    {
      name: 'Quản lý Học Kỳ',
      image: AiOutlineCalendar,
      url: '/term',
    },
    {
      name: 'Quản lý Giảng Viên',
      image: AiOutlineCalendar,
      url: '/teacher',
    },
    {
      name: 'Quản lý Sinh Viên',
      image: AiOutlineCalendar,
      url: '/student',
    },
    {
      name: 'Quản lý Đề tài',
      image: AiOutlineCalendar,
      url: '/topic',
    },
    {
      name: 'Quản lý Đánh giá',
      image: AiOutlineCalendar,
      url: '/empty',
    },
    {
      name: 'Quản lý nhóm',
      image: AiOutlineCalendar,
      url: '/grading',
    },
    {
      name: 'Quản lý nhóm Giảng viên',
      image: AiOutlineCalendar,
      url: '/group-lecturer',
    },
    {
      name: 'Quản Lý Chấm Điểm',
      image: AiOutlineCalendar,
      url: '/evaluation-group-of-lecturer',
    },
  ],
  LECTURER: [
    {
      name: 'Quản lý Đề tài',
      image: AiOutlineCalendar,
      url: '/topic',
    },
    {
      name: 'Quản lý Đánh giá',
      image: AiOutlineCalendar,
      url: '/empty',
    },
    {
      name: 'Quản Lý Chấm Điểm',
      image: AiOutlineCalendar,
      url: '/evaluation-group-of-lecturer',
    },
  ],
};

export default menus;
