interface SidebarProps {
  open: boolean;      // 모바일에서 햄버거로 여닫기
}

export default function Sidebar({ open }: SidebarProps) {
  return (
    <aside
      className={[
        // 레이아웃: 헤더 높이만큼 아래로 시작
        "mt-11 h-[calc(100vh-56px)]", // Navbar가 h-14(=56px)이므로 높이 보정
        // 배경/텍스트
        "bg-zinc-900 text-white",
        // 레이아웃 참여(고정X). 메인과 나란히 놓여 공간을 나눔
        "shrink-0 overflow-hidden",
        // width만 애니메이션
        "transition-[width] duration-200",
        "relative z-40",
        // 반응형 규칙:
        //  - 모바일/협소: 기본 w-0(숨김), open이면 w-64
        //  - md 이상: 항상 w-64로 핀 고정
        open ? "w-64" : "w-0",
      ].join(" ")}
      aria-label="사이드바"
    >
      <nav className="p-3 space-y-1">
        <a href="/search" className="block px-3 py-2 rounded hover:bg-white/10">
          🔍 찾기
        </a>
        <a href="/my" className="block px-3 py-2 rounded hover:bg-white/10">
          👤 마이페이지
        </a>
      </nav>
    </aside>
  );
}
