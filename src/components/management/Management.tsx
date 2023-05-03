import { useRef, useState, useMemo, useEffect } from 'react';
import classNames from 'classnames/bind';
import style from './Management.module.scss';
import { useAppDispatch, useAppSelector } from '../../redux/hooks';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import tokenService from '../../services/token';
import { BiLogOutCircle } from 'react-icons/bi';
import { Select, Typography } from 'antd';
import Term from '../../entities/term';
import termService from '../../services/term';
import { TermSlices, setTermIndex, setTermSlice } from '../../redux/slices/term_slice';
const cls = classNames.bind(style);

const avatarDefault = '/assets/avatars/avatarDefault.png'

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

  useEffect(() => {
    termService
      .getTerm({ majorsId: userState.user.majors.id })
      .then((response) => {
        setTerm(response.data);
        dispatch(setTermSlice(response.data))

      })
      .catch((err) => {
        console.log(err);
      });
  }, []);

  useEffect(() => {
    if (termState.termSelected) {
      const t = termState.term.filter((value) => value.id === termState.termSelected)[0]
      dispatch(setTermIndex(t))
    } else {
      dispatch(setTermIndex(termState.term[0]))
    }

  }, [termState])

  const onchangeValue = (value: any) => {
    setTermSelect(value);
    dispatch(TermSlices.actions.setTermSelected(value))
  }

  const router = useLocation();
  console.log(router)

  const renderTerm = useMemo(() => {
    return (
      <>{
        <div className={cls('filter_term')}>

          <Text style={{ paddingBottom: '8px', textTransform: 'uppercase' }} type="secondary">Học kỳ</Text>
          <Select
            size={"large"}
            style={{ width: '80%' }}
            placeholder={termState?.termIndex?.name ? termState?.termIndex?.name : termState.term[0].name}
            onChange={(value: any) =>
              onchangeValue(value)
            }
            disabled={router.pathname !== '/term' ? true : false}
            options={term.map((val) => {
              return {
                value: val.id,
                label: val.name,
              };
            })}
          />
        </div>
      }</>
    )
  }, [term, termSelect])

  return (
    <div className={cls('management')}>
      <div className={cls('menu')} id="menu">
        <div className={cls('empty')}>
          <Link to="/user-info">
            <img src={userState.user.avatar ? userState.user.avatar : avatarDefault} alt="" />
          </Link>
          <div className={cls('username')}>{userState.user.name}
          </div>
        </div>
        {renderTerm}
        <hr />

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
              <Image style={{ fontSize: 22, marginRight: 10 }} />
              <p>{name}</p>
            </Link>
          );
        })}
        <hr style={{ marginTop: 100 }} />
        <div className={cls('menu_item')} onClick={logout}>
          <BiLogOutCircle style={{ fontSize: 22, marginRight: 10 }} />
          <p>Đăng xuất</p>
        </div>
      </div>
    </div >
  );
};

export default Management;
