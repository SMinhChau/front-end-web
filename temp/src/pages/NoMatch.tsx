import { Empty } from 'antd';
import styled from 'styled-components';

const { Link } = require('react-router-dom');

function NoMatch() {
    return (
        <div>
            <Wapper>
                <Empty />
                <Link to="/">Go to the home page</Link>
            </Wapper>
        </div>
    );
}
export default NoMatch;

const Wapper = styled.section`
    background-color: antiquewhite;
    justify-content: center;
    align-items: center;
`;
