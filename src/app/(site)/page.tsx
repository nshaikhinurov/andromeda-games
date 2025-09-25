import { Header } from "./ui/header";
import { MainContent } from "./ui/main-content";
import { Sidebar } from "./ui/sidebar";

export default function HomePage() {
  return (
    <div className="flex min-h-screen bg-white">
      <Sidebar />
      <div className="flex-1">
        <Header />
        <MainContent />
      </div>
    </div>
  );
}
