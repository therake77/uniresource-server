import Header from '../components/base/Header';
import Footer from '../components/base/Footer';
import LoginForm from '../components/base/LoginForm';
import ImagePanel from '../components/base/ImagePanel';

export function Login() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <main className="flex-1 flex">
        <LoginForm />
        <ImagePanel />
      </main>

      <Footer />
    </div>
  );
}

export default Login;