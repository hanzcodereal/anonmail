"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import type { TempMailMessage } from "@/lib/tempmail";
import type { Session } from "@/lib/types";
import Header from "./Header";
import Hero from "./Hero";
import EmailBox from "./EmailBox";
import InboxList from "./InboxList";
import MessageModal from "./MessageModal";
import { FeatureGrid, StatsGrid, CTASection } from "./InfoGrids";
import SettingsSection from "./SettingsSection";
import BottomNav from "./BottomNav";
import Footer from "./Footer";
import { ToastStack, type ToastData } from "./Toast";

const STORAGE_KEY = "anonmail_session_v3";
const TTL_MINUTES = 24 * 60;
const TTL_SECONDS = TTL_MINUTES * 60;
const POLL_INTERVAL_MS = 8000;

export default function MailApp() {
  const [session, setSession] = useState<Session | null>(null);
  const [loadingSession, setLoadingSession] = useState(false);
  const [messages, setMessages] = useState<TempMailMessage[]>([]);
  const [copied, setCopied] = useState(false);
  const [openMessageNumber, setOpenMessageNumber] = useState<number | null>(null);
  const [openMessage, setOpenMessage] = useState<TempMailMessage | null>(null);
  const [loadingMessage, setLoadingMessage] = useState(false);
  const [secondsLeft, setSecondsLeft] = useState(TTL_SECONDS);
  const [autoChecking, setAutoChecking] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [toasts, setToasts] = useState<ToastData[]>([]);
  const pollRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const toastIdRef = useRef(0);

  const pushToast = useCallback((type: ToastData["type"], message: string) => {
    const id = ++toastIdRef.current;
    setToasts((prev) => [...prev, { id, type, message }]);
  }, []);

  const dismissToast = useCallback((id: number) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  useEffect(() => {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (raw) {
      try {
        const parsed: Session = JSON.parse(raw);
        setSession(parsed);
        return;
      } catch {
        // fall through
      }
    }
    generate();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (session) {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(session));
    }
  }, [session]);

  useEffect(() => {
    if (!session) return;
    const tick = () => {
      const elapsedSec = Math.floor((Date.now() - session.createdAt) / 1000);
      setSecondsLeft(Math.max(0, TTL_SECONDS - elapsedSec));
    };
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, [session]);

  const fetchInbox = useCallback(
    async (sess: Session, silent = true) => {
      if (!silent) setAutoChecking(true);
      try {
        const res = await fetch(`/api/${encodeURIComponent(sess.address)}/inbox`);
        const data = await res.json();
        if (res.ok && data.success) {
          setMessages(data.data?.messages || []);
          if (!silent) pushToast("success", "Inbox diperbarui.");
        } else if (!silent) {
          pushToast("error", data.error || "Gagal memuat inbox.");
        }
      } catch {
        if (!silent) pushToast("error", "Tidak bisa terhubung ke server email.");
      } finally {
        if (!silent) setAutoChecking(false);
      }
    },
    [pushToast]
  );

  useEffect(() => {
    if (pollRef.current) clearInterval(pollRef.current);
    if (!session) return;

    fetchInbox(session);
    setAutoChecking(true);
    pollRef.current = setInterval(() => fetchInbox(session), POLL_INTERVAL_MS);

    return () => {
      if (pollRef.current) clearInterval(pollRef.current);
    };
  }, [session, fetchInbox]);

  async function generate(username?: string, domain?: string) {
    setLoadingSession(true);
    setMessages([]);
    try {
      const path = username
        ? encodeURIComponent(domain ? `${username}@${domain}` : username)
        : "random";
      const res = await fetch(`/api/${path}`);
      const data = await res.json();
      if (!res.ok || !data.success) {
        pushToast(
          "error",
          data.error ||
            "Server email sedang bermasalah. Coba tekan tombol refresh lagi dalam beberapa saat."
        );
        return;
      }
      setSession({
        address: data.data.email,
        username: data.data.username,
        domain: data.data.domain,
        createdAt: Date.now(),
      });
      if (username) pushToast("success", "Email dengan nama custom berhasil dibuat.");
    } catch {
      pushToast("error", "Gagal terhubung ke server. Periksa koneksi internet Anda.");
    } finally {
      setLoadingSession(false);
    }
  }

  function handleCopy() {
    if (!session) return;
    navigator.clipboard.writeText(session.address).then(() => {
      setCopied(true);
      pushToast("success", "Alamat email disalin.");
      setTimeout(() => setCopied(false), 1600);
    });
  }

  async function handleOpenMessage(number: number) {
    if (!session) return;
    setOpenMessageNumber(number);
    setLoadingMessage(true);
    setOpenMessage(null);
    try {
      const res = await fetch(`/api/${encodeURIComponent(session.address)}/inbox/${number}`);
      const data = await res.json();
      if (res.ok && data.success) {
        setOpenMessage(data.data);
      } else {
        pushToast("error", data.error || "Gagal membuka pesan.");
      }
    } catch {
      pushToast("error", "Gagal membuka pesan.");
    } finally {
      setLoadingMessage(false);
    }
  }

  async function handleRefresh() {
    if (!session || refreshing) return;
    setRefreshing(true);
    await fetchInbox(session, false);
    setRefreshing(false);
  }

  function handleClearAll() {
    if (!session) return;
    if (!confirm("Buat inbox baru? Alamat email saat ini akan diganti.")) return;
    window.localStorage.removeItem(STORAGE_KEY);
    setMessages([]);
    generate();
  }

  function handleNewAddress() {
    if (!session) return;
    if (!confirm(`Ganti alamat ${session.address} dengan yang baru?`)) return;
    window.localStorage.removeItem(STORAGE_KEY);
    setSession(null);
    setMessages([]);
    generate();
  }

  return (
    <div id="top" className="flex min-h-dvh flex-col">
      <ToastStack toasts={toasts} onDismiss={dismissToast} />
      <Header />
      <main className="flex-1 pb-10">
        <Hero />
        <EmailBox
          session={session}
          loading={loadingSession}
          onGenerate={generate}
          onCopy={handleCopy}
          copied={copied}
        />
        <InboxList
          messages={messages}
          onOpen={handleOpenMessage}
          onClearAll={handleClearAll}
          onRefresh={handleRefresh}
          refreshing={refreshing}
          autoChecking={autoChecking}
        />
        <FeatureGrid />
        <StatsGrid received={messages.length} secondsLeft={secondsLeft} />
        <CTASection onGenerate={() => generate()} />
        <SettingsSection session={session} onDelete={handleNewAddress} />
      </main>
      <Footer />
      <BottomNav />

      {openMessageNumber !== null && (
        <MessageModal
          message={openMessage}
          loading={loadingMessage}
          onClose={() => {
            setOpenMessageNumber(null);
            setOpenMessage(null);
          }}
        />
      )}
    </div>
  );
}
