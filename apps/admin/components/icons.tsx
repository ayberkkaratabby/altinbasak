'use client';

// Icon mapping - Lucide React icons
import {
  LayoutDashboard,
  FileText,
  Palette,
  PenTool,
  Settings,
  Image as ImageIcon,
  ClipboardList,
  Navigation as NavigationIcon,
  Footprints,
  Sparkles,
  Globe,
  LogOut,
  Plus,
  Search,
  Filter,
  ChevronDown,
  ChevronUp,
  Edit,
  Trash2,
  Eye,
  Check,
  X,
  AlertCircle,
  Clock,
  Calendar,
  Upload,
  Download,
  MoreVertical,
  ArrowUpDown,
  ArrowUp,
  ArrowDown,
} from 'lucide-react';

export const AdminIcons = {
  // Navigation
  dashboard: LayoutDashboard,
  pages: FileText,
  projects: Palette,
  blog: PenTool,
  services: Settings,
  media: ImageIcon,
  leads: ClipboardList,
  navigation: NavigationIcon,
  footer: Footprints,
  hero: Sparkles,
  siteSettings: Settings,
  
  // Actions
  globe: Globe,
  logout: LogOut,
  plus: Plus,
  search: Search,
  filter: Filter,
  edit: Edit,
  delete: Trash2,
  view: Eye,
  check: Check,
  x: X,
  alert: AlertCircle,
  clock: Clock,
  calendar: Calendar,
  upload: Upload,
  download: Download,
  more: MoreVertical,
  
  // Sorting
  sort: ArrowUpDown,
  sortUp: ArrowUp,
  sortDown: ArrowDown,
  chevronDown: ChevronDown,
  chevronUp: ChevronUp,
};

export type IconName = keyof typeof AdminIcons;

