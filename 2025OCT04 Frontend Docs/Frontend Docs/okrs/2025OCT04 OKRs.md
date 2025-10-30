# 2025OCT02 OKRs

생성자: 현 김
생성 일시: 2025년 10월 25일 오후 6:33
카테고리: 작업 계획
최종 편집자:: 현 김
최종 업데이트 시간: 2025년 10월 28일 오후 5:05
검토자: HyunSu Choi

# 체계적인 업무와 현황 공유를 위한 작업 루틴

모든 작업 전에 레퍼런스 탐색 및 검토 → 작업 계획 문서에다 레퍼런스 및 근거 작성하고, 필요하다면 동료에게 작업 계획 문서 검토 요청 또는 텔레그램으로 직접 질의해서 피드백 또는 컨펌 받기 → 컨펌/피드백 받은 대로 작업 실행 or 재질의 후 실행 → 작업 완료 문서 작성 후 기존 문서 태그, 어디에 어떻게 실제로 구현되었는지 상술

# 작업 중간 질의 알고리즘

텔레그램 or 노션 피드백 요청 문서로 검토 요청

→ 답변 바로 올 시 그대로 작업 진행 or 재질의 후 작업 진행 
→ 피드백이 늦다면 확인 요청 후 다른 작업 진행

[Re: Weekly Recap- 2025OCTWeek02Front](Re%20Weekly%20Recap-%202025OCTWeek02Front%20297944d779568001a7b9e34e166580b9.md)

# 화폐단위 관련

1. Settings - Preferences 제거
2. 화폐단위 수정이 있던 부분에서 빼먹은 부분 없는지 사이트 전역 검사 본인 손으로 시행, AI 의존 x
3. 어느 부분에서 수정이 있었고 지금 다시 수정할 계획인지 (둘의 범위 같음) 문서화 // 여기에 문서 링크 삽입
4. 수수료 제외한 모든 화폐변수들 변수 제거, 하드코딩으로 HYPE 고정
5. 수수료만 변수 유지, 추후 HIIN & HIDE 단위 추가 (변환 계산식 넣어서)

[2025OCT04 Task Plan - Currency & Preferences](2025OCT04%20Task%20Plan%20-%20Currency%20&%20Preferences%20298944d7795680118114e1e634571de3.md)

# 보안

1. SQL injection 사례 및 공격 시나리오 작성법 공부
2. 여타 프론트엔드 차원 공격 가능성 다방면으로 검토 (perplexity 심층조사와 구글링 이용 예정)
3. 공격 시나리오 문서화, 서준이에게 피드백 받기
4. 공격 시나리오 실행 및 분석 보고서 작성
5. 보완할 점이 보이지 않을 때까지 반복(문서 제목 예시: SQL Injection Attack Scenario #1, #2 등등)

[2025OCT04 Task Plan - Security](2025OCT04%20Task%20Plan%20-%20Security%20298944d779568012b3d0e99a01637033.md)

# Discover Page

1. 인덱스 생성할 때 티커와 이름 모두 validation을 알파벳 문자열만으로 하게끔 설정. 이모지가 없는 게 낫다
2. 인덱스 검색 알고리즘을 이름과 티커로만 검색되게끔
3. Partner Indices 카테고리 추가
4. Hot, New, Top Gainers, Top Losers, High Volume 정하는 기준 세우고 실제 데이터값에 맞게 실시간 반영 되는지 확인
5. 색상 구성 관련한 디자인 아티클 탐색 및 학습 → 계획 문서화
6. Compositions Filter는 인덱스 목록을 스크롤하게끔 + 검색해서 찾게끔. 그리고 구성요소 목록은 실제 HyperCore spot 자산 데이터셋에서 끌어오기
7. Performance Range & NAV Range는 launch에 있는 자산 구성비율 조정 섹션 참고해서 슬라이드바+텍스트박스로 구성하도록 하겠음
8. Segment Filter 만들고, 테마별로 볼 수 있게 하기. 하나의 인덱스 바스켓은 여러 가지의 테마 속성을 가질 수 있음 복합 타입 포켓몬처럼.
9. 위의 있는 작업 전에 반드시 Binance Futures/Axiom/Hyperliquid 참고하여 레퍼런스 선행조사를 진행하겠음

[2025OCT04 Task Plan - Discover Page](2025OCT04%20Task%20Plan%20-%20Discover%20Page%20298944d779568084a1dde1208428b873.md)

# Docs

1. Frontend Docs는 현행유지
2. HyperIndex Docs는 레퍼런스 참고하고 초안 작성해서 피드백 요청 하겠음

[2025OCT04 Task Plan - HyperIndex Docs](2025OCT04%20Task%20Plan%20-%20HyperIndex%20Docs%20298944d779568041bc40c4e062e89e6b.md)

# Launch

1. Launch Guide를 Docs 페이지에 추가
2. Target Raise라는 표현을 Bonding Curve에서 graduate 하기위한 액수 라는 표현으로 대체
3. Creator Fee는 Buisness Documentation 참조해서 산식 세워서 넣고 전역변수 설정하도록, Portfolio 페이지에서 Creator Fee로 얼마 벌었는지 볼 수 있게 수정. Creator Fee 징수는 거래 과정에서 표시하고 자동으로 나가서 creator 지갑으로 들어갈 수 있게 수정
    1. 2025.10.27 Feedback @현 김 by Henry
    애초에 Creator Fee, Protocol Fee, Lp Fee, Frontend Fee 다 하나의 Trading Fee안에 묶이는거라 그거는 한번에 청구, ?버튼 등 호버하면 Breakdown 되도록
    → Re: 20251027 Feedback 
    확인했습니다 화면에는 Fee를 묶어서 표시하고, 물음표 모양 툴팁에 Fee의 구성요소들 적어넣는걸로 하겠음 2025.10.28 @HyunSu Choi by Martin
4. AssetID 오류라고 강하게 추정됨. 디버그하겠음
5. Discover 고급필터 수정하면서 사용한 자산 검색 메커니즘을 따로 저장해서 여기에서도 적용하도록 하기
6. Preview 기간 단위 1일/7일/30일/1년으로 수정
7. 슬라이드바는 현행대로 정수단위로만 조절 가능케 하고 텍스트박스에선 합산했을 땐 자동으로 소숫점 두자리까지 반올림되게(33.33으로 세개 다 입력하면 100퍼센트로 조정) 수정 또는 다른 대안 피드백 있으면 그 방식대로 수정
8. 네이티브 토큰 단위 전부 HYPE로 실 데이터 반영 후 테스트. Phase 1 준비할 때 네이티브 토큰 옵션 추가하기
9. Total Cost로 총액 표기 통일, 수수료와 가스비 그리고 Swap하는데 드는 기타 모든 비용까지 합산하여 계산. 자산 가격 제외한 부분은 Fees 항목으로 묶어서 처리 후 (?) 아이콘 작게 놔두고 호버 해서 실시간 수치 변화 보여줄 수 있게 수정. 실제 데이터 연결→테스트→문서화→리뷰
10. Inline Swap 제거, 자체 메커니즘으로 스왑되게끔 하기. 서준이와 얘기해볼 것
11. Launch 모달 x 버튼 두개인 문제 해결
12. Confirm Launch 모달에서 체크박스에 밝은 색 테두리 추가
13. Index Datails 모달-Compositions 표/Asset Breakdown 디테일 추가→Coreindex에 있는 요소 전부 넣기
Compositions table: price 열 추가, side는 spot이면 long/short가 아니라 buy/sell이라 해야하고 leverage는 하이픈으로 넣어야함 
Asset Breakdown: 레퍼런스 탐색, 브레인스토밍 후 넣을 요소 선정 문서화, 안 넣은 건 왜 안 넣었는지 서술, 피드백 후 작업 진행
14. Launch 이후 과정 실데이터로 표현되게끔 하는 것→ 재질의 답변 이후에 방향 결정
15. 인덱스 share 할때 링크 복사 가능하게, 쿠팡이나 무신사 공유창처럼 링크텍스트박스에 복사버튼 한 줄, 그 밑에 아이콘으로 x, telegram, instagram, 애플공유 버튼 이렇게 수정

[2025OCT04 Task Plan - Launch Page](2025OCT04%20Task%20Plan%20-%20Launch%20Page%20298944d7795680f4b21cef44e204bfb8.md)

## 추가 요청 @현 김

- Launcher에서 Preview 보여주는 거 관련 추가 요청
    - Preview 대신 Backtesting이라고 이름 바꿔주기
    - Sharpe Ratio, Max Drawdown(MDD) 계산해서 차트 하단에 표시해주기
- UI 꾸미기
    - 이제 슬슬 Demo 화면을 캡쳐해서라도 VC들한테 보여줘야 되는 때가 오고 있어서, 주요 페이지들은 UI 꾸미기를 슬슬 진행해주는 게 좋을듯함
    - 현재 주로 필요한 페이지는
        - Launcher 괸련
        - Dashboard & Portfolio 관련
        - 개별 인덱스의 Info 괸련

Re: 추가 요청

확인했습니다 Binance나 axiom 급으로 디자인 요소 많이 넣은 수준으로 가는 것보단 차라리 지금 있는 난잡한 컴포넌트랑 꾸밈요소 많이 덜어내서 hyperliquid 정도의 정갈한 UI 구현을 목표로 하겠음

- Launcher
1. Preview 대신 Backtesting이라고 이름 바꾸기
2. Sharpe Ratio, Max Drawdown(MDD) 계산해서 차트 하단에 표시하기

- UI 전반적인 수정 사항
1. 사이드바 제거하고 footers에 주요항목 아이콘으로 넣기(axiom처럼). 누르면 확장 모달로 해당 항목 볼 수 있게 하기.
2. 이모지 떡칠 없애기.
3. 색상이 난잡한 것들, 예를 들면 인덱스카드의 레이어라든가 vs battle 표시하는 뱃지 같은것들을 우리 브랜드색 민트 계열로 해서 톤만 다르게 하고, 손익 초록빨강 같은 쨍한 색깔들 채도 줄이기. 
4. 레이아웃 크기 조절을 고정크기 하드코딩 말고, 환경별로 최적화된 크기로 만들기. 

- Launcher
    - Launch 관련 문서로 갈음하겠음 [2025OCT04 Task Plan - Launch Page](2025OCT04%20Task%20Plan%20-%20Launch%20Page%20298944d7795680f4b21cef44e204bfb8.md)

- Dashboard & Portfolio
    - 이것도 작업계획 문서로 갈음하겠음
- 개별 인덱스의 Info 관련
    - 랜딩에서 카드 누르면 나오는 모달 형식을 발전시키고 통일해서 Discover에서도 맨 오른쪽에 Actions 열View Details 버튼 만들고 순서를
    Trade            |
                          | 즐찾아이콘
    View Details |
    이렇게 해야겠다
        - Index Details modal은 Launcher에서 보는것, 랜딩에서 카드 누르면 보이는 것, discover에서 보이는 것, Leaderboard에서 해당 사용자 주 종목 눌렀을때 보이는 것 통일해서 라이브러리에서 같은 컴포넌트 불러오도록 해야함

2025.10.28 @HyunSu Choi by Martin