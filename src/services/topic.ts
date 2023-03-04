import { axiosAuth } from "~/utils/axiosConfig";

class TopicService {
    createTopic(data: any) {
        return axiosAuth({
            url: "/lecturer/topics",
            method: "post",
            data,
        });
    }
    updateTopic(id: number, data: any) {
        return axiosAuth({
            url: "/lecturer/topics/" + id,
            method: "put",
            data,
        });
    }
    getTopic(query: { lecturerId: number; termId: number }) {
        return axiosAuth({
            url: "/lecturer/topics",
            method: "get",
            params: query,
        });
    }
    getTopicById(id: number) {
        return axiosAuth({
            url: "/lecturer/topics/" + id,
            method: "get",
        });
    }
}
const topicService = new TopicService();
export default topicService;
