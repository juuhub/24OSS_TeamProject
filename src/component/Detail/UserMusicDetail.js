import { Avatar } from 'antd'; // Spin은 로딩 애니메이션을 위한 컴포넌트

const AlbumDetails = ({ album }) => {

    if (!album) return null; // trackInfo가 없으면 null 반환

    // 곡 시간 초로 맞추기
    const durationInMinutes = Math.floor(album.duration / 60);
    const durationInSeconds = Math.floor((album.duration % 60));
    const formattedDuration = `${durationInMinutes}:${durationInSeconds < 10 ? '0' : ''}${durationInSeconds}`;

    const releaseDate = album.published || 'No release date available.';
    const details = album.memo || 'No details';
    return (
        <div>
            <Avatar src={album.image} size={128} className="album-image" />
            <h2>{album.name}</h2>
            <p><strong>Artist:</strong> {album.artist}</p>
            <p><strong>Release Date:</strong> {releaseDate}</p> {/* 발매일 정보임 */}
            <p><strong>Duration:</strong> {formattedDuration}</p> {/* 노래 재생 시간 */}
            <p><strong>Album Details:</strong> {details}</p>
        </div>
    );
};

export default AlbumDetails;
