# Hashscraper MCP Server - 사용 가이드

이 가이드는 Hashscraper MCP Server를 Claude Desktop, Cursor 등 AI 에이전트와 함께 설정하고 사용하는 방법을 설명합니다.

---

## 사전 요구사항

- [Hashscraper](https://www.hashscraper.com) 계정
- Claude Desktop, Cline, 또는 Cursor 설치
- Node.js 20+

> **참고**: npm 패키지는 아직 publish되지 않았습니다. 현재는 소스에서 직접 설치해야 합니다. 아래 [소스에서 설치](#소스에서-설치) 섹션을 참고하세요.

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
3. [내 정보](https://www.hashscraper.com/users/change_userinfo) 페이지로 이동
4. API 키 확인 및 복사

---

## 2단계: MCP 서버 설정

### Claude Desktop

**방법 A: 설정에서 추가 (권장)**

1. Claude Desktop 열기
2. **설정** 클릭 (좌측 하단 톱니바퀴 아이콘)
3. **Developer** 탭 선택
4. **"Edit Config"** 버튼 클릭
5. 아래 `mcpServers` 설정 추가
6. 저장 후 Claude Desktop 재시작 (Cmd+Q 후 다시 열기)

**방법 B: 설정 파일 직접 수정**

**macOS:**
```
~/Library/Application Support/Claude/claude_desktop_config.json
```

**Windows:**
```
%APPDATA%\Claude\claude_desktop_config.json
```

**설정 내용 (로컬 빌드 사용):**

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

> **참고:** `/absolute/path/to/` 부분을 저장소를 클론한 실제 경로로 변경하세요.
> 예시: `/Users/username/hashscraper-mcp-server/dist/index.js`

<!-- TODO: npm publish 이후 주석 해제
**설정 내용 (npx 사용 - npm publish 이후):**

```json
{
  "mcpServers": {
    "hashscraper": {
      "command": "npx",
      "args": ["-y", "@hashscraper/mcp-server"],
      "env": {
        "HASHSCRAPER_API_KEY": "your-api-key"
      }
    }
  }
}
```
-->

> **참고:** 파일에 다른 설정이 이미 있다면, `mcpServers` 섹션만 추가하세요.

### Cline

**설정 파일 위치:**

- **macOS:** `~/Library/Application Support/Code/User/globalStorage/saoudrizwan.claude-dev/settings/cline_mcp_settings.json`
- **Windows:** `%APPDATA%\Code\User\globalStorage\saoudrizwan.claude-dev\settings\cline_mcp_settings.json`

**설정 내용 (로컬 빌드 사용):**

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

> **참고:** `/absolute/path/to/` 부분을 저장소를 클론한 실제 경로로 변경하세요.

### Cursor

프로젝트 루트에 `.cursor/mcp.json` 파일을 생성하거나 수정하세요:

**로컬 빌드 사용:**

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

> **참고:** `/absolute/path/to/` 부분을 저장소를 클론한 실제 경로로 변경하세요.

<!-- TODO: npm publish 이후 주석 해제
**npx 사용 (npm publish 이후):**

```json
{
  "mcpServers": {
    "hashscraper": {
      "command": "npx",
      "args": ["-y", "@hashscraper/mcp-server"],
      "env": {
        "HASHSCRAPER_API_KEY": "your-api-key"
      }
    }
  }
}
```
-->

---

## 3단계: AI 클라이언트 재시작

- **Claude Desktop**: 완전히 종료 (macOS: Cmd+Q, Windows: Alt+F4) 후 다시 열기
- **Cline**: VS Code 재시작
- **Cursor**: 에디터 재시작

MCP 서버 연결 표시가 나타납니다.

---

## 사용 예시

### 예시 1: 뉴스 기사 요약

```
사용자: 이 기사를 요약해줘: https://news.example.com/article/12345

Claude: [scrape_url 호출]

기사 요약입니다:

## 핵심 내용
- 포인트 1: ...
- 포인트 2: ...
- 포인트 3: ...

## 결론
...
```

### 예시 2: 페이지 콘텐츠 가져오기

```
사용자: https://example.com/data 에서 내용을 가져와줘

Claude: [scrape_url 호출]

# 페이지 제목

> 출처: https://example.com/data

깔끔한 마크다운 형식으로 페이지 내용이 반환됩니다...
```

### 예시 3: API 사용량 확인

```
사용자: API 사용량 확인해줘

Claude: [get_usage 호출]

## API 사용량

| 항목 | 값 |
|------|------|
| 플랜 | Standard |
| 총 크레딧 | 10,000 |
| 사용 크레딧 | 1,234 |
| 남은 크레딧 | 8,766 |
| 갱신일 | 2026-02-27 |
```

### 예시 4: 경쟁사 가격 조사

```
사용자: https://competitor.com/product/abc 의 가격 정보를 알려줘

Claude: [scrape_url 호출]

가격 정보입니다:

- **제품명**: ABC Premium
- **정가**: $99.00
- **할인가**: $79.00 (20% 할인)
- **배송비**: 무료
```

### 예시 5: API 문서 읽고 코드 작성 (개발자 사용 사례)

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
│ 사용자          │
│ "이 URL을       │
│  요약해줘"      │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│ Claude Desktop  │
│ / Cursor        │
└────────┬────────┘
         │
         ▼
┌─────────────────┐     ┌─────────────────┐
│ MCP Server      │────►│ Hashscraper API │
│ (scrape_url)    │     │                 │
└────────┬────────┘     └────────┬────────┘
         │                       │
         │◄──────────────────────┘
         │      HTML 응답
         ▼
┌─────────────────┐
│ 마크다운으로    │
│ 변환            │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│ AI 응답         │
│ (요약 등)       │
└─────────────────┘
```

---

## 사용 가능한 도구

### scrape_url

웹페이지를 스크래핑하고 AI가 읽기 좋은 마크다운 콘텐츠를 반환합니다.

**파라미터:**

| 이름 | 타입 | 필수 | 설명 |
|------|------|------|------|
| url | string | 예 | 스크래핑할 URL |
| wait_for | string | 아니오 | 페이지 로드 조건: `load`, `networkidle`, `domcontentloaded`. 기본값: `networkidle` |

**예시:**

```json
{
  "url": "https://example.com/article",
  "wait_for": "networkidle"
}
```

### scrape_urls

여러 웹페이지를 동시에 스크래핑하고 AI가 읽기 좋은 마크다운 콘텐츠를 반환합니다.

**파라미터:**

| 이름 | 타입 | 필수 | 설명 |
|------|------|------|------|
| urls | string[] | 예 | 스크래핑할 URL 목록 (최대 10개) |
| wait_for | string | 아니오 | 페이지 로드 조건: `load`, `networkidle`, `domcontentloaded`. 기본값: `networkidle` |

**예시:**

```json
{
  "urls": ["https://example.com/page1", "https://example.com/page2"],
  "wait_for": "networkidle"
}
```

### get_usage

API 사용량과 남은 크레딧을 확인합니다.

**파라미터:** 없음

---

## 로컬 개발

로컬 Hashscraper 백엔드로 테스트하려면 `HASHSCRAPER_API_URL`을 설정에 추가하세요:

```json
{
  "mcpServers": {
    "hashscraper": {
      "command": "node",
      "args": ["/absolute/path/to/hashscraper-mcp-server/dist/index.js"],
      "env": {
        "HASHSCRAPER_API_KEY": "your-api-key",
        "HASHSCRAPER_API_URL": "http://localhost:3000"
      }
    }
  }
}
```

---

## 문제 해결

### "API key is required"

설정 파일에 `HASHSCRAPER_API_KEY` 환경 변수가 올바르게 설정되어 있는지 확인하세요.

### "Invalid API key"

Hashscraper 대시보드에서 API 키가 올바르고 활성 상태인지 확인하세요.

### "Insufficient credits"

계정의 크레딧이 소진되었습니다. [hashscraper.com](https://www.hashscraper.com)에서 충전하세요.

### MCP 서버 연결 안됨

1. Node.js 20+ 설치 확인
2. `node /absolute/path/to/hashscraper-mcp-server/dist/index.js` 를 수동으로 실행하여 오류 확인
3. Claude Desktop 완전히 종료 (macOS: Cmd+Q, Windows: Alt+F4) 후 재시작
4. 설정 > Developer에서 서버가 목록에 있는지 확인

### Developer 탭이 안 보임

Claude Desktop을 최신 버전으로 업데이트하세요: Claude 메뉴 → "Check for Updates..."

---

## 지원

- **문서**: [https://docs.hashscraper.com](https://docs.hashscraper.com)
- **이메일**: support@hashscraper.com
- **이슈**: [GitHub Issues](https://github.com/bamchi/hashscraper-mcp-server/issues)
