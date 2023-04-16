import classNames from 'classnames/bind';
import styled from './ListGroupOfLecturer.module.scss';
import { Avatar, Badge, Card, Col, Descriptions, Radio, Row, Select, Skeleton, Tabs } from "antd";
import { useEffect, useState } from "react";
import Term from "~/entities/term";
import termService from "~/services/term";
import { useAppSelector } from "~/redux/hooks";
import assignService from '~/services/assign';
import { DoubleRightOutlined, GroupOutlined, SnippetsOutlined, StarOutlined } from '@ant-design/icons';
import Meta from 'antd/es/card/Meta';
import { Link, useSearchParams } from 'react-router-dom';
import GroupStudent from '~/entities/group_student';
import TabPane from 'antd/es/tabs/TabPane';
import Assign, { TypeEvalution } from '~/entities/assign';

const cls = classNames.bind(styled);


const ListGroupOfLecturer = () => {
    const { user } = useAppSelector((state) => state.user);
    const userState = useAppSelector((state) => state.user).user;
    const [term, setTerm] = useState<Array<Term>>([]);
    const [termSelect, setTermSelect] = useState<number | null>(null);
    const [listAssign, setListAssign] = useState<Array<Assign>>([]);
    const [loading, setLoading] = useState(true);
    const [typeEvalution, setTypeEvalution] = useState<TypeEvalution>(TypeEvalution.ADVISOR)

    useEffect(() => {
        termService
            .getTerm({ majorsId: user.majors.id })
            .then((response) => {
                setTerm(response.data);
            })
            .catch((err) => {
                console.log(err);
            });
    }, []);

    useEffect(() => {
        if (term.length > 0) {
            assignService.getAssignByLecturer(termSelect ? termSelect : term[0].id, userState.id, typeEvalution)
                .then((result) => {
                    setLoading(false);
                    setListAssign(result?.data);

                })
                .catch((error) => {
                    console.log('error', error);
                });
        }
    }, [termSelect, term, typeEvalution, userState.id]);
    const handlerChangeType = (props: any) => {
        setTypeEvalution(props.target.value)
    };
    return (
        <div className={cls('list_evaluation')}>
            <div className={cls('filter_term')}>
                <Select
                    style={{ width: 120 }}
                    onChange={(value) => {
                        setTermSelect(value);
                    }}
                    options={term.map((val) => {
                        return {
                            value: val.id,
                            label: val.name,
                        };
                    })}
                />
            </div>
            <h3 className={cls('title_group')}>Danh sách Nhóm sinh viên chấm điểm</h3>

            <div className={cls('type_evalution')}>
                <Radio.Group defaultValue={typeEvalution} buttonStyle="solid" onChange={handlerChangeType}>
                    <Radio.Button value={TypeEvalution.ADVISOR}>hướng dẫn</Radio.Button>
                    <Radio.Button value={TypeEvalution.REVIEWER}>Phản biện</Radio.Button>
                    <Radio.Button value={TypeEvalution.SESSION_HOST}>Hội đồng</Radio.Button>
                </Radio.Group>
            </div>

            <Card title={''} className={cls('list_group')}>
                <Skeleton loading={loading} avatar active></Skeleton>

                {listAssign.map((item, index) => (

                    <Card.Grid className={cls('group')} hoverable>
                        <Badge.Ribbon text={<StarOutlined />} color="red">

                            <Meta
                                title={
                                    <div className={cls('group_name')}>
                                        <Descriptions column={2} title={<div className={cls('name_info')} >Nhóm: {item?.group.name}</div>}>
                                        </Descriptions>
                                    </div>
                                }
                                description={
                                    <div className={cls('group_more')}>

                                        <div className={cls('evalaution_content')}>
                                            <DoubleRightOutlined className={cls('icon_evaluation')} size={20} />
                                            <Link to={`/group/evaluation-for-group/${item?.group.id}?type=${item.typeEvaluation}&assignId=${item.id}`}> Chấm điểm  </Link>
                                        </div>

                                    </div>
                                }
                            />
                        </Badge.Ribbon>
                    </Card.Grid>
                ))}

            </Card>

        </div>
    )
}
export default ListGroupOfLecturer;