# 🔗 Hashscraper MCP Server

> URL을 깔끔한 Markdown/Text로 변환하는 MCP 서버

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

**⚡ 빠르고 안정적** — 7년 이상의 웹 크롤링 경험, 1,900개 이상의 프로덕션 크롤러, 검증된 anti-bot 처리 기술.

## 이게 뭔가요?

AI 에이전트가 웹 페이지를 읽을 수 있게 해주는 [MCP (Model Context Protocol)](https://modelcontextprotocol.io/) 서버입니다. URL만 주면 깔끔하고 LLM이 바로 사용할 수 있는 콘텐츠를 빠르게 반환합니다.

**Before:** AI가 웹 페이지를 직접 읽을 수 없음  
**After:** "이 기사 요약해줘"가 그냥 됨 ✨

---

## 주요 기능

- 🌐 **URL → Markdown**: 제목, 목록, 링크 구조 유지
- 📄 **URL → Text**: 순수 텍스트 추출
- 🏷️ **메타데이터**: 제목, 작성자, 날짜, 이미지
- 🧹 **깔끔한 출력**: 광고, 네비게이션, 스크립트 제거
- ⚡ **JavaScript 렌더링**: SPA 사이트도 지원

---

## 사전 요구사항

- [Hashscraper](https://www.hashscraper.com) 계정
- Claude Desktop, Cline, 또는 Cursor 설치
- Node.js 20+

> 참고: npm 패키지는 아직 배포되지 않았습니다. 현재는 소스에서 설치해주세요. 배포 후에는 `npx hashscraper-mcp-server`로 설치 가능합니다.

---

## 소스에서 설치

```bash
# 저장소 클론
git clone https://github.com/bamchi/hashscraper-mcp-server.git
cd hashscraper-mcp-server

# 의존성 설치 및 빌드
npm install && npm run build
```

---

## 1단계: API 키 발급

1. [https://www.hashscraper.com](https://www.hashscraper.com) 접속
2. 회원가입 또는 로그인
3. [내 정보](https://www.hashscraper.com/users/change_userinfo)로 이동
4. API 키 복사

---

## 2단계: MCP 서버 설정

### Claude Desktop

**방법 A: 설정에서 (권장)**

1. Claude Desktop 실행
2. 설정 클릭 (좌측 하단 톱니바퀴 아이콘)
3. Developer 탭 선택
4. "Edit Config" 버튼 클릭
5. mcpServers 설정 추가 (아래 참조)
6. 저장 후 Claude Desktop 재시작 (Cmd+Q 후 다시 실행)

**방법 B: 설정 파일 직접 수정**

- macOS: `~/Library/Application Support/Claude/claude_desktop_config.json`
- Windows: `%APPDATA%\Claude\claude_desktop_config.json`

**설정:**

```json
{
  "mcpServers": {
    "hashscraper": {
      "command": "node",
      "args": ["/absolute/path/to/hashscraper-mcp-server/dist/index.js"],
      "env": {
        "HASHSCRAPER_API_KEY": "your-api-key"
      }
    }
  }
}
```

> 참고: `/absolute/path/to/`를 저장소를 클론한 실제 경로로 변경하세요.

### Cline

설정 파일 위치:
- macOS: `~/Library/Application Support/Code/User/globalStorage/saoudrizwan.claude-dev/settings/cline_mcp_settings.json`
- Windows: `%APPDATA%\Code\User\globalStorage\saoudrizwan.claude-dev\settings\cline_mcp_settings.json`

```json
{
  "mcpServers": {
    "hashscraper": {
      "command": "node",
      "args": ["/absolute/path/to/hashscraper-mcp-server/dist/index.js"],
      "env": {
        "HASHSCRAPER_API_KEY": "your-api-key"
      }
    }
  }
}
```

### Cursor

프로젝트 루트에 `.cursor/mcp.json` 파일 생성 또는 수정:

```json
{
  "mcpServers": {
    "hashscraper": {
      "command": "node",
      "args": ["/absolute/path/to/hashscraper-mcp-server/dist/index.js"],
      "env": {
        "HASHSCRAPER_API_KEY": "your-api-key"
      }
    }
  }
}
```

---

## 3단계: AI 클라이언트 재시작

- **Claude Desktop**: 완전히 종료 (macOS: Cmd+Q, Windows: Alt+F4) 후 다시 실행
- **Cline**: VS Code 재시작
- **Cursor**: 에디터 재시작

MCP 서버 연결 표시가 나타나면 성공입니다.

---

## 사용 가능한 도구

### `scrape_url`

웹 페이지를 스크래핑하여 AI가 읽을 수 있는 콘텐츠로 반환합니다.

**파라미터:**

| 이름     | 타입   | 필수 | 설명                                     |
| -------- | ------ | ---- | ---------------------------------------- |
| `url`    | string | ✅    | 스크래핑할 URL                           |
| `format` | string |      | `markdown` (기본값) 또는 `text`          |

**예시:**

```json
{
  "url": "https://example.com/article",
  "format": "markdown"
}
```

**Markdown 출력:**

```markdown
# 기사 제목

> 작성자: 홍길동 | 게시일: 2024-01-15

## 소개

이것은 기사의 본문 내용입니다. 깔끔한 마크다운으로 변환되었습니다...

## 핵심 포인트

- 포인트 1: 중요한 내용
- 포인트 2: 또 다른 인사이트
- [관련 링크](https://example.com/related)
```

**Text 출력:**

```text
기사 제목

작성자: 홍길동 | 게시일: 2024-01-15

소개

이것은 기사의 본문 내용입니다. 순수 텍스트로 변환되었습니다...

핵심 포인트

- 포인트 1: 중요한 내용
- 포인트 2: 또 다른 인사이트
```

### `scrape_urls`

여러 웹 페이지를 병렬로 스크래핑하여 AI가 읽을 수 있는 콘텐츠로 반환합니다.

**파라미터:**

| 이름     | 타입     | 필수 | 설명                                     |
| -------- | -------- | ---- | ---------------------------------------- |
| `urls`   | string[] | ✅    | 스크래핑할 URL 목록 (최대 10개)          |
| `format` | string   |      | `markdown` (기본값) 또는 `text`          |

**예시:**

```json
{
  "urls": ["https://example.com/page1", "https://example.com/page2"],
  "format": "text"
}
```

**출력:**

```json
[
  {
    "url": "https://example.com/page1",
    "content": "페이지 1 제목\n\n페이지 1의 내용입니다..."
  },
  {
    "url": "https://example.com/page2",
    "content": "페이지 2 제목\n\n페이지 2의 내용입니다..."
  }
]
```

---

## 사용 예시

### 예시 1: 뉴스 기사 요약

```
사용자: 이 기사 요약해줘: https://news.example.com/article/12345

Claude: [scrape_url 호출]

기사 요약입니다:

## 핵심 포인트
- 포인트 1: ...
- 포인트 2: ...
- 포인트 3: ...
```

### 예시 2: 페이지 콘텐츠 가져오기

```
사용자: https://example.com/data 내용 가져와

Claude: [scrape_url 호출]

# 페이지 제목
> 출처: https://example.com/data

페이지 콘텐츠가 깔끔한 Markdown 형식으로 반환되었습니다...
```

### 예시 3: 경쟁사 가격 조사

```
사용자: https://competitor.com/product/abc 가격 정보 알려줘

Claude: [scrape_url 호출]

가격 정보입니다:
- **제품**: ABC 프리미엄
- **정가**: 99,000원
- **할인가**: 79,000원 (20% 할인)
```

### 예시 4: API 문서 읽기

```
사용자: https://docs.example.com/api/v2 읽고 연동 코드 작성해줘

Claude: [scrape_url 호출]

API 문서를 분석했습니다. 연동 코드입니다:

// api-client.ts
export class ExampleApiClient {
  private baseUrl = 'https://api.example.com/v2';
  
  async getData(): Promise<Response> {
    // ...
  }
}
```

---

## 작동 방식

```
┌─────────────────┐
│     사용자       │
│  "이 URL 내용   │
│   요약해줘"      │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│  Claude Desktop │
│    / Cursor     │
└────────┬────────┘
         │
         ▼
┌─────────────────┐     ┌─────────────────┐
│   MCP Server    │────►│ Hashscraper API │
│  (scrape_url)   │     │                 │
└────────┬────────┘     └────────┬────────┘
         │                       │
         │◄──────────────────────┘
         │      HTML 응답
         ▼
┌─────────────────┐
│ Markdown / Text │
│     변환        │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│    AI 응답      │
│  (요약 등)      │
└─────────────────┘
```

---

## 왜 Hashscraper인가?

7년 이상의 웹 크롤링 경험을 가진 [Hashscraper](https://hashscraper.com) 팀이 만들었습니다:

- ✅ 1,900개 이상의 프로덕션 크롤러
- ✅ JavaScript 렌더링 지원
- ✅ Anti-bot 처리
- ✅ 99.9% 가동률

---

## 문제 해결

### "API key is required"

설정 파일에서 `HASHSCRAPER_API_KEY` 환경 변수가 올바르게 설정되어 있는지 확인하세요.

### "Invalid API key"

Hashscraper 대시보드에서 API 키가 올바르고 활성 상태인지 확인하세요.

### MCP 서버가 연결되지 않음

1. Node.js 20+ 설치 확인
2. `node /absolute/path/to/hashscraper-mcp-server/dist/index.js` 수동 실행하여 오류 확인
3. Claude Desktop 완전 종료 (macOS: Cmd+Q, Windows: Alt+F4) 후 재시작
4. 설정 > Developer에서 서버가 목록에 있는지 확인

### Developer 탭이 보이지 않음

Claude Desktop을 최신 버전으로 업데이트: Claude 메뉴 → "Check for Updates..."

---

## 지원

- 이메일: help@hashscraper.com
- 이슈: [GitHub Issues](https://github.com/bamchi/hashscraper-mcp-server/issues)

---

## 라이선스

MIT © [Hashscraper](https://hashscraper.com)
