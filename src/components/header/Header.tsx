import { Link, NavLink, useNavigate } from 'react-router-dom';
import { getNavItemParams } from '../../providers/Routes';
import { useAppSelector } from '../../store/hooks';
import { Container } from '../container/Container';
import { Logo } from '../Logo';
import { LogoutButton } from './LogoutButton';

export function Header() {
  const navigate = useNavigate();
  const isAuthenticated = useAppSelector(({ auth }) => auth.authenticated);

  return (
    <header className="bg-gray-500 py-3 shadow">
      <Container>
        <nav className="flex">
          <div className="mr-4">
            <Link to={'/'}>
              <Logo width="50px" />
            </Link>
          </div>
          <ul className="ml-auto flex">
            {getNavItemParams(isAuthenticated).map(
              (item) =>
                item.active && (
                  <li key={item.path} className="flex align-middle">
                    <NavLink
                      to={item.path}
                      className={({ isActive }) =>
                        isActive ? 'font-bold' : undefined
                      }
                    >
                      <button
                        onClick={() => navigate(item.path)}
                        className="inline-block rounded-full px-6 py-2 duration-200 hover:bg-blue-100"
                      >
                        {item.label}
                      </button>
                    </NavLink>
                  </li>
                ),
            )}
            {isAuthenticated && (
              <li>
                <LogoutButton />
              </li>
            )}
          </ul>
        </nav>
      </Container>
    </header>
  );
}
