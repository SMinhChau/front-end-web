import { HeartOutlined } from '@ant-design/icons';
import classNames from 'classnames/bind';
import style from './Footer.module.scss'

const cls = classNames.bind(style)

function AppFooter() {
    return (
        <div className={cls('footer')}>
            <HeartOutlined style={{ color: 'red' }} />
            <div className={cls('title')}> 2022 - 2023</div>
            <HeartOutlined style={{ color: 'red' }} />
        </div>
    );
}
export default AppFooter;


