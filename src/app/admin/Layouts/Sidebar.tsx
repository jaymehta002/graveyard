import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { FiMenu } from 'react-icons/fi';

const Sidebar = () => {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);

  const links = [
    { href: '/admin/dashboard', label: 'Home' },
    { href: '/admin/products/new', label: 'Add new product' },
    { href: '/admin/products/list', label: 'View All Products' },
    { href: '/admin/orders', label: 'Orders' },
    { href: '/admin/users/list', label: 'Users' },
    { href: '/admin/content', label: 'Content'},
    { href: '/admin/contact', label: 'Contact Form submission'},
    // { href: '/admin/settings', label: 'Settings' },
  ];

  const toggleSidebar = () => {
    setIsOpen(!isOpen);
  };

  return (
    <div>
      <button
        className="p-4 text-white bg-gray-800 lg:hidden fixed top-0 left-0 z-50"
        onClick={toggleSidebar}
      >
        <FiMenu size={24} />
      </button>

      <div className={`fixed top-0 left-0 w-64 h-screen bg-gray-800 text-white transition-transform transform ${isOpen ? 'translate-x-0' : '-translate-x-full'} lg:translate-x-0 z-40`}>
        <h2 className="text-2xl font-black font-serif p-4"><Link href='/'>GRAVEYARD</Link></h2>
        <ul className='mt-12'>
          {links.map((link) => (
            <li key={link.href} className="mb-4">
              <Link href={link.href}>
                <p className={`block py-2 px-4 rounded ${
                  pathname === link.href ? 'bg-gray-900' : 'hover:bg-gray-700'
                }`}>
                  {link.label}
                </p>
              </Link>
            </li>
          ))}
        </ul>
      </div>

      {isOpen && <div className="fixed inset-0 bg-black opacity-50 z-30 lg:hidden" onClick={toggleSidebar}></div>}
    </div>
  );
};

export default Sidebar;
