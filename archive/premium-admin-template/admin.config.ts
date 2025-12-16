/**
 * Admin Panel Configuration
 * 
 * Customize this file to configure the admin panel for your project.
 * This includes menu items, dashboard statistics, and entity types.
 */

export interface MenuItem {
  id: string;
  label: string;
  icon: string;
  href: string;
  description?: string;
}

export interface DashboardStat {
  id: string;
  title: string;
  icon: string;
  color: string;
  href: string;
  // You can customize these per project
  getCount?: () => Promise<number>;
}

export interface EntityType {
  id: string;
  label: string;
  labelPlural: string;
  icon: string;
  apiRoute: string;
  adminRoute: string;
}

export const adminConfig = {
  // Admin panel title
  title: 'Admin Panel',
  
  // Menu items in sidebar
  menuItems: [
    {
      id: 'dashboard',
      label: 'Kontrol Paneli',
      icon: 'dashboard',
      href: '/admin',
      description: 'Ana dashboard sayfası',
    },
    {
      id: 'media',
      label: 'Medya Kütüphanesi',
      icon: 'media',
      href: '/admin/media',
      description: 'Görsel ve video yönetimi',
    },
    {
      id: 'settings',
      label: 'Ayarlar',
      icon: 'siteSettings',
      href: '/admin/settings',
      description: 'Site ayarları',
    },
    // Add your custom menu items here
    // Example:
    // {
    //   id: 'products',
    //   label: 'Ürünler',
    //   icon: 'products',
    //   href: '/admin/products',
    //   description: 'Ürün yönetimi',
    // },
  ] as MenuItem[],

  // Dashboard statistics cards
  dashboardStats: [
    {
      id: 'media',
      title: 'Medya',
      icon: 'media',
      color: 'from-pink-500 to-pink-600',
      href: '/admin/media',
    },
    // Add your custom stats here
    // Example:
    // {
    //   id: 'products',
    //   title: 'Ürünler',
    //   icon: 'products',
    //   color: 'from-blue-500 to-blue-600',
    //   href: '/admin/products',
    // },
  ] as DashboardStat[],

  // Entity types for content management
  entityTypes: [
    // Add your entity types here
    // Example:
    // {
    //   id: 'product',
    //   label: 'Ürün',
    //   labelPlural: 'Ürünler',
    //   icon: 'products',
    //   apiRoute: '/api/admin/products',
    //   adminRoute: '/admin/products',
    // },
  ] as EntityType[],

  // Command Palette commands (will be auto-generated from menuItems)
  // You can add custom commands here
  customCommands: [] as Array<{
    id: string;
    label: string;
    description?: string;
    icon?: string;
    action: () => void;
    category: string;
    keywords?: string[];
  }>,
};

