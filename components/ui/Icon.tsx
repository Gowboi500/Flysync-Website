import {
  Award,
  Bell,
  Building2,
  CalendarRange,
  Check,
  Clock,
  Cloud,
  Compass,
  Globe,
  GraduationCap,
  Handshake,
  Heart,
  Hotel,
  Layers,
  LayoutDashboard,
  LifeBuoy,
  Lightbulb,
  LineChart,
  type LucideIcon,
  Mail,
  MapPin,
  Network,
  Phone,
  Plane,
  Plug,
  Rocket,
  Search,
  ShieldCheck,
  Smartphone,
  Sparkles,
  Tags,
  Target,
  TrendingUp,
  Users,
  Wallet,
  Zap,
} from "lucide-react";

/**
 * Single registry so content files can name an icon as a string and stay
 * free of JSX. One icon family throughout the site.
 */
export const ICONS: Record<string, LucideIcon> = {
  Award,
  Bell,
  Building2,
  CalendarRange,
  Check,
  Clock,
  Cloud,
  Compass,
  Globe,
  GraduationCap,
  Handshake,
  Heart,
  Hotel,
  Layers,
  LayoutDashboard,
  LifeBuoy,
  Lightbulb,
  LineChart,
  Mail,
  MapPin,
  Network,
  Phone,
  Plane,
  Plug,
  Rocket,
  Search,
  ShieldCheck,
  Smartphone,
  Sparkles,
  Tags,
  Target,
  TrendingUp,
  Users,
  Wallet,
  Zap,
};

export function Icon({
  name,
  className = "h-5 w-5",
  strokeWidth = 1.75,
}: {
  name: string;
  className?: string;
  strokeWidth?: number;
}) {
  const Cmp = ICONS[name] ?? Sparkles;
  return <Cmp className={className} strokeWidth={strokeWidth} />;
}
