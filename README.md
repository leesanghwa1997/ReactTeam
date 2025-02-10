Spofity API를 활용한 음악 플레이 리스트

받아서 플레이 하려면 초기 작업이 많이 필요함

1. https://developer.spotify.com/documentation/web-api에 접속 -> Login -> Dashboard -> Create app -> Redirect URIs = http://localhost:5173/Callback 작성 APIs used = Web API, Web Playback SDK 선택후 생성하면 Client ID,Client secret 생성

2. 프로젝트를 받고 ReactTeam 안에 .env파일 생성후 아까만든 Client ID='본인꺼' Client secret='본인꺼' 작성후에 저장

3. 터미널에 yarn -> yarn dev로 실행

