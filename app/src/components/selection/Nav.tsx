import '../../assets/css/selection/Nav.scss';
import mainLogo from '../../assets/img/logo.png';

function Nav() {
  return (
    <div className="selection_nav">
      <img className="selection_logo" alt="Netflix logo" src={mainLogo} />
      <div className="selection_help">Help</div>
    </div>
  );
}

export default Nav;
