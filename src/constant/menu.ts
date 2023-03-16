import { AiOutlineCalendar } from "react-icons/ai";
import { GiTeacher } from "react-icons/gi";

const menus = {
    ADMIN: [
        {
            name: "Quản lý Học Kỳ",
            image: AiOutlineCalendar,
            url: "/",
        },
        {
            name: "Quản lý chuyên ngành",
            image: AiOutlineCalendar,
            url: "/major",
        },
        {
            name: "Quản lý Giảng Viên",
            image: GiTeacher,
            url: "/teacher",
        }
    ],
    HEADLECTURER: [
        {
            name: "Quản lý Học Kỳ",
            image: AiOutlineCalendar,
            url: "/",
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
    SUBHEADLECTURER: [
        {
            name: "Quản lý Học Kỳ",
            image: AiOutlineCalendar,
            url: "/",
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
    LECTURER: [],
};

export default menus;
