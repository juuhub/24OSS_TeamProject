import React, { useEffect, useState } from 'react';
import { Avatar, Button, List, Skeleton, Pagination, Space, Typography, Input } from 'antd';
import { EditOutlined, DeleteOutlined, PlusCircleOutlined } from '@ant-design/icons';
import './common.css';  // CSS 파일 추가

const { Text } = Typography;
const { Search } = Input;
const pageSize = 5;
const fakeDataUrl = `https://66ff48002b9aac9c997ec8d3.mockapi.io/api/music`;

const App = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchText, setSearchText] = useState('');

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
          enterButton="Search"
          onSearch={handleSearch}
          style={{ width: 300 }}
        />
        <Button type="primary" onClick={() => window.location.href = '/another-page'}>
          Go to Another Page
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
              />,
            ]}
          >
            <Skeleton avatar title={false} loading={item.loading} active>
              <div className="list-item-content">
                <Avatar src={item.image} size={64} className="item-avatar" />
                <div className="item-details">
                  <Text strong>{item.name}</Text>
                  <br />
                  <Text type="secondary">{item.artist} / {item.genre}</Text>
                </div>
                <div className="item-duration">
                  {Math.floor(item.duration / 60)}분 {item.duration % 60}초
                </div>
              </div>
            </Skeleton>
          </List.Item>
        )}
      />

      {/* Pagination을 가운데 정렬 */}
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
          onClick={() => alert('Add new item')}
        />
      </div>
    </div>
  );
};

export default App;