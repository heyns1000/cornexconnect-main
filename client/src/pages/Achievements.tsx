import { PageTransition } from "@/components/PageTransition";
import { AchievementSystem } from "@/components/AchievementSystem";
import { AchievementDemo } from "@/components/AchievementDemo";

export default function Achievements() {
  return (
    <PageTransition>
      <div className="p-6 max-w-7xl mx-auto space-y-8">
        <AchievementDemo />
        <AchievementSystem />
      </div>
    </PageTransition>
  );
}