"use client";
import React, { useState } from "react";
import { useCalendar } from "../context/CalendarContext";
import DatePicker from "./DatePicker";
import MonthView from "./views/MonthView";
import WeekView  from "./views/WeekView";
import DayView   from "./views/DayView";
import YearView  from "./views/YearView";
import { ChevronLeft, ChevronRight, Globe } from "lucide-react";
import { useTranslations, useLocale } from "next-intl";

type View = "month"|"week"|"day"|"year";

function resolveLocale(locale: string) { return locale === 'ar' ? 'ar-MA' : locale; }

function getLocaleMonthYear(date: Date, locale: string) {
  return date.toLocaleDateString(resolveLocale(locale), { month: 'long', year: 'numeric' });
}

function getLocaleWeekRange(date: Date, locale: string) {
  const rl = resolveLocale(locale);
  const wS = new Date(date); wS.setDate(wS.getDate() - wS.getDay());
  const wE = new Date(wS); wE.setDate(wS.getDate() + 6);
  const startStr = wS.toLocaleDateString(rl, { month: 'short', day: 'numeric' });
  const endStr = wE.toLocaleDateString(rl, { month: 'short', day: 'numeric', year: 'numeric' });
  return `${startStr} — ${endStr}`;
}

function getLocaleDayFull(date: Date, locale: string) {
  return date.toLocaleDateString(resolveLocale(locale), { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' });
}

export default function CalendarCard() {
  const { curView, setCurView, viewDate, setViewDate, showGlobals, toggleGlobals } = useCalendar();
  const [animKey, setAnimKey] = useState(0);
  const t = useTranslations("CalendarPage");
  const locale = useLocale();

  const TODAY = new Date(); TODAY.setHours(0,0,0,0);

  const titleText = (() => {
    if (curView === 'month') return getLocaleMonthYear(viewDate, locale);
    if (curView === 'week')  return getLocaleWeekRange(viewDate, locale);
    if (curView === 'day')   return getLocaleDayFull(viewDate, locale);
    return String(viewDate.getFullYear());
  })();

  const prev = () => {
    const d = new Date(viewDate);
    if (curView==='month') d.setMonth(d.getMonth()-1);
    else if (curView==='week') d.setDate(d.getDate()-7);
    else if (curView==='day')  d.setDate(d.getDate()-1);
    else d.setFullYear(d.getFullYear()-1);
    setViewDate(d);
    setAnimKey(k => k+1);
  };
  const next = () => {
    const d = new Date(viewDate);
    if (curView==='month') d.setMonth(d.getMonth()+1);
    else if (curView==='week') d.setDate(d.getDate()+7);
    else if (curView==='day')  d.setDate(d.getDate()+1);
    else d.setFullYear(d.getFullYear()+1);
    setViewDate(d);
    setAnimKey(k => k+1);
  };
  const goToday = () => { setViewDate(new Date(TODAY)); setAnimKey(k => k+1); };

  const switchView = (v: View) => {
    if (v === curView) return;
    setCurView(v);
    setAnimKey(k => k+1);
  };

  const [gotoDate, setGotoDate] = useState<string>('');
  const handleGoto = (date: string) => {
    setGotoDate(date);
    const d = new Date(date+'T00:00:00');
    if (!isNaN(d.getTime())) { setViewDate(d); setAnimKey(k => k+1); }
  };

  const views: { id: View; label: string }[] = [
    { id:'month', label: t('month') },
    { id:'week',  label: t('week')  },
    { id:'day',   label: t('day')   },
  ];

  return (
    <>
      <div className="cal-card" id="cal-card" style={{ flex:1, minWidth:0 }}>
        {/* ── Navigation Bar ── */}
        <div className="cal-nav">
          <div className="cal-nav-left">
            <button className="nav-btn" onClick={prev}>
              <ChevronLeft size={16} color="var(--dark)" />
            </button>

            <div className="cal-title">{titleText}</div>
            <button className="nav-btn" onClick={next}>
              <ChevronRight size={16} color="var(--dark)" />
            </button>

            <button className="today-btn" onClick={goToday}>{t('today')}</button>
          </div>

          <div className="cal-nav-right">
            <DatePicker
              value={gotoDate}
              onChange={handleGoto}
              placeholder={t('pick_date')}
              dropdownAlign="right"
            />

            {/* Globals toggle */}
            <button
              className={`globals-toggle${showGlobals?' on':''}`}
              id="globals-toggle-btn"
              onClick={toggleGlobals}
            >
              <Globe size={14} />
              <span>{t('global')}</span>
              <div className="toggle-pill" id="globals-pill">
                <div className="toggle-thumb"></div>
              </div>
            </button>
          </div>

          {/* View Tabs */}
          <div className="view-tabs">
            {views.map(v => (
              <button
                key={v.id}
                className={`vtab${curView===v.id?' active':''}`}
                onClick={() => switchView(v.id)}
              >
                {v.label}
              </button>
            ))}
          </div>
        </div>

        {/* ── View Content with slide animation ── */}
        <div style={{ position:'relative', overflow:'hidden' }}>
          {curView === 'month' && (
            <div key={`month-${animKey}`} className="vpage active anim-in" id="vpage-month">
              <MonthView />
            </div>
          )}
          {curView === 'week' && (
            <div key={`week-${animKey}`} className="vpage active anim-in" id="vpage-week">
              <WeekView />
            </div>
          )}
          {curView === 'day' && (
            <div key={`day-${animKey}`} className="vpage active anim-in" id="vpage-day">
              <DayView />
            </div>
          )}
          {curView === 'year' && (
            <div key={`year-${animKey}`} className="vpage active anim-in" id="vpage-year">
              <YearView />
            </div>
          )}
        </div>
      </div>
    </>
  );
}
