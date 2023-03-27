import { axiosAuth } from "~/utils/axiosConfig"

class EvaluateService{
    async getEvaluate(data: {termId: number, type: string}){
        return await axiosAuth({
            url:'/lecturer/evaluations',
            method: 'get',
            params: data,
        })
    }
    async insert(data:any){
        return await axiosAuth({
            url: '/lecturer/evaluations',
            method: 'post',
            data
        })
    }
}

const evaluateService = new EvaluateService()
export default evaluateService