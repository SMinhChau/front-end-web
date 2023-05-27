import { useRef, useState, useMemo, useEffect } from 'react';
import classNames from 'classnames/bind';
import style from './Management.module.scss';
import { useAppDispatch, useAppSelector } from '../../redux/hooks';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import tokenService from '../../services/token';
import { BiLogOutCircle } from 'react-icons/bi';
import { Avatar, Col, Row, Typography } from 'antd';
import Term from '../../entities/term';
import termService from '../../services/term';
import { TermSlices, setTermIndex, setTermSlice } from '../../redux/slices/term_slice';
import { setAllow } from 'src/redux/slices/user_slice';
import { EnumRole } from 'src/enum';
import Select from 'react-select';
const cls = classNames.bind(style);
const avatarDefault = 'assets/avatars/avatarDefault.png';

const logo = 'assets/Logo_IUH.png';

const Management = () => {
  const { Text } = Typography;
  const pathRef = useRef(window.location.pathname);
  const userState = useAppSelector((state) => state.user);

  const logout = () => {
    tokenService.reset();
    window.location.href = '/login';
  };

  const [term, setTerm] = useState<Array<Term>>([]);
  const [termSelect, setTermSelect] = useState<number | null>(null);
  const dispatch = useAppDispatch();
  const termState = useAppSelector((state) => state.term);
  const navigate = useNavigate();

  useEffect(() => {
    termService
      .getTerm({ majorsId: userState.user.majors.id })
      .then((response) => {
        setTerm(response.data);
        dispatch(setTermSlice(response.data));
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);

  useEffect(() => {
    if (termState.termSelected) {
      const t = termState.term.filter((value) => value.id === termState.termSelected)[0];
      dispatch(setTermIndex(t));
    } else {
      termService
        .getTermNow({ majorsId: userState.user.majors.id })
        .then((result) => {
          dispatch(setTermIndex(result.data.term));
          dispatch(setAllow(result.data.allow));
        })
        .catch((err) => {
          console.log(err);
        });
    }
  }, [termState.termSelected]);

  const onchangeValue = (value: any) => {
    console.log('onchangeValue value', value.value);

    setTermSelect(value.value);
    dispatch(TermSlices.actions.setTermSelected(value.value));
  };

  const router = useLocation();
  console.log(router);

  const renderTerm = useMemo(() => {
    return (
      <>
        <div className={cls('filter_term')}>
          {router.pathname !== '/term' ? (
            <>
              <Row justify={'center'} style={{ width: '100%' }} align={'middle'}>
                <Col></Col>
                <Col>
                  <Text type="success" className={cls('name_term')}>
                    {termState?.termIndex?.name}
                  </Text>
                </Col>
              </Row>
            </>
          ) : (
            <>
              <div style={{ width: '70%' }}>
                <Select
                  placeholder={termState?.termIndex?.name ? termState?.termIndex?.name : termState.term[0].name}
                  onChange={(value: any) => onchangeValue(value)}
                  isDisabled={router.pathname !== '/term' ? true : false}
                  closeMenuOnSelect={false}
                  options={term.map((val) => {
                    return {
                      value: val.id,
                      label: val.name,
                    };
                  })}
                />
              </div>
              {/* <Select

                size={'middle'}
                style={{ width: '70%' }}
                placeholder={termState?.termIndex?.name ? termState?.termIndex?.name : termState.term[0].name}
                onChange={(value: any) => onchangeValue(value)}
                disabled={router.pathname !== '/term' ? true : false}
                options={term.map((val) => {
                  return {
                    value: val.id,
                    label: val.name,
                  };
                })}
              /> */}
            </>
          )}
        </div>
      </>
    );
  }, [term, termSelect, termState]);

  useEffect(() => {
    replaceRouter();
  }, [userState, termState.termIndex, navigate]);

  const replaceRouter = () => {
    if (userState.user.role === EnumRole.LECTURER && userState.allow === false) return navigate('/disaccepted-user', { replace: true });
  };

  return (
    <>
      {userState.user.role === EnumRole.LECTURER && userState.allow === false ? (
        <>
          <div style={{ backgroundColor: '##f0f2f5' }}></div>
        </>
      ) : (
        <div className={cls('management')}>
          <Row justify={'center'} style={{ width: '100%' }}>
            <Col span={24} offset={1}>
              <div className={cls('logo')}>
                <img src={logo} alt="" style={{ width: '150px' }} />
              </div>
            </Col>
          </Row>

          <div className={cls('empty')}>
            <Link to="/user-info">
              <img className={cls('img')} src={userState.user.avatar ? userState.user.avatar : avatarDefault} alt="" />
            </Link>
            <div className={cls('username')}>{userState.user.name}</div>
          </div>

          {renderTerm}
          <hr />
          <div className={cls('menu')} id="menu">
            {userState.functions.map(({ name, image: Image, url }, index) => {
              return (
                <Link
                  to={url + ''}
                  className={cls('menu_item')}
                  key={index}
                  style={
                    pathRef.current === url
                      ? {
                          color: 'rgb(24, 144, 255)',
                          background: '#e6f7ff',
                          borderRight: '3px solid rgb(24, 144, 255)',
                        }
                      : {}
                  }
                >
                  <Image style={{ fontSize: 30, marginRight: 10 }} />
                  <p className={cls('menu_title')}>{name}</p>
                </Link>
              );
            })}
          </div>
          <hr />
          <div className={cls('footer')} onClick={logout}>
            <Row justify={'center'} align={'middle'}>
              <Col className={cls('btn')}>
                <BiLogOutCircle style={{ fontSize: 22, marginRight: 10, color: 'red' }} />
              </Col>
              <Col className={cls('btn')}>
                <p className={cls('menu_title_logout')}>Đăng xuất</p>
              </Col>
            </Row>
          </div>
        </div>
      )}
    </>
  );
};

export default Management;
