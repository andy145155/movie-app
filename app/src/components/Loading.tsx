import '../assets/css/Loading.scss';
import Nav from '../components/main/Nav';
function Loading() {
  return (
    <div>
      <Nav />
      <div className="loading">Loading....</div>
    </div>
  );
}

export default Loading;
