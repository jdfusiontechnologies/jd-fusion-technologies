import React, { useState, useEffect, useCallback } from 'react';
import { BrowserRouter, Routes, Route, Navigate, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';
import { AuthProvider } from './context/AuthContext';
import { api, getAuthToken } from './lib/api';
import {
  PublicSiteData,
  AdminSiteData,
  AdminDashboardStats,
  Inquiry,
  MediaItem,
  WebProject,
  GraphicProject,
  ServiceItem,
  Testimonial,
} from './types';
import { defaultPublicSiteData } from './data/defaultData';

// Common UI Components
import { Navbar } from './components/common/Navbar';
import { Footer } from './components/common/Footer';
import { WhatsAppFloatingButton } from './components/common/WhatsAppFloatingButton';
import { LightboxModal } from './components/common/LightboxModal';
import { ProjectModal } from './components/common/ProjectModal';
import { CursorSpotlight } from './components/common/CursorSpotlight';
import { ScrollToTop } from './components/common/ScrollToTop';

// Dedicated Multi-Page Views
import { HomePage } from './pages/HomePage';
import { ServicesPage } from './pages/ServicesPage';
import { ServiceDetailPage } from './pages/ServiceDetailPage';
import { ProjectsPage } from './pages/ProjectsPage';
import { AboutPage } from './pages/AboutPage';
import { InsightsPage } from './pages/InsightsPage';
import { InsightDetailPage } from './pages/InsightDetailPage';
import { ContactPage } from './pages/ContactPage';

// Admin CMS Components
import { AdminLoginView } from './components/admin/AdminLoginView';
import { AdminLayout } from './components/admin/AdminLayout';
import { AdminDashboardView } from './components/admin/AdminDashboardView';
import { AdminHomepageView } from './components/admin/AdminHomepageView';
import { AdminAboutView } from './components/admin/AdminAboutView';
import { AdminFoundersView } from './components/admin/AdminFoundersView';
import { AdminServicesView } from './components/admin/AdminServicesView';
import { AdminWebProjectsView } from './components/admin/AdminWebProjectsView';
import { AdminTestimonialsView } from './components/admin/AdminTestimonialsView';
import { AdminInquiriesView } from './components/admin/AdminInquiriesView';
import { AdminContactLocationView } from './components/admin/AdminContactLocationView';
import { AdminSocialsView } from './components/admin/AdminSocialsView';
import { AdminSEOView } from './components/admin/AdminSEOView';
import { AdminMediaView } from './components/admin/AdminMediaView';
import { AdminSettingsView } from './components/admin/AdminSettingsView';
import { AdminSecurityActivityView } from './components/admin/AdminSecurityActivityView';
import { AdminUserActivitiesView } from './components/admin/AdminUserActivitiesView';

import { Loader2, AlertTriangle, RefreshCw } from 'lucide-react';

const AdminRouteWrapper: React.FC<{
  adminData: AdminSiteData | null;
  publicData: PublicSiteData;
  stats: AdminDashboardStats | null;
  inquiries: Inquiry[];
  mediaList: MediaItem[];
  isAdminLoading: boolean;
  adminError: string | null;
  fetchAdminData: () => Promise<void>;
  onInquiryStatusChange: (id: string, status: 'new' | 'read' | 'archived') => Promise<void>;
}> = ({
  adminData,
  publicData,
  stats,
  inquiries,
  mediaList,
  isAdminLoading,
  adminError,
  fetchAdminData,
  onInquiryStatusChange,
}) => {
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [adminTab, setAdminTab] = useState<string>('dashboard');

  useEffect(() => {
    const hash = (window.location.hash || '').replace('#', '').toLowerCase();
    if (hash.startsWith('admin/')) {
      const tab = hash.replace('admin/', '').split('/')[0];
      if (tab) setAdminTab(tab);
    }
  }, []);

  if (!isAuthenticated) {
    return (
      <AdminLoginView
        onSuccess={() => {
          fetchAdminData();
          setAdminTab('dashboard');
        }}
        onBackToSite={() => navigate('/')}
      />
    );
  }

  const unreadCount = inquiries.filter((i) => i.status === 'new').length;
  const activeAdminData = adminData || (publicData as unknown as AdminSiteData) || (defaultPublicSiteData as unknown as AdminSiteData);

  return (
    <AdminLayout
      currentTab={adminTab}
      onSelectTab={(tab) => {
        setAdminTab(tab);
        window.location.hash = `admin/${tab}`;
      }}
      onViewLiveSite={() => navigate('/')}
      unreadInquiriesCount={unreadCount}
    >
      {adminError && (
        <div className="mb-6 p-4 rounded-2xl bg-red-500/10 border border-red-500/30 text-red-600 dark:text-red-400 flex items-center justify-between text-xs">
          <div className="flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 shrink-0" />
            <span>{adminError}</span>
          </div>
          <button
            onClick={() => fetchAdminData()}
            className="px-3 py-1.5 rounded-lg bg-red-600 hover:bg-red-500 text-white font-bold transition-colors cursor-pointer"
          >
            Retry
          </button>
        </div>
      )}

      {adminTab === 'dashboard' && (
        <AdminDashboardView
          stats={stats}
          isLoading={isAdminLoading}
          onRefresh={fetchAdminData}
          onNavigateTab={(tab) => {
            setAdminTab(tab);
            window.location.hash = `admin/${tab}`;
          }}
          onUpdateInquiryStatus={onInquiryStatusChange}
        />
      )}

      {adminTab === 'user-activities' && <AdminUserActivitiesView />}
      {adminTab === 'security' && <AdminSecurityActivityView />}
      {adminTab === 'homepage' && <AdminHomepageView settings={activeAdminData.settings} onRefresh={fetchAdminData} />}
      {adminTab === 'about' && <AdminAboutView about={activeAdminData.about} onRefresh={fetchAdminData} />}
      {adminTab === 'founders' && <AdminFoundersView founders={activeAdminData.founders || []} onRefresh={fetchAdminData} />}
      {adminTab === 'services' && <AdminServicesView services={activeAdminData.services} onRefresh={fetchAdminData} />}
      {adminTab === 'web-projects' && <AdminWebProjectsView projects={activeAdminData.webProjects} onRefresh={fetchAdminData} />}
      {adminTab === 'testimonials' && <AdminTestimonialsView testimonials={activeAdminData.testimonials} onRefresh={fetchAdminData} />}
      {adminTab === 'inquiries' && <AdminInquiriesView inquiries={inquiries} onRefresh={fetchAdminData} />}
      {adminTab === 'contact' && (
        <AdminContactLocationView
          contact={activeAdminData.contact}
          location={activeAdminData.location}
          onRefresh={fetchAdminData}
        />
      )}
      {adminTab === 'socials' && <AdminSocialsView socials={activeAdminData.socials} onRefresh={fetchAdminData} />}
      {adminTab === 'seo' && <AdminSEOView seo={activeAdminData.seo} onRefresh={fetchAdminData} />}
      {adminTab === 'media' && <AdminMediaView mediaList={mediaList} onRefresh={fetchAdminData} />}
      {adminTab === 'settings' && <AdminSettingsView onRefreshAll={fetchAdminData} />}
    </AdminLayout>
  );
};

const MainAppContent: React.FC = () => {
  const { isAuthenticated, isLoading: authLoading } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const isAdminRoute = location.pathname.startsWith('/admin');

  // Data States
  const [publicData, setPublicData] = useState<PublicSiteData>(defaultPublicSiteData);
  const [adminData, setAdminData] = useState<AdminSiteData | null>(null);
  const [stats, setStats] = useState<AdminDashboardStats | null>(null);
  const [inquiries, setInquiries] = useState<Inquiry[]>([]);
  const [mediaList, setMediaList] = useState<MediaItem[]>([]);

  const [isLoadingData, setIsLoadingData] = useState<boolean>(false);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [isAdminLoading, setIsAdminLoading] = useState<boolean>(false);
  const [adminError, setAdminError] = useState<string | null>(null);

  // Modal States
  const [selectedWebProject, setSelectedWebProject] = useState<WebProject | null>(null);
  const [selectedGraphicImage, setSelectedGraphicImage] = useState<{
    imageUrl: string;
    title: string;
    category?: string;
  } | null>(null);

  // Keyboard shortcut: Alt+A or Ctrl+Shift+A opens Admin Portal
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (
        (e.ctrlKey && e.shiftKey && (e.key === 'a' || e.key === 'A')) ||
        (e.altKey && (e.key === 'a' || e.key === 'A'))
      ) {
        e.preventDefault();
        navigate('/admin');
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [navigate]);

  // Fetch Public Data
  const fetchPublicData = useCallback(async () => {
    try {
      setLoadError(null);
      const data = await api.getPublicSiteData();
      setPublicData(data);
    } catch (err: any) {
      console.error('Failed to load public site data:', err);
      setLoadError(err.message || 'Unable to connect to JD Fusion Technologies server.');
    } finally {
      setIsLoadingData(false);
    }
  }, []);

  // Fetch Admin Data
  const fetchAdminData = useCallback(async () => {
    const token = getAuthToken();
    // Only attempt to fetch admin data if explicitly authenticated and token exists
    if (!isAuthenticated || !token) return;

    setIsAdminLoading(true);
    setAdminError(null);

    try {
      const [fullSiteData, dashboardStats, allInquiries, allMedia] = await Promise.all([
        api.getAdminSiteData().catch((err) => {
          console.warn('[Admin] Note: Could not load site data:', err?.message || err);
          return null;
        }),
        api.getDashboardStats().catch((err) => {
          console.warn('[Admin] Note: Could not load dashboard stats:', err?.message || err);
          return null;
        }),
        api.getInquiries().catch(() => []),
        api.getMediaList().catch(() => []),
      ]);

      const activeInquiries = Array.isArray(allInquiries) ? allInquiries : [];
      setInquiries(activeInquiries);
      setMediaList(Array.isArray(allMedia) ? allMedia : []);

      if (fullSiteData) {
        setAdminData(fullSiteData);
        setPublicData({
          settings: fullSiteData.settings,
          about: fullSiteData.about,
          contact: fullSiteData.contact,
          location: fullSiteData.location,
          socials: fullSiteData.socials,
          seo: fullSiteData.seo,
          founders: fullSiteData.founders || [],
          services: fullSiteData.services?.filter((s: ServiceItem) => s.isPublished) || [],
          webProjects: fullSiteData.webProjects?.filter((p: WebProject) => p.isPublished) || [],
          graphicProjects: fullSiteData.graphicProjects?.filter((p: GraphicProject) => p.isPublished) || [],
          testimonials: fullSiteData.testimonials?.filter((t: Testimonial) => t.isPublished) || [],
        });
      }

      if (dashboardStats) {
        setStats(dashboardStats);
      } else {
        const source = fullSiteData || (publicData as AdminSiteData) || (defaultPublicSiteData as unknown as AdminSiteData);
        setStats({
          totalWebProjects: source.webProjects?.length || 0,
          totalGraphicProjects: source.graphicProjects?.length || 0,
          totalServices: source.services?.length || 0,
          publishedServices: source.services?.filter((s: ServiceItem) => s.isPublished)?.length || 0,
          publishedTestimonials: source.testimonials?.filter((t: Testimonial) => t.isPublished)?.length || 0,
          newInquiries: activeInquiries.filter((i) => i.status === 'new').length,
          totalInquiries: activeInquiries.length,
          recentProjects: [
            ...(source.webProjects || []).map((p: WebProject) => ({
              id: p.id,
              title: p.title,
              type: 'web' as const,
              createdAt: p.createdAt,
            })),
            ...(source.graphicProjects || []).map((g: GraphicProject) => ({
              id: g.id,
              title: g.title,
              type: 'graphic' as const,
              createdAt: g.createdAt,
            })),
          ].slice(0, 5),
          recentInquiries: activeInquiries.slice(0, 5),
        });
      }
    } catch (err: any) {
      console.warn('[Admin] Data fetch interrupted:', err?.message || err);
      setAdminError(err.message || 'Failed to connect to administrative database.');
    } finally {
      setIsAdminLoading(false);
    }
  }, [isAuthenticated]);

  useEffect(() => {
    fetchPublicData();
  }, [fetchPublicData]);

  useEffect(() => {
    if (isAuthenticated) {
      fetchAdminData();
    }
  }, [isAuthenticated, fetchAdminData]);

  // Record page visit for visitor analytics when browsing public routes
  useEffect(() => {
    if (!isAdminRoute) {
      api.trackVisit(location.pathname).catch(() => {});
    }
  }, [location.pathname, isAdminRoute]);

  const handleInquiryStatusChange = async (id: string, status: 'new' | 'read' | 'archived') => {
    try {
      await api.updateInquiryStatus(id, status);
      fetchAdminData();
    } catch (err: any) {
      console.error('Error updating inquiry status:', err);
    }
  };

  if (isLoadingData) {
    return (
      <div className="min-h-screen bg-white dark:bg-black flex flex-col items-center justify-center p-6 text-black dark:text-white">
        <div className="flex flex-col items-center space-y-4">
          <div className="w-14 h-14 rounded-2xl bg-black border-2 border-[#155EEF] flex items-center justify-center text-white font-extrabold text-2xl shadow-lg">
            <span className="text-[#155EEF]">J</span>
            <span className="text-[#FF914D]">D</span>
          </div>
          <div className="flex items-center gap-2">
            <Loader2 className="w-5 h-5 text-[#155EEF] animate-spin" />
            <span className="font-bold text-sm tracking-wide">Loading JD Fusion Technologies...</span>
          </div>
        </div>
      </div>
    );
  }

  if (loadError && !publicData) {
    return (
      <div className="min-h-screen bg-stone-50 dark:bg-zinc-950 flex flex-col items-center justify-center p-6 text-stone-900 dark:text-zinc-100">
        <div className="max-w-md w-full p-8 rounded-3xl bg-white dark:bg-zinc-900 border border-stone-200 dark:border-zinc-800 shadow-xl text-center space-y-4">
          <div className="w-12 h-12 rounded-2xl bg-red-500/10 text-red-500 flex items-center justify-center mx-auto">
            <AlertTriangle className="w-6 h-6" />
          </div>
          <h2 className="text-xl font-bold font-['Outfit']">Failed to Load Website</h2>
          <p className="text-xs text-stone-600 dark:text-zinc-400">{loadError}</p>
          <button
            onClick={() => fetchPublicData()}
            className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-[#FF914D] hover:bg-[#f07e36] text-white text-xs font-bold shadow-md transition-colors"
          >
            <RefreshCw className="w-4 h-4" />
            <span>Retry Connection</span>
          </button>
        </div>
      </div>
    );
  }

  // Admin Portal Route Branch
  if (isAdminRoute) {
    return (
      <AdminRouteWrapper
        adminData={adminData}
        publicData={publicData}
        stats={stats}
        inquiries={inquiries}
        mediaList={mediaList}
        isAdminLoading={isAdminLoading}
        adminError={adminError}
        fetchAdminData={fetchAdminData}
        onInquiryStatusChange={handleInquiryStatusChange}
      />
    );
  }

  // Public Multi-Page Showcase
  return (
    <div className="min-h-screen bg-white text-black flex flex-col font-['Plus_Jakarta_Sans'] selection:bg-[#FF914D] selection:text-white transition-colors duration-300">
      {/* Persistent Multi-Page Navigation Header */}
      <Navbar
        settings={publicData.settings}
        contact={publicData.contact}
      />

      {/* Page Routing Container */}
      <main className="flex-1 w-full">
        <Routes>
          <Route
            path="/"
            element={
              <HomePage
                data={publicData}
                onSelectWebProject={(proj) => setSelectedWebProject(proj)}
                onSelectGraphicImage={(img) => setSelectedGraphicImage(img)}
              />
            }
          />

          <Route path="/services" element={<ServicesPage data={publicData} />} />
          <Route path="/services/:slug" element={<ServiceDetailPage />} />

          <Route
            path="/projects"
            element={
              <ProjectsPage
                data={publicData}
                onSelectWebProject={(proj) => setSelectedWebProject(proj)}
                onSelectGraphicImage={(img) => setSelectedGraphicImage(img)}
              />
            }
          />

          <Route path="/about" element={<AboutPage data={publicData} />} />

          <Route path="/insights" element={<InsightsPage />} />
          <Route path="/insights/:slug" element={<InsightDetailPage />} />

          <Route
            path="/contact"
            element={
              <ContactPage
                contact={publicData.contact}
                location={publicData.location}
                onInquirySubmitted={fetchAdminData}
              />
            }
          />

          {/* Fallback to Home */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>

      {/* Persistent Multi-Page Footer */}
      <Footer
        settings={publicData.settings}
        contact={publicData.contact}
        location={publicData.location}
        socials={publicData.socials}
      />

      {/* Interactive Floating WhatsApp Contact Trigger - only if activated by admin */}
      {(() => {
        const whatsappSocial = (publicData.socials || []).find(
          (s) =>
            s.platform?.toLowerCase() === 'whatsapp' &&
            s.isPublished !== false &&
            s.isEnabled !== false
        );
        if (!whatsappSocial) return null;

        let rawPhone = publicData.contact?.whatsapp || publicData.contact?.phone || '+254 700 000 000';
        if (whatsappSocial.url && whatsappSocial.url.includes('wa.me/')) {
          const extracted = whatsappSocial.url.split('wa.me/')[1]?.split('?')[0];
          if (extracted) rawPhone = extracted;
        }

        return (
          <WhatsAppFloatingButton
            phone={rawPhone}
            brandName={publicData.settings?.brandName || 'JD Fusion Technologies'}
          />
        );
      })()}

      {/* Lightbox Modal for Graphic Arts */}
      {selectedGraphicImage && (
        <LightboxModal
          isOpen={true}
          imageUrl={selectedGraphicImage.imageUrl}
          title={selectedGraphicImage.title}
          category={selectedGraphicImage.category}
          onClose={() => setSelectedGraphicImage(null)}
        />
      )}

      {/* Web Project Full Details & Case Study Modal */}
      {selectedWebProject && (
        <ProjectModal
          isOpen={true}
          project={selectedWebProject}
          onClose={() => setSelectedWebProject(null)}
          onStartInquiry={(projectName) => {
            setSelectedWebProject(null);
            navigate('/contact', {
              state: { prefilledService: projectName ? `Project: ${projectName}` : 'Full-Stack Web Engineering' },
            });
          }}
          onInquire={(projectName) => {
            setSelectedWebProject(null);
            navigate('/contact', {
              state: { prefilledService: projectName ? `Project: ${projectName}` : 'Full-Stack Web Engineering' },
            });
          }}
        />
      )}
    </div>
  );
};

export default function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <BrowserRouter>
          <ScrollToTop />
          <MainAppContent />
        </BrowserRouter>
      </AuthProvider>
    </ThemeProvider>
  );
}
