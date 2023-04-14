import React, { useEffect, useMemo, useState } from 'react';
import classNames from 'classnames/bind';
import style from './GroupDetail.module.scss';
import { Badge, Card, Col, Descriptions, Divider, Row, Skeleton } from 'antd';
import { useParams } from 'react-router-dom';
import studentService from '~/services/student';
import GroupStudent from '~/entities/group_student';
import topicService from '~/services/topic';
import Topic from '~/entities/topic';
import Teacher from '~/entities/teacher';

const cls = classNames.bind(style);

const GroupDetail = () => {
  const { id } = useParams();
  const [inforGroup, setInfoGroup] = useState<GroupStudent>();
  const [topic, setTopic] = useState<Topic>();
  const [lecturer, setLecturer] = useState<Teacher>();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const idGroup = id;

    studentService
      .getGroupStudentByID(Number(idGroup))
      .then((result) => {
        console.log('getGroupStudentByID', result?.data);
        setLoading(false)
        setInfoGroup(result.data);
        getTopic(result.data?.topic?.id);

      })
      .catch((errr) => console.log('erre', errr));
  }, []);

  const getTopic = (id: number) => {
    topicService
      .getTopicById(id)
      .then((result) => {
        console.log('getTopicById', result?.data);

        setTopic(result.data);
        setLecturer(result.data?.lecturer);
      })
      .catch((errr) => console.log('erre', errr));
  };

  const handleChange = (value: string) => {
    console.log(`selected ${value}`);
  };

  const genderMemberForGroup = useMemo(() => {
    if (inforGroup) {
      const member = inforGroup?.members?.length;
      if (member > 0)
        return (
          <>
            {inforGroup?.members?.map((item, index) => {
              return (
                <Descriptions title="">
                  <Descriptions.Item label={'Sinh Viên'}>
                    <div className={cls('member')}>{item?.student?.name}</div>
                  </Descriptions.Item>
                </Descriptions>
              );
            })}
          </>
        );
      else
        return (
          <div style={{ width: '100%' }}>
            <Badge.Ribbon text="Thông báo" color="red">
              <Card title="Sinh viên" size="default">
                Chọn Sinh Viên
              </Card>
            </Badge.Ribbon>
          </div>
        );
    }
  }, [inforGroup?.members?.length]);

  const renderTopic = useMemo(() => {
    const DATA_TOPIC = [
      {
        lable: 'Mô tả',
        value: topic?.description,
      },
      {
        lable: 'Yều cầu đầu vào',
        value: topic?.requireInput,
      },

      {
        lable: 'Yều cầu đầu ra',
        value: topic?.standradOutput,
      },

      {
        lable: 'Ghi chú',
        value: topic?.note,
      },
    ];


    if (topic)
      return (
        <Row justify={'space-between'} align={'middle'}>
          <Col span={8} >
            <Descriptions title="">
              <Descriptions.Item label={'Tên đề tài'}>
                <div className={cls('member')}>{topic?.name}</div>
              </Descriptions.Item>
            </Descriptions>
          </Col>


          <Col span={16} style={{ borderWidth: 1, borderColor: 'greenyellow' }}>
            <Badge.Ribbon text="" color="red">
              <Card title="Chi tiết về đề tài" size="default">
                {DATA_TOPIC.map((item, index) => {
                  return (
                    <>
                      <Descriptions key={index} title="">
                        <Descriptions.Item label={item?.lable}>
                          <div className={cls('member')}>{item?.value}</div>
                        </Descriptions.Item>
                      </Descriptions>

                    </>
                  );
                })}
              </Card>
            </Badge.Ribbon>



          </Col>

        </Row>
      );
    else
      return (
        <div style={{ width: '100%' }}>
          <Badge.Ribbon text="Thông báo" color="red">
            <Card title="Đề tài" size="default">
              Nhóm chưa có đề tài
            </Card>
          </Badge.Ribbon>
        </div>
      );
  }, [topic]);

  const renderLecturerForGroup = useMemo(() => {
    if (lecturer)
      return (
        <Descriptions title="">
          <Descriptions.Item label={'Giảng viên hướng dẫn'}>
            <div className={cls('member')}>{lecturer?.name}</div>
          </Descriptions.Item>
        </Descriptions>
      );
    else
      return (
        <div style={{ width: '100%' }}>
          <Badge.Ribbon text="Thông báo" color="red">
            <Card title="Giảng viên " size="default">
              Nhóm chưa có Giảng Viên hướng dẫn
            </Card>
          </Badge.Ribbon>
        </div>
      );
  }, [lecturer]);


  const renderGroupReviewer = useMemo(() => {
    if (lecturer)
      return (
        <Descriptions title="">
          <Descriptions.Item label={'Chấm phản biện'}>
            <div className={cls('member')}>{lecturer?.name}</div>
          </Descriptions.Item>
        </Descriptions>
      );
    else
      return (
        <div style={{ width: '100%' }}>
          <Badge.Ribbon text="Thông báo" color="red">
            <Card title="Chấm phản biện " size="default">
              Nhóm chưa được phân công Giảng Viên chấm "PHẢN BIỆN"
            </Card>
          </Badge.Ribbon>
        </div>
      );
  }, [lecturer]);


  const renderGroupSessionHost = useMemo(() => {
    if (lecturer)
      return (
        <Descriptions title="">
          <Descriptions.Item label={'Chấm phản hội đồng'}>
            <div className={cls('member')}>{lecturer?.name}</div>
          </Descriptions.Item>
        </Descriptions>
      );
    else
      return (
        <div style={{ width: '100%' }}>
          <Badge.Ribbon text="Thông báo" color="red">
            <Card title="Chấm hội đồng " size="default">
              Nhóm chưa được phân công Giảng Viên chấm "HỘI ĐỒNG"
            </Card>
          </Badge.Ribbon>
        </div>
      );
  }, [lecturer]);


  return (
    <div className={cls('group_detail')}>
      <Skeleton loading={loading} avatar active>
        <Badge.Ribbon >
          <Card title={<Descriptions title="">
            <Descriptions.Item label={<div className={cls('group_name')}>Tên nhóm</div>}>
              <div className={cls('group_name')}>{inforGroup?.name}</div>
            </Descriptions.Item>
          </Descriptions>} size="default">
            <div className={cls('group_member')}>{genderMemberForGroup}</div>
            <Divider orientation="left"></Divider>
            <div className={cls('topic')}>{renderTopic}</div>
            <Divider orientation="left"></Divider>
            <div className={cls('lecturer')}>{renderLecturerForGroup}</div>
            <Divider orientation="left"></Divider>
            <div className={cls('lecturer')}>{renderGroupReviewer}</div>
            <Divider orientation="left"></Divider>
            <div className={cls('lecturer')}>{renderGroupSessionHost}</div>
          </Card>
        </Badge.Ribbon>
      </Skeleton>    </div>

  );
};

export default GroupDetail;
