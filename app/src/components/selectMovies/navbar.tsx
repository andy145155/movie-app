import mainLogo from '@/assets/images/logo.png';

function Nav() {
  return (
    <nav className="flex h-navBar border-b justify-between lg:px-80 md:px-30 px-16">
      <img className="py-4" alt="Netflix logo" src={mainLogo} />
      <div className="text-gray-600 text-xl font-bold py-6">Help</div>
    </nav>
  );
}

export default Nav;
