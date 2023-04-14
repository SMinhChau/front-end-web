import classNames from 'classnames/bind';
import styled from './ListGroupOfLecturer.module.scss';
import { Avatar, Badge, Card, Descriptions, Select, Skeleton } from "antd";
import { useEffect, useState } from "react";
import Term from "~/entities/term";
import termService from "~/services/term";
import { useAppSelector } from "~/redux/hooks";
import studentService from '~/services/student';
import { DoubleRightOutlined, GroupOutlined, SnippetsOutlined, StarOutlined } from '@ant-design/icons';
import Meta from 'antd/es/card/Meta';
import { Link } from 'react-router-dom';
import GroupStudent from '~/entities/group_student';

const cls = classNames.bind(styled);


const ListGroupOfLecturer = () => {
    const { user } = useAppSelector((state) => state.user);

    const [term, setTerm] = useState<Array<Term>>([]);
    const [termSelect, setTermSelect] = useState<number | null>(null);

    const [listGroup, setListGroup] = useState<Array<GroupStudent>>([]);
    const [loading, setLoading] = useState(true);

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
            studentService
                .getGroupStudents(termSelect ? termSelect : term[0].id)
                .then((result) => {
                    setLoading(false);
                    setListGroup(result?.data);
                })
                .catch((error) => {
                    console.log('error', error);
                });
        }
    }, [termSelect, term]);

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
            <h3 className={cls('title_group')}>Danh sách nhóm Sinh Viên đang quản lý</h3>

            <Card title={''} className={cls('list_group')}>
                <Skeleton loading={loading} avatar active></Skeleton>
                {listGroup.map((item, index) => (

                    <Card.Grid className={cls('group')} hoverable>
                        <Badge.Ribbon text={<StarOutlined />} color="red">

                            <Meta
                                title={
                                    <div className={cls('group_name')}>
                                        <Descriptions column={2} title={<div className={cls('name_info')} >Nhóm: {item?.name}</div>}>


                                        </Descriptions>
                                    </div>
                                }
                                description={
                                    <div className={cls('group_more')}>

                                        <div className={cls('evalaution_content')}>
                                            <DoubleRightOutlined className={cls('icon_evaluation')} size={20} />
                                            <Link to={'/group/evaluation-for-group/' + item?.id}> Chấm điểm  </Link>
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