import { axiosAuth, axiosFormData } from "~/utils/axiosConfig"

class StudentService{
    getStudent(filter: {majorsId?: number}){
        return axiosAuth({
            url:'/lecturer/students',
            params: filter,
            method:'get'
        })
    }

    importSudent(data:FormData){
        return axiosFormData({
            url: '/lecturer/students/import-student',
            method:'post',
            data
        })
    }

}

const studentService = new StudentService()

export default studentService