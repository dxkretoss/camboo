import "@/styles/globals.css";
import { UserProvider } from "@/context/UserContext";
import { GoogleOAuthProvider } from "@react-oauth/google";
import PageLoader from "@/components/Loader/PageLoader";
import BackToTop from "@/components/BackToTop/BackToTop";
import { SearchProvider } from "@/context/SearchContext";
export default function App({ Component, pageProps }) {
  return (
    <GoogleOAuthProvider clientId={process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID}>
      <UserProvider>
        <SearchProvider>
          <PageLoader />
          <Component {...pageProps} />
          <BackToTop />
        </SearchProvider>
      </UserProvider>
    </GoogleOAuthProvider>
  );
}
