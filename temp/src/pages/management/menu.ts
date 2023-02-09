import SemesterManagement from "../../components/SemesterManagement/SemesterManagement"
import Empty from "../../components/empty/Empty"
import TeacherManagement from "../../components/TeacherManagement/TeacherManagement"


const menus = {
    "admin":[
        {
            name:"Quản lý Học Kỳ",
            image: "menu-icons/1.png",
            container: SemesterManagement
        },
        {
            name:"Quản lý Ngành",
            image: "menu-icons/2.png",
            container: Empty
        },

        {
            name:"Quản lý Giảng Viên",
            image: "menu-icons/3.png",
            container: Empty
        },
        {
            name:"Quản lý Sinh Viên",
            image: "menu-icons/3.png",
            container: Empty
        },
        {
            name:"Quản lý nhóm Giảng Viên",
            image: "menu-icons/4.png",
            container: Empty
        },
        {
            name:"Quản lý Nhóm Đề Tài",
            image: "menu-icons/4.png",
            container: Empty
        },
        {
            name:"Quản lý Đánh giá",
            image: "menu-icons/5.png",
            container: Empty
        },
    ],
    "teacher-v1":[
        {
            name:"Quản lý Học Kỳ",
            image: "menu-icons/1.png",
            container: SemesterManagement
        },
        {
            name:"Quản lý Giảng Viên",
            image: "menu-icons/2.png",
            container: TeacherManagement
        },
        {
            name:"Quản lý Sinh Viên",
            image: "menu-icons/2.png",
            container: Empty
        },
        {
            name:"Quản lý nhóm Giảng Viên",
            image: "menu-icons/4.png",
            container: Empty
        },
        {
            name:"Quản lý Nhóm Đề Tài",
            image: "menu-icons/4.png",
            container: Empty
        },
        {
            name:"Quản lý Đề tài",
            image: "menu-icons/1.png",
            container: Empty
        },
        {
            name:"Quản lý Đánh giá",
            image: "menu-icons/5.png",
            container: Empty
        },
    ],
    "teacher-v2":[]
}

export default menus