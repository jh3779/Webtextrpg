// [1주차 과제] 아래 변수들에 본인의 캐릭터 정보를 입력해 보세요!

let characterName = "신입 모험가"; 
// let: 변수(상자)를 선언하는 예약어로, 나중에 상자 안의 값을 바꿀 수 있게 해줍니다.
// characterName: 메모리에 저장된 데이터에 접근하기 위한 식별자(이름)입니다.
// "신입 모험가": 문자열(String) 데이터 타입으로, 텍스트 정보를 저장할 때 반드시 따옴표를 씁니다.

const initialLevel = 1;
// const: '상수'를 선언하며, 한 번 할당한 값을 절대 바꿀 수 없도록 보호하는 키워드입니다.
// 1: 숫자(Number) 데이터 타입으로, 산술 연산이 가능한 데이터입니다.

// 화면에 캐릭터 이름을 표시하는 로직 (4주차에 자세히 배웁니다)
document.getElementById("p-name").innerText = characterName;
// document: 현재 실행 중인 HTML 문서 전체를 가리키는 객체입니다.
// getElementById("p-name"): HTML 코드 중 id가 "p-name"인 특정 태그를 찾아오는 함수입니다.
// .innerText: 찾은 태그 안에 들어갈 텍스트 내용을 변경하는 속성입니다.

console.log("게임 준비 완료: " + characterName);
// console.log: 브라우저 개발자 도구(F12)의 콘솔 창에 메시지를 출력하여 버그를 찾거나 확인하는 도구입니다.
