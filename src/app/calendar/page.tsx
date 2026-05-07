"use client";
import React from "react";
import { CalendarProvider } from "./context/CalendarContext";
import Topbar        from "./components/Topbar";
import CalendarCard  from "./components/CalendarCard";
import RightPanel    from "./components/RightPanel";
import EventModal    from "./components/EventModal";
import ConfirmModal  from "./components/ConfirmModal";
import AddEventDrawer from "./components/AddEventDrawer";
import { useCalendar } from "./context/CalendarContext";
import { Plus } from "lucide-react";
import { useTranslations } from "next-intl";

function CalendarApp() {
  const { drawerOpen, setDrawerOpen } = useCalendar();
  const t = useTranslations("CalendarPage");

  React.useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'n' || e.key === 'N') {
        if (!['INPUT','TEXTAREA'].includes((e.target as HTMLElement).tagName)) {
          setDrawerOpen(true);
        }
      }
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [setDrawerOpen]);

  return (
    <div className="shell">
      <div className="main-grid">
        <Topbar />
        <CalendarCard />
        <button className="mobile-add-btn" onClick={() => setDrawerOpen(true)}>
          <Plus size={16} style={{ marginRight: "6px" }} /> {t('add_event')}
        </button>
        <div style={{ marginTop:'20px' }}>
          <RightPanel />
        </div>
      </div>

      <button className="fab" onClick={() => setDrawerOpen(true)} title={t('add_event')}>
        <Plus size={24} color="#fff" />
      </button>

      <EventModal />
      <ConfirmModal />
      <AddEventDrawer open={drawerOpen} onClose={() => setDrawerOpen(false)} />
    </div>
  );
}

export default function CalendarPage() {
  return (
    <CalendarProvider>
      <CalendarApp />
    </CalendarProvider>
  );
}
