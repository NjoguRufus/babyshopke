import { Link } from "react-router-dom";
import UserPageLayout from "@/components/UserPageLayout";
import BrandLogo from "@/components/BrandLogo";

const GetStarted = () => {
  return (
    <UserPageLayout
      title="Get Started"
      description="Create your account or login to start shopping and managing your family profile."
    >
      <div className="bg-card rounded-2xl border border-border p-6 md:p-8 shadow-soft space-y-6">
        <div className="flex items-center gap-3">
          <BrandLogo imageClassName="w-12 h-12" />
          <div>
            <h2 className="text-xl font-extrabold">Baby Shop KE</h2>
            <p className="text-sm text-muted-foreground">Premium baby and kids products in Kenya</p>
          </div>
        </div>

        <div className="flex flex-wrap gap-3">
          <Link to="/register" className="px-6 py-3 rounded-full bg-primary text-primary-foreground font-bold">
            Create Account
          </Link>
          <Link to="/login" className="px-6 py-3 rounded-full border border-border bg-card font-bold">
            Login
          </Link>
          <Link to="/" className="px-6 py-3 rounded-full bg-accent text-accent-foreground font-bold">
            Continue Shopping
          </Link>
        </div>
      </div>
    </UserPageLayout>
  );
};

export default GetStarted;

