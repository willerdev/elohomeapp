import { ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export const TermsAndConditions = () => {
  const navigate = useNavigate();

  return (
    <div className="pb-20 pt-4">
      <div className="px-4">
        <div className="flex items-center gap-3 mb-6">
          <button onClick={() => navigate(-1)} className="p-1">
            <ArrowLeft className="w-6 h-6" />
          </button>
          <h1 className="text-2xl font-bold text-gray-800">Terms and Conditions</h1>
        </div>

        <div className="prose prose-sm max-w-none">
          <p className="text-gray-600 mb-6">
            Last updated: {new Date().toLocaleDateString()}
          </p>

          <section className="mb-8">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">1. Agreement to Terms</h2>
            <p className="text-gray-600 mb-4">
              By accessing or using EloHome, you agree to be bound by these Terms and Conditions. If you disagree with any part of the terms, you may not access the service.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">2. User Accounts</h2>
            <p className="text-gray-600 mb-4">
              When you create an account with us, you must provide accurate, complete, and up-to-date information. Failure to do so constitutes a breach of the Terms, which may result in immediate termination of your account.
            </p>
            <p className="text-gray-600 mb-4">
              You are responsible for safeguarding the password and for all activities that occur under your account.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">3. User Content</h2>
            <p className="text-gray-600 mb-4">
              Our service allows you to post, link, store, share and otherwise make available certain information, text, graphics, or other material. You are responsible for the content you post.
            </p>
            <p className="text-gray-600 mb-4">
              By posting content, you grant us the right to use, modify, publicly perform, publicly display, reproduce, and distribute such content on and through our service.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">4. Prohibited Activities</h2>
            <p className="text-gray-600 mb-4">
              You may not access or use the Service for any purpose other than that for which we make the Service available. The Service may not be used in connection with any commercial endeavors except those that are specifically endorsed or approved by us.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">5. Intellectual Property</h2>
            <p className="text-gray-600 mb-4">
              The Service and its original content (excluding Content provided by users), features, and functionality are and will remain the exclusive property of EloHome and its licensors.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">6. Termination</h2>
            <p className="text-gray-600 mb-4">
              We may terminate or suspend your account immediately, without prior notice or liability, for any reason whatsoever, including without limitation if you breach the Terms.
            </p>
            <p className="text-gray-600 mb-4">
              Upon termination, your right to use the Service will immediately cease. If you wish to terminate your account, you may simply discontinue using the Service.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">7. Limitation of Liability</h2>
            <p className="text-gray-600 mb-4">
              In no event shall EloHome, nor its directors, employees, partners, agents, suppliers, or affiliates, be liable for any indirect, incidental, special, consequential or punitive damages, including without limitation, loss of profits, data, use, goodwill, or other intangible losses.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">8. Changes</h2>
            <p className="text-gray-600 mb-4">
              We reserve the right, at our sole discretion, to modify or replace these Terms at any time. What constitutes a material change will be determined at our sole discretion.
            </p>
            <p className="text-gray-600 mb-4">
              By continuing to access or use our Service after those revisions become effective, you agree to be bound by the revised terms.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">9. Contact Us</h2>
            <p className="text-gray-600">
              If you have any questions about these Terms, please contact us at:
            </p>
            <ul className="list-disc pl-6 mt-2 text-gray-600">
              <li>Email: support@elohome.com</li>
              <li>Phone: +971 4 123 4567</li>
              <li>Address: Dubai Silicon Oasis, Dubai, UAE</li>
            </ul>
          </section>
        </div>
      </div>
    </div>
  );
};