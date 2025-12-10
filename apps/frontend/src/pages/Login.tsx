import Header from '../components/ui/Header';
import Footer from '../components/ui/Footer';
import LoginForm from '../components/ui/LoginForm';
import ImagePanel from '../components/ui/ImagePanel';

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