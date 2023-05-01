import { Button, Result } from "antd";
import { useNavigate } from "react-router-dom";



const Notification = () => {
    const navigate = useNavigate();
    return (
        <>
            <Result
                status="404"
                title="404"
                subTitle="Chưa có thông báo nào"
                extra={<Button onClick={() => navigate(-1)} type="primary">Quay lại</Button>}
            />
        </>
    )
}
export default Notification;
