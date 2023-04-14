import { TabsProps } from "antd";
import React from "react";
import GE from "~/components/group_evaluation/GroupEvaluation";
import { default as Group_Lecturer } from "~/components/group_lecturer/GroupLecturer";
import Wrapper from "~/components/wapper/Wrapper";

const GroupEvaluation = () => {

    return (
        <div>
            <Wrapper>
                <GE />
            </Wrapper>
        </div>
    );
};

export default GroupEvaluation;
