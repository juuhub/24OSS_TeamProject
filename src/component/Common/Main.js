import React, { useEffect, useState } from 'react';
import { Avatar, Button, List, Skeleton, Pagination, Input, Typography, Modal, message } from 'antd';
import { EditOutlined, DeleteOutlined, PlusCircleOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import './common.css';
import AlbumDetails from '../Detail/UserMusicDetail';

const { Text } = Typography;
const { Search } = Input;
const pageSize = 5;
const fakeDataUrl = `https://66ff48002b9aac9c997ec8d3.mockapi.io/api/music`;


const Main = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchText, setSearchText] = useState('');

  const [selectedAlbum, setSelectedAlbum] = useState(null); // 선택한 앨범 정보를 저장
  const [isModalVisible, setIsModalVisible] = useState(false); // 모달 표시 여부

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

  // 삭제 처리 함수
  const handleDelete = (id) => {
    Modal.confirm({
      title: 'Are you sure you want to delete this music?',
      content: 'This action cannot be undone.',
      okText: 'Delete',
      okType: 'danger',
      cancelText: 'Cancel',
      onOk: async () => {
        try {
          const response = await fetch(`${fakeDataUrl}/${id}`, {
            method: 'DELETE',
          });

          if (response.ok) {
            message.success('Music deleted successfully!');
            setData(data.filter(item => item.id !== id)); // 리스트에서 삭제
          } else {
            message.error('Failed to delete music.');
          }
        } catch (error) {
          message.error('An error occurred: ' + error.message);
        }
      },
    });
  };

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
          Search and Add
        </Button>
      </div>

      {/* 리스트 항목 */}
      <List
        itemLayout="horizontal"
        dataSource={paginatedData}
        loading={loading}
        renderItem={(item) => (
          <List.Item
            className="list-item"
            actions={[
              <Button
                key="edit"
                type="link"
                icon={<EditOutlined />}
                className="action-button"
                onClick={(e) => {
                  navigate(`Music/EditMusic/${item.id}`)
                  e.stopPropagation();
                }} // 각 아이템의 ID에 맞게 경로 설정
              />,
              <Button
                key="delete"
                type="link"
                icon={<DeleteOutlined />}
                className="action-button"
                style={{ marginLeft: '5px' }}
                onClick={(e) => {
                  e.stopPropagation();
                  handleDelete(item.id)
                }} // 삭제 처리 함수 호출
              />,
            ]}
          >
            <Skeleton avatar title={false} loading={item.loading} active>
              <div className="list-item-content element-sytle"
                onClick={() => {
                  setSelectedAlbum(item); // 선택한 앨범 저장
                  setIsModalVisible(true); // 모달 표시
                }}
                style={{ cursor: 'pointer' }}
              >
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

      <Modal
        title="Album Details"
        visible={isModalVisible}
        onCancel={() => setIsModalVisible(false)} // 취소하면 모달 닫기
        footer={null} // 하단 버튼 숨기기
      >
        <AlbumDetails album={selectedAlbum} />
      </Modal>
    </div>
  );
};

export default Main;
