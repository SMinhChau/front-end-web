import React, { useEffect, useMemo, useState } from 'react';
import classNames from 'classnames/bind';
import styled from './ListGroupOfLecturer.module.scss';
import { Avatar, Button, Col, Divider, Radio, Result, Row, Skeleton, Table, Tag, Typography } from 'antd';

import { useAppSelector } from '../../redux/hooks';
import assignService from '../../services/assign';
import { EditOutlined, SnippetsOutlined } from '@ant-design/icons';
import Meta from 'antd/es/card/Meta';
import { Link, useNavigate } from 'react-router-dom';

import { TypeEvalution } from '../../entities/assign';
import AssignAdvisorOfLecturer from 'src/entities/assign_advisor';
import { AiOutlineEdit } from 'react-icons/ai';
import AssignPoint from 'src/entities/asisign_point';
import { checkDegree, checkDisableButton, checkGender, getStatusGroup, getStatusGroupColor } from 'src/constant';
import AssignAdvisor from 'src/entities/assign_advisor';
import { ColumnsType } from 'antd/es/table';
import studentService from 'src/services/student';
import Teacher from 'src/entities/teacher';
import TruncatedText from '../topic_management/TruncatedText';

const cls = classNames.bind(styled);
const { Text } = Typography;

const ListGroupOfLecturer = () => {
  const [listAssign, setListAssign] = useState<Array<AssignAdvisor>>([]);
  const [data, setData] = useState<Array<AssignAdvisor>>([]);
  const [loading, setLoading] = useState(true);
  const [typeEvalution, setTypeEvalution] = useState<TypeEvalution>(TypeEvalution.ADVISOR);
  const termState = useAppSelector((state) => state.term);
  const user = useAppSelector((state) => state.user.user);
  const [loadingTranscript, setLoadingTranscript] = useState(false);
  const [loadingDetail, setLoadingDetail] = useState(true);
  const navigate = useNavigate();
  useEffect(() => {
    if (termState.term.length > 0) {
      getListStudentbyType(typeEvalution);
    }
  }, [termState]);

  const getListStudentbyType = (type: TypeEvalution) => {
    setLoadingTranscript(true);
    assignService

      .getAssignByLecturer(termState.termIndex.id, user.id, type)
      .then((result) => {
        setLoadingTranscript(false);

        const _data = result.data.map((value: AssignAdvisor, index: number) => {
          return {
            key: index,
            id: value.id,
            name: value.group.name,
            status: value.group.status,
            member: value.group.members,
            topic: value.group.topic,
            group: value.group,
            groupLecturer: value.groupLecturer,
          };
        });

        setListAssign(_data);

        setData(_data);
      })
      .catch((error) => {
        setLoadingTranscript(false);
      });
  };

  const handlerChangeType = (props: any) => {
    setTypeEvalution(props.target.value);
    getListStudentbyType(props.target.value);
  };
  const getEvalutionName = () => {
    switch (typeEvalution) {
      case 'ADVISOR':
        return 'Hướng dẫn';
      case 'REVIEWER':
        return 'Phản biện';
      case 'SESSION_HOST':
        return 'Hội đồng';
    }
  };

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
      title: 'Tình tạng',
      dataIndex: 'status',
      key: 'status',
      width: 100,
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
    {
      title: 'Tên đề tài',
      dataIndex: 'topic',
      key: 'topic',
      fixed: 'left',

      render: (text) => (
        <div className={cls('text_colum')} style={{ maxHeight: '160px', overflow: 'auto', fontWeight: '500' }}>
          {text.name}
        </div>
      ),
    },
    {
      title: '',
      dataIndex: 'topic',
      key: 'topic',
      width: 200,
      render: (topic) => {
        return <TruncatedText id={topic.id} topicInfo={topic} topicfromDetail={true} />;
      },
    },
    {
      title: 'Đánh giá',
      dataIndex: 'id',
      key: 'id',
      width: 200,
      render: (id) => {
        const _item = listAssign.filter((i) => i.id === id)[0];
        const status = checkDisableButton(_item.status);

        return (
          <Button
            disabled={status}
            type="dashed"
            size="small"
            style={{
              margin: '0 10px',
              animation: 'none',
              color: 'rgb(80, 72, 229)',
            }}
            className={cls('content_link')}
            onClick={() => navigate(`/group/evaluation-for-group/${_item.group.id}?type=${typeEvalution}&assignId=${_item.id}`)}
          >
            <div>
              <div className={cls('icon_evaluation')}>Đánh giá</div>
            </div>
            <AiOutlineEdit color="blue" size={24} />
          </Button>
        );
      },
    },
  ];

  const handleGetInfoStudent = (id: number) => {
    getTranscriptByStudent(id);
  };

  const getTranscriptByStudent = (_id: number) => {
    setLoadingTranscript(true);
    studentService
      .getTranscriptsSummary(_id, termState.termIndex.id)
      .then((result) => {
        setLoadingTranscript(false);
        setLoadingDetail(false);
        // setTranscriptsSummary(result.data);
      })
      .catch((er) => console.log('er', er));
  };

  const viewMember = (id: number) => {
    const data = listAssign.filter((value) => id === value.id)[0];

    const studentTable = data.member.map((i) => {
      return i.student;
    });

    const lecturerTable = data.groupLecturer.members.map((i) => {
      return i.lecturer;
    });

    const studenColum = [
      {
        title: 'Mã SV',
        dataIndex: 'username',
        key: 'username',
        width: 100,
        render: (text: string) => (
          <div className={cls('text_colum')} style={{ maxHeight: '50px', overflow: 'auto' }}>
            {text}
          </div>
        ),
      },
      {
        title: 'Tên SV',
        dataIndex: 'name',
        key: 'name',

        render: (text: string) => (
          <div className={cls('text_colum')} style={{ maxHeight: '60px', overflow: 'auto' }}>
            {text}
          </div>
        ),
      },
      {
        title: 'Giới tính',
        dataIndex: 'gender',
        key: 'gender',
        with: 100,
        render: (text: string) => {
          const _name = checkGender(text)?.toLocaleUpperCase();
          return (
            <Tag color={_name === 'NAM' ? 'green' : 'blue'} key={checkDegree(text)}>
              <div className={cls('text_colum')} style={{ maxHeight: '160px' }}>
                {_name}
              </div>
            </Tag>
          );
        },
      },

      {
        title: 'SĐT',
        dataIndex: 'phoneNumber',
        key: 'phoneNumber',

        render: (text: string) => (
          <div className={cls('text_colum')} style={{ maxHeight: '60px', overflow: 'auto' }}>
            {text}
          </div>
        ),
      },
      {
        title: 'Email',
        dataIndex: 'email',
        key: 'email',

        render: (text: string) => (
          <div className={cls('text_colum')} style={{ maxHeight: '60px', overflow: 'auto' }}>
            {text}
          </div>
        ),
      },
    ];
    const columnsLecturer: ColumnsType<any> = [
      {
        title: 'Mã GV',
        dataIndex: 'username',
        key: 'username',
        width: 100,
        render: (text: string) => (
          <div className={cls('text_colum')} style={{ maxHeight: '50px', overflow: 'auto' }}>
            {text}
          </div>
        ),
      },
      {
        title: 'Tên GV',
        dataIndex: 'name',
        key: 'name',
        width: 150,
        render: (text: string) => (
          <div className={cls('text_colum')} style={{ maxHeight: '60px', overflow: 'auto' }}>
            {text}
          </div>
        ),
      },

      {
        title: 'Trình độ',
        dataIndex: 'degree',
        width: 100,
        render: (text: string) => {
          const _name = checkDegree(text)?.toLocaleUpperCase();
          return (
            <Tag color={_name === 'THẠC SĨ' ? 'green' : 'red'} key={checkDegree(text)}>
              <div className={cls('text_colum')} style={{ maxHeight: '160px' }}>
                {_name}
              </div>
            </Tag>
          );
        },
      },
      {
        title: 'SĐT',
        dataIndex: 'phoneNumber',
        key: 'phoneNumber',
        width: 120,
        render: (text: string) => (
          <div className={cls('text_colum')} style={{ maxHeight: '60px', overflow: 'auto' }}>
            {text}
          </div>
        ),
      },
      {
        title: 'Email',
        dataIndex: 'email',
        key: 'email',
        width: 150,
        render: (text: string) => (
          <div className={cls('text_colum')} style={{ maxHeight: '60px', overflow: 'auto' }}>
            {text}
          </div>
        ),
      },
    ];

    return (
      <div>
        <Divider />
        <Row justify={'center'} align={'top'} style={{ width: '100%' }}>
          <Col span={6}>
            <div className={cls('member')}>Thành viên nhóm Sinh viên: </div>
          </Col>

          <Col span={18}>
            <Table pagination={false} columns={studenColum} dataSource={studentTable} />
          </Col>
        </Row>
        <Divider />
        <Row justify={'center'} align={'top'} style={{ width: '100%' }}>
          {typeEvalution === TypeEvalution.ADVISOR ? (
            <Col span={6}>
              <div className={cls('member')}>Thông tin giảng viên hướng dẫn: </div>
            </Col>
          ) : (
            <Col span={6}>
              <div className={cls('member')}>Thành viên nhóm hội đồng: </div>
            </Col>
          )}
          <Col span={18}>
            <Table pagination={false} columns={columnsLecturer} dataSource={lecturerTable} />
          </Col>
        </Row>
      </div>
    );
  };

  const renderListGroup = useMemo(() => {
    return (
      <>
        <Skeleton loading={loadingTranscript} avatar active>
          {listAssign.length > 0 ? (
            <>
              <Table
                columns={baseColumns}
                expandable={{
                  expandedRowRender: (i) => <p style={{ margin: 0 }}>{viewMember(i.id)}</p>,
                  rowExpandable: (record) => record.name !== 'Not Expandable',
                  expandRowByClick: false,
                }}
                pagination={{ pageSize: 7 }}
                dataSource={data}
              />
            </>
          ) : (
            <Result status="warning" title="">
              <Text type="danger" style={{ fontSize: '18px' }}>
                Chưa có nhóm cho học kỳ này
              </Text>
            </Result>
          )}
        </Skeleton>
      </>
    );
  }, [listAssign, loadingTranscript]);

  return (
    <>
      <div className={cls('list_evaluation')}>
        <h3 className={cls('title_group')}>Danh sách Nhóm sinh viên Đánh giá</h3>

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

        <div className={cls('info')}>{renderListGroup}</div>
      </div>
    </>
  );
};
export default ListGroupOfLecturer;
