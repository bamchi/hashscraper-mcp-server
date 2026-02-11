# 🔗 Scrapi MCP Server

[English](README.md)

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
- 💳 **빌링 내장**: 크레딧 추적, 구독 관리, 사용량 분석 (MCP 키)
- 🔄 **자동 재시도**: 429 Rate Limit 응답 시 Retry-After 기반 자동 재시도
- 🌍 **듀얼 트랜스포트**: Stdio (npx) + Streamable HTTP로 유연한 배포

---

## 트랜스포트 모드

Scrapi MCP Server는 두 가지 트랜스포트 모드를 지원합니다:

| 모드 | 적합한 용도 | Node.js 필요 |
|------|------------|-------------|
| **Stdio** | Claude Desktop, Cursor, Cline, Claude Code | Yes (npx 자동) |
| **Streamable HTTP** | 모든 클라이언트, Node.js 없는 환경 | No |

---

## 사전 요구사항

- [Scrapi MCP](https://scrapi.ai) 계정 (기존 Scrapi 계정과 별도)
- Claude Desktop, Cline, 또는 Cursor 설치
- Node.js 20+

---

## 설치

### 방법 A: npx (권장)

별도 설치 없이 MCP 클라이언트 설정에서 `npx`를 사용하면 됩니다.

```json
{
  "mcpServers": {
    "scrapi": {
      "command": "npx",
      "args": ["-y", "@scrapi.ai/mcp-server"],
      "env": {
        "SCRAPI_API_KEY": "your-api-key"
      }
    }
  }
}
```

> 이 설정을 어디에 넣어야 하는지는 [2단계](#2단계-mcp-서버-설정)를 참고하세요.

### 방법 B: 소스에서 설치

```bash
# 저장소 클론
git clone https://github.com/bamchi/scrapi-mcp-server.git
cd scrapi-mcp-server

# 의존성 설치 및 빌드
npm install && npm run build
```

---

## 1단계: API 키 발급

1. [https://scrapi.ai](https://scrapi.ai) 접속
2. 회원가입 또는 로그인
3. [MCP 대시보드](https://scrapi.ai/dashboard) 방문 — Free 플랜(월 500 크레딧)과 API 키가 자동 생성됩니다
4. `hsmcp_` API 키 복사

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

**설정 (npx):**

```json
{
  "mcpServers": {
    "scrapi": {
      "command": "npx",
      "args": ["-y", "@scrapi.ai/mcp-server"],
      "env": {
        "SCRAPI_API_KEY": "your-api-key"
      }
    }
  }
}
```

**설정 (소스 설치 시):**

```json
{
  "mcpServers": {
    "scrapi": {
      "command": "node",
      "args": ["/absolute/path/to/scrapi-mcp-server/dist/index.js"],
      "env": {
        "SCRAPI_API_KEY": "your-api-key"
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

**설정 (npx):**

```json
{
  "mcpServers": {
    "scrapi": {
      "command": "npx",
      "args": ["-y", "@scrapi.ai/mcp-server"],
      "env": {
        "SCRAPI_API_KEY": "your-api-key"
      }
    }
  }
}
```

**설정 (소스 설치 시):**

```json
{
  "mcpServers": {
    "scrapi": {
      "command": "node",
      "args": ["/absolute/path/to/scrapi-mcp-server/dist/index.js"],
      "env": {
        "SCRAPI_API_KEY": "your-api-key"
      }
    }
  }
}
```

### Cursor

프로젝트 루트에 `.cursor/mcp.json` 파일 생성 또는 수정:

**설정 (npx):**

```json
{
  "mcpServers": {
    "scrapi": {
      "command": "npx",
      "args": ["-y", "@scrapi.ai/mcp-server"],
      "env": {
        "SCRAPI_API_KEY": "your-api-key"
      }
    }
  }
}
```

**설정 (소스 설치 시):**

```json
{
  "mcpServers": {
    "scrapi": {
      "command": "node",
      "args": ["/absolute/path/to/scrapi-mcp-server/dist/index.js"],
      "env": {
        "SCRAPI_API_KEY": "your-api-key"
      }
    }
  }
}
```

### Streamable HTTP

Streamable HTTP로 연결 — 클라이언트 측 Node.js 설치가 필요 없습니다.

**Cursor** (`.cursor/mcp.json`):

```json
{
  "mcpServers": {
    "scrapi": {
      "url": "https://scrapi.ai/api",
      "headers": {
        "X-API-Key": "your-api-key"
      }
    }
  }
}
```

**Claude Code** (CLI):

```bash
claude mcp add --transport http scrapi https://scrapi.ai/api \
  --header "X-API-Key: your-api-key"
```

**Cline** (`cline_mcp_settings.json`):

```json
{
  "mcpServers": {
    "scrapi": {
      "type": "streamableHttp",
      "url": "https://scrapi.ai/api",
      "headers": {
        "X-API-Key": "your-api-key"
      }
    }
  }
}
```

**Claude Desktop** (`claude_desktop_config.json`):

```json
{
  "mcpServers": {
    "scrapi": {
      "command": "npx",
      "args": [
        "mcp-remote",
        "https://scrapi.ai/api",
        "--header",
        "X-API-Key: your-api-key"
      ]
    }
  }
}
```

> 참고: Claude Desktop은 HTTP 연결 시 [mcp-remote](https://www.npmjs.com/package/mcp-remote) 프록시가 필요합니다.

<details>
<summary>Self-host: 직접 HTTP 서버 운영하기 (고급)</summary>

호스팅 엔드포인트 대신 자체 인스턴스를 실행할 수 있습니다:

```bash
SCRAPI_API_KEY=your-api-key npx -y -p @scrapi.ai/mcp-server scrapi-http
# 또는 소스에서:
SCRAPI_API_KEY=your-api-key node dist/http.js
```

서버가 `http://localhost:3000/api`에서 시작됩니다. `PORT`와 `HOST` 환경 변수로 설정 가능합니다. 위 클라이언트 설정에서 URL만 self-host URL로 교체하면 됩니다.

**헬스체크:** `GET http://localhost:3000/health`

</details>

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

### `scraper_server_status`

모든 ScraperServer 인스턴스의 상태를 조회합니다. 서버 건강 상태, 서킷브레이커 상태, 실패 횟수, 시간 정보를 표시합니다.

**파라미터:** 없음

**예시:**

```json
{}
```

**출력:**

```markdown
## ScraperServer Status

Total: 3 | Available: 2

| Name | OS | Status | Failures | Last Success | Last Failure |
|------|----|--------|----------|--------------|--------------|
| pluto | linux | OK | 0 | 01/30 14:23:05 | - |
| mars | mac | FAIL | 2 | 01/29 10:00:00 | 01/30 13:55:12 |
| venus | linux | OPEN | 3 | 01/28 09:00:00 | 01/30 12:00:00 |

### Issues
- **mars**: Connection refused - connect(2)
- **venus**: 서킷브레이커 해제 시각: 01/30 12:30:00
- **venus**: Net::ReadTimeout
```

**상태 값:**

| 상태 | 설명 |
|------|------|
| `OK` | 서버 정상 |
| `FAIL` | 서버 비정상 |
| `OPEN` | 서킷브레이커 발동 (30분간 격리) |
| `N/A` | 아직 체크되지 않음 |

### `get_usage`

API 사용량 및 남은 크레딧을 확인합니다.

**파라미터:** 없음

**예시:**

```json
{}
```

**출력:**

```markdown
## MCP Credits

| Item | Value |
|------|-------|
| Plan | starter |
| Subscription Credits | 1,500 |
| Purchased Credits | 200 |
| Total Remaining | 1,700 |
| Period End | 2026-03-01 |
```

### `get_billing`

구독, 플랜, 일별 사용량, 소비 한도 등 빌링 정보를 상세 조회합니다.

**파라미터:**

| 이름 | 타입 | 필수 | 설명 |
|------|------|------|------|
| `action` | string | 예 | `subscription`, `plans`, `daily_usage`, `spending_limits` 중 택 1 |
| `start_date` | string | | `daily_usage`용 시작일 (YYYY-MM-DD, 기본: 30일 전) |
| `end_date` | string | | `daily_usage`용 종료일 (YYYY-MM-DD, 기본: 오늘) |

**예시 — 현재 구독 정보:**

```json
{ "action": "subscription" }
```

```markdown
## MCP Subscription

| Item | Value |
|------|-------|
| Plan | starter (Starter) |
| Status | active |
| Monthly Credits | 2,000 |
| Price | $19.00/mo |
| Rate Limit | 30 RPM |
| Burst Limit | 5 concurrent |
| Period End | 2026-03-01 |
```

**예시 — 이용 가능 플랜:**

```json
{ "action": "plans" }
```

```markdown
## Available MCP Plans

| Plan | Credits/mo | Price | RPM | Burst |
|------|-----------|-------|-----|-------|
| Free (free) | 500 | Free | 10 | 2 |
| Starter (starter) | 2,000 | $19.00/mo | 30 | 5 |
| Pro (pro) | 10,000 | $49.00/mo | 60 | 10 |
| Business (business) | 50,000 | $149.00/mo | 120 | 20 |
```

**예시 — 일별 사용량:**

```json
{ "action": "daily_usage", "start_date": "2026-02-01", "end_date": "2026-02-07" }
```

```markdown
## Daily Usage (2026-02-01 ~ 2026-02-07)

| Date | Requests | Credits | Top Tool |
|------|----------|---------|----------|
| 2026-02-07 | 45 | 45 | scrape#scrape (45) |
| 2026-02-06 | 120 | 120 | scrape#scrape (100) |

**Total**: 165 requests, 165 credits
```

**예시 — 소비 한도:**

```json
{ "action": "spending_limits" }
```

```markdown
## Spending Limits

| Item | Value |
|------|-------|
| Daily Limit | 500 credits |
| Today's Usage | 120 credits |
| Usage % | 24.0% |
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
│   MCP Server    │────►│ Scrapi API │
│  (scrape_url)   │     │ (format 파라미터)│
└────────┬────────┘     └────────┬────────┘
         │                       │
         │◄──────────────────────┘
         │  Markdown/Text 응답
         ▼
┌─────────────────┐
│    AI 응답      │
│  (요약 등)      │
└─────────────────┘
```

---

## 왜 Scrapi인가?

7년 이상의 웹 크롤링 경험을 가진 [Scrapi](https://scrapi.ai) 팀이 만들었습니다:

- ✅ 1,900개 이상의 프로덕션 크롤러
- ✅ JavaScript 렌더링 지원
- ✅ Anti-bot 처리
- ✅ 99.9% 가동률

---

## 문제 해결

### "API key is required"

설정 파일에서 `SCRAPI_API_KEY` 환경 변수가 올바르게 설정되어 있는지 확인하세요.

### "Invalid API key"

Scrapi 대시보드에서 API 키가 올바르고 활성 상태인지 확인하세요.

### MCP 서버가 연결되지 않음

1. Node.js 20+ 설치 확인
2. `node /absolute/path/to/scrapi-mcp-server/dist/index.js` 수동 실행하여 오류 확인
3. Claude Desktop 완전 종료 (macOS: Cmd+Q, Windows: Alt+F4) 후 재시작
4. 설정 > Developer에서 서버가 목록에 있는지 확인

### Developer 탭이 보이지 않음

Claude Desktop을 최신 버전으로 업데이트: Claude 메뉴 → "Check for Updates..."

---

## 지원

- 이메일: help@scrapi.ai
- 이슈: [GitHub Issues](https://github.com/bamchi/scrapi-mcp-server/issues)

---

## 라이선스

MIT © [Scrapi](https://scrapi.ai)
