import { axiosAuth } from "~/utils/axiosConfig";

class HeadOfLecturerService {
    async getAll() {
        return await axiosAuth({
            url: "/lecturer/lecturers?isHeadLecturer=true",
            method: "get",
        });
    }
}

const headOfLecturerService = new HeadOfLecturerService();

export default headOfLecturerService;
