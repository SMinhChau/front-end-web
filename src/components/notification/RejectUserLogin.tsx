import { Button, Result } from 'antd';
import { useNavigate } from 'react-router-dom';
import tokenService from 'src/services/token';

const RejectUserLogin = () => {
  const logout = () => {
    tokenService.reset();
    window.location.href = '/login';
  };
  return (
    <div style={{ flex: 1, width: '100wh', height: '100wh' }}>
      <Result
        status="403"
        title="403"
        subTitle="Bạn không có trong học kỳ hiện tại, Vui lòng kiểm tra lại"
        extra={
          <Button onClick={logout} type="primary">
            Quay lại
          </Button>
        }
      />
    </div>
  );
};
export default RejectUserLogin;
