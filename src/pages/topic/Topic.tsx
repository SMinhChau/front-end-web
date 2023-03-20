import React from "react";
import Wrapper from "~/components/wapper/Wrapper";
import TopicManagement from "~/components/topic_management/TopicManagement";
import HEADTopicManagement from "~/components/topic_management/HEADTopicManagement";
import { useAppSelector } from "~/redux/hooks";
import { EnumRole } from "~/enum";

const Topic = () => {
    const userState = useAppSelector((state) => state.user);
    return (
        <Wrapper>
            {userState.user.role === EnumRole.HEAD_LECTURER ? (
                <HEADTopicManagement />
            ) : (
                <TopicManagement />
            )}
        </Wrapper>
    );
};

export default Topic;
