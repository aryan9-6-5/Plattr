import PageHeader from "@/components/ui/PageHeader";

const TermsPage = () => {
  return (
    <div className="bg-[#F6FFF8] min-h-screen">
      <PageHeader title="Terms of Service" description="Last updated: October 2023" />
      
      <div className="max-w-3xl mx-auto px-4 py-12">
        <div className="prose prose-sm md:prose-base prose-green max-w-none text-[#4A6357] leading-relaxed 
                        bg-white p-8 md:p-12 rounded-3xl shadow-sm ring-1 ring-[#D4E8DA]">
          
          <h3 className="font-serif text-xl font-bold text-[#1B2D24] mb-3 mt-0">1. Acceptance of Terms</h3>
          <p className="mb-8">
            By accessing or using Plattr, you agree to comply with and be bound by these Terms of Service. If you do not agree with any part of these terms, you may not use our services.
          </p>

          <h3 className="font-serif text-xl font-bold text-[#1B2D24] mb-3">2. Use of Platform</h3>
          <p className="mb-8">
            Plattr connects you with verified independent chefs and cloud kitchens. You agree to use the platform only for lawful purposes and not to misuse the service (e.g., placing false orders, attempting to breach security). Accounts found violating these terms may be suspended.
          </p>

          <h3 className="font-serif text-xl font-bold text-[#1B2D24] mb-3">3. Ordering and Payment</h3>
          <p className="mb-8">
            All prices are quoted in Indian Rupees (INR) and are subject to applicable taxes. We reserve the right to refuse or cancel any order. Payments must be fully processed before delivery, except in the case of Cash on Delivery (where applicable) or pre-approved B2B credit lines.
          </p>

          <h3 className="font-serif text-xl font-bold text-[#1B2D24] mb-3">4. Cancellation and Refunds</h3>
          <p className="mb-8">
            Due to the perishable nature of food, cancellations must be made at least 4 hours prior to the scheduled delivery time to be eligible for a full refund. Quality complaints must be reported within 24 hours of delivery; verified issues will be refunded or replaced at our discretion.
          </p>

          <h3 className="font-serif text-xl font-bold text-[#1B2D24] mb-3">5. Food Safety and Quality</h3>
          <p className="mb-8">
            While we rigorously vet our partners for FSSAI compliance and hygiene, the final preparation of the food is managed by the respective chefs. Plattr acts as an aggregator and delivery facilitator and uses best efforts to ensure quality standards are maintained.
          </p>

          <h3 className="font-serif text-xl font-bold text-[#1B2D24] mb-3">6. Limitation of Liability</h3>
          <p className="mb-8">
            Plattr shall not be liable for any indirect, incidental, or consequential damages arising from the use of our service, including but not limited to damages related to food allergies or delayed deliveries due to force majeure.
          </p>

          <h3 className="font-serif text-xl font-bold text-[#1B2D24] mb-3">7. Governing Law</h3>
          <p className="mb-8">
            These terms shall be governed by and construed in accordance with the laws of India. Any disputes arising out of or related to these terms shall be subject to the exclusive jurisdiction of the courts located in Hyderabad, India.
          </p>

          <h3 className="font-serif text-xl font-bold text-[#1B2D24] mb-3">8. Contact</h3>
          <p className="mb-0">
            For questions regarding these Terms, please contact us at legal@plattr.club.
          </p>
        </div>
      </div>
    </div>
  );
};

export default TermsPage;
