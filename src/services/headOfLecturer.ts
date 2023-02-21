import { axiosAuth } from "~/utils/axiosConfig";

class HeadOfLecturerService {
    async getAll(){
        await axiosAuth({
            url:'/lecturer/user/list-head-lecturer',
            method:'get'
        })
    }
}

const headOfLecturerService = new HeadOfLecturerService();

export default headOfLecturerService;
