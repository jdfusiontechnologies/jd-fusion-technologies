import React from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { sampleArticles, Article } from '../data/insightsData';
import { PageBackground } from '../components/common/PageBackground';
import {
  Clock,
  ArrowLeft,
  ChevronRight,
  Share2,
  Bookmark,
  CheckCircle2,
  Sparkles,
  ArrowRight,
} from 'lucide-react';

export const InsightDetailPage: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();

  const article = sampleArticles.find((a) => a.slug === slug) || sampleArticles[0];
  const related = sampleArticles.filter((a) => a.id !== article.id).slice(0, 2);

  return (
    <div className="relative min-h-screen pt-32 pb-24 bg-white dark:bg-black text-stone-900 dark:text-zinc-100 transition-colors duration-300">
      <PageBackground variant="insights" />

      <article className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 space-y-12">
        {/* Breadcrumb Navigation */}
        <nav className="flex items-center gap-2 text-xs text-stone-500 dark:text-zinc-400">
          <Link to="/" className="hover:text-black dark:hover:text-white transition-colors">
            Home
          </Link>
          <ChevronRight className="w-3.5 h-3.5" />
          <Link to="/insights" className="hover:text-black dark:hover:text-white transition-colors">
            Insights
          </Link>
          <ChevronRight className="w-3.5 h-3.5" />
          <span className="text-[#155EEF] font-semibold truncate max-w-xs">{article.title}</span>
        </nav>

        {/* Back Link */}
        <div>
          <Link
            to="/insights"
            className="inline-flex items-center gap-1.5 text-xs font-bold text-stone-600 dark:text-zinc-400 hover:text-[#155EEF] transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to All Publications</span>
          </Link>
        </div>

        {/* Article Header */}
        <header className="space-y-6">
          <div className="flex items-center gap-2 text-xs">
            <span className="px-3 py-1 rounded-full bg-[#155EEF]/10 text-[#155EEF] font-bold uppercase tracking-wider">
              {article.category}
            </span>
            <span className="text-stone-400">·</span>
            <span className="text-stone-500 dark:text-zinc-400 flex items-center gap-1">
              <Clock className="w-3.5 h-3.5" />
              {article.readingTime}
            </span>
            <span className="text-stone-400">·</span>
            <span className="text-stone-500 dark:text-zinc-400">{article.publishedDate}</span>
          </div>

          <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-black dark:text-white font-['Outfit'] leading-tight">
            {article.title}
          </h1>

          <p className="text-lg sm:text-xl text-stone-600 dark:text-zinc-300 leading-relaxed font-normal">
            {article.summary}
          </p>

          {/* Author Block */}
          <div className="pt-4 flex items-center justify-between border-t border-b border-stone-200/80 dark:border-zinc-800 py-4">
            <div className="flex items-center gap-3.5">
              <img
                src={article.author.avatar}
                alt={article.author.name}
                className="w-12 h-12 rounded-full object-cover ring-2 ring-[#155EEF]/30"
              />
              <div>
                <p className="text-sm font-bold text-black dark:text-white">
                  {article.author.name}
                </p>
                <p className="text-xs text-stone-500 dark:text-zinc-400">
                  {article.author.role}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => {
                  navigator.clipboard?.writeText(window.location.href);
                  alert('Article link copied to clipboard!');
                }}
                className="p-2.5 rounded-xl bg-stone-100 dark:bg-zinc-800 hover:bg-stone-200 dark:hover:bg-zinc-700 text-stone-600 dark:text-zinc-300 transition-colors cursor-pointer"
                title="Share Article Link"
              >
                <Share2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        </header>

        {/* Featured Cover Image */}
        <div className="aspect-16/9 rounded-3xl overflow-hidden bg-black shadow-lg">
          <img
            src={article.coverImage}
            alt={article.title}
            className="w-full h-full object-cover"
          />
        </div>

        {/* Article Body */}
        <div className="space-y-10 text-stone-800 dark:text-zinc-200 leading-relaxed">
          <p className="text-base sm:text-lg font-medium text-stone-900 dark:text-white leading-relaxed">
            {article.content.intro}
          </p>

          {article.content.sections.map((sec, sIdx) => (
            <div key={sIdx} className="space-y-4">
              <h2 className="text-2xl font-bold text-black dark:text-white font-['Outfit']">
                {sec.heading}
              </h2>

              {sec.body.map((p, pIdx) => (
                <p key={pIdx} className="text-sm sm:text-base text-stone-700 dark:text-zinc-300 leading-relaxed">
                  {p}
                </p>
              ))}

              {sec.takeaway && (
                <div className="p-4 rounded-2xl bg-blue-50 dark:bg-zinc-900/90 border-l-4 border-[#155EEF] text-xs sm:text-sm text-[#155EEF] dark:text-[#3577f8] font-medium my-4">
                  <span className="font-bold block mb-1">Key Takeaway:</span>
                  {sec.takeaway}
                </div>
              )}
            </div>
          ))}

          <div className="pt-6 border-t border-stone-200 dark:border-zinc-800">
            <h3 className="text-xl font-bold text-black dark:text-white font-['Outfit'] mb-2">
              Conclusion
            </h3>
            <p className="text-sm sm:text-base text-stone-700 dark:text-zinc-300 leading-relaxed">
              {article.content.conclusion}
            </p>
          </div>
        </div>

        {/* Tags */}
        <div className="pt-4 flex flex-wrap items-center gap-2">
          {article.tags.map((t, tIdx) => (
            <span
              key={tIdx}
              className="px-3 py-1 rounded-lg text-xs font-semibold bg-stone-100 dark:bg-zinc-800 text-stone-700 dark:text-zinc-300 border border-stone-200 dark:border-zinc-700"
            >
              #{t}
            </span>
          ))}
        </div>

        {/* Related Articles */}
        <div className="pt-12 border-t border-stone-200 dark:border-zinc-800 space-y-6">
          <h3 className="text-xl font-bold font-['Outfit'] text-black dark:text-white">
            Related Insights
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {related.map((rel) => (
              <div
                key={rel.id}
                className="p-6 rounded-2xl bg-stone-50 dark:bg-zinc-900 border border-stone-200 dark:border-zinc-800 space-y-3"
              >
                <span className="text-[10px] font-bold uppercase tracking-wider text-[#155EEF]">
                  {rel.category}
                </span>
                <h4 className="text-base font-bold text-black dark:text-white font-['Outfit'] line-clamp-2">
                  <Link to={`/insights/${rel.slug}`} className="hover:text-[#155EEF] transition-colors">
                    {rel.title}
                  </Link>
                </h4>
                <p className="text-xs text-stone-600 dark:text-zinc-400 line-clamp-2">
                  {rel.summary}
                </p>
                <Link
                  to={`/insights/${rel.slug}`}
                  className="inline-flex items-center gap-1 text-xs font-bold text-[#FF914D] hover:text-[#f07e36]"
                >
                  <span>Read Article</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            ))}
          </div>
        </div>

        {/* Bottom Consultation Box */}
        <div className="rounded-3xl bg-black text-white p-8 sm:p-10 border border-zinc-800 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="space-y-1.5 text-center md:text-left">
            <h3 className="text-xl sm:text-2xl font-bold font-['Outfit']">
              Want to implement these architectural patterns?
            </h3>
            <p className="text-xs sm:text-sm text-zinc-400">
              Consult with our engineering and design leads on your next build.
            </p>
          </div>

          <button
            onClick={() => navigate('/contact')}
            className="px-6 py-3 rounded-xl bg-[#FF914D] hover:bg-[#f07e36] text-white font-bold text-xs shadow-md transition-all shrink-0 cursor-pointer"
          >
            Schedule Consultation &rarr;
          </button>
        </div>
      </article>
    </div>
  );
};
