import React from 'react';
import AppHeader from '../header/Header';
import Management from '../management/Management';
import classNames from 'classnames/bind';
import style from './Wrapper.module.scss';
import { useAppSelector } from 'src/redux/hooks';
import { EnumRole } from 'src/enum';
import RejectUserLogin from '../notification/RejectUserLogin';

const cls = classNames.bind(style);

const Wrapper = ({ children }: { children: React.ReactElement }) => {
  return (
    <div className={cls('wrapper')}>
      <div className={cls('menu_left')}>
        <Management />
      </div>
      <div className={cls('menu_right')}>
        <AppHeader />
        <div className={cls('content')}>{children}</div>
      </div>
    </div>
  );
};

export default Wrapper;
