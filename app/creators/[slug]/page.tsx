'use client';

import { useParams, useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
import { Star, MapPin, Flag } from 'lucide-react';
import StoryCard from '@/components/StoryCard';

export default function CreatorProfile() {
  const params = useParams();
  const router = useRouter();
  const rawSlug = params.slug as string;
  const slug = rawSlug.toLowerCase();

  const [creator, setCreator] = useState<any>(null);
  const [products, setProducts] = useState<any[]>([]);
  const [approvedReviews, setApprovedReviews] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showReportModal, setShowReportModal] = useState(false);
  const [reportReason, setReportReason] = useState('');
  const [sendingReport, setSendingReport] = useState(false);

  // Redirection
  useEffect(() => {
    if (rawSlug !== slug) router.replace(`/creators/${slug}`);
    if (rawSlug === 'me') router.replace('/creators/creator_test');
  }, [rawSlug, slug, router]);

  const fetchCreatorData = async () => {
    if (!slug) return;

    setLoading(true);
    setError('');

    try {
      const res = await fetch(`/api/creators/${slug}`, { cache: 'no-store' });
      
      if (!res.ok) {
        throw new Error('Créatrice non trouvée');
      }

      const data = await res.json();
      
      setCreator(data.creator);
      setProducts(data.products || []);
      setApprovedReviews(data.reviews || []);
    } catch (err: any) {
      setError(err.message || 'Erreur de chargement');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCreatorData();
  }, [slug]);

  const sendReport = async () => {
    if (!reportReason || !creator) {
      alert("Veuillez choisir une raison");
      return;
    }

    setSendingReport(true);

    try {
      const res = await fetch('/api/reports', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          creator_id: creator.id,
          reason: reportReason,
          status: 'pending'
        })
      });

      if (res.ok) {
        alert("✅ Signalement envoyé à l'équipe. Merci !");
        setShowReportModal(false);
        setReportReason('');
      } else {
        alert("Erreur lors de l'envoi du signalement");
      }
    } catch (err) {
      console.error(err);
      alert("Erreur réseau");
    } finally {
      setSendingReport(false);
    }
  };

  if (loading) return <div className="min-h-screen bg-zinc-950 pt-32 text-center">Chargement de la créatrice...</div>;
  if (error || !creator) return <div className="min-h-screen bg-zinc-950 pt-32 text-center text-red-400">{error}</div>;

  return (
    <div className="min-h-screen bg-zinc-950 pb-20">
      {/* Bannière */}
      <div className="h-80 relative">
        <img 
          src={creator.banner_url || "https://picsum.photos/id/1015/1200/400"} 
          alt="Bannière" 
          className="w-full h-full object-cover" 
        />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-zinc-950/70 to-zinc-950" />
      </div>

      <div className="max-w-5xl mx-auto px-6 -mt-16 relative z-10">
        <div className="flex flex-col md:flex-row gap-8">
          <div className="relative -mt-12 md:-mt-20 flex-shrink-0">
            <div className="relative inline-block">
              <img 
                src={creator.avatar_url || "https://pics
