import { Seo } from "@/components/Seo";
import { Loader2 } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";

import { AppShell } from "@/components/AppShell";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/context/AuthContext";
import { useTheme } from "@/context/ThemeContext";
import { updateUserProfile, updateUserSettings } from "@/lib/api";
import { pricing } from "@/lib/mock-data";

// Nigerian local format -> E.164 for the wa.me link (leading 0 dropped, +234 prepended).
const UPGRADE_WHATSAPP_NUMBER = "2347017470501";

function upgradeWhatsAppUrl(planName: string, price: string, period: string) {
  const message = `Hi, I'd like to upgrade to the ${planName} plan (${price} ${period}) on CareerMind AI.`;
  return `https://wa.me/${UPGRADE_WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
}


const notificationOptions = [
  { key: "matches", label: "New job matches above 85%", defaultOn: true },
  { key: "cv", label: "CV analysis results", defaultOn: true },
  { key: "roadmap", label: "Roadmap milestone reminders", defaultOn: true },
  { key: "digest", label: "Weekly career digest email", defaultOn: false },
  { key: "product", label: "Product news and offers", defaultOn: false },
];

function SettingsPage() {
  const { user } = useAuth();
  const { theme, toggle } = useTheme();
  const [name, setName] = useState(user?.name ?? "");
  const [targetRole, setTargetRole] = useState(user?.targetRole ?? "");
  const [bio, setBio] = useState(user?.bio ?? "");
  const [email, setEmail] = useState(user?.email ?? "");
  const [prefs, setPrefs] = useState(
    Object.fromEntries(notificationOptions.map((o) => [o.key, o.defaultOn])),
  );
  const [saving, setSaving] = useState(false);
  const saveProfile = (updateUserProfile);
  const saveSettings = (updateUserSettings);

  useEffect(() => {
    setName(user?.name ?? "");
    setEmail(user?.email ?? "");
    setTargetRole(user?.targetRole ?? "");
    setBio(user?.bio ?? "");
  }, [user]);

  async function handleSaveProfile() {
    setSaving(true);
    try {
      await saveProfile({ data: { fullName: name, targetRole, bio } });
      toast.success("Profile saved");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to save profile");
    } finally {
      setSaving(false);
    }
  }

  async function handleTogglePref(key: string, value: boolean) {
    setPrefs((p) => ({ ...p, [key]: value }));
    const next = { ...prefs, [key]: value };
    try {
      await saveSettings({
        data: {
          notifyMatches: next.matches,
          notifyCv: next.cv,
          notifyRoadmap: next.roadmap,
          notifyDigest: next.digest,
          notifyProduct: next.product,
        },
      });
      toast.success("Notification preference updated");
    } catch (err) {
      toast.error("Failed to update notification preference");
    }
  }

  return (
    <AppShell title="Settings" subtitle="Account, notifications and subscription.">
      <Tabs defaultValue="account">
        <TabsList>
          <TabsTrigger value="account">Account</TabsTrigger>
          <TabsTrigger value="notifications">Notifications</TabsTrigger>
          <TabsTrigger value="subscription">Subscription</TabsTrigger>
        </TabsList>

        <TabsContent value="account" className="mt-5">
          <div className="glass max-w-xl rounded-3xl p-6">
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Full name</Label>
                <Input id="name" value={name} onChange={(e) => setName(e.target.value)} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input id="email" value={email} disabled className="opacity-60" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="targetRole">Target role</Label>
                <Input
                  id="targetRole"
                  value={targetRole}
                  onChange={(e) => setTargetRole(e.target.value)}
                  placeholder="e.g. Senior Product Manager"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="bio">Bio</Label>
                <Input
                  id="bio"
                  value={bio}
                  onChange={(e) => setBio(e.target.value)}
                  placeholder="Short professional summary"
                />
              </div>
              <div className="flex items-center justify-between rounded-2xl border border-border p-4">
                <div>
                  <p className="text-sm font-medium">Light theme</p>
                  <p className="text-xs text-muted-foreground">Switch between dark and light mode</p>
                </div>
                <Switch checked={theme === "light"} onCheckedChange={toggle} />
              </div>
              <Button
                className="gradient-brand text-primary-foreground"
                onClick={handleSaveProfile}
                disabled={saving}
              >
                {saving && <Loader2 className="mr-2 size-4 animate-spin" />}
                Save changes
              </Button>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="notifications" className="mt-5">
          <div className="glass max-w-xl divide-y divide-border rounded-3xl p-2">
            {notificationOptions.map((o) => (
              <div key={o.key} className="flex items-center justify-between gap-4 p-4">
                <p className="text-sm">{o.label}</p>
                <Switch
                  checked={prefs[o.key]}
                  onCheckedChange={(v) => handleTogglePref(o.key, v)}
                />
              </div>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="subscription" className="mt-5">
          <div className="glass mb-5 flex flex-wrap items-center gap-4 rounded-3xl p-6">
            <div>
              <p className="text-sm text-muted-foreground">Current plan</p>
              <p className="font-display text-2xl font-bold gradient-text">{user?.plan}</p>
            </div>
            <Badge variant="secondary" className="ml-auto">
              Renews 12 Aug
            </Badge>
            <Button variant="outline" onClick={() => toast.info("Subscription management coming soon")}>
              Cancel plan
            </Button>
          </div>
          <div className="grid gap-4 lg:grid-cols-3">
            {pricing.map((p) => (
              <div
                key={p.name}
                className={
                  p.name === user?.plan
                    ? "rounded-3xl border border-primary/40 bg-card p-6 glow"
                    : "glass rounded-3xl p-6"
                }
              >
                <h3 className="font-semibold">{p.name}</h3>
                <p className="mt-1 text-xs text-muted-foreground">{p.blurb}</p>
                <p className="mt-4 font-display text-3xl font-bold">
                  {p.price}
                  <span className="text-sm text-muted-foreground"> {p.period}</span>
                </p>
                <Button
                  variant={p.name === user?.plan ? "outline" : "default"}
                  className={p.name === user?.plan ? "mt-5 w-full" : "gradient-brand mt-5 w-full text-primary-foreground"}
                  disabled={p.name === user?.plan}
                  asChild={p.name !== user?.plan}
                >
                  {p.name === user?.plan ? (
                    "Current plan"
                  ) : (
                    <a href={upgradeWhatsAppUrl(p.name, p.price, p.period)} target="_blank" rel="noopener noreferrer">
                      Upgrade via WhatsApp
                    </a>
                  )}
                </Button>
              </div>
            ))}
          </div>
          <p className="mt-4 text-center text-xs text-muted-foreground">
            Upgrades are handled manually for now — you'll be taken to WhatsApp to sort out payment.
          </p>
        </TabsContent>
      </Tabs>
    </AppShell>
  );
}

export default function Page() {
  return (
    <>
      <Seo title={"Settings — CareerMind AI"} description={"Manage your account, notifications, theme and CareerMind AI subscription."} />
      <ProtectedRoute>
      <SettingsPage />
    </ProtectedRoute>
    </>
  );
}
