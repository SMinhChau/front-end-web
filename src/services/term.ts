import { axiosAuth } from "~/utils/axiosConfig";

class TermService {
    async getTerm(major: number) {
        return await axiosAuth({
            url: "/lecturer/term/",
            method: "get",
            params: { majorsId: major },
        });
    }
    async createTerm(values: any) {
        return await axiosAuth({
            url: "/lecturer/term/",
            method: "post",
            data: values,
        });
    }

    async deleteTerm(id: number){
        return await axiosAuth({
            url: '/lecturer/term/'+id,
            method:'delete',
        })
    }
    async update(id:any, data:any){
        return await axiosAuth({
            url:'/lecturer/term/'+id,
            method: 'put',
            data
        })
    }
}

const termService = new TermService();
export default termService;
