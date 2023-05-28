import React, { useEffect, useMemo, useState } from 'react';
import classNames from 'classnames/bind';
import styled from './GroupAdvisor.module.scss';
import { Avatar, Button, Col, Radio, Result, Row, Skeleton, Table, Tag, Typography } from 'antd';

import { useAppSelector } from '../../redux/hooks';
import assignService from '../../services/assign';
import { ExportOutlined, SnippetsOutlined } from '@ant-design/icons';
import Meta from 'antd/es/card/Meta';
import { Link } from 'react-router-dom';

import { TypeEvalution } from '../../entities/assign';

import { AiOutlineEdit } from 'react-icons/ai';

import AssignAdvisor from 'src/entities/assign_advisor';
import AssignAdvisorOfLecturer from 'src/entities/assign_advisor';
import { getStatusGroup, getStatusGroupColor } from 'src/constant';
import GroupLecturer from '../group_lecturer/GroupLecturer';
import { ColumnsType } from 'antd/es/table';
import Student from 'src/entities/student';
import TruncatedText from '../topic_management/TruncatedText';

const cls = classNames.bind(styled);
const { Text } = Typography;

const GroupAdvisor = () => {
  const [listAssign, setListAssign] = useState<Array<AssignAdvisorOfLecturer>>([]);
  // const [data, setData] = useState<Array<AssignAdvisor>>([]);
  // const [loading, setLoading] = useState(true);
  const [typeEvalution, setTypeEvalution] = useState<TypeEvalution>(TypeEvalution.ADVISOR);
  const termState = useAppSelector((state) => state.term);
  const user = useAppSelector((state) => state.user.user);
  const [isShow, setIssShow] = useState(false);

  useEffect(() => {
    if (termState.term.length > 0) {
      assignService
        .getAssignByTypeAdvisor(user.id, { typeEvaluation: 'ADVISOR' })
        .then((result) => {
          console.log('getlist -> result.data', result.data);

          const _data = result.data.map((value: AssignAdvisor, index: number) => {
            return {
              name: value.group.name,
              status: value.group.status,
              member: value.group.members,
              groupOfLecturer: value.groupLecturer.members,
            };
          });
          console.log(_data);

          setListAssign(_data);
          // setData(result.data);
        })
        .catch((error) => {
          console.log('getlist -> error', error);
        });
    }
  }, [termState]);

  const baseColumns: ColumnsType<AssignAdvisorOfLecturer> = [
    {
      title: 'Mã nhóm',
      dataIndex: 'id',
      key: 'id',
      width: 100,
      render: (text) => {
        return <div className={cls('text_colum')}>{text}</div>;
      },
    },
    {
      title: 'Tên nhóm',
      dataIndex: 'name',
      key: 'name',
      render: (text) => {
        return <div className={cls('text_colum_name')}>{text}</div>;
      },
    },
    {
      title: 'Tình tạng',
      dataIndex: 'status',
      key: 'status',

      render: (text) => {
        const name = getStatusGroup(text);
        const color = getStatusGroupColor(text);
        return (
          <Tag color={color}>
            <div style={{ color: color, fontSize: '16px' }}>{name}</div>
          </Tag>
        );
      },
    },
  ];
  interface DataType {
    key: React.Key;
    name: string;
    age: number;
    address: string;
    description: string;
  }

  const handleClseShow = () => {
    setIssShow(false);
  };

  const viewMember = (id: number) => {
    setIssShow(true);
    const data = listAssign.filter((value) => id === value.id)[0];

    const studentTable = data.member.map((i) => {
      return { username: i.student.username, name: i.student.name };
    });

    const studenColum = [
      {
        title: 'Mã sinh viên',
        dataIndex: 'username',
        key: 'username',
        width: 100,
        render: (text: string) => {
          return <div className={cls('text_colum')}>{text}</div>;
        },
      },
      {
        title: 'Tên nhóm',
        dataIndex: 'name',
        key: 'name',
        render: (text: string) => {
          return <div className={cls('text_colum')}>{text}</div>;
        },
      },
    ];
    return (
      <>
        <Row justify={'center'} align={'top'} style={{ width: '100%' }}>
          <Col span={8}>
            <div className={cls('member')}>Thành viên: </div>
          </Col>

          <Col span={16}>
            <Table pagination={false} columns={studenColum} dataSource={studentTable} />
          </Col>
        </Row>
      </>
    );
  };

  const renderTable = useMemo(() => {
    return (
      <Table
        columns={baseColumns}
        expandable={{
          expandedRowRender: (i) => <p style={{ margin: 0 }}>{viewMember(i.id)}</p>,
          rowExpandable: (record) => record.name !== 'Not Expandable',
        }}
        pagination={isShow === true ? { pageSize: 1 } : { pageSize: 7 }}
        dataSource={listAssign}
      />
    );
  }, [listAssign]);

  const renderGroupLecturer = useMemo(() => {
    return <Table columns={baseColumns} dataSource={listAssign} />;
  }, [listAssign]);

  return (
    <>
      <div className={cls('list_evaluation')}>
        <div className={cls('info')}>
          <Row justify={'center'} align={'top'} style={{ width: '100%' }}>
            <Col span={10}>
              <Row justify={'start'} align={'middle'} style={{ width: '100%' }}>
                <Col span={4}></Col>
                <Col span={20}>
                  <h3 className={cls('title_group_left')}>Danh sách nhóm đang quản lý</h3>
                </Col>
              </Row>

              <div className={cls('left')}>{renderTable}</div>
            </Col>
            <Col span={14}>
              <div className={cls('right')}>
                <Row justify={'center'} align={'top'} style={{ width: '100%' }}>
                  <h3 className={cls('title_group_right')}>Nhóm Hội đồng - Phản Biện</h3>
                  <Col span={24}> {renderGroupLecturer}</Col>
                </Row>
                <Row justify={'center'} align={'top'} style={{ width: '100%' }}>
                  <h3 className={cls('title_group_right')}>Nhóm Hội đồng - Hội đồng</h3>
                  <Col span={24}> {renderGroupLecturer}</Col>
                </Row>
              </div>
            </Col>
          </Row>
        </div>
      </div>
    </>
  );
};
export default GroupAdvisor;
