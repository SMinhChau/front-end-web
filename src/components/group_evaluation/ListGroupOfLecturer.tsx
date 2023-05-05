import classNames from 'classnames/bind';
import styled from './ListGroupOfLecturer.module.scss';
import { Badge, Card, Descriptions, Radio, Result, Skeleton } from 'antd';
import { useEffect, useState } from 'react';

import { useAppSelector } from '../../redux/hooks';
import assignService from '../../services/assign';
import { DoubleRightOutlined, StarOutlined } from '@ant-design/icons';
import Meta from 'antd/es/card/Meta';
import { Link } from 'react-router-dom';

import Assign, { TypeEvalution } from '../../entities/assign';

const cls = classNames.bind(styled);

const ListGroupOfLecturer = () => {
  const userState = useAppSelector((state) => state.user).user;

  const [listAssign, setListAssign] = useState<Array<Assign>>([]);
  const [loading, setLoading] = useState(true);
  const [typeEvalution, setTypeEvalution] = useState<TypeEvalution>(TypeEvalution.ADVISOR);
  const termState = useAppSelector((state) => state.term);

  useEffect(() => {
    if (termState.term.length > 0) {
      assignService
        .getAssignByLecturer(termState.termIndex.id, userState.id, typeEvalution)
        .then((result) => {
          setLoading(false);
          setListAssign(result?.data);
        })
        .catch((error) => {
          setLoading(false);
          console.log('error', error);
        });
    }
  }, [termState, typeEvalution, userState.id]);

  const handlerChangeType = (props: any) => {
    setTypeEvalution(props.target.value);
  };
  return (
    <div className={cls('list_evaluation')}>
      <div className={cls('filter_term')}></div>
      <h3 className={cls('title_group')}>Danh sách Nhóm sinh viên chấm điểm</h3>

      <div className={cls('type_evalution')}>
        <Radio.Group defaultValue={typeEvalution} buttonStyle="solid" onChange={handlerChangeType}>
          <Radio.Button className={cls('btn_radio')} value={TypeEvalution.ADVISOR}>
            hướng dẫn
          </Radio.Button>
          <Radio.Button className={cls('btn_radio')} value={TypeEvalution.REVIEWER}>
            Phản biện
          </Radio.Button>
          <Radio.Button className={cls('btn_radio')} value={TypeEvalution.SESSION_HOST}>
            Hội đồng
          </Radio.Button>
        </Radio.Group>
      </div>
      <Skeleton loading={loading} avatar active>
        <Card title={''} className={cls('list_group')}>
          {listAssign.length === 0 && <Result status="warning" title="Chưa có nhóm cho học kỳ này" />}
          {listAssign.map((item, index) => (
            <Card.Grid key={index} className={cls('group')} hoverable>
              <Badge.Ribbon text={<StarOutlined />} color="red">
                <Meta
                  title={
                    <div className={cls('group_name')}>
                      <Descriptions column={2} title={<div className={cls('name_info')}>Nhóm: {item?.group.name}</div>}></Descriptions>
                    </div>
                  }
                  description={
                    <div className={cls('group_more')}>
                      <div className={cls('evalaution_content')}>
                        <DoubleRightOutlined className={cls('icon_evaluation')} size={20} />
                        <Link to={`/group/evaluation-for-group/${item?.group.id}?type=${item.typeEvaluation}&assignId=${item.id}`}>
                          Chấm điểm
                        </Link>
                      </div>
                    </div>
                  }
                />
              </Badge.Ribbon>
            </Card.Grid>
          ))}
        </Card>
      </Skeleton>
    </div>
  );
};
export default ListGroupOfLecturer;
