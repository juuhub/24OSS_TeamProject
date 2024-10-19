import noImg from "../../img/noImg.png";

const getImageUrl = async (track, music, artist) => {
    const api_key = "873cf422b0fab3416eb51f4c0f99e24b";

    const encodedArtist = encodeURIComponent(artist);
    const encodedTrack = encodeURIComponent(music);

    const apiUrl = `https://ws.audioscrobbler.com/2.0/?method=track.getInfo&api_key=${api_key}&artist=${encodedArtist}&track=${encodedTrack}&format=json`;
    const getdata = await fetch(apiUrl);
    const data = await getdata.json();

    if (!data.track.album) {
        console.warn("Invalid track object:", track);
        return noImg; // 기본 이미지 반환
    }


    if (data.track.album.image[2]["#text"]) {
        if (data.track.album.image[2]["#text"] !== "") {
            return data.track.album.image[2]["#text"];
        } else {
            return noImg;
        }
    }
    return noImg;
};

export default getImageUrl;
