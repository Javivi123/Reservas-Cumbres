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

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <Link
          to="/"
          className="inline-flex items-center text-primary-600 hover:text-primary-700 mb-6"
        >
          <ArrowLeft size={20} className="mr-2" />
          Volver al inicio
        </Link>

        <div className="bg-white rounded-lg shadow-md p-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-6">{content.titulo}</h1>
          <div
            className="prose max-w-none"
            dangerouslySetInnerHTML={{ __html: content.contenido }}
          />
        </div>
      </div>
    </div>
  );
};

