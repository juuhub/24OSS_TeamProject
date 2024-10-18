import React, { useEffect, useState } from 'react';
import { Avatar, Button, List, Skeleton, Pagination, Input, Typography } from 'antd';
import { EditOutlined, DeleteOutlined, PlusCircleOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import './common.css';

const { Text } = Typography;
const { Search } = Input;
const pageSize = 5;
const fakeDataUrl = `https://66ff48002b9aac9c997ec8d3.mockapi.io/api/music`;

const Main = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchText, setSearchText] = useState('');

  const navigate = useNavigate();

  useEffect(() => {
    fetch(fakeDataUrl)
      .then((res) => res.json())
      .then((res) => {
        setData(res);
        setLoading(false);
      });
  }, []);

  // 검색 처리 함수
  const handleSearch = (value) => {
    setSearchText(value.toLowerCase());
  };

  // 페이지 이동 시 처리 함수
  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  // 검색된 데이터를 필터링하는 함수
  const filteredData = data.filter(
    (item) =>
      item.name.toLowerCase().includes(searchText) ||
      item.artist.toLowerCase().includes(searchText) ||
      item.genre?.toLowerCase().includes(searchText)
  );

  // 페이지별로 데이터를 자르는 함수
  const paginatedData = filteredData.slice((currentPage - 1) * pageSize, currentPage * pageSize);

  return (
    <div className="container">
      {/* 검색창과 페이지 이동 버튼 */}
      <div className="search-and-button">
        <Search
          placeholder="Search by name, artist, or genre"
          onSearch={handleSearch}
          style={{ width: 300 }}
        />
        <Button type="primary" onClick={() => navigate('/search')}>
          API Page
        </Button>
      </div>

      {/* 리스트 항목 */}
      <List
        itemLayout="horizontal"
        dataSource={paginatedData}
        loading={loading}
        renderItem={(item) => (
          <List.Item
            actions={[
              <Button 
                key="edit" 
                type="link" 
                icon={<EditOutlined />} 
                className="action-button"
              />,
              <Button 
                key="delete" 
                type="link" 
                icon={<DeleteOutlined />} 
                className="action-button"
                style={{ marginLeft: '5px' }}
              />,
            ]}
          >
            <Skeleton avatar title={false} loading={item.loading} active>
              <div className="list-item-content">
                <Avatar src={item.image} size={64} className="item-avatar" />
                <div className="item-details">
                  <Text strong className="item-name">{item.name}</Text>
                  <br />
                  <Text className="item-secondary">{item.artist} / {item.genre}</Text>
                </div>
                <div className="item-duration">
                  {Math.floor(item.duration / 60)} : {item.duration % 60}
                </div>
              </div>
            </Skeleton>
          </List.Item>
        )}
      />

      <div className="pagination-container">
        <Pagination
          current={currentPage}
          pageSize={pageSize}
          total={filteredData.length}
          onChange={handlePageChange}
        />
      </div>

      {/* 오른쪽 하단 추가 버튼 */}
      <div className="add-icon">
        <Button 
          type="primary" 
          shape="circle" 
          icon={<PlusCircleOutlined />} 
          size="large" 
          className="add-button"
          onClick={() => navigate('Music/AddMusic')}
        />
      </div>
    </div>
  );
};

export default Main;
