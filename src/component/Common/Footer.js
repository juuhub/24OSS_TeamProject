import React from 'react';
import { HomeOutlined, UserOutlined } from '@ant-design/icons';
import './common.css';

const Footer = () => {
  return (
    <div className="footer">
      {/* 회색 선 */}
      <div className="footer-line"></div>
      
      <div className="footer-content">
        {/* 왼편 Home 아이콘 */}
        <div className="footer-left">
          <HomeOutlined className="footer-icon" />
        </div>

        {/* 중앙 텍스트 */}
        <div className="footer-center">
          <span>© 2024 MyShared Music. All Rights Reserved.</span>
        </div>

        {/* 오른편 사용자 아이콘 */}
        <div className="footer-right">
          <UserOutlined className="footer-icon" />
        </div>
      </div>
    </div>
  );
};

export default Footer;