import { message } from 'antd';

const addMusicToDB = async (album, api_key, noImg) => {
    console.log("추가하려는 곡 제목 : " + album.name);
    console.log("추가하려는 가수 이름 : " + album.artist);

    // API 호출
    const getdata = await fetch(
        `https://ws.audioscrobbler.com/2.0/?method=track.getInfo&api_key=${api_key}&artist=${album.artist}&track=${album.name}&format=json`
    );

    const data = await getdata.json();

    // 데이터 유효성 검사
    if (!data || !data.track) {
        console.error('Invalid data structure:', data);
        return 'Invalid data structure'; // 유효하지 않은 데이터 구조일 때 에러 메시지 반환
    }

    // 안전하게 JSON 데이터를 가져오기 위한 함수
    const getValue = (data, path, defaultValue = "") => {
        const keys = path.split("."); // path를 점(.)으로 나누어 각 키를 배열로 만듦
        let value = data;

        for (let key of keys) {
            if (value && value[key] !== undefined) {
                value = value[key]; // Json 데이터에 해당 값이 있으면 계속 탐색
            } else {
                if (keys.includes("image")) {
                    console.log("No image data!!");
                    return noImg; // 이미지가 없을 경우 기본 이미지
                }
                console.log(`No ${key} data`);
                return defaultValue; // 값이 없으면 기본값 반환
            }
        }

        return value || defaultValue;
    };

    // db 앨범 데이터 구성
    const userAlbumData = {
        name: getValue(data, "track.name"),
        artist: getValue(data, "track.artist.name"),
        image: getValue(data, "track.album.image.2.#text", noImg),
        published: getValue(data, "track.wiki.published"),
        duration: getValue(data, "track.duration") / 1000 || "", // 초단위로 맞춤
        memo: "",
        genre: getValue(data, "track.toptags.tag.0.name"),
        id: getValue(data, "mbid")
    };

    // 추가된 db 저장
    const response = await fetch('https://66ff48002b9aac9c997ec8d3.mockapi.io/api/music', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(userAlbumData)
    });

    // 저장 결과 확인
    if (response.ok) message.success("Music save success"); // 성공 알림
    else message.error("Music save fail"); // 실패 알림
};

export default addMusicToDB;
