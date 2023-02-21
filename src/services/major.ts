import { axiosAuth } from "~/utils/axiosConfig";

class MajorService{
    async getMajor(){
        await axiosAuth({
            url:'/lecturer/majors',
            method:'get'
        })
    }
}

const majorService = new MajorService()

export default majorService;