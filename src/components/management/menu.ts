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
            name:"Quản lý chuyên ngành",
            image: AiOutlineCalendar,
            url: "/major"
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
            image: AiOutlineCalendar,
            url: '/'
        },
        {
            name:"Quản lý Giảng Viên",
            image: AiOutlineCalendar,
            url: '/teacher'
        },
        {
            name:"Quản lý Sinh Viên",
            image: AiOutlineCalendar,
            url: '/student'
        },
        {
            name:"Quản lý nhóm Giảng Viên",
            image: AiOutlineCalendar,
            url: '/empty'
        },
        {
            name:"Quản lý Nhóm Đề Tài",
            image: AiOutlineCalendar,
            url: '/empty'
        },
        {
            name:"Quản lý Đề tài",
            image: AiOutlineCalendar,
            url: '/empty'
        },
        {
            name:"Quản lý Đánh giá",
            image: AiOutlineCalendar,
            url: '/empty'
        },
    ],
    "teacher-v2":[]
}

export default menus