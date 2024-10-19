import React, { useState, useEffect } from 'react';
import { Form, Input, Button, DatePicker, InputNumber, message } from 'antd';
import { useNavigate, useParams } from 'react-router-dom';
import moment from 'moment'; // moment 라이브러리 import
import './music.css';

const { TextArea } = Input;

const EditMusic = () => {
  const [loading, setLoading] = useState(false);
  const [initialData, setInitialData] = useState(null);
  const navigate = useNavigate();
  const { id } = useParams();

  // 초기 데이터를 가져오는 함수
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(`https://66ff48002b9aac9c997ec8d3.mockapi.io/api/music/${id}`);
        const data = await response.json();
        
        // 날짜를 moment 객체로 변환
        if (data.published) {
          data.published = moment(data.published); // moment로 변환
        }
        setInitialData(data);
      } catch (error) {
        message.error('Failed to fetch music details.');
      }
    };

    fetchData();
  }, [id]);

  // 폼 제출 처리 함수
  const onFinish = async (values) => {
    setLoading(true);

    // 수정된 데이터를 처리하는 부분
    const updatedData = {
      id, // 기존 ID 유지
      name: values.name,
      artist: values.artist,
      genre: values.genre,
      duration: values.duration,
      published: values.releaseDate.toISOString(), // published로 날짜 형식 맞춤
      memo: values.details, // memo 필드 사용
      image: values.imageUrl, // image 필드 사용
    };

    try {
      const response = await fetch(`https://66ff48002b9aac9c997ec8d3.mockapi.io/api/music/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updatedData),
      });

      if (response.ok) {
        message.success('Music updated successfully!');
        navigate('/'); // 메인 페이지로 이동
      } else {
        const errorData = await response.json(); // 응답 내용 확인
        console.error('Error response:', errorData); // 콘솔에 로그 남기기
        message.error('Failed to update music. Please try again.');
      }
    } catch (error) {
      message.error('An error occurred: ' + error.message); // 에러 메시지 표시
    } finally {
      setLoading(false);
    }
  };

  // 데이터가 아직 로드되지 않았으면 로딩 메시지를 출력
  if (!initialData) {
    return <div>Loading...</div>;
  }

  return (
    <div className="form-container">
      <h1 className="form-title">Edit Music</h1>
      <Form
        layout="vertical"
        onFinish={onFinish}
        initialValues={{
          name: initialData.name,
          artist: initialData.artist,
          genre: initialData.genre,
          duration: initialData.duration,
          releaseDate: initialData.published ? moment(initialData.published) : null, // moment로 변환
          details: initialData.memo,
          imageUrl: initialData.image,
        }}
      >
        {/* 제목 입력 */}
        <Form.Item
          label="Title"
          name="name"
          rules={[{ required: true, message: 'Please enter the title' }]}
        >
          <Input placeholder="Enter title" />
        </Form.Item>

        {/* 가수 입력 */}
        <Form.Item
          label="Artist"
          name="artist"
          rules={[{ required: true, message: 'Please enter the artist' }]}
        >
          <Input placeholder="Enter artist" />
        </Form.Item>

        {/* 장르 입력 */}
        <Form.Item
          label="Genre"
          name="genre"
          rules={[{ required: true, message: 'Please enter the genre' }]}
        >
          <Input placeholder="Enter genre" />
        </Form.Item>

        {/* 곡 길이 입력 */}
        <Form.Item
          label="Duration (in seconds)"
          name="duration"
          rules={[{ required: true, message: 'Please enter the duration' }]}
        >
          <InputNumber min={0} placeholder="Enter duration in seconds" className="full-width" />
        </Form.Item>

        {/* 발매일 입력 */}
        <Form.Item
          label="Release Date"
          name="releaseDate"
          rules={[{ required: true, message: 'Please select the release date' }]}
        >
          <DatePicker className="full-width" />
        </Form.Item>

        {/* 세부정보 입력 */}
        <Form.Item
          label="Details"
          name="details"
          rules={[{ required: true, message: 'Please enter details' }]}
        >
          <TextArea rows={4} placeholder="Enter details" />
        </Form.Item>

        {/* 사진 URL 입력 */}
        <Form.Item
          label="Image URL"
          name="imageUrl"
          rules={[
            { required: true, message: 'Please enter the image URL' },
            { type: 'url', message: 'Please enter a valid URL' },
          ]}
        >
          <Input placeholder="Enter image URL" />
        </Form.Item>

        {/* 제출 버튼 */}
        <Form.Item className="button-container">
          <Button type="primary" htmlType="submit" loading={loading} className="submit-button">
            Save Changes
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
};

export default EditMusic;
