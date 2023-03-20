import { AiOutlineCalendar } from "react-icons/ai";
import { GiTeacher } from "react-icons/gi";

const menus = {
  ADMIN: [
    {
      name: "Quản lý chuyên ngành",
      image: AiOutlineCalendar,
      url: "/major",
    },
    {
      name: "Quản lý Giảng Viên",
      image: GiTeacher,
      url: "/teacher",
    },
  ],
  HEAD_LECTURER: [
    {
      name: "Quản lý Học Kỳ",
      image: AiOutlineCalendar,
      url: "/term",
    },
    {
      name: "Quản lý Giảng Viên",
      image: AiOutlineCalendar,
      url: "/teacher",
    },
    {
      name: "Quản lý Sinh Viên",
      image: AiOutlineCalendar,
      url: "/student",
    },
    {
      name: "Quản lý Đề tài",
      image: AiOutlineCalendar,
      url: "/topic",
    },
    {
      name: "Quản lý Đánh giá",
      image: AiOutlineCalendar,
      url: "/empty",
    },
  ],
  SUB_HEAD_LECTURER: [
    {
      name: "Quản lý Học Kỳ",
      image: AiOutlineCalendar,
      url: "/term",
    },
    {
      name: "Quản lý Giảng Viên",
      image: AiOutlineCalendar,
      url: "/teacher",
    },
    {
      name: "Quản lý Sinh Viên",
      image: AiOutlineCalendar,
      url: "/student",
    },
    {
      name: "Quản lý Đề tài",
      image: AiOutlineCalendar,
      url: "/topic",
    },
    {
      name: "Quản lý Đánh giá",
      image: AiOutlineCalendar,
      url: "/empty",
    },
  ],
  LECTURER: [
    {
      name: "Quản lý Đề tài",
      image: AiOutlineCalendar,
      url: "/topic",
    },
    {
      name: "Quản lý Đánh giá",
      image: AiOutlineCalendar,
      url: "/empty",
    },
  ],
};

export default menus;
