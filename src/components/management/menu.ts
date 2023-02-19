import SemesterManagement from "../semester_management/SemesterManagement"
import TeacherManagement from "../teacher_management/TeacherManagement"
import { AiOutlineCalendar, AiOutlineUsergroupAdd } from "react-icons/ai";
import {GiTeacher} from 'react-icons/gi'
import {FaChild} from 'react-icons/fa'
import {RiGroupLine} from 'react-icons/ri'
import {SiSimpleanalytics} from 'react-icons/si'


const menus = {
    "admin":[
        {
            name:"Quản lý Học Kỳ",
            image: AiOutlineCalendar,
            url: "/"
        },
        {
            name:"Quản lý Giảng Viên",
            image: GiTeacher,
            url: '/teacher'
        },
        {
            name:"Quản lý Sinh Viên",
            image: FaChild,
            url: '/student'
        },
        {
            name:"Quản lý nhóm Giảng Viên",
            image: AiOutlineUsergroupAdd,
            url: '/empty'
        },
        {
            name:"Quản lý Nhóm Đề Tài",
            image: RiGroupLine,
            url: '/empty'
        },
        {
            name:"Quản lý Đánh giá",
            image: SiSimpleanalytics,
            url: '/evaluate'
        },
    ],
    "teacher-v1":[
        {
            name:"Quản lý Học Kỳ",
            image: "menu-icons/1.png",
            url: SemesterManagement
        },
        {
            name:"Quản lý Giảng Viên",
            image: "menu-icons/2.png",
            url: TeacherManagement
        },
        {
            name:"Quản lý Sinh Viên",
            image: "menu-icons/2.png",
            url: '/empty'
        },
        {
            name:"Quản lý nhóm Giảng Viên",
            image: "menu-icons/4.png",
            url: '/empty'
        },
        {
            name:"Quản lý Nhóm Đề Tài",
            image: "menu-icons/4.png",
            url: '/empty'
        },
        {
            name:"Quản lý Đề tài",
            image: "menu-icons/1.png",
            url: '/empty'
        },
        {
            name:"Quản lý Đánh giá",
            image: "menu-icons/5.png",
            url: '/empty'
        },
    ],
    "teacher-v2":[]
}

export default menus