import { AiOutlineCalendar } from 'react-icons/ai';

import { FcCalendar, FcViewDetails, FcManager, FcTodoList, FcPortraitMode, FcNews, FcReading, FcGrid } from 'react-icons/fc';

const menus = {
  ADMIN: [
    {
      name: 'Quản lý chuyên ngành',
      image: FcReading,
      url: '/major',
    },
    {
      name: 'Quản lý Giảng Viên',
      image: FcManager,
      url: '/teacher',
    },
  ],
  HEAD_LECTURER: [
    {
      name: 'Quản lý Học Kỳ',
      image: FcCalendar,
      url: '/term',
    },
    {
      name: 'Quản lý Giảng Viên',
      image: FcManager,
      url: '/teacher',
    },
    {
      name: 'Quản lý Sinh Viên',
      image: FcPortraitMode,
      url: '/student',
    },
    {
      name: 'Duyệt Đề tài',
      image: FcViewDetails,
      url: '/topic',
    },
    {
      name: 'Quản lý Đề tài',
      image: FcViewDetails,
      url: '/management-topic',
    },
    {
      name: 'Quản lý Đánh giá',
      image: FcTodoList,
      url: '/evaluate',
    },
    {
      name: 'Quản lý nhóm',
      image: FcPortraitMode,
      url: '/group',
    },
    {
      name: 'Quản lý nhóm Giảng viên',
      image: FcManager,
      url: '/group-lecturer',
    },
    {
      name: 'Nhóm hướng dẫn',
      image: FcGrid,
      url: '/group-advisor-of-lecturer',
    },
    {
      name: 'Quản Lý Chấm Điểm',
      image: FcNews,
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
      image: FcManager,
      url: '/teacher',
    },
    {
      name: 'Quản lý Sinh Viên',
      image: FcPortraitMode,
      url: '/student',
    },
    {
      name: 'Duyệt Đề tài',
      image: FcViewDetails,
      url: '/topic',
    },
    {
      name: 'Quản lý Đề tài',
      image: FcViewDetails,
      url: '/management-topic',
    },
    {
      name: 'Quản lý Đánh giá',
      image: FcTodoList,
      url: '/evaluate',
    },
    {
      name: 'Quản lý nhóm',
      image: FcPortraitMode,
      url: '/group',
    },
    {
      name: 'Quản lý nhóm Giảng viên',
      image: FcManager,
      url: '/group-lecturer',
    },
    {
      name: 'Nhóm hướng dẫn',
      image: FcGrid,
      url: '/group-advisor-of-lecturer',
    },
    {
      name: 'Quản Lý Chấm Điểm',
      image: FcNews,
      url: '/evaluation-group-of-lecturer',
    },
  ],
  LECTURER: [
    {
      name: 'Thông tin Học Kỳ',
      image: FcCalendar,
      url: '/term-info',
    },
    {
      name: 'Quản lý Đề tài',
      image: FcViewDetails,
      url: '/management-topic',
    },
    {
      name: 'Nhóm hướng dẫn',
      image: FcGrid,
      url: '/group-advisor-of-lecturer',
    },
    // {
    //   name: 'Quản lý Đánh giá',
    //   image: AiOutlineCalendar,
    //   url: '/empty',
    // },
    {
      name: 'Quản Lý Chấm Điểm',
      image: FcNews,
      url: '/evaluation-group-of-lecturer',
    },
  ],
};

export default menus;
