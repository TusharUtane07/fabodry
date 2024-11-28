import { useLocation } from 'react-router-dom';
import Navbar from './Navbar';
import Sidebar from './Sidebar';

const Layout = ({ children }) => {
  const location = useLocation();
  const isLoginPage = location.pathname === '/';

  return (
    <>
      {!isLoginPage && <Navbar />}
      <div className={isLoginPage ? '' : 'h-[calc(100vh-70px)] w-screen flex'}>
        {!isLoginPage && <Sidebar />}
        <div className={isLoginPage ? '' : 'flex-1 overflow-y-auto'}>{children}</div>
      </div>
    </>
  );
};

export default Layout;
