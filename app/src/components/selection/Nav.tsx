import '../../assets/css/selection/Nav.css';
import mainLogo from '../../assets/img/logo.png';

function Nav() {
  return (
    <div className="selection-nav">
      <img className="selection-logo" alt="Netflix logo" src={mainLogo} />
      <div className="selection-help">Help</div>
    </div>
  );
}

export default Nav;
