import type { Metadata } from "next";
import { isAuthenticated } from "@/lib/auth";
import { getServiceClient, isSupabaseConfigured } from "@/lib/supabase";
import { getAllHeroImages } from "@/lib/hero";
import AdminLogin from "./AdminLogin";
import AdminDashboard from "./AdminDashboard";
import type {
  DevProject,
  MotionProject,
  WriterPost,
  ToolkitItem,
  Collaboration,
} from "@/lib/types";

export const metadata: Metadata = {
  title: "Admin",
  robots: { index: false, follow: false },
};

// Always render fresh; never cache the admin view.
export const dynamic = "force-dynamic";

export default async function AdminPage() {
  const authed = await isAuthenticated();

  if (!authed) {
    const configured = Boolean(
      process.env.ADMIN_PASSCODE && process.env.ADMIN_SESSION_SECRET
    );
    return <AdminLogin configured={configured} />;
  }

  // Authenticated: load current content with the service client for the dashboard.
  const client = getServiceClient();
  let dev: DevProject[] = [];
  let motion: MotionProject[] = [];
  let writer: WriterPost[] = [];
  let toolkit: ToolkitItem[] = [];
  let collaborations: Collaboration[] = [];

  if (client) {
    const [d, m, w, t, c] = await Promise.all([
      client.from("dev_projects").select("*").order("created_at", { ascending: false }),
      client.from("motion_projects").select("*").order("created_at", { ascending: false }),
      client.from("writer_posts").select("*").order("date", { ascending: false }),
      client.from("toolkit_items").select("*").order("sort_order", { ascending: true }),
      client.from("collaborations").select("*").order("sort_order", { ascending: true }),
    ]);
    dev = (d.data as DevProject[]) ?? [];
    motion = (m.data as MotionProject[]) ?? [];
    writer = (w.data as WriterPost[]) ?? [];
    toolkit = (t.data as ToolkitItem[]) ?? [];
    collaborations = (c.data as Collaboration[]) ?? [];
  }

  const heroes = await getAllHeroImages();

  return (
    <AdminDashboard
      supabaseReady={isSupabaseConfigured() && Boolean(client)}
      initialDev={dev}
      initialMotion={motion}
      initialWriter={writer}
      initialToolkit={toolkit}
      initialCollaborations={collaborations}
      initialHeroes={heroes}
    />
  );
}
