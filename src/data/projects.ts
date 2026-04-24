export const categories = [
  "시뮬레이터",
  "쓸데없는 도구",
  "미니게임",
  "AI 실험",
  "감성/힐링",
  "기타",
] as const;

export type Category = (typeof categories)[number];

export interface Project {
  id: string;
  title: string;
  description: string;
  category: Category;
  url?: string;
  github?: string;
  published: boolean;
  createdAt: string;
}

export const projects: Project[] = [
  {
    id: "1",
    title: "온라인 담배피기",
    description:
      "클릭하면 담배에 불이 붙고 연기가 올라갑니다. 폐활량 게이지도 있음.",
    category: "시뮬레이터",
    url: "https://example.com/smoking",
    published: true,
    createdAt: "2026-03-10",
  },
  {
    id: "2",
    title: "무한 뽁뽁이",
    description:
      "에어캡을 끝없이 터뜨릴 수 있는 앱. 터뜨린 개수 세계 랭킹 지원.",
    category: "시뮬레이터",
    url: "https://example.com/bubblewrap",
    published: true,
    createdAt: "2026-03-15",
  },
  {
    id: "3",
    title: "퇴근까지 남은 시간",
    description:
      "6시까지 남은 시간을 초 단위로 보여주면서 응원해주는 타이머.",
    category: "쓸데없는 도구",
    url: "https://example.com/offwork",
    published: true,
    createdAt: "2026-03-20",
  },
  {
    id: "4",
    title: "AI 변명 생성기",
    description:
      "지각, 과제 미제출, 연락 안 한 이유 등 상황별 변명을 AI가 생성.",
    category: "AI 실험",
    github: "https://github.com/example/excuse-ai",
    published: false,
    createdAt: "2026-03-25",
  },
  {
    id: "5",
    title: "가위바위보 999연승 도전",
    description:
      "AI가 일부러 져주는 가위바위보. 근데 가끔 반란을 일으킴.",
    category: "미니게임",
    url: "https://example.com/rps",
    published: true,
    createdAt: "2026-03-28",
  },
  {
    id: "6",
    title: "빗소리 + 코딩 ASMR",
    description:
      "빗소리와 키보드 타이핑 소리를 믹스해서 들려주는 감성 앱.",
    category: "감성/힐링",
    url: "https://example.com/rain-coding",
    published: true,
    createdAt: "2026-04-01",
  },
];
