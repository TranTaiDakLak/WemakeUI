import { createRouter, createWebHashHistory, type RouteRecordRaw } from 'vue-router'

const routes: RouteRecordRaw[] = [
  {
    path: '/',
    component: () => import('../views/showcase/DemoLayout.vue'),
    children: [
      {
        path: '',
        name: 'Sitemap',
        component: () => import('../views/showcase/SitemapView.vue'),
      },
      /* ── phase 0 ────────────────────────────────────── */
      {
        path: 'showcase/tokens',
        name: 'ShowcaseTokens',
        component: () => import('../views/showcase/TokensShowcase.vue'),
      },
      /* ── phase 1 ────────────────────────────────────── */
      {
        path: 'showcase/primitives',
        name: 'ShowcasePrimitives',
        component: () => import('../views/showcase/PrimitivesShowcase.vue'),
      },
      /* ── phase 2 ────────────────────────────────────── */
      {
        path: 'showcase/overlay',
        name: 'ShowcaseOverlay',
        component: () => import('../views/showcase/OverlayShowcase.vue'),
      },
      {
        path: 'showcase/nav',
        name: 'ShowcaseNav',
        component: () => import('../views/showcase/NavShowcase.vue'),
      },
      /* ── phase 3 — form & layout shells ─────────────── */
      {
        path: 'showcase/shell/sidebar',
        name: 'ShowcaseShellSidebar',
        component: () => import('../views/showcase/shell/SidebarShellShowcase.vue'),
      },
      {
        path: 'showcase/shell/topnav',
        name: 'ShowcaseShellTopNav',
        component: () => import('../views/showcase/shell/TopNavShellShowcase.vue'),
      },
      {
        path: 'showcase/shell/split',
        name: 'ShowcaseShellSplit',
        component: () => import('../views/showcase/shell/SplitShellShowcase.vue'),
      },
      /* ── phase 4 — data display ─────────────────────── */
      {
        path: 'showcase/data',
        name: 'ShowcaseDataIndex',
        component: () => import('../views/showcase/data/IndexView.vue'),
      },
      {
        path: 'showcase/data/grid',
        name: 'ShowcaseDataGrid',
        component: () => import('../views/showcase/data/GridView.vue'),
      },
      {
        path: 'showcase/data/filter',
        name: 'ShowcaseDataFilter',
        component: () => import('../views/showcase/data/FilterView.vue'),
      },
      {
        path: 'showcase/data/log',
        name: 'ShowcaseDataLog',
        component: () => import('../views/showcase/data/LogView.vue'),
      },
      {
        path: 'showcase/data/kanban',
        name: 'ShowcaseDataKanban',
        component: () => import('../views/showcase/data/KanbanView.vue'),
      },
      {
        path: 'showcase/data/calendar',
        name: 'ShowcaseDataCalendar',
        component: () => import('../views/showcase/data/CalendarView.vue'),
      },
      {
        path: 'showcase/data/timeline',
        name: 'ShowcaseDataTimeline',
        component: () => import('../views/showcase/data/TimelineView.vue'),
      },
      {
        path: 'showcase/data/gallery',
        name: 'ShowcaseDataGallery',
        component: () => import('../views/showcase/data/GalleryView.vue'),
      },
      /* ── phase 4.5 — chart system ───────────────────── */
      {
        path: 'showcase/charts',
        name: 'ShowcaseCharts',
        component: () => import('../views/showcase/charts/IndexView.vue'),
      },
      /* ── phase 5 — feedback / async / permission / platform ── */
      {
        path: 'showcase/async',
        name: 'ShowcaseAsync',
        component: () => import('../views/showcase/AsyncShowcase.vue'),
      },
      {
        path: 'showcase/permission',
        name: 'ShowcasePermission',
        component: () => import('../views/showcase/PermissionShowcase.vue'),
      },
      {
        path: 'showcase/platform',
        name: 'ShowcasePlatform',
        component: () => import('../views/showcase/PlatformShowcase.vue'),
      },
    ],
  },
  /* Legacy showcase — không có sidebar wrapper */
  {
    path: '/legacy',
    name: 'LegacyShowcase',
    component: () => import('../views/ShowcaseView.vue'),
  },

  /* ── phase 6 — auth / error / dashboard ──────────────────────
   * mỗi page là full-page (không wrap trong DemoLayout).
   * AuthLayout / ErrorLayout / DashboardLayout đã có sẵn shell riêng.
   * ─────────────────────────────────────────────────────────── */

  /* auth (10 trang) */
  { path: '/auth/login',     name: 'AuthLogin',     component: () => import('../views/auth/LoginView.vue') },
  { path: '/auth/login-v2',  name: 'AuthLoginV2',   component: () => import('../views/auth/LoginV2View.vue') },
  { path: '/auth/register',  name: 'AuthRegister',  component: () => import('../views/auth/RegisterView.vue') },
  { path: '/auth/forgot',    name: 'AuthForgot',    component: () => import('../views/auth/ForgotPasswordView.vue') },
  { path: '/auth/reset',     name: 'AuthReset',     component: () => import('../views/auth/ResetPasswordView.vue') },
  { path: '/auth/otp',       name: 'AuthOtp',       component: () => import('../views/auth/OtpView.vue') },
  { path: '/auth/email-verify', name: 'AuthEmailVerify', component: () => import('../views/auth/EmailVerifyView.vue') },
  { path: '/auth/lock',      name: 'AuthLock',      component: () => import('../views/auth/LockScreenView.vue') },
  { path: '/auth/onboarding', name: 'AuthOnboarding', component: () => import('../views/auth/OnboardingView.vue') },
  { path: '/auth/workspace', name: 'AuthWorkspace', component: () => import('../views/auth/WorkspacePickerView.vue') },

  /* error (7 trang) */
  { path: '/error/404',     name: 'Error404',     component: () => import('../views/error/NotFoundView.vue') },
  { path: '/error/500',     name: 'Error500',     component: () => import('../views/error/ServerErrorView.vue') },
  { path: '/error/403',     name: 'Error403',     component: () => import('../views/error/ForbiddenView.vue') },
  { path: '/error/503',     name: 'Error503',     component: () => import('../views/error/MaintenanceView.vue') },
  { path: '/error/offline', name: 'ErrorOffline', component: () => import('../views/error/OfflineView.vue') },
  { path: '/error/under-construction', name: 'ErrorConstruction', component: () => import('../views/error/UnderConstructionView.vue') },
  { path: '/error/coming-soon',        name: 'ErrorComingSoon',  component: () => import('../views/error/ComingSoonView.vue') },

  /* dashboard (10 trang) */
  { path: '/dashboard/overview',   name: 'DashOverview',   component: () => import('../views/dashboard/OverviewView.vue') },
  { path: '/dashboard/analytics',  name: 'DashAnalytics',  component: () => import('../views/dashboard/AnalyticsView.vue') },
  { path: '/dashboard/ecommerce',  name: 'DashEcommerce',  component: () => import('../views/dashboard/EcommerceView.vue') },
  { path: '/dashboard/crm',        name: 'DashCrm',        component: () => import('../views/dashboard/CrmView.vue') },
  { path: '/dashboard/project',    name: 'DashProject',    component: () => import('../views/dashboard/ProjectView.vue') },
  { path: '/dashboard/finance',    name: 'DashFinance',    component: () => import('../views/dashboard/FinanceView.vue') },
  { path: '/dashboard/saas',       name: 'DashSaas',       component: () => import('../views/dashboard/SaasView.vue') },
  { path: '/dashboard/logistics',  name: 'DashLogistics',  component: () => import('../views/dashboard/LogisticsView.vue') },
  { path: '/dashboard/helpdesk',   name: 'DashHelpdesk',   component: () => import('../views/dashboard/HelpdeskView.vue') },
  { path: '/dashboard/iot',        name: 'DashIot',        component: () => import('../views/dashboard/IotView.vue') },

  /* ── phase 7 — app pages (20) ───────────────────────────────── */
  { path: '/app/profile',       name: 'AppProfile',       component: () => import('../views/app/ProfileView.vue') },
  { path: '/app/profile-edit',  name: 'AppProfileEdit',   component: () => import('../views/app/ProfileEditView.vue') },
  { path: '/app/settings',      name: 'AppSettings',      component: () => import('../views/app/SettingsView.vue') },
  { path: '/app/mailbox',       name: 'AppMailbox',       component: () => import('../views/app/MailboxView.vue') },
  { path: '/app/chat',          name: 'AppChat',          component: () => import('../views/app/ChatView.vue') },
  { path: '/app/pricing',       name: 'AppPricing',       component: () => import('../views/app/PricingView.vue') },
  { path: '/app/notifications', name: 'AppNotifications', component: () => import('../views/app/NotificationsView.vue') },
  { path: '/app/faq',           name: 'AppFaq',           component: () => import('../views/app/FaqView.vue') },
  { path: '/app/search',        name: 'AppSearch',        component: () => import('../views/app/SearchView.vue') },
  { path: '/app/invoices',      name: 'AppInvoice',       component: () => import('../views/app/InvoiceView.vue') },
  { path: '/app/files',         name: 'AppFiles',         component: () => import('../views/app/FileManagerView.vue') },
  { path: '/app/api-keys',      name: 'AppApiKeys',       component: () => import('../views/app/ApiKeyView.vue') },
  { path: '/app/audit-log',     name: 'AppAuditLog',      component: () => import('../views/app/AuditLogView.vue') },
  { path: '/app/wiki',          name: 'AppWiki',          component: () => import('../views/app/WikiView.vue') },
  { path: '/app/organization',  name: 'AppOrganization',  component: () => import('../views/app/OrganizationView.vue') },
  { path: '/app/product',       name: 'AppProduct',       component: () => import('../views/app/ProductDetailView.vue') },
  { path: '/app/order',         name: 'AppOrder',         component: () => import('../views/app/OrderDetailView.vue') },
  { path: '/app/learning',      name: 'AppLearning',      component: () => import('../views/app/LearningView.vue') },
  { path: '/app/map',           name: 'AppMap',           component: () => import('../views/app/MapView.vue') },
  { path: '/app/calendar',      name: 'AppCalendar',      component: () => import('../views/app/CalendarAppView.vue') },

  /* ── phase 7 — landing pages (10) ──────────────────────────── */
  { path: '/landing',           name: 'LandingSaas',      component: () => import('../views/landing/LandingSaasView.vue') },
  { path: '/landing/about',     name: 'LandingAbout',     component: () => import('../views/landing/AboutView.vue') },
  { path: '/landing/contact',   name: 'LandingContact',   component: () => import('../views/landing/ContactView.vue') },
  { path: '/landing/blog',      name: 'LandingBlog',      component: () => import('../views/landing/BlogListView.vue') },
  { path: '/landing/blog/post', name: 'LandingBlogPost',  component: () => import('../views/landing/BlogPostView.vue') },
  { path: '/landing/changelog', name: 'LandingChangelog', component: () => import('../views/landing/ChangelogView.vue') },
  { path: '/landing/careers',   name: 'LandingCareers',   component: () => import('../views/landing/CareersView.vue') },
  { path: '/landing/policy',    name: 'LandingPolicy',    component: () => import('../views/landing/PolicyView.vue') },
  { path: '/landing/api',       name: 'LandingApi',       component: () => import('../views/landing/LandingApiView.vue') },
  { path: '/landing/features',  name: 'LandingFeatures',  component: () => import('../views/landing/FeaturesView.vue') },

  /* ── phase 7 — weconnect pages (10) ────────────────────────── */
  { path: '/weconnect',               name: 'WCAdmin',        component: () => import('../views/weconnect/AdminView.vue') },
  { path: '/weconnect/accounts',      name: 'WCAccounts',     component: () => import('../views/weconnect/AccountsView.vue') },
  { path: '/weconnect/sessions',      name: 'WCSessions',     component: () => import('../views/weconnect/SessionsView.vue') },
  { path: '/weconnect/contacts',      name: 'WCContacts',     component: () => import('../views/weconnect/ContactsView.vue') },
  { path: '/weconnect/campaigns',     name: 'WCCampaigns',    component: () => import('../views/weconnect/CampaignsView.vue') },
  { path: '/weconnect/plugins',       name: 'WCPlugins',      component: () => import('../views/weconnect/PluginsView.vue') },
  { path: '/weconnect/console',       name: 'WCConsole',      component: () => import('../views/weconnect/ConsoleView.vue') },
  { path: '/weconnect/scheduler',     name: 'WCScheduler',    component: () => import('../views/weconnect/SchedulerView.vue') },
  { path: '/weconnect/integrations',  name: 'WCIntegrations', component: () => import('../views/weconnect/IntegrationsView.vue') },
  { path: '/weconnect/automation',    name: 'WCAutomation',   component: () => import('../views/weconnect/AutomationCanvasView.vue') },
]

const router = createRouter({
  history: createWebHashHistory(),
  routes,
})

export default router
