let characterName = "신입 궁수"; 

const initialLevel = 1;

const player = {
  hp: 100, 
  maxHp: 100, 
  atk: 15
};
// 플레이어 객체

const monsters = [
  {name: "슬라임", hp: 30, maxhp: 30,atk: 20},
  {name: "고블린", hp: 120, maxhp: 120, atk: 12},
  {name: "드래곤", hp: 180, maxhp:180, atk: 20}
  ]
// 몬스터 3마리를 배열로 선언

let currentFloor = 1;
const maxFloor = 3;
// 현재 몇 층인지 추적하는 던전 상태 변수

function playerAttack(monster) { 
  monster.hp -= player.atk;

  if (monster.hp < 0) {
    monster.hp = 0;
  }
}
// 플레이어 → 몬스터 공격 처리

function monsterAttack(monster) {
  player.hp -= monster.atk;

  if (player.hp < 0) {
    player.hp = 0;
  }
}
// 몬스터 → 플레이어 공격 처리

function checkGameOver() {
  return player.hp <= 0;
}
// 게임오버 판정

function healAfterClear() {
  const healAmount = [10, 20, 30];
  player.hp += healAmount[currentFloor - 1];

  if (player.hp > player.maxHp) {
    player.hp = player.maxHp;
  }
}
// 층 클리어 시 HP 회복
// 층마다 다른 회복량 적용, maxHp 초과 불가

function checkMonsterDead() {
  return monsters[currentFloor - 1].hp <= 0;
}
// 현재 층의 몬스터가 죽었는지 판정

function nextFloor() {
  currentFloor += 1;
}
// 다음 층으로 이동
// 몬스터 처치 → healAfterClear() → nextFloor() - Clear했던 층의 회복량 적용
// 몬스터 처치 → nextFloor() → healAfterClear() ❌ - 다음 층 회복량이 적용됨

function checkGameClear() {
  return monsters[maxFloor - 1].hp <= 0;
}
// 마지막 층까지 Clear 한 건지 확인

document.getElementById("p-name").innerText = characterName;
// document: 현재 실행 중인 HTML 문서 전체를 가리키는 객체입니다.
// getElementById("p-name"): HTML 코드 중 id가 "p-name"인 특정 태그를 찾아오는 함수입니다.
// .innerText: 찾은 태그 안에 들어갈 텍스트 내용을 변경하는 속성입니다.