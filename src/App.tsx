import { Routes, Route, Navigate } from 'react-router-dom';
import { AppShell } from '@/components/layout/AppShell';
import { TodayPage } from '@/pages/Today';
import { FoodPage } from '@/pages/Food';
import { WorkoutsPage } from '@/pages/Workouts';
import { BodyPage } from '@/pages/Body';
import { InsightsPage } from '@/pages/Insights';

export default function App() {
  return (
    <AppShell>
      <Routes>
        <Route path="/" element={<TodayPage />} />
        <Route path="/food" element={<FoodPage />} />
        <Route path="/workouts" element={<WorkoutsPage />} />
        <Route path="/body" element={<BodyPage />} />
        <Route path="/insights" element={<InsightsPage />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </AppShell>
  );
}
