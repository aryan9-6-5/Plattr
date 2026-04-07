import PageHeader from "@/components/ui/PageHeader";

const PrivacyPolicyPage = () => {
  return (
    <div className="bg-[#F6FFF8] min-h-screen">
      <PageHeader title="Privacy Policy" description="Last updated: October 2023" />
      
      <div className="max-w-3xl mx-auto px-4 py-12">
        <div className="prose prose-sm md:prose-base prose-green max-w-none text-[#4A6357] leading-relaxed 
                        bg-white p-8 md:p-12 rounded-3xl shadow-sm ring-1 ring-[#D4E8DA]">
          <h3 className="font-serif text-xl font-bold text-[#1B2D24] mb-3 mt-0">1. Information We Collect</h3>
          <p className="mb-8">
            When you use Plattr, we collect information you provide directly to us, such as your name, email address, phone number, and delivery address. We also collect order history and generic usage data to improve our services and delivery efficiency.
          </p>

          <h3 className="font-serif text-xl font-bold text-[#1B2D24] mb-3">2. How We Use Your Information</h3>
          <p className="mb-8">
            We use your information to facilitate your food orders, communicate with our verified chefs, complete deliveries, and send important service updates. Your data may also be used for internal analytics to enhance the Plattr platform.
          </p>

          <h3 className="font-serif text-xl font-bold text-[#1B2D24] mb-3">3. Data Storage and Security</h3>
          <p className="mb-8">
            We employ industry-standard security measures to protect your personal information. All payment transactions are encrypted and processed by PCI-DSS compliant third-party gateways; we do not store full credit card numbers on our servers.
          </p>

          <h3 className="font-serif text-xl font-bold text-[#1B2D24] mb-3">4. Third Party Services</h3>
          <p className="mb-8">
            We partner with Supabase for secure database and authentication infrastructure. We only share necessary data with our delivery partners and chefs to fulfill your orders. We do not sell your personal data to advertisers.
          </p>

          <h3 className="font-serif text-xl font-bold text-[#1B2D24] mb-3">5. Your Rights</h3>
          <p className="mb-8">
            You have the right to access, correct, or delete your personal data. You can manage your information directly from your Plattr Dashboard or request account deletion by contacting our support team.
          </p>

          <h3 className="font-serif text-xl font-bold text-[#1B2D24] mb-3">6. Contact Us</h3>
          <p className="mb-0">
            If you have any questions about this Privacy Policy, please contact us at privacy@plattr.club or via our WhatsApp support channel.
          </p>
        </div>
      </div>
    </div>
  );
};

export default PrivacyPolicyPage;
