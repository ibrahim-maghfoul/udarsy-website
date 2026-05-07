"use client";
import React from "react";
import { useCalendar } from "../context/CalendarContext";
import { Trash2 } from "lucide-react";
import { useTranslations } from "next-intl";

export default function ConfirmModal() {
  const { confirmOpen, confirmMsg, closeConfirm, confirmOk } = useCalendar();
  const t = useTranslations("CalendarPage");

  if (!confirmOpen) return null;
  return (
    <div id="confirm-overlay" className="open">
      <div id="confirm-box">
        <div className="confirm-icon">
          <Trash2 size={24} color="#ef4444" />
        </div>
        <div className="confirm-title">{t('delete_event_title')}</div>
        <div className="confirm-msg">{confirmMsg}</div>
        <div className="confirm-btns">
          <button className="confirm-cancel" onClick={closeConfirm}>{t('cancel')}</button>
          <button className="confirm-delete" onClick={confirmOk}>{t('delete_confirm')}</button>
        </div>
      </div>
    </div>
  );
}
