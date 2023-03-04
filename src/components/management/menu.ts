import { AiOutlineCalendar } from "react-icons/ai";
import { GiTeacher } from "react-icons/gi";
import { FaChild } from "react-icons/fa";
import { RiGroupLine } from "react-icons/ri";
import { SiSimpleanalytics } from "react-icons/si";

const menus = {
    admin: [
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
        },
        {
            name: "Quản lý Sinh Viên",
            image: FaChild,
            url: "/student",
        },
        {
            name: "Quản lý đề tài",
            image: RiGroupLine,
            url: "/empty",
        },
        {
            name: "Quản lý Đánh giá",
            image: SiSimpleanalytics,
            url: "/evaluate",
        },
    ],
    headLecturer: [
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
    Lecturer: [],
};

export default menus;
