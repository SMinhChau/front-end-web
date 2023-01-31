import { ConfigProvider } from "antd";

import styled from "styled-components";
import "~/App.css";
import "antd/dist/reset.css";

function AuthProvider() {
    return (
        <Wrapper>
            <Title inputColor="blue">AuthProvider!!</Title>
            <ConfigProvider
                theme={{
                    components: {
                        Radio: {
                            colorPrimary: "#00b96b",
                        },
                    },
                }}
            ></ConfigProvider>
        </Wrapper>
    );
}

export default AuthProvider;

const Wrapper = styled.section`
    background: papayawhip;
    height: 500px;
`;

const Title = styled.h1<{ inputColor: string }>`
    font-size: 1.5em;
    text-align: center;
    color: ${(props) => props.inputColor || "palevioletred"};
`;
