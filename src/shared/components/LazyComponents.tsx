import dynamic from 'next/dynamic';

export const LazyStats = dynamic(() => import('./Stats'), {
  loading: () => <div className="h-96 animate-pulse bg-gray-100 dark:bg-gray-800" />,
});

export const LazyProjectGallery = dynamic(() => import('./ProjectGallery'), {
  loading: () => <div className="h-[600px] animate-pulse bg-gray-100 dark:bg-gray-800" />,
});
