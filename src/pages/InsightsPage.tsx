import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { sampleArticles, Article } from '../data/insightsData';
import { PageBackground } from '../components/common/PageBackground';
import {
  BookOpen,
  Clock,
  ArrowRight,
  Sparkles,
  ChevronRight,
  Layers,
  Tag,
} from 'lucide-react';

export const InsightsPage: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  const categories = [
    { id: 'all', label: 'All Publications' },
    { id: 'Engineering', label: 'Software Engineering' },
    { id: 'Cybersecurity', label: 'Cybersecurity & Compliance' },
    { id: 'Brand Systems', label: 'Brand & UI Architecture' },
  ];

  const filtered = sampleArticles.filter(
    (a) => selectedCategory === 'all' || a.category === selectedCategory
  );

  return (
    <div className="relative min-h-screen pt-32 pb-24 bg-stone-50 dark:bg-black text-stone-900 dark:text-zinc-100 transition-colors duration-300">
      <PageBackground variant="insights" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 space-y-16">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#155EEF]/10 border border-[#155EEF]/20 text-[#155EEF] dark:text-[#3577f8] text-xs font-bold">
            <Sparkles className="w-3.5 h-3.5 text-[#FF914D]" />
            <span>Engineering Insights &amp; Publications</span>
          </div>

          <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold text-black dark:text-white font-['Outfit'] tracking-tight">
            Perspectives on Modern Systems &amp; Brand Architecture
          </h1>

          <p className="text-base sm:text-lg text-stone-600 dark:text-zinc-400 leading-relaxed">
            Technical write-ups, security architecture blueprints, and design systems analysis direct from our founding team.
          </p>

          {/* Category Filter */}
          <div className="pt-4 flex flex-wrap items-center justify-center gap-2">
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all cursor-pointer ${
                  selectedCategory === cat.id
                    ? 'bg-[#155EEF] text-white shadow-md shadow-[#155EEF]/25'
                    : 'bg-white dark:bg-zinc-900 text-stone-600 dark:text-zinc-400 border border-stone-200 dark:border-zinc-800 hover:text-black dark:hover:text-white'
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>
        </div>

        {/* Featured Top Article */}
        {filtered.length > 0 && (
          <div className="rounded-3xl bg-white dark:bg-zinc-900 border border-stone-200 dark:border-zinc-800 overflow-hidden shadow-sm hover:shadow-xl transition-all">
            <div className="grid grid-cols-1 lg:grid-cols-12 items-center">
              <div className="lg:col-span-6 aspect-16/10 lg:aspect-auto lg:h-full relative overflow-hidden bg-black">
                <img
                  src={filtered[0].coverImage}
                  alt={filtered[0].title}
                  className="w-full h-full object-cover"
                />
              </div>

              <div className="lg:col-span-6 p-8 sm:p-12 space-y-4">
                <div className="flex items-center gap-3 text-xs">
                  <span className="font-bold text-[#155EEF] dark:text-[#3577f8] uppercase tracking-wider">
                    {filtered[0].category}
                  </span>
                  <span className="text-stone-400">·</span>
                  <span className="text-stone-500 dark:text-zinc-400 flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5" />
                    {filtered[0].readingTime}
                  </span>
                </div>

                <h2 className="text-2xl sm:text-3xl font-extrabold text-black dark:text-white font-['Outfit'] leading-tight">
                  <Link
                    to={`/insights/${filtered[0].slug}`}
                    className="hover:text-[#155EEF] transition-colors"
                  >
                    {filtered[0].title}
                  </Link>
                </h2>

                <p className="text-sm text-stone-600 dark:text-zinc-300 leading-relaxed">
                  {filtered[0].summary}
                </p>

                <div className="pt-4 flex items-center justify-between border-t border-stone-100 dark:border-zinc-800">
                  <div className="flex items-center gap-3">
                    <img
                      src={filtered[0].author.avatar}
                      alt={filtered[0].author.name}
                      className="w-9 h-9 rounded-full object-cover ring-2 ring-[#155EEF]/30"
                    />
                    <div>
                      <p className="text-xs font-bold text-black dark:text-white">
                        {filtered[0].author.name}
                      </p>
                      <p className="text-[10px] text-stone-500 dark:text-zinc-400">
                        {filtered[0].author.role}
                      </p>
                    </div>
                  </div>

                  <Link
                    to={`/insights/${filtered[0].slug}`}
                    className="inline-flex items-center gap-1.5 text-xs font-bold text-[#FF914D] hover:text-[#f07e36] transition-colors"
                  >
                    <span>Read Article</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Article Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filtered.slice(1).map((article) => (
            <div
              key={article.id}
              className="group rounded-3xl bg-white dark:bg-zinc-900 border border-stone-200 dark:border-zinc-800 overflow-hidden shadow-xs hover:shadow-xl hover:border-[#155EEF]/40 transition-all flex flex-col justify-between"
            >
              <div className="aspect-16/10 overflow-hidden relative bg-black">
                <img
                  src={article.coverImage}
                  alt={article.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute top-4 left-4">
                  <span className="px-3 py-1 rounded-full text-[11px] font-bold bg-black/80 text-white backdrop-blur-md border border-white/10">
                    {article.category}
                  </span>
                </div>
              </div>

              <div className="p-7 space-y-4 flex-1 flex flex-col justify-between">
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-[11px] text-stone-500 dark:text-zinc-400">
                    <Clock className="w-3.5 h-3.5 text-[#155EEF]" />
                    <span>{article.readingTime}</span>
                    <span>·</span>
                    <span>{article.publishedDate}</span>
                  </div>

                  <h3 className="text-lg font-bold text-black dark:text-white font-['Outfit'] group-hover:text-[#155EEF] transition-colors line-clamp-2">
                    <Link to={`/insights/${article.slug}`}>{article.title}</Link>
                  </h3>

                  <p className="text-xs text-stone-600 dark:text-zinc-300 line-clamp-3 leading-relaxed">
                    {article.summary}
                  </p>
                </div>

                <div className="pt-4 border-t border-stone-100 dark:border-zinc-800 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <img
                      src={article.author.avatar}
                      alt={article.author.name}
                      className="w-7 h-7 rounded-full object-cover"
                    />
                    <span className="text-xs font-semibold text-stone-700 dark:text-zinc-300">
                      {article.author.name}
                    </span>
                  </div>

                  <Link
                    to={`/insights/${article.slug}`}
                    className="inline-flex items-center gap-1 text-xs font-bold text-[#FF914D] hover:text-[#f07e36] transition-colors"
                  >
                    <span>Read</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
