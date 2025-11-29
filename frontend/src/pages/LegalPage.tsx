import { useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { legalService } from '../services/api';
import { Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';

export const LegalPage = () => {
  const { page } = useParams<{ page: string }>();
  const [content, setContent] = useState<{ titulo: string; contenido: string } | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (page) {
      legalService
        .getPage(page)
        .then((data) => {
          setContent(data);
        })
        .catch((error) => {
          console.error('Error al cargar página legal:', error);
        })
        .finally(() => {
          setLoading(false);
        });
    }
  }, [page]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  if (!content) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Página no encontrada</h1>
          <Link to="/" className="text-primary-600 hover:text-primary-700">
            Volver al inicio
          </Link>
        </div>
      </div>
    );
  }

  const getPageStyle = () => {
    if (page === 'privacidad') {
      return {
        bg: 'bg-gradient-to-br from-blue-50 to-cyan-50',
        border: 'border-blue-200',
        titleGradient: 'from-blue-600 to-cyan-600',
        emoji: '🔒',
      };
    }
    if (page === 'emergencia') {
      return {
        bg: 'bg-gradient-to-br from-red-50 to-orange-50',
        border: 'border-red-200',
        titleGradient: 'from-red-600 to-orange-600',
        emoji: '🚨',
      };
    }
    if (page === 'normas') {
      return {
        bg: 'bg-gradient-to-br from-green-50 to-emerald-50',
        border: 'border-green-200',
        titleGradient: 'from-green-600 to-emerald-600',
        emoji: '📋',
      };
    }
    return {
      bg: 'bg-gradient-to-br from-purple-50 to-pink-50',
      border: 'border-purple-200',
      titleGradient: 'from-purple-600 to-pink-600',
      emoji: '📄',
    };
  };

  const pageStyle = getPageStyle();

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <Link
          to="/"
          className="inline-flex items-center text-primary-600 hover:text-primary-700 mb-6 transition-colors"
        >
          <ArrowLeft size={20} className="mr-2" />
          <span>Volver al inicio</span>
        </Link>

        <div className={`card ${pageStyle.bg} border-2 ${pageStyle.border} shadow-xl p-8`}>
          <h1 className="text-4xl font-bold mb-6 flex items-center">
            <span>{pageStyle.emoji}</span>
            <span className={`bg-gradient-to-r ${pageStyle.titleGradient} bg-clip-text text-transparent ml-3`}>
              {content.titulo}
            </span>
          </h1>
          <div
            className="prose max-w-none text-gray-700"
            style={{
              '--tw-prose-headings': 'text-gray-900',
              '--tw-prose-links': 'text-primary-600',
            } as React.CSSProperties}
            dangerouslySetInnerHTML={{ __html: content.contenido }}
          />
        </div>
      </div>
    </div>
  );
};

