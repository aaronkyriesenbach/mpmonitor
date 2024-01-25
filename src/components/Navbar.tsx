export default function Navbar(props: NavbarProps) {
  const { displayLogoutButton } = props;

  return (
    <nav className="navbar bg-primary">
      <div className="container-fluid">
        <div className="navbar-brand text-white logo fs-4">MP Monitor</div>
        {displayLogoutButton && (
          <a className="text-white text-decoration-none fs-5" href="/">
            Log out
          </a>
        )}
      </div>
    </nav>
  );
}

type NavbarProps = {
  displayLogoutButton?: boolean;
};
