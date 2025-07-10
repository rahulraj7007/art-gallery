import Header from './Header';
import Footer from './Footer';
import CartSidebar from '@/components/cart/CartSidebar';

interface MainLayoutProps {
  children: React.ReactNode;
}

export default function MainLayout({ children }: MainLayoutProps) {
  return (
    <div className="min-h-screen flex flex-col">
      {/* Notification Bar */}
      <div className="bg-red-900 text-white text-center py-2 px-4 mb-4">
        <p className="text-m font-serif">
          Free shipping on orders over €200 • Worldwide delivery available
        </p>
      </div>
      
      <Header />
      <main className="flex-1">
        {children}
      </main>
      <Footer />
      <CartSidebar />
    </div>
  );
}