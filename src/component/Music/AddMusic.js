import React, { useState } from 'react';
import { Form, Input, Button, DatePicker, InputNumber, message } from 'antd';
import { useNavigate } from 'react-router-dom';
import './music.css';
import noImg from "../../img/noImg.png";
import moment from 'moment';

const { TextArea } = Input;

const AddMusic = () => {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const formatReleaseDate = (date) => {
    return moment(date).format('DD MMM YYYY, HH:mm'); // moment.js를 사용하여 형식 지정
  };

  // 폼 제출 처리 함수
  const onFinish = async (values) => {
    setLoading(true);

    const formattedDate = formatReleaseDate(values.releaseDate); 

    // 이미지 URL이 빈칸일 경우 기본 이미지 경로로 설정
    const imageUrl = values.imageUrl ? values.imageUrl : noImg;

    // 데이터 폼 변환
    const formData = {
      name: values.name,
      artist: values.artist,
      genre: values.genre,
      duration: values.duration,
      published: formattedDate, // 날짜 형식 변환
      memo: values.details, // memo 필드로 변경
      image: imageUrl, // 이미지 URL 확인 후 적용
    };

    try {
      const response = await fetch('https://66ff48002b9aac9c997ec8d3.mockapi.io/api/music', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        message.success('Music added successfully!');
        navigate('/'); // 메인 페이지로 이동
      } else {
        message.error('Failed to add music. Please try again.');
      }
    } catch (error) {
      message.error('An error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="form-container">
      <h1 className="form-title">Add Music</h1>
      <Form layout="vertical" onFinish={onFinish}>
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
          <DatePicker
            className="full-width"
            showTime={{ format: 'HH:mm' }} // 초를 제외한 시:분 포맷
            format="DD MMM YYYY, HH:mm" // 입력 포맷
          />
        </Form.Item>

        {/* 세부정보 입력 */}
        <Form.Item
          label="Details"
          name="details"
          rules={[{ required: false, message: 'Please enter details' }]}
        >
          <TextArea rows={4} placeholder="Enter details" />
        </Form.Item>

        {/* 사진 URL 입력 */}
        <Form.Item
          label="Image URL"
          name="imageUrl"
          rules={[
            { required: false, message: 'Please enter the image URL' }, // 필수 입력 제거
            { type: 'url', message: 'Please enter a valid URL' },
          ]}
        >
          <Input placeholder="Enter image URL" />
        </Form.Item>

        {/* 제출 버튼 */}
        <Form.Item className="button-container">
          <Button type="primary" htmlType="submit" loading={loading} className="submit-button">
            Add Music
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
};

export default AddMusic;
