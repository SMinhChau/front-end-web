import React, { useEffect, useState } from 'react';
import classNames from 'classnames/bind';
import style from './GradingAssigment.module.scss';
import { Avatar, Badge, Card, Descriptions, Select, Skeleton } from 'antd';
import { Link } from 'react-router-dom';
import Term from '~/entities/term';
import termService from '~/services/term';
import { useAppSelector } from '~/redux/hooks';
import studentService from '~/services/student';
import GroupStudent from '~/entities/group_student';
import { FileDoneOutlined, GroupOutlined, SnippetsOutlined, UserOutlined } from '@ant-design/icons';
import Meta from 'antd/es/card/Meta';

const cls = classNames.bind(style);

const GradingAssigment = () => {
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
    <div className={cls('grading_assigment')}>
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

      <h3 className={cls('title_group')}>Danh sách nhóm Sinh Viên</h3>
      <Card title={''} className={cls('list_group')}>
        <Skeleton loading={loading} avatar active></Skeleton>
        {listGroup.map((item, index) => (
          <Card.Grid key={index} className={cls('group')} hoverable>
            <div>
              <Avatar style={{ backgroundColor: '#87d068' }} icon={<SnippetsOutlined />} />

              <GroupOutlined size={30} className={cls('icon')} />
            </div>
            <Meta
              title={
                <div className={cls('group_name')}>
                  <Descriptions column={2} title={<div className={cls('name_info')} >Nhóm: {item?.name}</div>}>


                    {item?.members.map((i, d) => {
                      return <Descriptions.Item key={d} label="Thành viên">{i?.student?.name}</Descriptions.Item>;
                    })}
                  </Descriptions>
                </div>
              }
              description={
                <div className={cls('group_more')}>
                  {/* <div className={cls('eva')}> <Link to={'/group/evaluation-for-group/' + item?.id}> Đánh giá  </Link>
                    <FileDoneOutlined className={cls('icon_evaluation')} color='red' size={40} /></div> */}
                  <Link to={'/group/' + item?.id}> Chi tiết...</Link>
                </div>
              }
            />
          </Card.Grid>
        ))}

      </Card>
    </div>
  );
};

export default GradingAssigment;
