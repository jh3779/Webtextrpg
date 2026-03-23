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
  const healAmount = [10, 20, 40];
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

let gameActive = false;
// 게임 진행 중 여부 (게임오버 또는 클리어 시 false)

let gameState = "waiting";
// 게임 상태: "waiting"(입장 대기) / "playerTurn"(공격 대기) / "monsterDelay"(몬스터 공격 대기) / "dodgeWindow"(회피 대기) / "nextFloor"(다음 층 대기)

let dodgeCooldown = 0;
// 회피 쿨타임 (0이면 회피 가능, 1 이상이면 회피 불가)

let dodgeTimer = null;
// 회피 시간 제한용 타이머

const dodgeWindows = [1500, 1200, 800];
// 층별 회피 제한 시간 (ms) - 높은 층일수록 짧음


function updateStatus() {
  document.getElementById("p-name").innerText = characterName;
  document.getElementById("p-floor").innerText = currentFloor + "층";
  document.getElementById("p-hp").innerText = player.hp;
  document.getElementById("p-maxHp").innerText = player.maxHp;
  document.getElementById("p-atk").innerText = player.atk;
}

function addLog(message, className) {
  const logWindow = document.getElementById("log-window");
  const newLog = document.createElement("p");
  newLog.innerText = message;
  if (className) {
    newLog.className = className;
  }
  logWindow.appendChild(newLog);
  logWindow.scrollTop = logWindow.scrollHeight;
}

function applyFloorBuff() {
  if (currentFloor === 3) {
    player.atk += 10;
    addLog("드래곤의 기운을 받아 공격력이 상승했습니다. (공격력: " + player.atk + ")", "log-buff");
  }
}
// 3층 진입 시 공격력 버프

function processGameOver() {
  addLog("게임오버...", "log-gameover");
  addLog("Enter를 누르고 다시 플레이하세요.", "log-system");
  document.getElementById("p-status").innerText = "게임오버";
  gameActive = false;
  gameState = "waiting";
}

function handleMonsterTurn(monster) {
  gameState = "monsterDelay";
  const delayTime = 1500;

  setTimeout(function() {
    if (!gameActive) {
      return;
    }

    // 쿨타임 중이면 회피 불가, 바로 피격
    if (dodgeCooldown > 0) {
      dodgeCooldown -= 1;
      addLog("회피 불가! (쿨타임: " + (dodgeCooldown + 1) + "턴)", "log-dodge-fail");
      monsterAttack(monster);
      addLog(monster.name + "의 공격! " + characterName + "에게 " + monster.atk + " 데미지! (HP: " + player.hp + "/" + player.maxHp + ")", "log-monster-atk");

      if (checkGameOver()) {
        processGameOver();
      }

      gameState = "playerTurn";
      updateStatus();
      return;
    }

    // 회피 가능 → 회피 창 열기
    const timeLimit = dodgeWindows[currentFloor - 1];
    addLog(monster.name + "이 공격합니다! 회피하세요! (" + (timeLimit / 1000) + "초)", "log-dodge-prompt");
    gameState = "dodgeWindow";

    dodgeTimer = setTimeout(function() {
      if (gameState !== "dodgeWindow") {
        return;
      }
      // 시간 초과 → 피격
      gameState = "playerTurn";
      addLog("회피 실패!", "log-dodge-fail");
      monsterAttack(monster);
      addLog(monster.name + "의 공격! " + characterName + "에게 " + monster.atk + " 데미지! (HP: " + player.hp + "/" + player.maxHp + ")", "log-monster-atk");

      if (checkGameOver()) {
        processGameOver();
      }

      updateStatus();
    }, timeLimit);
  }, delayTime);
}

function handleDodge() {
  if (gameState !== "dodgeWindow") {
    return;
  }

  clearTimeout(dodgeTimer);
  gameState = "playerTurn";
  dodgeCooldown = 2;
  addLog("회피 성공! (다음 2턴 회피 불가)", "log-dodge-success");
  updateStatus();
}

function handleAttack() {
  if (!gameActive || gameState !== "playerTurn") {
    return;
  }

  const monster = monsters[currentFloor - 1];

  // 플레이어 → 몬스터 공격
  playerAttack(monster);
  addLog(characterName + "의 공격! " + monster.name + "에게 " + player.atk + " 데미지! (HP: " + monster.hp + "/" + monster.maxhp + ")", "log-player-atk");
  updateStatus();

  // 몬스터 처치 판정
  if (checkMonsterDead()) {
    addLog(monster.name + "을(를) 처치했다!", "log-kill");

    // 게임 클리어 판정
    if (checkGameClear()) {
      addLog("던전을 클리어했습니다! 축하합니다!", "log-clear");
      document.getElementById("p-status").innerText = "던전 클리어!";
      gameActive = false;
      updateStatus();
      return;
    }

    // 회복 → 다음 층 대기
    healAfterClear();
    addLog("HP를 회복했습니다! (HP: " + player.hp + "/" + player.maxHp + ")", "log-heal");
    addLog((currentFloor + 1) + "층에 진입하려면 Enter를 누르세요.", "log-system");
    gameState = "nextFloor";
    updateStatus();
    return;
  }

  // 몬스터 턴 처리
  handleMonsterTurn(monster);
}

function resetGame() {
  player.hp = player.maxHp;
  player.atk = 15;
  currentFloor = 1;
  dodgeCooldown = 0;

  monsters[0].hp = monsters[0].maxhp;
  monsters[1].hp = monsters[1].maxhp;
  monsters[2].hp = monsters[2].maxhp;

  // 로그창 초기화
  const logWindow = document.getElementById("log-window");
  while (logWindow.firstChild) {
    logWindow.removeChild(logWindow.firstChild);
  }
}

function startDungeon() {
  if (gameState !== "waiting") {
    return;
  }

  resetGame();
  gameActive = true;
  gameState = "playerTurn";
  document.getElementById("p-status").innerText = "전투 중";
  addLog("던전에 입장했습니다!", "log-system");
  addLog("--- " + currentFloor + "층 ---", "log-floor");
  addLog(monsters[currentFloor - 1].name + "이 나타났습니다!");
  updateStatus();
}

function enterNextFloor() {
  if (gameState !== "nextFloor") {
    return;
  }

  nextFloor();
  gameState = "playerTurn";
  addLog("--- " + currentFloor + "층 ---", "log-floor");
  addLog(monsters[currentFloor - 1].name + "이 나타났습니다!");
  applyFloorBuff();
  dodgeCooldown = 0;
  updateStatus();
}

// 키보드 이벤트 연결
document.addEventListener("keydown", function(event) {
  if (event.key === "Enter") {
    startDungeon();
    enterNextFloor();
  }
  if (event.key === "a") {
    handleAttack();
  }
  if (event.key === "d") {
    handleDodge();
  }
});