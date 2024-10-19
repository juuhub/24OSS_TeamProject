import React, { useState } from "react";
import { List, Button, Skeleton, Avatar, Typography, Pagination, Input, Select } from "antd";
import { PlusCircleOutlined } from "@ant-design/icons";
import { Modal } from "antd"; // 모달 컴포넌트 추가
import AlbumDetails from "../Detail/APIMusicDetail"; // 세부정보 보여주는 모달
import addMusicToDB from './AddMusicToDB'; // 사용자 db에 저장하는 역할
import getImageUrl from './GetImg'; // 이미지 받아오는 역할
import '../Common/common.css'
import './Search.css'
import '../Detail/Modal.css'
import noImg from "../../img/noImg.png";

const { Text } = Typography;

function Search() {
    const [searchTerm, setSearchTerm] = useState("");
    const [albums, setAlbums] = useState([]);
    const [loading, setLoading] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const [albumsCount, setCount] = useState();
    const [apiItemsPerPage, setItemsPerPage] = useState(10); // 값을 알 수 없으니 itemsPerPage랑 같은 값 넣어줌
    const [searchOption, setSearchOption] = useState("track"); // 기본값은 제목으로 검색

    const [selectedAlbum, setSelectedAlbum] = useState(null); // 선택한 앨범 정보를 저장
    const [isModalVisible, setIsModalVisible] = useState(false); // 모달 표시 여부

    const itemsPerPage = 10;

    const searchOptions = [ // 이건 검색 옵션
        { label: "Name", value: "track" },
        { label: "Artist", value: "artist" }
    ];
    const api_key = "873cf422b0fab3416eb51f4c0f99e24b";

    // API 호출 함수
    const fetchAlbums = async (page) => {
        setLoading(true);

        const apiPage = Math.ceil(page / (apiItemsPerPage / itemsPerPage)); // API에서 값을 불러올 때 넣어줄 page 값 계산
        /* 
            계산식
            apiPage와 내 웹 page를 맞춰줘야함, 내가 지금 10개 단위로 받고 있으니 api페이지 페이지 요소 갯수를 담고있는
            apiItemsPerPage랑 내가 지금 받고있는 단위인 itemsPerPage를 나눈 값을 현재 내 웹 페이지랑 나눠서 맞추는 방식
        */

        console.log("search option: " + searchOption);

        if (searchOption === "track") { // 제목으로 검색
            // API 호출부분
            // 원래는 album이랑 artist선택한거에 따라서 동적으로 하려고 했는데 JSON 데이터가 좀 많이 달라서 if문으로 따로 구분
            // 원래 주소도 searchOption 안 넣고 정적으로 해도 되는데 아까워서 그냥 넣어둠
            const response = await fetch(
                `https://ws.audioscrobbler.com/2.0/?method=${searchOption}.search&track=${searchTerm}&api_key=${api_key}&format=json&page=${apiPage}`
            );
            const data = await response.json();

            if (!data.results) { // 검색한 결과가 없을 때 처리하기 위한거 그냥 다 비워놓게
                console.error("엘범 이름 못 찾음");
                setAlbums([]); // 앨범 목록을 빈 배열로 설정
                setCount(0);
                setLoading(false);
                return;
            }

            const updateItemsPerPage = data.results["opensearch:itemsPerPage"];
            setItemsPerPage(updateItemsPerPage);

            // 30개의 JSON데이터에서 페이지에 맞게 10개씩 뽑기위한 변수들
            const startIndex = (page - 1 - (apiPage - 1) * (apiItemsPerPage / itemsPerPage)) * itemsPerPage; // 시작 인덱스 설정
            /*
                시작 인덱스 구하는건 api한 페이지에 내 웹 몇페이지 나오는지 구하는게 apiItemsPerPage / itemsPerPage 이거고 구한 단위에다가
                현재 api페이지 * 단위를 한거에 현재 웹 페이지를 빼고
                인덱스가 0부터 시작이니 -1을 해주고 내가 읽는 단위만큼 곱해주면 JSON 파일에서 읽어야할 위치가 나온다.
             */
            const endIndex = startIndex + itemsPerPage; // 끝 인덱스

            const tracksData = data.results.trackmatches.track.slice(startIndex, endIndex).map((track) => ({
                name: track.name,
                artist: track.artist,
                image: noImg  // 초기값은 그냥 물음표 이미지로 설정
            }));

            // 이미지 로딩 비동기 처리
            const updatedTracksData = await Promise.all(tracksData.map(async (track) => {
                const imageUrl = await getImageUrl(track, track.name, track.artist);  // 비동기적으로 이미지 URL 가져오기
                return { ...track, image: imageUrl };  // 이미지 업데이트해서 넣기
            }));

            const albumCounts = data.results["opensearch:totalResults"];
            // JSON 목록에서 검색한 데이터의 총 갯수를 받아온다.
            const result = albumCounts > 100 ? 1000 : albumCounts;
            // 총 데이터수가 100을 넘으면 페이지는 100으로 제한, 원래 갯수에 맞게 하려했는데 끝쪽으로 가니까 데이터가 그냥 없는경우가 많아서 100에서 컷

            console.log("현재 웹 page: " + page);
            console.log("계산 apipage: " + apiPage);
            console.log("apiItemsPerPage: " + apiItemsPerPage);
            console.log("itemsPerPage: " + itemsPerPage);
            setAlbums(updatedTracksData);
            setCount(result);
            setLoading(false);

        } else if (searchOption === "artist") { // 가수로 검색
            // API 호출부분
            // page값에 apiPage값을 넣어줌
            const apiPage = Math.ceil(page / (apiItemsPerPage / itemsPerPage));
            const response = await fetch(
                `https://ws.audioscrobbler.com/2.0/?method=${searchOption}.gettoptracks&${searchOption}=${searchTerm}&api_key=873cf422b0fab3416eb51f4c0f99e24b&format=json&page=${apiPage}`
            );
            const data = await response.json();

            if (!data.toptracks) { // 검색한 결과가 없을 때 처리하기 위한거 그냥 다 비워놓게
                console.error("없는 가수이름");
                setAlbums([]);
                setCount(0);
                setLoading(false);
                return;
            }

            const attr = data.toptracks["@attr"];
            const updateItemsPerPage = parseInt(attr.perPage);
            setItemsPerPage(updateItemsPerPage);

            const startIndex = (page - 1 - (apiPage - 1) * (apiItemsPerPage / itemsPerPage)) * itemsPerPage; // 시작 인덱스
            const endIndex = startIndex + itemsPerPage; // 끝 인덱스

            console.warn("시작: "+startIndex);
            console.warn("끝: "+endIndex);


            const albumsData = data.toptracks.track.slice(startIndex, endIndex).map((track) => ({
                name: track.name,
                artist: track.artist.name,
                image: noImg  // 초기값은 그냥 물음표 이미지로 설정
            }));

            // 이미지 로딩 비동기 처리
            const updatedAlbumsData = await Promise.all(albumsData.map(async (track) => {
                const imageUrl = await getImageUrl(track, track.name, track.artist);  // 비동기적으로 이미지 URL 가져오기
                return { ...track, image: imageUrl };  // 이미지 업데이트해서 넣기
            }));

            const albumCounts = attr.total;
            const result = albumCounts > 100 ? 1000 : albumCounts;

            console.log("현재 웹 page: " + page);
            console.log("계산 apipage: " + apiPage);
            console.log("apiItemsPerPage: " + apiItemsPerPage);
            console.log("itemsPerPage: " + itemsPerPage);
            setAlbums(updatedAlbumsData);
            setCount(result);
            setLoading(false);
        }
    };

    // 검색하면 1번째 페이지로 가게 하는거
    const handleSearch = () => {
        if (!searchTerm) return;
        setCurrentPage(1);
        fetchAlbums(1);
    };

    // 페이지가 변경될 때마다 해당 페이지 데이터 불러오기
    const handlePageChange = (page) => {
        setCurrentPage(page);
        fetchAlbums(page);
    };

    return (
        <div className="container">
            <div className="search-button-style">
                <Select
                    defaultValue={searchOption}
                    onChange={(value) => setSearchOption(value)}
                    style={{ width: 120, marginRight: 8 }} // marginRight로 간격을 조절
                >
                    {searchOptions.map((option) => (
                        <Select.Option key={option.value} value={option.value}>
                            {option.label}
                        </Select.Option>
                    ))}
                </Select>
                <Input.Search
                    type="text"
                    id="music"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    onSearch={handleSearch}
                    placeholder="Search by music name, artist"
                    style={{ width: 300 }}
                />
            </div>
            <List
                itemLayout="horizontal"
                dataSource={albums}
                loading={loading}
                renderItem={(item) => (
                    <List.Item
                        className="list-item"
                        actions={[
                            <Button
                                shape="circle"
                                size="large"
                                key="add"
                                type="primary"
                                icon={<PlusCircleOutlined />}
                                className="add-button"
                                onClick={(e) => {
                                    e.stopPropagation(); // + 버튼 누르면 모달창 안뜨게
                                    addMusicToDB(item, api_key, noImg)
                                }}
                            />,
                        ]}
                        onClick={() => {
                            setSelectedAlbum(item); // 선택한 앨범 저장
                            setIsModalVisible(true); // 모달 표시
                        }}
                    >
                        <Skeleton avatar title={false} loading={loading} active>
                            <div className="list-item-content">
                                <Avatar src={item.image} size={64} className="item-avatar" />
                                <div className="item-details">
                                    <Text strong className="item-name">{item.name}</Text>
                                    <br />
                                    <Text className="item-secondary">{item.artist}</Text>
                                </div>
                            </div>
                        </Skeleton>
                    </List.Item>
                )}
            />

            {/* 페이지 번호 */}
            <div className="pagination-container">
                <Pagination
                    current={currentPage}
                    pageSize={itemsPerPage}
                    total={albumsCount}
                    onChange={handlePageChange}
                />
            </div>

            <Modal
                className="custom-modal"
                title="Album Details"
                visible={isModalVisible}
                onCancel={() => setIsModalVisible(false)} // 취소하면 모달 닫기
                footer={null} // 하단 버튼 숨기기
            >
                <AlbumDetails album={selectedAlbum} apiKey={api_key} />
            </Modal>
        </div>
    );
}

export default Search;
