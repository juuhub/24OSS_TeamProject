import React, { useEffect, useState } from 'react';
import { Avatar, Spin } from 'antd'; // Spin은 로딩 애니메이션을 위한 컴포넌트

const AlbumDetails = ({ album, apiKey }) => {
    const [trackInfo, setTrackInfo] = useState(null); // trackInfo 상태를 추가
    const [loading, setLoading] = useState(true); // 로딩 상태를 추가

    useEffect(() => {
        const fetchTrackInfo = async () => {
            if (!album) return;

            const encodedArtist = encodeURIComponent(album.artist);
            const encodedTrack = encodeURIComponent(album.name);
            const apiUrl = `https://ws.audioscrobbler.com/2.0/?method=track.getInfo&api_key=${apiKey}&artist=${encodedArtist}&track=${encodedTrack}&format=json`;

            try {
                const getdata = await fetch(apiUrl);
                const data = await getdata.json();
                setTrackInfo(data.track); // 가져온 track 정보를 상태에 설정
            } catch (error) {
                console.error("Error fetching track info:", error);
            } finally {
                setLoading(false); // 로딩 완료
            }
        };

        fetchTrackInfo();
    }, [album, apiKey]); // album과 apiKey가 변경될 때마다 fetchTrackInfo 호출

    if (loading) return <Spin tip="Loading..." />; // 로딩 중일 때 로딩 스피너 표시
    if (!trackInfo) return null; // trackInfo가 없으면 null 반환

    // 곡 시간이 밀리초로 주어지므로 초로 변환
    const durationInMinutes = Math.floor(trackInfo.duration / 60000);
    const durationInSeconds = Math.floor((trackInfo.duration % 60000) / 1000);
    const formattedDuration = `${durationInMinutes}:${durationInSeconds < 10 ? '0' : ''}${durationInSeconds}`;

    // HTML 문자열에서 <a> 태그와 그 안의 요소들을 걸러내는 함수
    const stripHtmlTags = (htmlString) => {
        const parser = new DOMParser();
        const doc = parser.parseFromString(htmlString, 'text/html');
        // <a> 태그를 모두 제거하고 텍스트만 반환
        const aTags = doc.querySelectorAll('a');
        aTags.forEach(a => a.remove());
        return doc.body.textContent || ''; // 텍스트만 반환
    };

    const releaseDate = trackInfo.wiki?.published || 'No release date available.';
    const details = stripHtmlTags(trackInfo.wiki?.summary || 'No details available.');

    return (
        <div>
            <Avatar src={album.image} size={128} className="album-image" />
            <h2>{album.name}</h2>
            <p><strong>Artist:</strong> {album.artist}</p>
            <p><strong>Release Date:</strong> {releaseDate}</p> {/* 발매일 정보임 */}
            <p><strong>Duration:</strong> {formattedDuration}</p> {/* 노래 재생 시간 */}
            <p><strong>Album Details:</strong> {details}</p> {/* 세부정보인데 <a>이거 빼고 */}
        </div>
    );
};

export default AlbumDetails;
