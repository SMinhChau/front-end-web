import { axiosAuth } from '../utils/axiosConfig';
import qs from 'qs';
class TopicService {
  createTopic(data: any) {
    return axiosAuth({
      url: '/lecturer/topics',
      method: 'post',
      data,
    });
  }
  updateTopic(id: number, data: any) {
    return axiosAuth({
      url: '/lecturer/topics/' + id,
      method: 'put',
      data: qs.stringify(data),
    });
  }
  getTopic(query: { lecturerId?: number; termId: number }) {
    return axiosAuth({
      url: '/lecturer/topics',
      method: 'get',
      params: query,
    });
  }
  getTopicById(id: number) {
    return axiosAuth({
      url: '/lecturer/topics/' + id,
      method: 'get',
    });
  }
  deleteTopic(id: number) {
    return axiosAuth({
      url: '/lecturer/topics/' + id,
      method: 'delete',
    });
  }
  updateTopicStatus(id: number, data: any) {
    return axiosAuth({
      url: '/lecturer/topics/' + id + '/review',
      method: 'put',
      data,
    });
  }
}
const topicService = new TopicService();
export default topicService;
