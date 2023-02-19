import { axiosAuth } from "~/utils/axiosConfig";

class TermService {
    async getTerm(major: number) {
        return await axiosAuth.get("/lecturer/term/", {
            method: "get",
            params: { majorsId:major },
        });
    }
}

const termService = new TermService();
export default termService;
