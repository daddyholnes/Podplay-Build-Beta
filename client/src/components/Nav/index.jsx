import React from 'react';
import { NavLink } from 'react-router-dom';
import Landing from '~/components/Landing';
import Search from '~/components/Search';
import GeminiStudio from '~/components/GeminiStudio';
import GeminiVertex from '~/components/GeminiVertex';
import { Beaker } from 'lucide-react';

const Nav = () => {
  const navItems = [
    { name: 'New Chat', path: '/', component: Landing, icon: 'some-icon-class' },
    { name: 'Search', path: '/search', component: Search, icon: 'some-icon-class' },
    {
      name: 'Gemini Vertex',
      path: '/gemini-vertex',
      component: GeminiVertex,
      icon: 'some-icon-class'
    },
    {
      name: 'Vertex AI Studio',
      href: '/vertex-studio',
      icon: Beaker,
      current: pathname === '/vertex-studio',
    }
  ];

  return (
    <nav>
      <div className="flex flex-col space-y-2">
        {navItems.map((item) => (
          <NavLink
            key={item.name}
            to={item.path}
            className={({ isActive }) =>
              `flex items-center px-4 py-2 rounded-md text-sm font-medium transition-colors duration-150 ${
                isActive
                  ? 'bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-white'
                  : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 hover:text-gray-900 dark:hover:text-white'
              }`
            }
            end
          >
            {item.name}
          </NavLink>
        ))}
      </div>
    </nav>
  );
};

export default Nav;