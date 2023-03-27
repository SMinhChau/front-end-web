import { axiosAuth, axiosFormData } from "~/utils/axiosConfig";

class LecturerService {
    async getAll() {
        return await axiosAuth({
            url: "/lecturer/lecturers?isHeadLecturer=true",
            method: "get",
        });
    }
    async getWithTerm(termId: number){
        return await axiosAuth({
            url:'/lecturer/lecturers',
            params: {
                termId
            }
        })
    }
    async import(data: FormData){
        return await axiosFormData({
            url: '/lecturer/lecturers/import-lecturer',
            data
        })
    }
}

const lecturerService = new LecturerService();

export default lecturerService;
